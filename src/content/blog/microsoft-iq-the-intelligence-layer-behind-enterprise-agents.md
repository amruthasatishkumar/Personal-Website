---
title: "Microsoft IQ: The Intelligence Layer Behind Enterprise Agents"
description: "Microsoft IQ turns your company's scattered knowledge into agent-ready intelligence. Here is how Work IQ, Fabric IQ, Foundry IQ, and Web IQ fit together."
pubDate: 2026-06-26
category: "AI"
tags: ["AI", "Agents", "Microsoft", "Fabric", "Foundry"]
cover: "/images/blog/microsoft-iq-the-intelligence-layer-behind-enterprise-agents/cover.png"
readTime: "6 min"
featured: true
draft: false
---

## The problem Microsoft IQ is solving

Most teams building agents hit the same wall. The agent logic is ready, but the knowledge underneath it is scattered across documents, emails, meetings, operational systems, and the open web. Wiring all of that into an agent means solving for scale, security, freshness, and answer quality all at once, usually with a different custom integration for every source.

Microsoft frames the answer around a simple idea: your company already has an IQ. It is the collective intelligence locked inside your content and your data. Microsoft IQ is the layer that turns that raw intelligence into something agents can use safely and consistently.

Rather than one product, Microsoft IQ is a family. Each member owns a different kind of knowledge, and they feed a shared retrieval layer that any agent can call.

## The four members of the family

![The Microsoft IQ family](/images/blog/microsoft-iq-the-intelligence-layer-behind-enterprise-agents/iq-family.png)

### Work IQ: the knowledge of how your organization works

Work IQ brings organizational signals like emails, meetings, files, and Teams messages into one enriched, AI-ready source, all while respecting user permissions. This is the knowledge of how the company actually operates: what was decided, who owns what, and what is top of mind for a team this week.

Because it honors existing permissions, an agent grounded in Work IQ only ever sees what the person asking is already allowed to see.

### Fabric IQ: structured business meaning, not just rows

Fabric IQ lets agents query data agents and company ontologies. An ontology is a formal model of your business entities, their relationships, and the rules that connect them, linked to live data in OneLake through a specialized semantic layer.

The important shift here is meaning. Instead of returning raw rows, Fabric IQ returns structured answers that respect how your business actually defines a customer, an order, or a margin, alongside the unstructured document context for the same question.

### Foundry IQ: the unified knowledge layer

Foundry IQ is where it comes together. It brings enterprise content and structured systems into a single knowledge base for multi-source, agentic retrieval, so developers can give agents access to knowledge without building and maintaining a connector for every system.

A few things make it production grade:

- **Multi-source knowledge bases.** Ground agents across Work IQ, Fabric IQ, File Search, Azure SQL, and MCP through one knowledge base, with no custom integration work.
- **Agentic retrieval.** Foundry IQ runs an iterative retrieval loop rather than a single lookup. Microsoft reports answer quality improvements of up to 20 percent across its evaluated datasets, and up to 54 percent better recall compared to single-shot retrieval augmented generation.
- **Serverless and scale to zero.** Agent workloads are bursty, so the serverless tier scales to zero when idle and removes clusters and reserved capacity from the equation.
- **An MCP server.** Foundry IQ exposes knowledge bases over the Model Context Protocol, so any compatible host can use them, including Microsoft Agent Framework, Claude, ChatGPT, and LangChain.

### Web IQ: grounded access to the open web

When an answer needs fresh, real-world context, Web IQ extends an agent's reach to the open web across web, news, images, video, and shopping sources. It is designed for language model workflows rather than traditional search pages, with low-latency ranking, and it honors publisher preferences.

Combined with Foundry IQ, an agent can plan, search, reason, and synthesize an answer that draws on both internal knowledge and external context in one retrieval engine.

## Why governance is the quiet headline

The most interesting part of Microsoft IQ is not retrieval quality. It is that security lives at the data layer rather than being approximated in application code.

Permissions follow the content into the agent. Microsoft Purview sensitivity labels are surfaced inside knowledge sources, so label-based access controls are honored end to end, and SharePoint permissions sync incrementally as they change. For a regulated enterprise, that is the difference between a demo and something you can actually ship.

## A simple mental model

If you remember one thing, make it this flow:

1. **Sources** hold your knowledge. Work IQ for how the org works, Fabric IQ for structured business meaning, Web IQ for the outside world, plus files, SQL, and other systems.
2. **Foundry IQ** unifies those sources into one permission-aware knowledge layer and serves them through agentic retrieval and an MCP server.
3. **Agents** consume that layer. Microsoft 365 Copilot, your own custom agents, and any MCP-compatible host all draw from the same grounded knowledge.

Build the knowledge once, reuse it across every agent.

## Where this is heading

The pattern behind Microsoft IQ is bigger than any single product. As agents move from pilots to production, the differentiator stops being which model you picked and becomes how well your knowledge is organized, governed, and retrieved. Microsoft IQ is a bet that the knowledge layer, not the model, is where enterprise advantage will actually live.

If you are designing agents today, start with the question Microsoft is implicitly asking: where does your company's IQ live, and can your agents reach it without breaking trust?
