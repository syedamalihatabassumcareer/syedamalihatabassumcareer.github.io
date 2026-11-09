// Publication-status integrity on the single page: every research entry is
// rendered under its exact status, unpublished work never shows a DOI or
// citation controls, and under-review work says it is under peer review.
// (The content schema blocks most mistakes; this guards the rendered page.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, assertBuilt } from './helpers.mjs';

assertBuilt();

const SOURCE = 'src/content/research';
const entries = readdirSync(SOURCE)
  .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  .map((f) => {
    const front = readFileSync(join(SOURCE, f), 'utf8').split('---')[1] ?? '';
    return {
      id: f.replace(/\.md$/, ''),
      status: front.match(/^status:\s*([\w-]+)/m)?.[1],
      submittedTo: front.match(/^submittedTo:\s*(.+)$/m)?.[1]?.trim(),
    };
  });

const home = readFileSync(join(DIST, 'index.html'), 'utf8');

/** The rendered row for one entry: from its opening <li> to the next entry or list end. */
function rowFor(id) {
  const start = home.search(new RegExp(`<li[^>]*id="research-${id}"`));
  assert.ok(start >= 0, `#research-${id} missing from the home page`);
  const rest = home.slice(start + 10);
  const next = rest.search(/<li[^>]*id="research-|<\/ol>/);
  return home.slice(start, start + 10 + (next >= 0 ? next : rest.length));
}

for (const { id, status, submittedTo } of entries) {
  test(`#research-${id}: rendered as "${status}"`, () => {
    const row = rowFor(id);
    const tag = row.slice(0, row.indexOf('>') + 1);
    assert.match(tag, new RegExp(`data-status="${status}"`), 'filter status');
    assert.equal(row.match(/status--([\w-]+)/)?.[1], status, 'first status label in the row');

    if (status !== 'published') {
      assert.ok(!/doi\.org\//.test(row), 'unpublished work must not link a DOI');
      assert.ok(!/Copy citation|BibTeX/.test(row), 'unpublished work must not offer citations');
    }
    if (status === 'under-review') {
      assert.ok(/under peer review/.test(row), 'under-review entries say the work is under peer review');
      assert.ok(row.includes(submittedTo), 'under-review entries name the submission venue');
    }
    if (status === 'published') {
      assert.ok(/doi\.org\//.test(row), 'published work links its DOI');
    }
  });
}

test('every research entry appears exactly once on the page', () => {
  for (const { id } of entries) {
    assert.equal(home.match(new RegExp(`id="research-${id}"`, 'g'))?.length, 1, id);
  }
});
