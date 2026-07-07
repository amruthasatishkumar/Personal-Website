---
title: "From P to F: Migrating Power BI Premium to Fabric Capacity"
description: "Power BI Premium P SKUs are retiring and Fabric F SKUs are taking over. Here is what is changing, the timeline, the SKU map, and how to migrate cleanly."
pubDate: 2026-07-06
category: "Data"
tags: ["Data", "PowerBI", "Fabric", "Licensing"]
cover: "/images/blog/from-p-to-f-migrating-power-bi-premium-to-fabric-capacity/cover.png"
readTime: "8 min"
featured: true
draft: false
---

## The switch that looks like a rename but is not

If you run Power BI Premium, you have probably seen the letters change. Your P1 capacity now gets described in terms of an F64, and it is tempting to read this as a rebrand, a new label on the same box. It is not. Microsoft is retiring the Power BI Premium per capacity SKUs, the P SKUs, and moving everyone to Microsoft Fabric capacities, the F SKUs. The product you buy, the way you pay, and what you can build all change. Here is the clean version of what is happening and what to do about it.

## What is actually happening

Power BI Premium has been folded into Microsoft Fabric. Power BI is now one experience inside Fabric, sitting alongside data engineering, data warehousing, data science, real time intelligence, and Data Factory. Because of that, the standalone Premium capacity SKUs are being retired.

The practical headline: you can no longer buy a P SKU. Existing P capacities can only be renewed, and only for a limited window. To keep using Premium features going forward, you buy a Fabric F SKU instead. An F SKU gives you everything Premium did, plus the rest of the Fabric platform.

## The timeline that matters

The dates are the part people miss, so pin these down:

- **New customers:** P SKUs have not been available to purchase since July 1, 2024.
- **Existing customers without an Enterprise Agreement:** renewals were allowed until February 1, 2025. If your renewal date falls after that, you replace the P purchase with Fabric capacity at the end of your agreement.
- **Customers with an Enterprise Agreement:** you can keep renewing your P capacity annually until your EA ends, then move to Fabric.
- **Sovereign cloud customers:** not impacted for now, since Fabric is not yet available there.

Nothing breaks overnight, and no capacity is converted automatically. The trigger is your next renewal. That is the moment the decision lands on your desk.

## The SKU map

Compute lines up cleanly. Each P SKU has an F SKU with the same capacity units and v-cores.

![Power BI Premium P SKUs mapped to Microsoft Fabric F SKUs by capacity units and v-cores](/images/blog/from-p-to-f-migrating-power-bi-premium-to-fabric-capacity/skumap.png)

- **P1 maps to F64** (8 v-cores)
- **P2 maps to F128** (16 v-cores)
- **P3 maps to F256** (32 v-cores)
- **P4 maps to F512** (64 v-cores)
- **P5 maps to F1024** (128 v-cores)

F64 is the number to remember. It is the threshold where users with only a free license and a viewer role can read Power BI content, the same benefit P1 gave you. Drop below F64 and every viewer needs a Pro or Premium Per User license, so most Premium customers land on F64 or higher.

One caution: the map is a compute comparison, not a promise of identical performance. Right size using the Fabric Capacity Metrics app or a Fabric trial before you commit, and involve your Microsoft representative on sizing.

## Why F is more than a bigger P

If the switch were only a rename, this would be a chore. It is actually an upgrade, and that is worth understanding before you file it under paperwork.

- **The whole Fabric platform, not just Power BI.** Fabric is a superset of Premium. The same capacity that runs your reports also runs lakehouses, warehouses, notebooks, pipelines, eventhouses, and real time analytics. You stop paying for a reporting engine and start paying for a data platform.
- **Azure billing and flexibility.** P SKUs were a Microsoft 365 subscription with a monthly or yearly commitment. F SKUs are Azure resources. You can commit with a reservation for the best price, or run pay as you go. Because they are Azure resources, you can pause and resume capacity, which is a real cost lever for workloads that do not run around the clock.
- **MACC eligible.** Fabric spend counts toward your Microsoft Azure Consumption Commitment. For many enterprises that alone changes the math.
- **Azure only features.** Trusted workspace access, managed private endpoints, and Azure management surfaces are available on F SKUs and were never part of P.
- **Embedded and Report Server included.** Power BI Embedded comes with F SKUs, and Power BI Report Server is included with F64 and higher reserved instances.

## How to migrate, step by step

The mechanics are simpler than the licensing, but the effort depends entirely on your scenario.

**Start by picking your scenario. They are not equal.**

- **Same tenant, same region.** The easy path. You reassign your workspaces to the new Fabric capacity in the admin portal. It is a billing change, not a rebuild, and it covers both Power BI and Fabric items. Most migrations are this.
- **Same tenant, different region.** Doable for Power BI items, but large storage format semantic models do not move cross region automatically. You redeploy them or use backup and restore. Budget more time.
- **Cross region with Fabric items, or cross tenant.** Not a simple reassignment. Fabric items do not move cross region natively, and nothing moves across tenants by assignment. These are recreate and redeploy projects, so treat them as real migrations rather than swaps.

**Line up the prerequisites.**

- Purchase the target Fabric capacity first, sized from your actual usage.
- Assign the Fabric Administrator and Capacity Administrator roles to whoever runs the move.
- For a reserved instance, confirm you have the Azure owner or reservation purchaser role on the subscription.
- Check your Fabric capacity quota for that subscription and region, and request an increase if you are short.

**Discover before you move.**

- Inventory what is actually in the capacity. Old, unused reports are a chance to clean up rather than carry over.
- Flag large semantic models and any Fabric items early, since they change the plan, especially cross region.
- If there are no Fabric items, temporarily turning off Fabric features can speed things up.

**Then move the workspaces, one of two ways.**

- **Admin portal, manually.** Reassign each workspace to the new Fabric capacity, then delete the old P capacity once everything is moved. Best for a handful of workspaces.
- **Automated notebook.** For many workspaces or multiple P SKUs, Microsoft's open source [semantic-link-labs](https://github.com/microsoft/semantic-link-labs) project includes a capacity migration notebook you import into Fabric, parameterize, and run.

**Know the safety nets and the gotchas.** You get a free Premium capacity for the first 30 days after your old subscription ends, matched to your previous P size, so you are not paying for two capacities at once, and you keep access to your Power BI data for 90 days while you transition. Same region moves have no real downtime since it is a billing change, though it can take up to an hour before users can create Fabric items in the new capacity. When a workspace is reassigned, active jobs are cancelled and need a rerun, while scheduled jobs are not affected. One more limit: you cannot drop below F64 and keep Premium features, so resist the urge to downsize to F32. And VNet or on premises gateways must be reassigned to the new capacity by hand.

## Where this is heading

The P to F move is Microsoft closing the gap between business intelligence and data platform. Power BI is no longer a product you buy on its own. It is a view into Fabric. If you treat the renewal as a simple swap, you will end up on F and never touch the four fifths of the platform you are now paying for. The teams that win here treat the migration as the moment to ask a bigger question: now that the reporting capacity is also a full data platform, what else should live on it?

Is your next renewal before or after you have a Fabric plan? That is the only deadline that really matters.

## Sources

Everything here is drawn from Microsoft's public announcements and documentation:

- [Important update coming to Power BI Premium licensing](https://powerbi.microsoft.com/blog/important-update-coming-to-power-bi-premium-licensing/) (official Power BI blog, the retirement timeline)
- [Power BI Premium FAQ](https://learn.microsoft.com/en-us/fabric/enterprise/powerbi/service-premium-faq) (Microsoft Learn, transition, migration, and grace periods)
- [Understand Microsoft Fabric licenses](https://learn.microsoft.com/en-us/fabric/enterprise/licenses) (Microsoft Learn, SKUs and capacity rules)
