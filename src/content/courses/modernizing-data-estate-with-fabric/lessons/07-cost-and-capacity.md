---
course: "modernizing-data-estate-with-fabric"
slug: "cost-and-capacity"
title: "Cost and Capacity, Without Surprises"
summary: "How Fabric capacity actually bills, how to size an F SKU, and how to watch usage so throttling and runaway costs never catch you off guard."
order: 7
readTime: "9 min"
access: "free"
draft: false
---

Everything we have built is only a success if the bill stays sane. This is the lesson that separates a modernization people are proud of from one they quietly regret six months later when finance asks what happened. Let me demystify how Fabric costs work, because once you understand the model, controlling it is straightforward.

## How Fabric actually bills: one pool, shared by everything

Here is the mental model. You do not pay per query or per pipeline. You buy a **capacity**, an F SKU, which is a fixed pool of compute measured in **capacity units (CUs)**. Everything you run, pipelines, notebooks, SQL queries, report refreshes, draws from that same pool. F2, F4, F64, and so on, the number is the size of the pool.

This is different from paying for each thing you do, and the difference shapes every cost decision. Your bill is mostly determined by the *size of the pool you rent*, not by how many individual things you run inside it. Which means the game is: rent a pool big enough to handle your real workload smoothly, and no bigger.

## The F64 line worth knowing

One threshold matters enough to memorize: **F64**. At F64 and above, people with only a free license can view Power BI content in your capacity. Below F64, every viewer needs their own Pro or Premium Per User license. So for many organizations with lots of report viewers, F64 is the natural landing spot, not because of raw compute, but because of how viewer licensing works. Factor that in when you size, the right SKU is a compute *and* licensing decision.

## What "throttling" is, and why people meet it by surprise

Because everything shares one pool, you can overspend the pool's capacity in a burst. When you consistently ask for more than your capacity can deliver, Fabric **throttles**: it slows or delays operations until you are back within budget. People meet throttling as a nasty surprise, reports suddenly slow, jobs queue, and they do not know why.

Now you know why. Throttling is not a bug, it is the system telling you your workload is bigger than the pool you rented. The fix is either a bigger pool or a lighter workload, and the whole point of watching your usage is to see that coming before your users do.

## The tool that makes this visible: the Capacity Metrics app

You do not have to guess at any of this. Fabric has a **Capacity Metrics app** that shows exactly how much of your capacity you are using, which items are consuming it, and when you are approaching the ceiling. This is the single most important operational tool for cost control, and most teams do not install it until after their first surprise. Install it first.

Use it to answer three questions regularly:

- **Am I near my ceiling?** If you are constantly near 100%, you will throttle, size up or lighten the load.
- **Am I barely using it?** If you sit at 15%, you are renting too big a pool, size down and save.
- **What is eating my capacity?** It is usually a few heavy items. Often an over-scheduled pipeline or an expensive query, exactly the things lesson three warned you about.

## The levers that actually control cost

Here are the controls that matter, in order of how much they save.

- **Right-size the pool.** The biggest lever by far. Use a trial or the Metrics app to find your real usage, then rent to fit it. Do not size for a worst-case you hit twice a year, size for normal and handle spikes another way.
- **Pause when idle.** Because F SKUs are Azure resources, you can **pause and resume** them. If your capacity does nothing overnight or on weekends, pausing it stops the meter. For non-24/7 workloads this is a real, large saving that P SKUs never offered.
- **Scale for spikes, do not oversize permanently.** If you have a heavy month-end, scale up for it and back down after, rather than paying for month-end capacity all month long.
- **Commit if your usage is steady.** A one-year reservation saves meaningfully over pay-as-you-go once you know your baseline. Do this *after* you have found your real size, not before.
- **Stop over-scheduling.** This ties everything back together. Every pipeline that runs more often than the data needs is capacity spent for freshness nobody asked for. Match schedules to the decisions the data supports, as you decided all the way back in lesson one.

## The habit that keeps you safe

Cost control on Fabric is not a one-time setup, it is a habit. Once a week, or at least once a month early on, open the Metrics app and look. Are you near the ceiling? Barely using it? What is the top consumer? Ten minutes of looking prevents both the throttling surprise and the overspend surprise. The teams that get burned are always the ones who set a capacity and never looked at it again.

You now understand the whole cost model: one pool, shared by everything, watched with one app, controlled with a handful of deliberate levers. That is the difference between a modernization finance loves and one they audit.

One lesson left. We are going to pull the whole journey together into a repeatable playbook you can run on the next estate, and look at where you go from here.
