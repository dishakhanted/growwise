# Poonji website

Public website for **Poonji — Wall Street for AI Agents**, deployed at [www.poonji.ai](https://www.poonji.ai/).

The site presents Poonji’s vision with a green interactive globe, scroll reveals, and email contact links. It intentionally excludes product mechanics, private metrics, and roadmap details.

## Run locally

Use Node.js 22 LTS and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (port 8080 by default).

## Check and build

```sh
npm run check
npm run build
npm run preview
```

The production output is `dist/`. Check the homepage, the “Enter the next era” anchor, contact links, narrow screens, and reduced-motion behavior when changing the design. There is no automated browser test suite.

## Where to edit

- `index.html`: page content, sections, contact links, search and social metadata.
- `public/vision/style.css`: layout, typography, colors, and responsive styles.
- `public/vision/app.js`: animated globe, pointer interaction, and scroll reveals. It respects reduced-motion preferences and pauses animation when the page is hidden.
- `public/vision/logo.png`: current brand mark.
- `public/robots.txt`: crawler rules.
- Other `public/` icons: retained for the existing installable-site manifest and service worker.
- `vite.config.js`: development server, manifest, and service-worker caching.
- `vercel.json`: existing Vercel rewrite configuration.

This is a static HTML/CSS/JavaScript site. Vite and its PWA plugin are the only direct build dependencies. It does not use React, a database, or backend functions. No environment variables are required. Contact links open the visitor’s email application; the site does not submit a form.

## Deployment

The GitHub repository is connected to the existing Vercel `growwise` project. Updates to `main` trigger production deployment to poonji.ai. Vercel runs `npm run build` and serves `dist/`.

Check Vercel’s deployment result after pushing. Existing visitors may briefly see cached content while the service worker updates; reload once the new version is available. Keep the PWA update path unless deliberately retiring it for existing visitors.

## Archived code

The complete repository before the October 10, 2026 cleanup is preserved on [`archive/pre-cleanup-2026-10-10`](https://github.com/dishakhanted/growwise/tree/archive/pre-cleanup-2026-10-10).

That branch contains the previous React app, UI components, derivatives landing page and pricing tools, Supabase functions and migrations, legacy tests and documentation, setup scripts, and their dependencies and configuration. The earlier `legacy` branch remains untouched.

To inspect the archive without changing a current checkout:

```sh
git fetch origin
git worktree add ../poonji-archive origin/archive/pre-cleanup-2026-10-10
```

Removing backend code from this repository does not delete or disable any existing Supabase resources. This cleanup only changes repository contents and the static website build.
