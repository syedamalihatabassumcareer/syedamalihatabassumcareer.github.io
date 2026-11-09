// Privacy test: the original CV contains a phone number and referees' contact
// details. None of it may reach the published site — including inside the
// public CV PDF.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { join } from 'node:path';
import { DIST, assertBuilt, servedPath, walk } from './helpers.mjs';

assertBuilt();

// Things that must never be published. Kept as fragments so this file does
// not itself contain the full private values.
const FORBIDDEN = [
  /\+?880\s?1[3-9]\d{2}\s?\d{6}/, // Bangladeshi mobile numbers (+880 1XXX XXXXXX)
  /\b01[3-9]\d{8}\b/, // local mobile format
  /aniqua@/i,
  /ashiqur\.rahman@/i,
  /grameenphone\.com/i,
  /\bREFERENCES\b/,
];

const TEXT = /\.(html|xml|txt|js|css|json|svg|webmanifest)$/i;

test('no phone numbers or referee contacts in any published text file', () => {
  const problems = [];
  for (const file of walk().filter((f) => TEXT.test(f))) {
    const content = readFileSync(file, 'utf8');
    for (const pattern of FORBIDDEN) {
      if (pattern.test(content)) problems.push(`${servedPath(file)} matches ${pattern}`);
    }
  }
  assert.deepEqual(problems, []);
});

/** Raw PDF bytes plus every FlateDecode stream, decompressed. */
function pdfText(path) {
  const bytes = readFileSync(path);
  const raw = bytes.toString('latin1');
  const parts = [raw];
  const re = /stream\r?\n/g;
  let m;
  while ((m = re.exec(raw))) {
    const start = m.index + m[0].length;
    const end = raw.indexOf('endstream', start);
    if (end < 0) break;
    try {
      parts.push(inflateSync(bytes.subarray(start, end)).toString('latin1'));
    } catch {
      /* not a Flate stream (e.g. fonts with other filters) */
    }
  }
  return parts.join('\n');
}

test('the public CV has no referee e-mail links or private numbers', () => {
  const cv = join(DIST, 'cv', 'Syeda-Maliha-Tabassum-CV.pdf');
  if (!existsSync(cv)) return; // CV download disabled — nothing to check
  const text = pdfText(cv);
  for (const pattern of [/mailto:aniqua/i, /mailto:ashiqur/i, /1308538775/, /1711158849/, /1711506972/]) {
    assert.doesNotMatch(text, pattern);
  }
});

test('published project reports contain no phone numbers or referee contacts', () => {
  const problems = [];
  const reports = walk().filter((f) => /^reports\/[^/]+\.pdf$/.test(servedPath(f)));
  assert.ok(reports.length > 0, 'no published reports found to check');
  for (const file of reports) {
    const text = pdfText(file);
    for (const pattern of FORBIDDEN.slice(0, 5)) {
      if (pattern.test(text)) problems.push(`${servedPath(file)} matches ${pattern}`);
    }
  }
  assert.deepEqual(problems, []);
});

test('the private original CV is not published', () => {
  const published = walk().map(servedPath);
  assert.ok(!published.some((p) => /Maliha_Updated_Resume/i.test(p)), 'original CV file found in build');
  const original = 'Maliha_Updated_Resume___PHD.pdf';
  const cv = join(DIST, 'cv', 'Syeda-Maliha-Tabassum-CV.pdf');
  if (existsSync(original) && existsSync(cv)) {
    assert.notDeepEqual(readFileSync(cv), readFileSync(original), 'public CV is byte-identical to the private original');
  }
});
