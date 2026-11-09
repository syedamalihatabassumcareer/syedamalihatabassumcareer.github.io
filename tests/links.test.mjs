// Deployment-risk test: every internal link and asset must carry the base path
// and resolve to a real file in the build. This is what breaks when a site
// moves between https://<user>.github.io/ and https://<user>.github.io/<repo>/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BASE, DIST, assertBuilt, htmlFiles, read, servedPath, walk } from './helpers.mjs';

assertBuilt();

const ATTR = /\s(?:href|src|action|poster)="([^"]*)"|\ssrcset="([^"]*)"/g;
const CSS_URL = /url\(\s*["']?([^"')]+)["']?\s*\)/g;

/** Resolve a site-absolute URL path to the file GitHub Pages would serve. */
function fileFor(pathname) {
  const rest = decodeURIComponent(pathname.slice(BASE.length));
  if (rest === '' || rest.endsWith('/')) return join(DIST, rest, 'index.html');
  return join(DIST, rest);
}

function collectUrls(html) {
  const urls = [];
  for (const m of html.matchAll(ATTR)) {
    if (m[1] !== undefined) urls.push(m[1]);
    if (m[2]) urls.push(...m[2].split(',').map((part) => part.trim().split(/\s+/)[0]));
  }
  for (const m of html.matchAll(CSS_URL)) urls.push(m[1]);
  return urls.map((u) => u.replaceAll('&amp;', '&'));
}

const isInternal = (u) => u.startsWith('/') && !u.startsWith('//');

test(`internal links and assets carry the base path "${BASE}" and exist`, () => {
  const problems = [];
  for (const file of htmlFiles()) {
    const page = servedPath(file);
    for (const url of collectUrls(read(file))) {
      if (!isInternal(url)) continue;
      const { pathname } = new URL(url, 'https://example.test');
      if (!pathname.startsWith(BASE)) {
        problems.push(`${page}: "${url}" is missing the base path ${BASE}`);
      } else if (!existsSync(fileFor(pathname))) {
        problems.push(`${page}: "${url}" points to a file that does not exist`);
      }
    }
  }
  assert.deepEqual(problems, []);
});

test('no relative links that would break on nested pages', () => {
  const problems = [];
  for (const file of htmlFiles()) {
    for (const url of collectUrls(read(file))) {
      if (/^(https?:|mailto:|tel:|data:|#|\/)/.test(url) || url === '') continue;
      problems.push(`${servedPath(file)}: relative URL "${url}"`);
    }
  }
  assert.deepEqual(problems, []);
});

test('in-page fragments on internal links point at existing ids', () => {
  const problems = [];
  for (const file of htmlFiles()) {
    for (const url of collectUrls(read(file))) {
      if (!isInternal(url) || !url.includes('#')) continue;
      const { pathname, hash } = new URL(url, 'https://example.test');
      const target = fileFor(pathname);
      if (!existsSync(target)) continue; // reported by the first test
      const id = decodeURIComponent(hash.slice(1));
      if (id && !read(target).includes(`id="${id}"`)) problems.push(`${servedPath(file)}: "${url}" has no #${id} target`);
    }
  }
  assert.deepEqual(problems, []);
});

test('external links that open a new tab are isolated with rel="noopener"', () => {
  const problems = [];
  for (const file of htmlFiles()) {
    for (const tag of read(file).match(/<a\s[^>]*target="_blank"[^>]*>/g) ?? []) {
      if (!/rel="[^"]*noopener/.test(tag)) problems.push(`${servedPath(file)}: ${tag}`);
    }
  }
  assert.deepEqual(problems, []);
});

test('old section URLs still exist and forward to the one-page sections', () => {
  for (const [page, section] of [
    ['about', 'about'],
    ['research', 'research'],
    ['projects', 'projects'],
    ['experience', 'experience'],
    ['education', 'education'],
    ['skills', 'skills'],
    ['contact', 'contact'],
  ]) {
    const html = read(join(DIST, page, 'index.html'));
    assert.match(html, new RegExp(`http-equiv="refresh" content="0; url=${BASE}#${section}"`), `${page}/ redirect`);
    assert.match(read(join(DIST, 'index.html')), new RegExp(`id="${section}"`), `#${section} exists on home`);
  }
});

test('former research and project pages forward to their inline entries', () => {
  const home = read(join(DIST, 'index.html'));
  for (const [dir, prefix] of [
    ['research', 'research'],
    ['projects', 'project'],
  ]) {
    const ids = readdirSync(join('src', 'content', dir))
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.slice(0, -3));
    for (const id of ids) {
      const html = read(join(DIST, dir, id, 'index.html'));
      assert.match(html, new RegExp(`content="0; url=${BASE}#${prefix}-${id}"`), `${dir}/${id}/ redirect`);
      assert.match(html, /<meta name="robots" content="noindex"/, `${dir}/${id}/ is noindex`);
      assert.match(home, new RegExp(`id="${prefix}-${id}"`), `#${prefix}-${id} exists on home`);
    }
  }
});

test('the home page has every section anchor used by the navigation', () => {
  const home = read(join(DIST, 'index.html'));
  for (const id of ['home', 'about', 'skills', 'research', 'projects', 'experience', 'education', 'contact']) {
    assert.match(home, new RegExp(`id="${id}"`), `#${id}`);
  }
});

test('a 404 page exists at the artifact root for GitHub Pages', () => {
  assert.ok(existsSync(join(DIST, '404.html')), 'dist/404.html is missing');
});

test('every built page has a title, description and exactly one h1', () => {
  const problems = [];
  for (const file of htmlFiles()) {
    const html = read(file);
    const page = servedPath(file);
    if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${page}: missing <title>`);
    if (!/<meta name="description" content="[^"]+"/.test(html)) problems.push(`${page}: missing meta description`);
    const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
    if (h1s !== 1) problems.push(`${page}: ${h1s} <h1> elements`);
  }
  assert.deepEqual(problems, []);
});

test('only intended files are published (no source PDFs, notes or source maps)', () => {
  // PDFs allowed: the redacted CV and project reports (student IDs removed) in reports/.
  const allowedPdf = (p) => p === 'cv/Syeda-Maliha-Tabassum-CV.pdf' || /^reports\/[\w.-]+\.pdf$/.test(p);
  const unexpected = walk()
    .map(servedPath)
    .filter((p) => /\.(md|map|tex|docx?|py|ts)$/i.test(p) || (p.endsWith('.pdf') && !allowedPdf(p)));
  assert.deepEqual(unexpected, []);
});

test('canonical URLs and sitemap use the deployment URL when it is known', { skip: !process.env.SITE_URL && 'SITE_URL not set for this build' }, () => {
  const origin = process.env.SITE_URL.replace(/\/+$/, '');
  const home = read(join(DIST, 'index.html'));
  assert.match(home, new RegExp(`<link rel="canonical" href="${origin}${BASE}"`));
  assert.match(home, new RegExp(`<meta property="og:image" content="${origin}${BASE}og/default.png"`));
  assert.ok(existsSync(join(DIST, 'sitemap-index.xml')), 'sitemap-index.xml missing');
  const sitemap = walk().filter((f) => /sitemap-\d+\.xml$/.test(f)).map(read).join('\n');
  assert.match(sitemap, new RegExp(`<loc>${origin}${BASE}</loc>`));
  assert.doesNotMatch(sitemap, /404|\/research\/|\/projects\/|\/about\//, 'redirect pages are not in the sitemap');
});
