import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { annualToMonthly, simulate } from '../../src/lib/finance-core.ts';
import { defaultsFor, fieldsFor, formatNumber } from '../../src/lib/knowledge-calculators.ts';
import { TOOL_CONTENT, workedExample, KNOWLEDGE_UPDATED } from '../../src/data/knowledge-tools.ts';
import { DIRECTORY } from '../../src/data/knowledge-directory.ts';

function main() {
  const index = process.argv.indexOf('--out');
  if (index < 0 || !process.argv[index + 1]) throw new Error('Provide a fresh --out directory');
  const out = resolve(process.argv[index + 1]);
  if (existsSync(out)) throw new Error('Refusing to reuse an existing evidence directory');
  mkdirSync(out, { recursive: true });
  const save = (name, value) => writeFileSync(join(out, name), value, { encoding: 'utf8', flag: 'wx' });
  const frame = readFileSync('docs/knowledge-tools/frame.md', 'utf8');
  const approval = ['| Item | Document line | SHA-256 of exact text | Owner | Status | Approval date |', '|---|---:|---|---|---|---|'];
  const register = (name, content) => {
    save(name, content);
    content.split('\n').forEach((line, i) => { if (line.trim()) approval.push(`| ${name} | ${i + 1} | ${createHash('sha256').update(line).digest('hex')} | Natali | Pending line-by-line approval | — |`); });
  };
  const vectors = [
    { id: 'V1', expected: '100 funded months; first shortfall 101', result: simulate({ initialBalance: 100000, months: 101, withdrawal: 1000 }) },
    { id: 'V2', expected: 11760, result: simulate({ initialBalance: 0, months: 12, deposit: 1000, depositFee: .02 }) },
    { id: 'V3', expected: 100000 * 1.01 ** 12, result: simulate({ initialBalance: 100000, months: 12, monthlyReturn: .01 }) },
    { id: 'V4', expected: 100000 / 1.02, result: simulate({ initialBalance: 100000, months: 12, monthlyInflation: annualToMonthly(.02) }) },
    { id: 'V5', expected: 100000 * .999 ** 12, result: simulate({ initialBalance: 100000, months: 12, annualAccumulationFee: .012 }) },
  ];
  save('vectors.json', JSON.stringify(vectors, null, 2) + '\n');
  save('examples.json', JSON.stringify(Object.fromEntries(Object.keys(TOOL_CONTENT).map(kind => [kind, workedExample(kind)])), null, 2) + '\n');
  for (const [kind, c] of Object.entries(TOOL_CONTENT)) {
    const example = workedExample(kind);
    const fields = fieldsFor(kind).map(f => `| ${f.key} | ${f.label} | ${String(f.value)} | ${f.unit ?? '—'} | ${f.options ? f.options.map(o => o.value).join(' / ') : typeof f.value === 'boolean' ? 'true / false' : `${f.min}…${f.max}`} |`).join('\n');
    register(`${kind}-spec.md`, `${frame}\n# ${c.title} — one-page specification\n\nRoute: /knowledge/${c.track}/${c.slug}/\nOwner: Natali. Updated: ${KNOWLEDGE_UPDATED}. Status: DRAFT, pending approval.\n\n| Input | Label | Default (fictional) | Unit | Bounds |\n|---|---|---|---|---|\n${fields}\n\nOutputs: ${example.result.metrics.map(m => m.label).join('; ')}. SVG balance paths include month 0.\n\nAssumptions: monthly order and rate conversion in calculation-contract.md; constant return/inflation; deposits at start, fixed nominal; no tax/insurance/legal parameters; no rounding inside loop. URL query keys are the input names above, booleans 1/0, validated bounds, unknown keys ignored and invalid values visibly reset to example defaults. No email/backend/storage. Native browser print/PDF using A4 stylesheet.\n\n${c.limits}\n`);
    const exampleRows = example.result.metrics.map(m => `| ${m.label} | ${typeof m.value === 'number' ? formatNumber(m.value) : m.value}${m.unit ? ` ${m.unit}` : ''} |`).join('\n');
    register(`${kind}-content.md`, `${frame}\n# ${c.title}\n\nבעלים: נטלי · עודכן: ${KNOWLEDGE_UPDATED}\n\nטיוטה — ממתינה לאישור שורה־שורה של נטלי.\n\n## השאלה\n${c.question}\n\n## הסבר\n${c.explanation}\n\n## הדוגמה\n${c.example}\n\n| מדד | תוצאה |\n|---|---|\n${exampleRows}\n\n[פתיחת נתוני הדוגמה](${example.url})\n\n## שימוש בפגישה\n${c.guide.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n## מה להכין\n${c.prepare.map(s => `- ${s}`).join('\n')}\n\n## מה לשאול\n${c.ask.map(s => `- ${s}`).join('\n')}\n\n## גבולות התוצאה\n${c.limits}\n\nכאן עובדים על מספרים לדוגמה; ב־Plan-T עובדים על תיק הלקוח האמיתי.\n\n[תיאום הדגמה](/contact/)\n`);
  }
  register('directory.md', `${frame}\n# כלים מקצועיים לפי קהל\n\nבעלים: נטלי · עודכן: ${KNOWLEDGE_UPDATED}\n\n${DIRECTORY.map(t => `## ${t.title}\nקהל: ${t.audience} · מקור: ${t.source}\n\n[פתיחת השירות](${t.url})\n\nמה עושה: ${t.does}\n\nמתי: ${t.when}\n\nמה להכין: ${t.prepare}\n\nמגבלות: ${t.limits}\n`).join('\n')}`);
  save('content-approval.md', `${frame}\n# Natali's content approval — pending\n\nNaming the owner is not approval. Each non-empty draft line is fingerprinted below. Record approval only after Natali explicitly approves that exact text.\n\n${approval.join('\n')}\n`);
  save('README.md', `${frame}\n# Phase 1 delivery\n\nThree specs, three complete content drafts, directory and exact numeric evidence. Run npm run test:knowledge for the verbose vector report. Run this exporter into two fresh directories and compare their files. No timestamps, random values, cached calculations or prior outputs affect these artifacts.\n`);
  console.log(`Generated batch-1 drafts, vectors, examples and approval table in ${out}`);
}
main();
