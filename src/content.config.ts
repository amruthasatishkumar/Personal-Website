import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().default("Data & AI"),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    readTime: z.string().default("5 min"),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const level = z.enum(["Beginner", "Intermediate", "Advanced"]);
const access = z.enum(["free", "premium"]).default("free");

// Outcome-based courses. Each course is a folder under src/content/courses/<slug>/
// with a _course.md meta file and lessons in a lessons/ subfolder.
const courses = defineCollection({
  loader: glob({ pattern: "**/_course.md", base: "./src/content/courses" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string().default(""),
    // One-line promise: what the learner walks away able to do.
    outcome: z.string().default(""),
    level,
    // Optional learning track so courses can ladder later.
    track: z.string().optional(),
    order: z.number().default(0),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    // Short, honest prerequisites shown on the course hub.
    prerequisites: z.array(z.string()).default([]),
    // What the learner will be able to do / build by the end.
    outcomes: z.array(z.string()).default([]),
    // All free today. Flip to "premium" per course when commercializing.
    access,
    draft: z.boolean().default(false),
  }),
});

const lessons = defineCollection({
  loader: glob({ pattern: "**/lessons/*.md", base: "./src/content/courses" }),
  schema: z.object({
    // Slug of the parent course this lesson belongs to.
    course: z.string(),
    slug: z.string(),
    title: z.string(),
    summary: z.string().default(""),
    order: z.number().default(0),
    readTime: z.string().default("5 min"),
    access,
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, courses, lessons };
