---
course: "modernizing-data-estate-with-fabric"
slug: "the-target-state-on-fabric"
title: "The Target State: OneLake and One Copy of Data"
summary: "What 'modern on Fabric' actually means. OneLake, Lakehouse, workspaces, and capacity, explained in plain terms before you build anything."
order: 2
readTime: "8 min"
access: "free"
draft: false
---

Now that you have an honest map of your estate, let me show you where it is going to land. Because if you understand the target clearly, every decision later in this course becomes obvious instead of confusing.

Fabric has a lot of surfaces: data engineering, warehousing, data science, real-time, Power BI. It is easy to look at all of it and feel like you need to learn everything at once. You do not. Underneath all of those experiences sits one idea, and if you get that idea, the rest is just detail.

## The one idea: one copy of data

Here is the thing that makes Fabric different from what you have today. In most estates, every tool keeps its own copy of the data. Your warehouse has a copy, your data science team exports a copy, Power BI imports a copy. Each copy drifts. By Thursday, three teams quote three different revenue numbers and everyone is technically right.

Fabric is built to end that. There is one storage layer, called **OneLake**, and every engine reads from the same copy. Your SQL queries, your Spark notebooks, your Power BI reports, all pointing at the same data, in the same place, in the same open format. No re-copying, no drift.

That open format matters, so hold onto it: data in OneLake is stored as **Delta Parquet**, an open table format. This is why one copy can serve many engines, they all speak the same underlying language. You are not locked into a proprietary box.

## The vocabulary you actually need

You will hear a lot of Fabric terms. Here are the only four you need to start, in plain language.

- **OneLake** is the storage. Think of it as one big, organization-wide data lake that comes built in. You do not provision it, it is just there. Every Fabric data item you create, a Lakehouse, a Warehouse, and so on, stores its data in OneLake.
- **Workspace** is the container you work in. It is where your items live, and it is the unit you share and assign permissions on. Most teams start with a workspace per team or per project.
- **Lakehouse** is where your tables and files live and where most of your data engineering happens. It gives you a place to land files, turn them into tables, and query them with either Spark or SQL. For most modernization work, the Lakehouse is home base.
- **Capacity** is the compute you pay for. It is a pool of horsepower, an F SKU, that runs everything: your pipelines, your queries, your report refreshes. One capacity powers many workspaces. We will spend a whole lesson on sizing it so it never surprises you.

That is it. OneLake stores, a Workspace contains, a Lakehouse is where you build, and Capacity is what you pay for. Everything else you learn hangs off these four.

## Shortcuts and mirroring: use data without moving it

There is one more idea worth meeting now, because it changes how you think about migration. Fabric gives you two ways to use data without physically copying it into OneLake.

- A **shortcut** is a pointer to data that lives somewhere else, another workspace, another lake, even Amazon S3 or Azure Data Lake, that makes it show up in your Lakehouse as if it were local, without copying it.
- **Mirroring** goes a step further for operational databases. It keeps a near real-time replica of a source like Azure SQL, Cosmos DB, or Snowflake inside OneLake, kept in sync for you, so you can query current data in Fabric without building and babysitting a pipeline.

Why does this matter for modernization? Because it means you do not always have to physically move data, or build a copy job, to start using a source in Fabric. Sometimes the cleanest first step is to point at data where it already lives, or mirror it, prove the value, and decide later whether it ever needs a real move. This is the "connect it" pile from lesson one, and keeping these tools in your back pocket is often what separates a lean modernization from one that just recreates the old sprawl.

## How this maps to your four piles

Remember your piles from lesson one. Here is how they land in this target.

- Your **move it** sources become tables in a Lakehouse, landed once into OneLake, then served everywhere from that single copy.
- Your **rebuild it** sources get the same destination, but you reshape them on the way in instead of carrying the old structure.
- Your **connect it** sources never get copied at all. A shortcut or mirror makes them appear in your estate while they keep living where they are. This is where connectors, shortcuts, and mirroring earn their keep.
- Your **leave it** sources stay exactly where they are, untouched, because you decided they do not belong in the new estate.

## The mental model to carry forward

For the rest of this course, picture your estate collapsing from many drifting copies into one trusted copy in OneLake, with different engines reading from it depending on the job. That collapse is the modernization. Everything from here, landing data, shaping it, serving it, is just the mechanics of making that picture real.

Next, we make it real, we start landing your data into the Lakehouse, and I will show you how to pick the right way to bring each source in.
