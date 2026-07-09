---
title: "Ontologies vs Semantic Models: What They Mean for Data Agents and Power BI"
description: "An ontology and a Power BI semantic model are not the same thing. Here is what each does, when to use which, and why the pairing makes data agents trustworthy."
pubDate: 2026-07-09
category: "Data & AI"
tags: ["Data & AI", "Fabric", "PowerBI", "Agents"]
cover: "/images/blog/ontologies-vs-semantic-models-what-they-mean-for-data-agents-and-power-bi/cover.png"
readTime: "9 min"
featured: true
draft: false
---

## Ontology or semantic model: two words confusing every data team

For a decade, the semantic model was the trusted heart of a Power BI solution. Then Microsoft introduced ontologies as part of [Fabric IQ](/blog/fabric-iq-fabric-data-agents-azure-ai-foundry-and-mcp-how-they-work-together), and a lot of data teams started asking the same question: is an ontology just a new name for a semantic model, is it a replacement, and what does it mean for the reports and data agents we are already building?

Here is the sharpest way to put it: **a semantic model makes a report trustworthy, and an ontology makes an agent trustworthy.** They are related, and one can help you build the other, but you do not get one free with the other. Ontology in Fabric IQ is in preview, but the distinction is worth getting right now, because it changes how you build [agent-ready data](/blog/agent-ready-data-why-dashboard-ready-data-is-no-longer-enough).

## What a semantic model actually does

A Power BI semantic model is a curated analytics layer. It sits over your data and gives business users trusted, consistent numbers.

It defines:

- **Measures** like revenue, margin, and active customers
- **Hierarchies and dimensions** like date, region, and product
- **Relationships** between tables, so one question fans out correctly

Ask "what was revenue last quarter by region," and the model returns the same correct number no matter which report you open. That is its strength, and its scope: it is built for analytics, and it answers questions about **numbers**.

## What an ontology adds

An ontology works at a different level. Instead of measures and visuals, it captures the business itself as a shared vocabulary.

It defines:

- **Entity types**: what a Customer, an Order, a Product, or a Store is
- **Relationships**: an Order contains Products, a Product is stocked at a Store, a Store is served by a Supplier
- **Properties and rules**: what governs each entity, like the reorder threshold that flags a stockout
- **Actions**: what can be done, and how an agent can invoke it

The difference shows up the moment a question spans concepts. A semantic model can tell you sales fell. An ontology lets you **trace the chain**, Product to Store to Inventory to Supplier, and explain why. That relationship-first reasoning is why Fabric IQ pairs the ontology with a graph that stores and traverses those connections.

## The distinction at a glance

Your data lives in tables and schemas, structures built for machines. Businesses do not run on tables. They run on concepts: customers, assets, orders, breaches. The table below is the fastest way to see which layer handles which.

![How OneLake grounds a Power BI semantic model and an ontology, which together ground data agents and Power BI reports](/images/blog/ontologies-vs-semantic-models-what-they-mean-for-data-agents-and-power-bi/ontology-vs-semantic.png)


| | Power BI semantic model | Ontology (preview) |
| --- | --- | --- |
| **Models** | Measures, hierarchies, relationships | Entities, relationships, rules, actions |
| **Optimized for** | Analytics and reporting | Meaning, reasoning, and action |
| **Answers** | What are the numbers? | What do the concepts mean and how do they connect? |
| **Consumed by** | Reports and dashboards | Data and operations agents |
| **Example** | Revenue last quarter by region | Trace a sales drop to a supplier stockout and explain it |

## They are not the same thing

They are related, but not interchangeable, and this is where teams get burned. You can bootstrap an ontology from a Power BI semantic model already in production, and that is a real head start: your trusted definitions and terminology carry over.

Be clear-eyed about what that head start is, though. Ontology is in preview, and generating from a semantic model gives you a **starting point, not a finished ontology**. The parts that make it valuable, the entity relationships, the rules, and the actions, are work you do on top. Your semantic model's table relationships do not simply become an ontology.

The reason to do that work is one definition of the truth. Define a concept like Customer once, and the number a report shows and the concept an agent reasons over trace back to the same place, instead of quietly diverging.

## What it means for data agents

This is where it gets practical. A Fabric data agent is a virtual analyst that answers natural language questions over your data.

- **Without shared context**, the agent has to guess what your columns mean, and every ambiguous question needs a human to translate.
- **Grounded in a semantic model and an ontology**, it starts with your business language built in: what a Customer is, how a Shipment relates to an Order, and which actions are valid.

That grounding is the difference between an agent that produces plausible answers and one you can trust for decisions. It is also what lets operations agents move from "here is a number" to "here is an anomaly, and here is the governed action to take," because the ontology declares the rules and actions attached to each entity. You can even query the ontology in plain language, which turns a business question into a structured query rather than a guess.

## A retail example, end to end

Say a category manager asks: **"Why did revenue for our flagship product line drop last month?"**

**With a semantic model alone**, a data agent can answer the *what*. It returns a clean, trusted number: revenue for the line fell 12 percent last month, concentrated in the Northeast. Useful, but it stops there. Explaining *why* is still a person's job, pulling threads across sales, inventory, and promotions by hand.

**With an ontology underneath**, the agent can answer the *why*, because it knows how the business connects. It follows the relationships:

- The **product line** is sold across **stores**
- Those stores track **inventory**, supplied by specific **suppliers**
- The products were tied to a **promotion** that ended, and to a **price**

Tracing that chain, the agent can say: revenue dropped because a promotion ended on the two best-selling SKUs, while a supplier delay left those same SKUs out of stock across Northeast stores. And because the ontology also declares **actions**, the agent can do more than explain. It can flag the stockout to the category manager or open a reorder, within governed limits.

Same question. The semantic model gave a number. The ontology turned it into an explanation and an action.

## Which one does your data agent actually need?

Not every agent needs both. A quick way to decide:

- **Semantic model only.** If your agent answers metric questions inside one well-modeled domain, like "what was revenue by region last quarter," a trusted semantic model may be all it needs. The questions are about numbers, and the relationships stay inside that model.
- **Ontology, with a model underneath.** Reach for an ontology when questions span domains and relationships, like "why was this order delayed," when the agent has to follow business rules, or when an operations agent needs to act on live data. This is where cross-domain reasoning and governed actions live.
- **Both.** Most production agents land here. The semantic model supplies the trusted numbers, and the ontology supplies the shared meaning, relationships, and actions. Together they let an agent answer both "what happened" and "why, and what should we do about it."

If you are not sure, start with the semantic model you already trust, then add an ontology once your agents start asking questions that cross concepts or need to take action.

## How it comes together

At a high level, and without getting into preview-specific clicks:

1. **Model the analytics in Power BI.** Clean measures and relationships in your semantic model, the trusted numbers.
2. **Generate and refine the ontology in Fabric IQ.** Bootstrap from that semantic model, then add the entity relationships, rules, and actions that reporting never needed.
3. **Point a data agent at both.** It draws trusted numbers from the semantic model and business meaning from the ontology, grounded on your OneLake data.

Start at step one with what you already trust, and add the next layer when your agents need to reason or act.

## What it means for Power BI

If you have invested years in Power BI semantic models, that work is not obsolete, it is your foundation. The [modeling discipline you already have](/blog/the-foundation-beneath-every-power-bi-report), clean measures and well-defined relationships, is exactly what makes an ontology and the agents on top of it reliable. Good semantic modeling was always the real product. What changes is that the report is no longer the finish line. It is the on-ramp, and the teams that stop at the dashboard will be out-executed by the teams that build meaning on top of it.

## Where this is heading

As agents move into real decisions, the differentiator stops being which model you picked and becomes whether your data carries its own meaning. A report only has to be read by a human who already knows the business. An agent does not have that context, so it has to get it from somewhere. The ontology is that somewhere.

If you are modeling data today, the question is shifting. Not just "are my numbers right," but "does my data know what my business means, well enough for an agent to act on it?"

## Sources

This post is based on Microsoft's public documentation:

- [What is Fabric IQ?](https://learn.microsoft.com/en-us/fabric/iq/overview) (Microsoft Learn, semantic models, ontology, and data agents)
- [Power BI semantic models in Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/data-warehouse/semantic-models) (Microsoft Learn)
- [Fabric data agent concepts](https://learn.microsoft.com/en-us/fabric/data-science/concept-data-agent) (Microsoft Learn)
