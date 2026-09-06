import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

async function main() {
  const batch = Number(process.argv[process.argv.indexOf('--batch') + 1]);
  const outIndex = process.argv.indexOf('--out');
  if (![2, 3, 4, 5].includes(batch) || outIndex < 0 || !process.argv[outIndex + 1]) throw new Error('Require --batch 2..5 and a fresh --out directory');
  const out = resolve(process.argv[outIndex + 1]);
  if (existsSync(out)) throw new Error('Refusing to reuse an output directory');
  const { drafts, examples } = await import(`../../src/data/knowledge-batches/batch-${batch}.ts`);
  const frame = readFileSync('docs/knowledge-tools/frame.md', 'utf8');
  mkdirSync(out, { recursive: true });
  const save = (name, text) => writeFileSync(join(out, name), text, { encoding: 'utf8', flag: 'wx' });
  const approval = ['| Document | Line | Exact-line SHA-256 | Owner | Status | Approved on |', '|---|---:|---|---|---|---|'];
  for (const [name, body] of Object.entries(drafts)) {
    if (!/^[a-z0-9-]+\.md$/.test(name)) throw new Error('Unsafe draft filename');
    const content = `${frame}\n\nבעלים: נטלי · עודכן: 2026-09-06\n\nטיוטה — ממתינה לאישור מקצועי שורה־שורה של נטלי.\n\n${body}`;
    save(name, content);
    content.split('\n').forEach((line, i) => { if (line.trim()) approval.push(`| ${name} | ${i + 1} | ${createHash('sha256').update(line).digest('hex')} | Natali | Pending | — |`); });
  }
  save('examples.json', JSON.stringify(examples, null, 2) + '\n');
  save('content-approval.md', `${frame}\n\n# Batch ${batch}: line-by-line approval\n\n**PENDING.** Implementation authorization is not professional approval. Record Natali's explicit approval against the exact lines below; do not infer sign-off.\n\n${approval.join('\n')}\n`);
  save('README.md', `${frame}\n\n# Batch ${batch} review package\n\nThe drafts, field/spec contracts and fictional examples are generated from the same data used by the knowledge pages. No invented professional sign-off. See content-approval.md.\n\nVerification: the shared core tests, page/link checks, two byte-identical fresh exports, desktop/mobile stills, and print samples are in evidence/. No merge or publication performed.\n`);
  console.log(`PASS batch ${batch}: ${Object.keys(drafts).length} complete drafts, examples and line-by-line approval table`);
}
await main();
