---
title: "Automating Microsoft Fabric Capacity Scaling: Four Ways to Do It"
description: "A hands-on guide to automating Microsoft Fabric capacity scaling four ways: Logic Apps, Automation runbooks, Azure Monitor, and Fabric Activator."
pubDate: 2026-07-29
category: "Data"
tags: ["Fabric", "Capacity", "Cost Optimization", "Automation", "Activator"]
cover: "/images/blog/automating-microsoft-fabric-capacity-scaling/cover.png"
readTime: "11 min"
featured: false
draft: false
---

## Fabric will not autoscale your capacity for you

When you move to a Fabric F SKU, you get a lot of good things. What you do not get is the one thing people assume comes with the word "capacity" in the cloud: automatic scaling based on load. There is no rule you flip on that resizes your capacity when it gets busy and shrinks it when it goes quiet, the way a virtual machine scale set does.

That matters because Fabric capacity is billed by size, per hour. An F64 sitting idle overnight and all weekend costs the same per hour as an F64 running a heavy refresh. If your usage has any shape to it at all, business hours versus nights, weekdays versus weekends, month-end spikes, then a capacity that never changes size is a capacity you are overpaying for.

The good news is that every lever you need is exposed through the Azure REST API, and you can wire your own automation around it. This post walks through four ways to do that, from a five-minute no-code schedule to a fully Fabric-native setup, with the actual API calls and the trade-offs of each.

## First, what Fabric already does automatically

Before you build anything, know what you do not have to build. Fabric already smooths and bursts your usage under the hood, so short spikes do not require a bigger SKU. It spreads bursts of demand across time so a brief peak borrows against quieter periods rather than failing or forcing you to size up.

There is also **Autoscale Billing for Spark**, which is worth calling out because it solves a specific version of this problem without any scaling automation at all. When you enable it on a capacity, Spark jobs are offloaded to a serverless, pay-as-you-go pool and no longer consume your capacity's compute units. You set a maximum CU limit, and you are billed only for the Spark runtime you actually use. It does not burst from or fall back to your capacity, it is a separate model you opt into per capacity.

The practical takeaway: if your scaling pain is really "bursty Spark jobs," reach for Autoscale Billing for Spark first. If your pain is "the whole capacity is oversized for large parts of the week," then you want the scaling automation below.

## The two levers you are actually pulling

All four approaches automate the same two operations. It helps to be clear on them before the tooling.

- **Resize in place.** Change the SKU of the capacity, for example from F64 down to F16 overnight and back up in the morning. You are charged the pay-as-you-go hourly rate for whatever size you are currently on. Scaling below your reserved instance amount does not change the reserved part of your bill.
- **Pause and resume.** Stop the capacity entirely. This is the biggest saver because a paused capacity stops billing compute, but the content on it becomes unavailable while it is paused, so it fits dev and test capacities far better than production.

A quick note on a third option people reach for: moving workspaces onto a smaller capacity and back. You can do it, but reassigning a workspace to a different capacity cancels its running jobs. Resizing the capacity in place does not disturb the workspaces sitting on it, so prefer resize in place unless you have a specific reason not to.

Every approach below calls the same Azure REST endpoints. Resize is a `PATCH` on the capacity resource. Pause and resume are `POST` actions.

```http
PATCH https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Fabric/capacities/{name}?api-version=2023-11-01
Content-Type: application/json

{
  "sku": { "name": "F16", "tier": "Fabric" }
}
```

```http
POST https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Fabric/capacities/{name}/suspend?api-version=2023-11-01
POST https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Fabric/capacities/{name}/resume?api-version=2023-11-01
```

Whatever calls these needs the right permissions on the capacity. Create an Azure custom role scoped to just these actions and assign it to the identity doing the scaling:

- `Microsoft.Fabric/capacities/read`
- `Microsoft.Fabric/capacities/write`
- `Microsoft.Fabric/capacities/suspend/action`
- `Microsoft.Fabric/capacities/resume/action`

## Approach 1: A Logic App on a schedule

This is the fastest path to real savings and needs no code. A Logic App runs on a timer and calls the REST API to resize or pause on a fixed schedule.

![Approach 1: a Logic App on a schedule calls the Azure REST API to resize or pause the capacity](/images/blog/automating-microsoft-fabric-capacity-scaling/approach-1-logic-app.png)

The wiring:

1. **Give the Logic App an identity.** Turn on its system-assigned managed identity, then assign the custom role above to that identity, scoped to the Fabric capacity resource.
2. **Add a Recurrence trigger.** For a business-hours pattern, use two Logic Apps or one with a condition: scale up at, say, 8am on weekdays and down at 8pm.
3. **Add an HTTP action.** Set the method to `PATCH` for a resize, or `POST` for suspend and resume. Point the URI at the capacity resource with the paths shown above. Under authentication, choose **Managed Identity** and set the audience to `https://management.azure.com`.
4. **For a resize, add the body** with the target SKU. For pause and resume, no body is needed.

That is the whole thing. A capacity that drops from F64 to F16 for the twelve quiet hours of each weekday, and stays small all weekend, is running at its small size for well over half of every week.

**Best for:** predictable, clock-based patterns like business hours. It is the default I would start with.

## Approach 2: An Azure Automation runbook

If your team already runs operational tasks through Azure Automation, a PowerShell runbook is the natural home for the same logic. Microsoft even publishes a Fabric module in the runbook gallery for pause and resume.

![Approach 2: an Azure Automation runbook running PowerShell calls the REST API to resize, suspend, or resume](/images/blog/automating-microsoft-fabric-capacity-scaling/approach-2-runbook.png)

Using the managed identity of the Automation account, the calls are clean with `Invoke-AzRestMethod`:

```powershell
# Authenticate with the Automation account's managed identity
Connect-AzAccount -Identity

$base = "/subscriptions/$sub/resourceGroups/$rg/providers/Microsoft.Fabric/capacities/$name"
$api  = "?api-version=2023-11-01"

# Resize down to F16
Invoke-AzRestMethod -Method PATCH -Path "$base$api" `
  -Payload '{"sku":{"name":"F16","tier":"Fabric"}}'

# Or pause entirely
Invoke-AzRestMethod -Method POST -Path "$base/suspend$api"

# Or resume
Invoke-AzRestMethod -Method POST -Path "$base/resume$api"
```

Attach a schedule to the runbook and you have the same behavior as the Logic App, expressed in code your ops team can version and review.

**Best for:** teams whose operational tooling already lives in Azure Automation.

## Approach 3: Metric-driven scaling with Azure Monitor

Schedules are simple, but they cannot react to a surprise. If your load is spiky rather than predictable, you want to scale on the actual signal instead of the clock.

![Approach 3: Fabric capacity metrics feed an Azure Monitor alert that runs a Logic App or Function to scale the capacity](/images/blog/automating-microsoft-fabric-capacity-scaling/approach-3-metric.png)

The pattern:

1. **Watch a utilization metric** on the capacity through Azure Monitor.
2. **Define an alert rule** with a threshold, for example when utilization stays high for a sustained window.
3. **Point the alert at an action group** that runs a Logic App or an Azure Function.
4. **That action calls the same REST API** to scale up, and a second rule scales back down when utilization falls.

This reacts to real demand, which is exactly what you want for unpredictable load. The cost is more moving parts and the need to tune thresholds so you scale on genuine trends rather than flapping on every brief blip.

**Best for:** spiky load where a fixed schedule would either overprovision or miss the peak.

## Approach 4: Fabric-native scaling with Activator

Here is the approach that keeps everything inside Fabric, and it is the most interesting one, with one honest caveat you need to understand up front.

The idea is to run a smaller capacity as your baseline and let **Activator**, Fabric's no-code event and rules engine, watch utilization and trigger a scale-up when it crosses a threshold. Activator can trigger a notebook, a pipeline, or a User Data Function directly, and that item makes the API call.

![Approach 4: a utilization signal in Fabric drives an Activator rule that triggers a notebook, pipeline, or UDF to call the REST API](/images/blog/automating-microsoft-fabric-capacity-scaling/approach-4-activator.png)

The caveat: Activator cannot natively watch capacity utilization. Fabric's built-in events today cover workspace item activity, not a "capacity hit 85 percent" signal. So the real work is getting utilization into a form Activator can watch. Two practical options:

- Build an Activator rule on the **Capacity Metrics semantic model**, since a Power BI report or semantic model is a valid Activator source.
- Land utilization data in a Warehouse or KQL table and use an Activator rule that evaluates a **scheduled SQL query** on it.

Both are refresh or schedule based, so this reacts on the order of minutes, not milliseconds. That makes it a good fit for sustained load patterns and a poor fit for catching an instantaneous spike. Be honest with yourself about which you have.

Once the signal is in place, Activator is the trigger and a Fabric item is the hands. A notebook doing the resize looks like this:

```python
import requests
from azure.identity import ClientSecretCredential

# Use a service principal; keep the secret in Azure Key Vault, not in the notebook
cred = ClientSecretCredential(tenant_id, client_id, client_secret)
token = cred.get_token("https://management.azure.com/.default").token

base = f"https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Fabric/capacities/{name}"
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# Scale up to F64 when the rule fires
requests.patch(
    f"{base}?api-version=2023-11-01",
    headers=headers,
    json={"sku": {"name": "F64", "tier": "Fabric"}},
)
```

The whole loop runs without leaving Fabric, which is a genuinely nice story for a shop that is all-in on the platform. Just size your expectations to the latency of the signal.

**Best for:** Fabric-centric teams that want the automation to live in the platform, on load patterns that build over minutes rather than seconds.

## Choosing between them

| Approach | Reacts to | Effort | Best fit |
| --- | --- | --- | --- |
| Logic App schedule | The clock | Low | Predictable business-hours patterns |
| Automation runbook | The clock | Low | Teams already in Azure Automation |
| Azure Monitor | Real load | Medium | Spiky, unpredictable demand |
| Fabric Activator | Real load, minute-scale | Medium | Fabric-native shops, sustained load |
| Autoscale Billing for Spark | Spark demand | Low | Bursty Spark jobs specifically |

A reasonable default: start by pausing dev and test capacities off-hours, since that is the largest and easiest saving. Put a scheduled resize on predictable production capacities. Reserve the metric-driven and Activator approaches for the workloads that genuinely spike, and reach for Autoscale Billing for Spark when the spikes are Spark jobs rather than the capacity as a whole.

## Gotchas worth knowing before you ship

- **Permissions are specific.** The identity doing the scaling needs the four capacity actions above. Use a tight custom role, not a broad privileged one.
- **Resize timing is not instant everywhere.** Scaling a sub-F64 capacity up to a larger size happens almost immediately, but the license update can take up to a day, and moving across the F256 to F512 boundary can be slower.
- **Below F64 changes who can read your reports.** F64 is the threshold at which free users with a viewer role can consume Power BI content. Scale below it and those users may be prompted to upgrade, so schedule the small size for hours when they are not working.
- **Pausing bills your smoothed overage.** When you pause, any remaining smoothed and burst usage is summed and added to your bill. Pausing also instantly ends throttling, which makes it a useful emergency lever, but content is unavailable until you resume.
- **Prefer resize over workspace reassignment.** Reassigning a workspace to another capacity cancels its running jobs. Resizing in place does not.
- **Mind the Activator signal latency.** It reacts on the cadence of your metrics refresh or scheduled query, not in real time.

## Where this leaves you

Fabric hands you the levers but not the automation, and that is actually fine, because the automation is a few hours of work and the four patterns here cover almost every real usage shape. The mental model is simple: decide whether your savings come from a predictable schedule or from reacting to real load, pick the matching approach, and let the same two API calls do the work underneath.

The question worth asking about your own estate is not "how big should my capacity be," it is "how often is it that big for no reason?" Answer that honestly and one of these four approaches will pay for itself in the first month.

## Sources

This post is based on Microsoft's public documentation:

- [Scale your Fabric capacity](https://learn.microsoft.com/en-us/fabric/enterprise/scale-capacity) (Microsoft Learn)
- [Pause and resume your Fabric capacity](https://learn.microsoft.com/en-us/fabric/enterprise/pause-resume) (Microsoft Learn)
- [Autoscale Billing for Spark in Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/data-engineering/autoscale-billing-for-spark-overview) (Microsoft Learn)
- [What is Fabric Activator?](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction) (Microsoft Learn)
- [Fabric Capacities REST API: Update, Suspend, Resume](https://learn.microsoft.com/en-us/rest/api/microsoftfabric/fabric-capacities/update) (Microsoft Learn)
