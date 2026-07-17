---
course: "modernizing-data-estate-with-fabric"
slug: "migrating-from-legacy"
title: "Migrating Without Breaking Production"
summary: "A source-agnostic playbook for moving off any legacy system, on-prem databases, cloud warehouses, old ETL, without anyone noticing the floor moved, including the backup question people forget to ask."
order: 6
readTime: "9 min"
access: "free"
draft: false
---

So far we have modernized one slice cleanly. Now we face the harder reality: you have legacy systems that real people depend on right now, today, while you migrate. This lesson is about moving off them without anyone noticing the floor moved.

And notice I am not naming a specific source. That is deliberate. Whatever you are moving off, an on-prem database, a cloud data warehouse like Redshift, BigQuery, or Snowflake, a Synapse workspace, a tangle of legacy ETL jobs, or some mix of all of them, the hard part is the same. The mechanics of copying data you already learned in lesson three, and Fabric's connectors and mirroring reach almost anything. What makes migration hard is not the copy. It is the *sequencing*, doing it in an order that never leaves production without a floor to stand on. So that is what we will focus on, and it works no matter where you are coming from.

## The rule that prevents disasters: never cut over blind

The single most important migration principle is this: **run the old and the new side by side until the new one has earned your trust.** Do not flip a switch from the old system to Fabric on a Friday and hope. Land the data in Fabric, build the new version, and run both in parallel while you compare them. The old system stays the source of truth until the new one has proven it produces the same answers.

This feels slower. It is dramatically safer, and safer is faster when you count the outages you did not have.

## The sequence for a real cutover

Here is the order that keeps a floor under production the whole way, and it is the same whether your source is a database, a warehouse, or a pile of ETL.

1. **Land the legacy data into bronze.** Using whichever ingestion pattern fits the source, a pipeline, a mirror, a shortcut, copy the data into your Lakehouse faithfully. Production keeps running on the old system, untouched. You are just building a shadow copy in Fabric.
2. **Rebuild the transformations in silver and gold.** Recreate the logic the old system did, cleaning, modeling, aggregation, using the medallion approach. This is where you get to fix the things that were wrong in the old build instead of faithfully reproducing its flaws.
3. **Run both in parallel and reconcile.** For a real window, days or weeks depending on how critical the data is, produce the numbers on both systems and compare. When they match consistently, and only then, the new system has earned trust.
4. **Cut over the consumers.** Point reports and downstream consumers at the Fabric gold tables. Because you validated in parallel, this is a quiet switch, not a leap.
5. **Decommission the old system, deliberately.** Only after the new one has run alone successfully for a while. And read the next section before you delete anything.

## The backup question nobody asks until it is too late

Here is a question that catches teams no matter what they are migrating from, and it is worth pausing on because it is easy to miss: **what is your backup and recovery story on the new platform?**

On your old system, you probably had years of muscle memory around backups, point-in-time restore, and disaster recovery. When you move to Fabric, you cannot assume those exact mechanisms carry over unchanged. OneLake and Fabric have their own approaches to durability, retention, and recovery, and you need to *deliberately* understand them for your critical data before you decommission the system that was protecting it.

So before you delete the old platform, answer plainly: if a table is corrupted or deleted on Fabric next month, how do I get it back, and how far back can I go? Do not let the excitement of a clean new platform rush you past this. The old system is your safety net until you have consciously built a new one. Retire it last, and retire it on purpose.

## Cross-region and cross-tenant: know which move you are making

One more thing that changes the effort dramatically: *where* the new home is relative to the old one.

- **Same tenant, same region** is the easy path, and where most migrations land. Reassigning and rebuilding is straightforward.
- **Different region** adds real constraints. Some items and large data structures cannot simply hop regions, and you may need to redeploy rather than move. Budget more time.
- **Cross-tenant** is not a move at all, it is a rebuild. Nothing transfers by assignment across tenants, every item gets recreated in the new tenant. Treat it as a redeploy project, not a copy.

Figure out which of these you are in *before* you plan the timeline, because the difference is hours versus a multi-week project. This is the same lesson from the licensing world: the mechanics are simple, the scenario decides the effort.

## The mindset that makes migrations calm

Migrations feel scary because they feel irreversible. The antidote is to make every step reversible until the very last one. Shadow copy, don't cut. Validate in parallel, don't trust blind. Retire the old system last, and only after the new one has stood alone. Do that, and a migration stops being a leap of faith and becomes a series of small, safe, checkable steps.

You now know how to move the real, load-bearing parts of your estate. The last thing standing between you and a finished, durable modernization is making sure none of it quietly runs up a bill. Capacity and cost is the final lesson, and it is the one that keeps your modernization from becoming a cautionary tale.
