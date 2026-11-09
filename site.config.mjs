// ─────────────────────────────────────────────────────────────────────────────
// Deployment URL settings — the ONLY place the site URL and base path live.
//
// On GitHub Pages you normally do not need to edit this file: the deploy
// workflow (.github/workflows/deploy.yml) reads the real URL from GitHub and
// passes it in through the SITE_URL and BASE_PATH environment variables.
//
// Edit the fallbacks below only if you build somewhere else, or want local
// production builds (`npm run build`) to produce canonical URLs and a sitemap.
//
//   User site     https://<username>.github.io/
//       SITE_URL = 'https://<username>.github.io'   BASE_PATH = '/'
//
//   Project site  https://<username>.github.io/<repository>/
//       SITE_URL = 'https://<username>.github.io'   BASE_PATH = '/<repository>'
// ─────────────────────────────────────────────────────────────────────────────

/** Origin only, no path and no trailing slash. Empty = unknown (no sitemap/canonical tags). */
const FALLBACK_SITE_URL = '';

/** '/' for a user site, '/<repository>' for a project site. */
const FALLBACK_BASE_PATH = '/';

function normaliseBase(value) {
  const trimmed = (value ?? '').trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

function normaliseSite(value) {
  const trimmed = (value ?? '').trim().replace(/\/+$/, '');
  return trimmed || undefined;
}

// An environment variable that is set but empty still wins (GitHub reports a
// user site's base path as ""), so `??` rather than `||` here.
export const SITE_URL = normaliseSite(process.env.SITE_URL ?? FALLBACK_SITE_URL);
export const BASE_PATH = normaliseBase(process.env.BASE_PATH ?? FALLBACK_BASE_PATH);
