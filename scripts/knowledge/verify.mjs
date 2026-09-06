import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

function main() {
  const index = process.argv.indexOf('--out');
  if (index < 0) throw new Error('A fresh --out directory is required');
  const out = resolve(process.argv[index + 1]);
  if (existsSync(out)) throw new Error('Output directory already exists');
  mkdirSync(out, { recursive: true });
  const environment = { ...process.env, CI: 'true', FORCE_COLOR: '0', TZ: 'UTC', KNOWLEDGE_ENABLED: 'true', KNOWLEDGE_PUBLIC: 'false', ASTRO_TELEMETRY_DISABLED: '1' };
  const summary = [];
  const run = (name, args) => {
    const result = spawnSync(process.execPath, args, { encoding: 'utf8', env: environment, maxBuffer: 20 * 1024 * 1024 });
    writeFileSync(join(out, `${name}.log`), (result.stdout ?? '') + (result.stderr ?? ''), { flag: 'wx' });
    summary.push({ name, exitCode: result.status });
    console.log(`${result.status === 0 ? 'PASS' : 'FAIL'} ${name}`);
  };
  run('typecheck', ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.knowledge.json']);
  run('vectors', ['node_modules/vitest/vitest.mjs', 'run']);
  run('build', ['scripts/knowledge/build.mjs']);
  run('pages-and-internal-links', ['scripts/knowledge/check.mjs']);
  run('external-links', ['--experimental-strip-types', 'scripts/knowledge/links.mjs']);
  const batchIndex = process.argv.indexOf('--batch');
  const exportArgs = batchIndex < 0 ? ['scripts/knowledge/evidence.mjs'] : ['scripts/knowledge/export-batch.mjs', '--batch', process.argv[batchIndex + 1]];
  run('export-1', ['--experimental-strip-types', ...exportArgs, '--out', join(out, 'run-1')]);
  run('export-2', ['--experimental-strip-types', ...exportArgs, '--out', join(out, 'run-2')]);
  const checksums = readdirSync(join(out, 'run-1')).sort().map(file => {
    const a = readFileSync(join(out, 'run-1', file)); const b = readFileSync(join(out, 'run-2', file));
    return { file, identical: a.equals(b), sha256: createHash('sha256').update(a).digest('hex') };
  });
  const identical = checksums.every(x => x.identical);
  summary.push({ name: 'reproducibility', exitCode: identical ? 0 : 1 });
  writeFileSync(join(out, 'checksums.json'), JSON.stringify(checksums, null, 2) + '\n', { flag: 'wx' });
  writeFileSync(join(out, 'summary.json'), JSON.stringify(summary, null, 2) + '\n', { flag: 'wx' });
  console.log(`${identical ? 'PASS' : 'FAIL'} byte-identical calculation and draft outputs across two fresh runs`);
  if (summary.some(x => x.exitCode !== 0)) process.exit(1);
}
main();
