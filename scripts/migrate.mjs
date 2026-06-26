// Migrates articles from the old Supabase export into local Markdown + images.
// Run from the `site/` folder: npm run migrate
//
// Source: ../_articles_export.json (exported from the old "Perspective" Supabase DB)
// Output: src/content/blog/<slug>.md  and  public/images/blog/<slug>/...

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import TurndownService from "turndown";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EXPORT = path.resolve(ROOT, "..", "_articles_export.json");
const BLOG_DIR = path.join(ROOT, "src", "content", "blog");
const IMG_DIR = path.join(ROOT, "public", "images", "blog");
const AVATAR_OUT = path.join(ROOT, "public", "images", "amrutha.png");

// Replace em/en dashes (and dash-like glyphs used as separators) with commas.
// Keeps real hyphens in compound words.
function stripEmDashes(text) {
  if (!text) return text;
  return text
    // " — " or " – " used as a clause separator -> ", "
    .replace(/\s*[\u2014\u2013\u2015]\s*/g, ", ")
    // standalone fancy dashes -> hyphen
    .replace(/[\u2012\u2010\u2011]/g, "-")
    // collapse doubled commas that can result
    .replace(/,\s*,/g, ",");
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function download(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ! download failed (${res.status}): ${url}`);
      return false;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    return true;
  } catch (err) {
    console.warn(`  ! download error: ${url} (${err.message})`);
    return false;
  }
}

function extOf(url, fallback = ".png") {
  const m = String(url).split("?")[0].match(/\.(png|jpe?g|webp|gif|svg|avif)$/i);
  return m ? `.${m[1].toLowerCase()}` : fallback;
}

function yamlEscape(s) {
  return `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
// Keep underline/figure semantics readable.
turndown.addRule("figure", {
  filter: "figure",
  replacement: (content) => `\n\n${content}\n\n`,
});

async function main() {
  if (!fs.existsSync(EXPORT)) {
    console.error(`Export not found at ${EXPORT}`);
    process.exit(1);
  }

  const articles = JSON.parse(
    fs.readFileSync(EXPORT, "utf8").replace(/^\uFEFF/, "")
  );
  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.mkdirSync(IMG_DIR, { recursive: true });

  let avatarDone = false;
  let count = 0;

  for (const a of articles) {
    if (a.status === "draft") {
      console.log(`- skip draft: ${a.slug}`);
      continue;
    }
    const slug = a.slug || slugify(a.title);
    console.log(`+ ${slug}`);

    // Avatar (download once)
    if (!avatarDone && a.author_avatar) {
      const ok = await download(a.author_avatar, AVATAR_OUT);
      if (ok) {
        avatarDone = true;
        console.log(`  avatar -> public/images/amrutha.png`);
      }
    }

    // Cover image
    let coverPath;
    if (a.image) {
      const dest = path.join(IMG_DIR, slug, `cover${extOf(a.image)}`);
      const ok = await download(a.image, dest);
      if (ok) coverPath = `/images/blog/${slug}/cover${extOf(a.image)}`;
    }

    // Body: prefer rich HTML, fall back to structured sections.
    let html = a.content_html || "";
    if (!html && a.introduction) {
      html =
        `<p>${a.introduction}</p>` +
        (a.sections || [])
          .map((s) => `<h2>${s.heading}</h2>${s.content}`)
          .join("") +
        (a.conclusion ? `<p>${a.conclusion}</p>` : "");
    }

    // Download any inline images and rewrite their URLs to local paths.
    const inlineUrls = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(
      (m) => m[1]
    );
    let imgIndex = 0;
    for (const url of inlineUrls) {
      imgIndex += 1;
      const dest = path.join(IMG_DIR, slug, `img-${imgIndex}${extOf(url)}`);
      const ok = await download(url, dest);
      if (ok) {
        const local = `/images/blog/${slug}/img-${imgIndex}${extOf(url)}`;
        html = html.split(url).join(local);
      }
    }

    let markdown = turndown.turndown(html);
    markdown = stripEmDashes(markdown);

    const title = stripEmDashes(a.title || "Untitled");
    const description = stripEmDashes(
      a.meta_description || a.subtitle || ""
    ).slice(0, 300);
    const tags = Array.isArray(a.tags) ? a.tags : [];
    // created_at is ISO (sortable); the display `date` string is not sliceable.
    const pubDate = (a.created_at || a.updated_at || new Date().toISOString()).slice(
      0,
      10
    );

    const fm = [
      "---",
      `title: ${yamlEscape(title)}`,
      `description: ${yamlEscape(description)}`,
      `pubDate: ${pubDate}`,
      `category: ${yamlEscape(a.category || "Data & AI")}`,
      `tags: [${tags.map((t) => yamlEscape(t)).join(", ")}]`,
      coverPath ? `cover: ${yamlEscape(coverPath)}` : null,
      `readTime: ${yamlEscape(a.read_time || "5 min")}`,
      `featured: ${a.featured ? "true" : "false"}`,
      `draft: false`,
      "---",
      "",
    ]
      .filter(Boolean)
      .join("\n");

    fs.writeFileSync(
      path.join(BLOG_DIR, `${slug}.md`),
      `${fm}\n${markdown.trim()}\n`,
      "utf8"
    );
    count += 1;
  }

  console.log(`\nDone. Wrote ${count} articles to src/content/blog/`);
  if (!avatarDone) {
    console.log(
      "Note: avatar was not downloaded. Place a headshot at public/images/amrutha.png"
    );
  }
}

main();
