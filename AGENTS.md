# Agent conduct (read first)

- Implement **exactly** what the user requests—**nothing more**. No creative refactors, drive-by cleanups, or "helpful" extras unless the user **explicitly** agrees.
- **Git**: Do **not** create commits, push, or otherwise manipulate git history unless the user asks you to. The user owns version control.
- **Replies**: Be **concise** in messages to the user.
- **Tests**: Do not write tests unless the user explicitly asks. Verification for this site is `npm run test` (type-check + build) and browser-driving the dev server for UI changes.

---

# relayk.it — RelayKit marketing + docs site

Static **Astro 5** site, deployed as an **nsite** (NIP-5A static hosting on Nostr). The product it documents lives in the neighbouring `../relaykit` repo — use it as the source of truth for features, presets (`../relaykit/app/presets/*/metadata.json`) and the changelog (`../relaykit/app/CHANGELOG.md`).

## Hard constraints

- **Static-first, crawlable**: every page must render as real HTML at build time. No client-side routing, no UI frameworks. Interactivity lives in small vanilla TS scripts (`src/scripts/`) loaded as external modules.
- **CSP**: pages ship `script-src 'self'` — **never inline scripts or inline event handlers**. Use `<script src="…">` or Astro-processed `<script>` tags (bundled to external files).
- **Deployable as an nsite**: output must be plain static files in `dist/` (no server runtime). The nsyte publish script and `.nsite/config.json` assume this.
- **Brand identity (do not drift)**: Ethnocentric display font, system mono stack (SF Mono/Menlo, matching the relaykit app) body, lilac/lavender accents (`src/lib/brandAccents.ts`, `rgba(118,82,168)` anchor), sharp corners (`--radius: 0`), the rotating Rubik's cube above the fold, light/dark themes. The cube is a faithful vanilla port of `@samthomson/rubix-loader` — preserve its math and timings exactly.

## Project layout

- `src/pages/` — routes. Content collections render through `src/layouts/DocsLayout.astro`; the homepage (`src/pages/index.astro`) uses `BaseLayout` directly.
- `src/content/` — Markdown collections (`pages`, `features`, `services`, `apps`, `guides`) defined in `src/content.config.ts`. Frontmatter schemas are enforced; the docs sidebar is generated from collections by `src/lib/nav.ts` — **adding a file adds it to the nav**.
- `src/layouts/` — `BaseLayout` (head/SEO/CSP/theme/drawer) and `DocsLayout` (sidebar + TOC + prev/next).
- `src/components/` — server-rendered Astro components. `Icon.astro` holds inline lucide SVGs — add icons there rather than pulling a dependency.
- `src/scripts/` — vanilla TS: `rubix-cube.ts`, `typewriter.ts`, `site.ts` (drawer, theme toggle, TOC scroll-spy).
- `src/styles/global.css` — design tokens + brand utilities (`rk-*` classes). Tailwind config extends these tokens.
- `public/` — static assets. Screenshots/videos for content pages go in `public/media/`.

## Conventions

- Service pages carry a `media` frontmatter array (paths under `/media/`) — videos/images render automatically after the content body.
- The changelog is curated by hand from the app repo's CHANGELOG at release time.
- Accessibility: keyboard-navigable drawer, `aria-current` on nav, visible focus rings, `prefers-reduced-motion` respected by every animation.
- After changes, run `npm run test`; for UI changes also browser-drive `npm run dev` and verify the affected surface.

## Writing style

Content is factual technical documentation, not marketing. Rules:

- Be incredibly concise. No more words than needed. Cut every sentence that adds no information.
- No marketing speak: no "you bring the domain", "empower", "seamless", "perfect for", no clever flourishes. Write like one engineer talking to another.
- Describe what the product does, never how it works internally (no Dokploy/Traefik/docker details — they are background implementation, not user-facing).
- No CLI/docker commands in user-facing docs — this is a GUI product; if a fix needs the terminal, it's a bug report, not documentation.
- GUI-level accuracy only: verify claims against the actual `../relaykit` UI before writing them. Do not invent options (e.g. there is no certificate-type choice — TLS is automatic).

## Deploy

`npm run nsite:publish` → `astro build` + nsyte upload with `--fallback=/404.html`.
