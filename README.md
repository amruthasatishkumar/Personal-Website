# Amrutha Satishkumar — Portfolio & Blog

A fast, SEO-first personal site built with **Astro**, **Tailwind CSS v4**, and a glass-morphism design. Portfolio plus a migrated blog ("Writing") with 13 articles.

## Stack

- **Astro 5** — static site generation, one real HTML page per route (great for SEO)
- **Tailwind CSS v4** — CSS-first config in `src/styles/global.css`
- **React islands** — only for interactive bits (theme toggle)
- **Content Collections** — Markdown articles in `src/content/blog`
- **Sveltia CMS** — Git-based editor at `/admin` (no database, free)
- **Web3Forms** — contact form, no backend

## Project structure

```
site/
├── public/
│   ├── admin/            # Sveltia CMS (index.html + config.yml)
│   ├── images/           # avatar + blog images (downloaded, self-contained)
│   ├── favicon.svg
│   └── robots.txt
├── scripts/
│   └── migrate.mjs       # one-time article import from the old site
├── src/
│   ├── components/       # Nav, Footer, SEO, ThemeToggle
│   ├── content/blog/     # 13 Markdown articles
│   ├── data/site.ts      # ALL personal info lives here — edit this
│   ├── layouts/BaseLayout.astro
│   ├── pages/            # index, about, contact, blog/, rss, 404
│   └── styles/global.css # glass design system
└── astro.config.mjs
```

## Develop

```bash
cd site
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Editing content

- **Personal info, experience, skills, certs:** edit `src/data/site.ts`.
- **Articles:** add/edit Markdown in `src/content/blog/` or use the CMS at `/admin`.

## Before you deploy — checklist

1. **Domain:** set the real domain in `astro.config.mjs` (`site:`) and `src/data/site.ts` (`url`).
2. **Contact form:** create a free key at https://web3forms.com and set `web3formsKey` in `src/data/site.ts`.
3. **CMS:** in `public/admin/config.yml`, set `repo:` to your GitHub `username/repo`, then connect the repo in Sveltia (GitHub OAuth).
4. **OG image (optional):** add `public/og-default.png` (1200x630) for nicer social link previews.
5. **Robots/sitemap:** update the domain in `public/robots.txt`.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel. The included `vercel.json` sets the framework, build command (`npm run build`), and output (`dist`).
3. Add your custom domain in Vercel and update the two URLs from the checklist.

## Re-running the migration

The articles are already migrated. If you ever need to re-import from the old
export, run `npm run migrate` (reads `../_articles_export.json`). It downloads
images locally and strips em/en dashes automatically.

## Notes

- Default theme is **dark**; the toggle adds a `.light` class to `<html>` and
  remembers the choice. It also respects `prefers-color-scheme` on first visit.
- Two inline images in the transformer articles were hosted on LinkedIn's CDN
  (hotlink-protected) and could not be downloaded; their source captions remain.
  Replace them by adding local images if desired.
