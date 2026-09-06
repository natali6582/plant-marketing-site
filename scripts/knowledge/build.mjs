import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const environment = { ...process.env, KNOWLEDGE_ENABLED: 'true', KNOWLEDGE_PUBLIC: 'false', ASTRO_TELEMETRY_DISABLED: '1' };
for (const args of [['scripts/check-figures.mjs'], [resolve('node_modules/astro/bin/astro.mjs'), 'build']]) {
  const run = spawnSync(process.execPath, args, { stdio: 'inherit', env: environment });
  if (run.status !== 0) process.exit(run.status ?? 1);
}
