---
course: "modernizing-data-estate-with-fabric"
slug: "landing-your-data"
title: "Landing Your Data"
summary: "Pipelines, Dataflows Gen2, or shortcuts? Learn which ingestion pattern fits each source so you bring data in cleanly instead of copying chaos."
order: 3
readTime: "9 min"
access: "free"
draft: false
---

You have your map and you understand the target. Now we bring data in. This is the step where a lot of migrations go wrong, not because the tools are hard, but because people pick the wrong one for the job and then fight it forever.

So let me save you that fight. Fabric gives you four main ways to get data into your estate, and each one is genuinely the right answer for certain sources. The skill is not learning all four deeply. It is knowing which to reach for.

## The four patterns, and when each one wins

- **Pipelines** are for moving data at scale, on a schedule, from many sources. This is where Fabric's large **connector library** shines: hundreds of built-in connectors to databases, SaaS apps, file stores, and cloud services, so you rarely have to hand-build an integration. If you are copying tables out of a SQL Server every night, or pulling from a dozen systems, a pipeline is your workhorse. It is orchestration first: get data from A to B reliably, on time, at volume.
- **Dataflows Gen2** are for transforming as you ingest, with a visual, Power Query experience. They use the same broad connector set, so if your source is messy and you want to clean, reshape, and standardize it on the way in, in a low-code interface, this is the tool. It is the natural home for people coming from Power BI, because it is the same Power Query they already know.
- **Shortcuts** are for not moving data at all. If the data already lives in a place Fabric can reach, another lake, S3, ADLS, and you just need it to appear in your Lakehouse, a shortcut points at it. No copy, no schedule, no duplicate to keep in sync.
- **Mirroring** is for operational databases you want live in Fabric without owning a pipeline. Point it at a source like Azure SQL, Cosmos DB, or Snowflake and Fabric keeps a near real-time replica in OneLake, synced for you. You get current data to query without building or babysitting anything.

Here is the honest rule of thumb. Reach for a **shortcut or mirror** first and ask "do I even need to copy this?" If you do need to copy it and it is mostly a move job at scale, use a **pipeline** and its connectors. If moving it also means cleaning it, and you want that visual, reach for a **Dataflow Gen2**.

## Why "do I even need to copy this" comes first

Every copy you make is a copy you now have to keep fresh, secure, and consistent. That is the exact problem you are trying to escape. So the cheapest, cleanest ingestion is often the one you do not do. Before you build a pipeline for a source, ask whether a shortcut or a mirror gets you there. Sometimes the answer is no, you need it landed and transformed. But asking first keeps your new estate lean instead of recreating the sprawl you started with. This is exactly the "connect it" pile from lesson one earning its keep.

## Bronze first: land it raw before you touch it

Whatever pattern you use, land your data into a **raw, untouched layer first**. Resist the urge to clean it during the very first hop. Get an exact, faithful copy into the Lakehouse, then transform from there.

Why? Two reasons, and both will save you.

- **Reproducibility.** If your cleaning logic has a bug, and it will, you want the original data still sitting there so you can re-run without going back to the source system. Source systems are slow, rate-limited, and sometimes owned by people who do not want you hammering them.
- **Debugging.** When a number looks wrong three layers up, being able to compare against the raw landing zone tells you instantly whether the problem came in with the data or got introduced by your transformations.

This raw layer is the "bronze" of the medallion approach, and bronze is only the first of three. From here your data climbs two more layers: **silver**, where it gets cleaned, deduplicated, and made correct, and **gold**, where it gets shaped into business-ready tables that reports sit directly on top of. Landing is bronze. Trust is earned in silver and gold, which is the whole subject of the next lesson. For now, just internalize the discipline: land faithfully, transform afterward, never in the same breath.

## A concrete first move

Let me make this real. Say your most-trusted source, the top of your "move it" pile, is a set of tables in an on-prem SQL Server. Here is the clean first landing.

1. Create a Lakehouse in your workspace. This is your destination.
2. Build a **pipeline** with a Copy activity that reads the SQL tables and writes them as-is into the Lakehouse Files area, or as bronze tables. Faithful copy, no transformation.
3. Schedule it at the freshness you decided in lesson one, not faster. If the business needs it daily, run it daily. Running it hourly because you can is how bills grow.
4. Confirm the row counts match the source. That check is your proof the landing is faithful.

You now have your first source on Fabric, sitting in OneLake as one copy, ready to be shaped. That is a real milestone, do it with your actual top source before moving on.

## What to watch out for

A few things that trip people up on their first landings:

- **Do not over-schedule.** Freshness costs money and capacity. Match the schedule to the decision the data supports.
- **Do not transform on ingest for your critical sources.** Keep bronze faithful. Save the cleaning for the next layer.
- **Do not build one giant pipeline for everything.** Smaller, per-source or per-domain pipelines are easier to debug and rerun than one monolith that fails as a unit.

With data landing cleanly and faithfully, we are ready to shape it into something people can actually trust. That is the medallion approach, and I am going to strip the buzzwords off it in the next lesson.
