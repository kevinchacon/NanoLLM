# NanoLLM Blog

NanoLLM is a free, public tutorial blog documenting how to build a GPT-style language model from scratch.

The site is built with Astro and deployed to GitHub Pages with a push-to-publish workflow.

## Stack

- Astro (static site generation)
- Markdown content collections (`src/content/blog`)
- GitHub Actions CI/CD
- GitHub Pages hosting (free)

## Local development

```sh
npm install
npm run dev
```

Open `http://localhost:4321`.

## How publishing works

1. Add or edit posts in `src/content/blog/*.md`.
2. Commit and push to `main`.
3. GitHub Actions workflow at `.github/workflows/deploy.yml` builds and deploys automatically.

No manual deployment step is needed.

## Add a new post

Create a Markdown file inside `src/content/blog/` with frontmatter:

```md
---
title: 'Post title'
description: 'Short description'
pubDate: 'Feb 17 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

Your content here.
```

## Domain setup

- The custom domain is configured via `public/CNAME` as `nanollm.com`.
- In GitHub repo settings, enable GitHub Pages and point DNS records for `nanollm.com` to GitHub Pages.

## Future ads support

When you are ready, ads can be added without changing hosting by injecting ad script tags in `src/components/BaseHead.astro` and placing ad blocks in layouts/pages.
