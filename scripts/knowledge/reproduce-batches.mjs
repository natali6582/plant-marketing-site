import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

function main() {
  const index = process.argv.indexOf('--out');
  if (index < 0 || !process.argv[index + 1]) throw new Error('Require a fresh --out directory');
  const out = resolve(process.argv[index + 1]);
  if (existsSync(out)) throw new Error('Output directory already exists');
  mkdirSync(out, { recursive: true });
  const evidence = [];
  for (const batch of [2, 3, 4, 5]) {
    if (!existsSync(`src/data/knowledge-batches/batch-${batch}.ts`)) continue;
    for (const run of [1, 2]) {
      const result = spawnSync(process.execPath, ['--experimental-strip-types', 'scripts/knowledge/export-batch.mjs', '--batch', String(batch), '--out', join(out, `batch-${batch}-run-${run}`)], { encoding: 'utf8', env: { ...process.env, TZ: 'UTC', CI: 'true' } });
      if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'Export failed');
    }
    const first = join(out, `batch-${batch}-run-1`); const second = join(out, `batch-${batch}-run-2`);
    const names = readdirSync(first).sort();
    if (JSON.stringify(names) !== JSON.stringify(readdirSync(second).sort())) throw new Error('File list differs');
    for (const file of names) {
      const a = readFileSync(join(first, file)); const b = readFileSync(join(second, file));
      if (!a.equals(b)) throw new Error(`Non-reproducible batch ${batch} / ${file}`);
      evidence.push({ batch, file, identical: true, sha256: createHash('sha256').update(a).digest('hex') });
    }
    console.log(`PASS batch ${batch}: ${names.length} byte-identical files across two fresh runs`);
  }
  writeFileSync(join(out, 'checksums.json'), JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx' });
}
main();
