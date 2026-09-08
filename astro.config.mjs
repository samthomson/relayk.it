// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://relayk.it',
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],
  redirects: {
    '/apps/nsite-explorer': '/apps/npanel',
    '/docs/local-https': '/install',
    '/docs/your-first-service': '/install',
    '/docs/updating': '/features/updates',
    '/docs/troubleshooting': '/troubleshooting',
    '/features/one-command-install': '/install',
    '/features/logs': '/features/insights',
  },
  build: {
    inlineStylesheets: 'never',
  },
  // Keep every asset — scripts included — as real files: the CSP allows only
  // `script-src 'self'`, so Astro's small-chunk inlining must stay off.
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  // The floating dev toolbar is noise for this site — never needed it.
  devToolbar: { enabled: false },
});
