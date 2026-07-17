---
course: "modernizing-data-estate-with-fabric"
slug: "the-estate-you-actually-have"
title: "The Estate You Actually Have"
summary: "Before you touch Fabric, learn to read your current estate honestly. Its shape decides everything about how you move it."
order: 1
readTime: "7 min"
access: "free"
draft: false
---

Most "modernize your data" advice starts with a clean diagram. Yours does not look like that, and that is the honest place to begin.

You probably have data in a few too many places. Some of it lives in an on-prem SQL Server that someone set up years ago. Some sits in a Synapse workspace, some in flat files a team drops into a folder every morning, and a surprising amount lives inside Power BI reports that quietly became the source of truth nobody planned for. None of this is a failure. It is what happens when a business grows faster than its data platform.

So before we touch Fabric, let me show you how to *read* your estate, because the shape of what you have decides everything about how you move it.

## Why we start here and not with a tool

There is a strong temptation, the moment you decide to modernize, to open Fabric and start clicking. Resist it for one lesson. A migration that starts with the tool tends to recreate the same mess in a shinier place. A migration that starts with an honest map of what you have, and why, moves the right things and leaves the rest behind.

Modernizing is not about the newest feature. It is about getting one clean, trusted copy of your data into a place everything else can rely on. That is the whole game. Everything in this course is in service of that one sentence.

## The four questions that map an estate

For every source of data you have, answer four questions. Write them down. This becomes your migration plan later, so do not skip the writing part.

- **Where does it live?** The system: SQL Server, Synapse, a SharePoint folder, a SaaS app, a Power BI dataset. Be specific.
- **Who trusts it?** Which reports, teams, or decisions depend on this data today. If the answer is "everyone quietly," flag it, that is your highest-risk item.
- **How fresh does it need to be?** Once a day is a very different problem from once a minute. Most data does not need to be as real-time as people claim, and knowing that saves you money later.
- **Does anyone own it?** If nobody owns a source, migrating it is a chance to either assign an owner or retire it. Both are wins.

By the time you have answered these for every source, you will notice something: a handful of sources carry almost all the trust, and a long tail carries almost none. That imbalance is the most useful thing you will learn about your estate.

## The four piles

Sort every source into one of four piles. This is the decision that makes the rest of the migration tractable.

- **Move it.** Actively used, trusted, and worth carrying forward. These get first-class treatment on Fabric.
- **Rebuild it.** Used, but built badly or duct-taped together. Do not migrate the mess, use the move as the excuse to do it right.
- **Connect it.** Trusted and needed, but you do not actually have to copy it. Fabric has a large library of connectors, plus shortcuts and mirroring, that let you reach data where it already lives and make it show up in your estate without a physical move. For a lot of sources this is the smartest option, and most people forget it exists. We will come back to it in the next two lessons, because knowing which sources belong here saves you the most work of anything on this list.
- **Leave it.** Nobody trusts it, nobody owns it, or it is redundant with something in the "move" pile. The bravest and most valuable migration decisions are the things you choose not to bring.

A modernization is judged less by what you move and more by what you had the discipline to leave behind, or better yet, never had to move at all.

## What "modern" actually means, in one picture

Hold this target in your head for the rest of the course. Today your data is scattered, copied, and re-copied, and each copy drifts from the others. "Modern on Fabric" means the opposite: one copy of your data, in one place, that every engine can read without moving it again.

That place is OneLake, and that idea, one copy everything can trust, is what the next lesson is about. But you cannot design the target until you are honest about the start. So finish your four questions and your four piles first. That map is the real first deliverable of this course.

## Before the next lesson

Write out your sources, answer the four questions for each, and sort them into the four piles. Ten minutes with a notepad now will save you weeks later. When you have your map, move on, we are going to design where all of this lands.
