# TinaCMS Setup

This project uses TinaCMS as a Git-backed admin panel for the Astro static site.

## Editable Content

The admin edits these files:

- `content/casino/home.json` - home page hero, SEO, stats, featured games heading
- `content/casino/promotions.json` - promotions section and offer cards
- `content/casino/games.json` - casino games database
- `content/casino/providers.json` - game providers

## Local Editing

Run:

```bash
npm run dev
```

Open the Astro URL shown in the terminal, then visit:

```text
/admin/index.html
```

Example:

```text
http://localhost:4321/admin/index.html
```

## Cloudflare Pages

Use these Cloudflare Pages settings:

```text
Build command: npm run build:cloudflare
Output directory: dist
Node version: >=22.12.0
```

Add these environment variables after creating a Tina Cloud project:

```text
TINA_PUBLIC_CLIENT_ID=your_tina_client_id
TINA_TOKEN=your_tina_read_write_token
TINA_BRANCH=main
```

Production admin URL:

```text
https://macau3.zhuanqian388.workers.dev/admin/index.html
```

Without Tina Cloud credentials, the project still builds a local admin preview, but the production admin cannot save changes back to GitHub.
