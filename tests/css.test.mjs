// Guards against a CSS-minifier quirk that only shows up in production builds.
//
// The minifier (Lightning CSS) silently drops `translate`, `scale` or `rotate`
// when it shares a rule with a fixed `transform` — or folds it into `transform`
// in the wrong order. `npm run dev` doesn't minify, so the page looks right
// locally and breaks once deployed (the ProCV cover lost its centring this way).
// Put those properties in a rule of their own instead, e.g.
// `.floor:where(.cover-scene *) { scale: 0.72; }`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function sources(dir = 'src') {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...sources(full));
    else if (/\.(astro|css)$/.test(name)) out.push(full);
  }
  return out;
}

test('individual transform properties never share a rule with a fixed transform', () => {
  const problems = [];
  for (const file of sources()) {
    const text = readFileSync(file, 'utf8');
    const css = file.endsWith('.css')
      ? text
      : [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
    // Innermost blocks only (declarations), which is what the minifier merges.
    for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const transform = body.match(/(?:^|[;\s])transform\s*:\s*([^;]+)/);
      // A transform that uses var() can't be folded, so the minifier leaves it alone.
      if (!transform || transform[1].includes('var(')) continue;
      const individual = [...body.matchAll(/(?:^|[;\s])(translate|scale|rotate)\s*:/g)].map((m) => m[1]);
      if (individual.length) {
        problems.push(`${file}: "${selector.trim().split('\n').pop().trim()}" sets ${individual.join(', ')} with transform`);
      }
    }
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});
