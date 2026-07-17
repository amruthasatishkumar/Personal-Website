---
course: "modernizing-data-estate-with-fabric"
slug: "shaping-it-medallion"
title: "Shaping It: The Medallion Approach"
summary: "Bronze, silver, gold sounds like jargon. It is really just three honest stages of trust. Here is what each layer is for and how to build them."
order: 4
readTime: "8 min"
access: "free"
draft: false
---

You will hear "medallion architecture" constantly in Fabric conversations, usually said with enough reverence that it sounds complicated. It is not. Let me hand you the plain version, because once you see what it actually is, you will use it without thinking.

Medallion is just three stages your data passes through on its way from raw to trusted. Bronze, silver, gold. That is it. The names are marketing, the idea underneath is honest and useful: **data earns trust in stages, so give each stage its own place to live.**

## The three layers, in plain terms

- **Bronze is raw.** It is the faithful copy you landed in the last lesson. Untouched, exactly as it came from the source. Nobody builds reports on bronze. Its whole job is to be a reliable, re-runnable starting point.
- **Silver is cleaned and conformed.** This is where you fix types, remove duplicates, standardize formats, join related things, and make the data *correct*. Silver is trustworthy data, but it is still shaped like the source, tables that mirror your systems, just cleaned up.
- **Gold is business-ready.** This is data shaped for how the business actually asks questions. Aggregated, modeled, named in business terms. A "sales by region by month" table that a report can sit directly on top of. Gold is what people build on.

The progression is the point. Raw becomes correct becomes useful. Each step is a layer you can inspect, test, and trust independently.

## Why bother with three layers instead of one

The honest question is: why not just clean the data once and be done? Because separating the stages buys you things that are painful to get any other way.

- **You can rebuild upward without re-fetching.** If your gold logic changes, you rebuild gold from silver. If silver logic changes, you rebuild from bronze. You almost never have to go back and re-pull from the slow, rate-limited source system.
- **You can find where a number breaks.** When a gold report is wrong, you check silver. If silver is right, the bug is in your gold logic. If silver is wrong too, you check bronze. The layers turn "the number is wrong somewhere" into a five-minute bisection.
- **Different people can own different layers.** Engineers can own the bronze-to-silver plumbing while analysts own silver-to-gold modeling, without stepping on each other.

That is the whole justification. Three layers is not ceremony, it is what makes a data estate debuggable and rebuildable, which is exactly what your old estate was not.

## How to build them in a Lakehouse

Practically, in Fabric, this is refreshingly simple. Each layer is just a set of tables, and you move data between them with notebooks or Dataflows.

1. **Bronze**: the raw tables you landed already. Leave them alone.
2. **Silver**: write a notebook or Dataflow that reads bronze, cleans it, deduplicates, fixes types, and writes to silver tables. Run it after each bronze load.
3. **Gold**: write another that reads silver, aggregates and models into business-shaped tables, and writes to gold. Run it after silver.

You can keep all three in one Lakehouse using a naming convention, or split them across Lakehouses or workspaces as you scale. Start simple, one Lakehouse, clear names like `bronze_sales`, `silver_sales`, `gold_sales_by_region`. Structure can come later, clarity should come now.

## The mistake to avoid

The most common medallion mistake is doing too much in bronze or skipping silver entirely and jumping from raw straight to a report. It feels faster. It is not. You end up with cleaning logic tangled into your reporting logic, and the day a number looks wrong, you have nowhere to stand to debug it.

Keep the stages honest. Bronze faithful, silver correct, gold useful. Let each layer do its one job.

## Where this leaves us

At this point your best sources are landed, cleaned, and shaped into business-ready gold tables sitting in OneLake as one trusted copy. That is genuinely the hard part done. Now we need to get that gold data in front of people, fast, without making yet another copy. That is where Power BI Direct Lake comes in, and it is one of the most quietly important features in all of Fabric. That is the next lesson.
