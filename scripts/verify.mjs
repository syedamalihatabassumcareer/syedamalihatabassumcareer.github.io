// Builds the site for BOTH GitHub Pages URL shapes and runs the tests on each:
//   1. user site     https://<user>.github.io/            (base "/")
//   2. project site  https://<user>.github.io/<repo>/     (base "/portfolio-test")
// Usage: npm run verify
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';

const astro = 'node_modules/astro/bin/astro.mjs';
const targets = [
  { name: 'root deployment', outDir: 'dist', env: { BASE_PATH: '/' } },
  {
    name: 'repository-subpath deployment',
    outDir: 'dist-subpath',
    env: { BASE_PATH: '/portfolio-test', SITE_URL: 'https://username.github.io' },
  },
];

let failed = false;
for (const t of targets) {
  console.log(`\n▶ Building for ${t.name} (base ${t.env.BASE_PATH})`);
  const env = { ...process.env, ...t.env, ASTRO_TELEMETRY_DISABLED: '1' };
  if (!t.env.SITE_URL) delete env.SITE_URL;
  const build = spawnSync(process.execPath, [astro, 'build', '--outDir', t.outDir], { stdio: 'inherit', env });
  if (build.status !== 0) {
    failed = true;
    continue;
  }
  console.log(`\n▶ Testing ${t.name}`);
  const tests = spawnSync(process.execPath, ['--test', 'tests/*.test.mjs'], {
    stdio: 'inherit',
    env: { ...env, DIST_DIR: t.outDir },
  });
  if (tests.status !== 0) failed = true;
}

// The subpath build is only for testing; keep `dist/` as the real build.
rmSync('dist-subpath', { recursive: true, force: true });
console.log(failed ? '\n✖ Verification failed' : '\n✔ Both deployment shapes built and passed all tests');
process.exit(failed ? 1 : 0);
