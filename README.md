# relayk.it

The RelayKit marketing + documentation site — a static Astro site deployed to Nostr as an nsite (NIP-5A).

## Stack

- **[Astro 5](https://astro.build)** — static HTML output, near-zero client JS. The Rubik's cube, typewriter title and site chrome are small vanilla TS scripts; no UI framework ships anywhere.
- **TailwindCSS 3** — design tokens (lilac accents, sharp corners, light/dark) live in `src/styles/global.css`.
- **Ethnocentric** display font + the system mono stack (SF Mono/Menlo — matching the relaykit app) for body text.
- Content pages are Markdown in `src/content/`, organised into collections (`pages`, `features`, `services`, `apps`, `guides`) that drive the docs sidebar automatically (`src/lib/nav.ts`).

## Developing

```bash
npm run dev      # astro dev server
npm run test     # astro check + build
npm run build    # astro build → dist/
```

## Deploying

You'll be prompted each run for the site signing key — `nsec1…`, `nbunksec1…`, or a fresh `bunker://…` URL from your signer. Hidden input, never stored. Same key = same site npub.

```bash
npm run nsite:publish
```

Deploys publish as the named site `relaykit` (kind 35128, `d=relaykit`) — never the root site (kind 15128). The live site updates within ~10 minutes (or immediately via nPanel's "refresh nsite content" action). Scope a run to specific servers/relays with passthrough args, e.g. `npm run nsite:publish -- -s https://blossom.relayk.it`.

## Content authoring

- Add a page: drop a `.md` file into the matching `src/content/<collection>/` directory with `title`, `description`, `order` frontmatter. It appears in the sidebar.
- Screenshots/videos: put files in `public/media/`, reference from a service page's `media` frontmatter (rendered automatically) or inline in Markdown.
- The changelog (`src/content/pages/changelog.md`) is maintained by hand — copy user-facing notes from `../relaykit/app/CHANGELOG.md` when cutting a release.

## Analytics

Plausible Analytics is wired in via build-time env vars (see `.env.example`): set `PLAUSIBLE_DOMAIN` and rebuild. The CSP allows the script origin automatically. Leave it empty to build without tracking.
