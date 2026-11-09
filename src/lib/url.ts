// Every internal link and public asset must go through `withBase()` so the
// site works both at https://<user>.github.io/ and https://<user>.github.io/<repo>/.

const BASE = import.meta.env.BASE_URL; // always ends in "/" (trailingSlash: 'always')

/**
 * Prefix a site-relative path with the configured base path.
 * Page paths get a trailing slash; file paths (with an extension) and
 * hash/query suffixes are preserved.
 *
 *   withBase('/')                 → '/'            or '/repo/'
 *   withBase('research/camdet')   → '/research/camdet/'
 *   withBase('cv/cv.pdf')         → '/cv/cv.pdf'
 *   withBase('research/?topic=x') → '/research/?topic=x'
 */
export function withBase(path = '/'): string {
  const match = path.match(/^([^?#]*)(.*)$/);
  let pathname = (match?.[1] ?? '').replace(/^\/+/, '');
  const suffix = match?.[2] ?? '';
  const lastSegment = pathname.split('/').pop() ?? '';
  const isFile = lastSegment.includes('.');
  if (pathname && !isFile && !pathname.endsWith('/')) pathname += '/';
  return `${BASE}${pathname}${suffix}`;
}

/** Strip the base path from a pathname, e.g. for comparing nav items. */
export function stripBase(pathname: string): string {
  const base = BASE.replace(/\/$/, '');
  const rest = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return rest.startsWith('/') ? rest : `/${rest}`;
}

export function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:');
}

/** Absolute URL for metadata; undefined when the deployment URL is unknown. */
export function absoluteUrl(path: string, site: URL | undefined): string | undefined {
  return site ? new URL(withBase(path), site).href : undefined;
}
