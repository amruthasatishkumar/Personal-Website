---
course: "modernizing-data-estate-with-fabric"
slug: "serving-it-direct-lake-vs-warehouse"
title: "Serving It: Direct Lake vs Warehouse"
summary: "How to get your gold data in front of people without another copy. What Direct Lake really does, and the honest test for Lakehouse vs Warehouse."
order: 5
readTime: "9 min"
access: "free"
draft: false
---

Your data is landed, cleaned, and shaped into gold. Now people need to actually see it, in Power BI, fast. This lesson is about doing that without betraying the one principle we have built everything on: one copy of the data.

There are two things to get right here. First, how Power BI reads your gold data without making a copy, which is Direct Lake. Second, the question everyone eventually asks: should I be using a Lakehouse or a Warehouse to serve this? Let me take them in order.

## Direct Lake: the feature that keeps the promise

Traditionally, Power BI had two ways to get data: **Import**, which copies the data into the report's own model for speed, and **DirectQuery**, which leaves the data in the source and queries it live for freshness. You always had to choose. Fast but stale, or fresh but slow. Every Power BI person has felt that trade-off.

**Direct Lake** is Fabric's answer, and it is genuinely a third option, not a compromise between the two. It reads your gold Delta tables *directly out of OneLake*, with import-like speed, but without importing. There is no copy sitting in the model drifting from the source. The report reads the same one copy every other engine reads.

Sit with why that matters for what we are building. Everything in this course has been about collapsing many drifting copies into one trusted copy. If the final step, the report, made yet another copy, we would have reintroduced the exact problem at the finish line. Direct Lake is what lets the report sit directly on the single source of truth. It is the feature that keeps the promise.

## How you actually use it

The good news: it is mostly automatic. Over a Lakehouse or Warehouse you get a **semantic model**, either one Fabric creates for you or one you build yourself, and reports on that model read your gold Delta tables via Direct Lake. In practice:

1. Point Power BI at the semantic model over your gold tables.
2. Build your report as normal.
3. It reads gold from OneLake directly. When gold refreshes, the report reflects it, no re-import.

You get import-speed dashboards on live, single-copy data. For most of your reporting, this is the answer, and you should reach for it by default.

## Lakehouse or Warehouse: the honest test

Now the question that causes the most confusion. Fabric gives you both a **Lakehouse** and a **Warehouse**, and both can serve data with SQL. So which do you use? The internet will give you a hundred nuanced comparisons. Here is the honest test that covers most real decisions.

- **Use the Lakehouse when your work is engineering-shaped.** Files and tables, Spark notebooks, Python, data science, mixing structured and unstructured data. The Lakehouse is a lake with a SQL surface on top. If your team writes notebooks, this is home.
- **Use the Warehouse when your work is SQL-shaped.** Full T-SQL, including writes and updates, transactional guarantees, and a pure relational experience for people who think in SQL and stored procedures. If you are migrating a classic SQL data warehouse and your team lives in T-SQL, the Warehouse will feel like home in a way the Lakehouse will not.

Here is the part that removes the anxiety: **they both store data in the same OneLake, in the same Delta format.** So this is not a lock-in decision. A Warehouse can read a Lakehouse's tables and vice versa. You are choosing an *experience* for a given workload, not a permanent silo. Pick the one that fits how the team works, and know you can use the other alongside it.

## A simple default to start with

If you are early and unsure, start with a **Lakehouse** for engineering and landing, serve reports from it with **Direct Lake**, and introduce a **Warehouse** only when you have a genuinely SQL-centric workload or team that wants full T-SQL. That path keeps you simple now and leaves every door open later. Do not agonize over this choice, it is reversible.

## Where we are

Stop and appreciate what you have now. A real source, landed once, cleaned, shaped into gold, and served to a Power BI report reading the single copy directly. That is a complete, modern, end-to-end slice of your estate on Fabric. If you have followed along with your own top source, you have already modernized something real.

The remaining lessons handle the two things that turn a proof of concept into a finished migration: moving your legacy systems off their old homes, and making sure none of this quietly runs up a bill you did not expect. Migration is next.
