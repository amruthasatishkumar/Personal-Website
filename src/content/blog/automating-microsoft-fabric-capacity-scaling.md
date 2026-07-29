---
title: "Automating Microsoft Fabric Capacity Scaling: Four Ways to Do It"
description: "A hands-on guide to automating Microsoft Fabric capacity scaling: Logic Apps, Automation runbooks, Azure Functions, and Fabric Activator."
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

## What Fabric already handles for you

Fabric does a surprising amount out of the box, and it pays to know that before you automate anything. Under the hood it smooths and bursts your usage, spreading short spikes across quieter periods so a brief peak rides through without a bigger SKU. For plenty of workloads, that alone absorbs the variability you were worried about.

There is also **Autoscale Billing for Spark**, a genuinely elegant option for Spark-heavy work. Enable it on a capacity and Spark jobs run on a serverless, pay-as-you-go pool instead of consuming your capacity's compute units. You set a maximum CU limit and pay only for the Spark runtime you use. It is a separate, opt-in model per capacity, so the rest of your capacity keeps humming along untouched.

That already gives you two strong starting points: let smoothing and bursting handle the small stuff, and turn on Autoscale Billing for Spark when Spark is the pressure. The approaches below add scheduled scaling on top, for when the whole capacity is simply larger than it needs to be for big stretches of the week.

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

## Approach 3: A timer-triggered Azure Function

If you would rather express your scaling logic as code than in a Logic App designer, a timer-triggered Azure Function does the same scheduled job and costs almost nothing to run. It fits well when scaling is one small piece of a larger codebase you already deploy.

![Approach 3: a timer-triggered Azure Function calls the Azure REST API to resize or pause the capacity on a schedule](/images/blog/automating-microsoft-fabric-capacity-scaling/approach-3-function.png)

The wiring:

1. **Create a Function with a timer trigger.** The schedule is an NCRONTAB expression, for example one Function that scales up at 8am and another that scales down at 8pm.
2. **Turn on the Function's managed identity** and assign the custom role above to it, scoped to the capacity.
3. **Call the REST API from code**, using the Azure SDK or a plain HTTP request to the resize, suspend, or resume endpoints.

```python
import azure.functions as func
import requests
from azure.identity import DefaultAzureCredential

app = func.FunctionApp()

@app.timer_trigger(schedule="0 0 20 * * 1-5", arg_name="timer")  # 8pm on weekdays
def scale_down(timer: func.TimerRequest) -> None:
    token = DefaultAzureCredential().get_token("https://management.azure.com/.default").token
    base = f"https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Fabric/capacities/{name}"
    requests.patch(
        f"{base}?api-version=2023-11-01",
        headers={"Authorization": f"Bearer {token}"},
        json={"sku": {"name": "F16", "tier": "Fabric"}},
    )
```

**Best for:** teams who prefer their scheduled scaling as versioned, testable code.

## Approach 4: Fabric-native triggering with Activator

The three approaches above are all scheduled. The obvious next question is whether you can scale reactively, when utilization actually climbs, and do it from inside Fabric. The honest answer today is a partial yes, and it is worth knowing exactly where the line falls.

**Activator**, Fabric's no-code event and rules engine, can trigger a notebook, a pipeline, or a User Data Function directly, and that item can call the scaling API. So the action half of a reactive loop genuinely exists and stays inside Fabric.

![Approach 4: a utilization signal in Fabric drives an Activator rule that triggers a notebook, pipeline, or UDF to call the REST API](/images/blog/automating-microsoft-fabric-capacity-scaling/approach-4-activator.png)

The missing half is the signal. Activator cannot watch capacity utilization directly, because Fabric's built-in events today cover workspace item activity, not a "capacity hit 85 percent" event. The place utilization actually lives, the Capacity Metrics app, refreshes on a 10 to 15 minute latency, and its semantic model is documented as not supported for use outside the app's own reports. So there is no clean, supported way to feed real-time CU utilization into an Activator rule right now.

What this means in practice: use Activator as the trigger when you already have a suitable event or a signal you legitimately control, such as a business event you publish yourself or a threshold on your own data that stands in as a proxy for load. The notebook it fires looks like this:

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

The whole action runs without leaving Fabric, which is a genuinely nice story for a shop that is all-in on the platform.

**Best for:** Fabric-centric teams that want the scaling action to live in the platform and already have a trigger to hang it on.

## Handling spiky load today

For genuinely variable load, the pragmatic playbook is a schedule generous enough to cover your known peaks, aggressive pausing or downsizing in the quiet windows, and Autoscale Billing for Spark when the pressure is Spark. That combination gets you most of the savings that a reactive autoscaler would, with tooling that is stable and supported right now.

It is worth setting expectations on the fully reactive version, since it is easy to assume it already exists. Native, utilization-driven autoscaling of a capacity is not turnkey yet: Fabric capacity does not surface as an Azure Monitor metric, and the Capacity Metrics app that holds utilization does not raise alerts. Microsoft points to Real-Time hub for alerting, and a capacity-utilization event is not there yet. So scheduled scaling stays the reliable lever, and Activator is ready to be the action the day a suitable trigger lands.

## Choosing between them

| Approach | Driven by | Effort | Best fit |
| --- | --- | --- | --- |
| Logic App schedule | The clock | Low | Predictable business-hours patterns |
| Automation runbook | The clock | Low | Teams already in Azure Automation |
| Azure Function timer | The clock | Low | Scheduled scaling as code |
| Fabric Activator | A trigger you supply | Medium | Fabric-native action, if you have a signal |
| Autoscale Billing for Spark | Spark demand | Low | Bursty Spark jobs specifically |

A reasonable default: start by pausing dev and test capacities off-hours, since that is the largest and easiest saving. Put a scheduled resize, via a Logic App, a runbook, or a Function, on predictable production capacities. Reach for Autoscale Billing for Spark when the pressure is Spark jobs rather than the capacity as a whole, and use the Activator pattern when you have a legitimate trigger and want the action to stay inside Fabric.

## Gotchas worth knowing before you ship

- **Permissions are specific.** The identity doing the scaling needs the four capacity actions above. Use a tight custom role, not a broad privileged one.
- **Resize timing is not instant everywhere.** Scaling a sub-F64 capacity up to a larger size happens almost immediately, but the license update can take up to a day, and moving across the F256 to F512 boundary can be slower.
- **Below F64 changes who can read your reports.** F64 is the threshold at which free users with a viewer role can consume Power BI content. Scale below it and those users may be prompted to upgrade, so schedule the small size for hours when they are not working.
- **Pausing bills your smoothed overage.** When you pause, any remaining smoothed and burst usage is summed and added to your bill. Pausing also instantly ends throttling, which makes it a useful emergency lever, but content is unavailable until you resume.
- **Prefer resize over workspace reassignment.** Reassigning a workspace to another capacity cancels its running jobs. Resizing in place does not.
- **There is no native utilization trigger yet.** Fabric capacity does not publish Azure Monitor metrics, and the Capacity Metrics app does not support alerts, so reactive autoscaling is not turnkey today. Plan around scheduled scaling.

## Where this leaves you

Fabric hands you the levers but not the automation, and that is actually fine, because the automation is a few hours of work and the four patterns here cover almost every real usage shape. The mental model is simple: decide whether your savings come from a predictable schedule or from reacting to real load, pick the matching approach, and let the same two API calls do the work underneath.

The question worth asking about your own estate is not "how big should my capacity be," it is "how often is it that big for no reason?" Answer that honestly and one of these four approaches will pay for itself in the first month.

## Sources

This post is based on Microsoft's public documentation:

- [Scale your Fabric capacity](https://learn.microsoft.com/en-us/fabric/enterprise/scale-capacity) (Microsoft Learn)
- [Pause and resume your Fabric capacity](https://learn.microsoft.com/en-us/fabric/enterprise/pause-resume) (Microsoft Learn)
- [Autoscale Billing for Spark in Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/data-engineering/autoscale-billing-for-spark-overview) (Microsoft Learn)
- [What is Fabric Activator?](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction) (Microsoft Learn)
- [What is the Microsoft Fabric Capacity Metrics app?](https://learn.microsoft.com/en-us/fabric/enterprise/metrics-app) (Microsoft Learn)
- [Fabric Capacities REST API: Update, Suspend, Resume](https://learn.microsoft.com/en-us/rest/api/microsoftfabric/fabric-capacities/update) (Microsoft Learn)
