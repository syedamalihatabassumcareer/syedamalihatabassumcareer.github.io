// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL, BASE_PATH } from './site.config.mjs';

// Site URL and base path are configured in ./site.config.mjs — not here.
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  // Every page is a folder with index.html, so links always end in "/".
  trailingSlash: 'always',
  build: { format: 'directory' },
  output: 'static',
  // Keep classic HTML whitespace handling (Astro 7 defaults to JSX rules).
  compressHTML: true,
  // A sitemap needs an absolute URL, so it is only generated when one is known.
  // Old URLs (/about/, /research/<id>/ …) only redirect into the one-page site.
  integrations: SITE_URL
    ? [
        sitemap({
          filter: (page) =>
            !page.includes('/404') && !/\/(about|research|projects|experience|education|skills|contact)\//.test(page),
        }),
      ]
    : [],
  // Fonts are downloaded at build time and served from this site (no third-party requests).
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Lato',
      cssVariable: '--font-sans',
      weights: [400, 700, 900],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'Segoe UI', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
