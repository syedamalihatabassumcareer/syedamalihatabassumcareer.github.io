// Shared helpers for the build-output tests.
// The tests inspect a finished build, so run `npm run build` first — or use
// `npm run verify`, which builds for both deployment shapes and tests each.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export const DIST = process.env.DIST_DIR ?? 'dist';
/** Base path the build was made for: "/" or "/<repo>/". */
export const BASE = (() => {
  const raw = (process.env.BASE_PATH ?? '/').replace(/^\/+|\/+$/g, '');
  return raw ? `/${raw}/` : '/';
})();

export function assertBuilt() {
  if (!existsSync(join(DIST, 'index.html'))) {
    throw new Error(`No build found in "${DIST}". Run "npm run build" (or "npm run verify") first.`);
  }
}

export function walk(dir = DIST) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/** Path of a built file as served, e.g. "research/camdet/index.html". */
export const servedPath = (file) => relative(DIST, file).split(sep).join('/');

export const read = (file) => readFileSync(file, 'utf8');

export const htmlFiles = () => walk().filter((f) => f.endsWith('.html'));
