import { annualToMonthly, compareScenarios, decompose, simulate } from './finance-core.ts';
import type { SimulationInput } from './finance-core.ts';

export type ToolKind = 'fees' | 'withdrawals' | 'real';
export type Values = Record<string, number | string | boolean>;
export interface Field { key: string; label: string; value: number | string | boolean; min?: number; max?: number; step?: number; unit?: string; options?: { value: string; label: string }[]; }
export interface Metric { label: string; value: number | string; unit?: string; }
export interface Curve { label: string; values: number[]; }
export interface ToolResult { metrics: Metric[]; curves: Curve[]; notes: string[]; }

const cash = (key: string, label: string, value: number): Field => ({ key, label, value, min: 0, max: 1000000000, step: 100, unit: '₪' });
const rate = (key: string, label: string, value: number, min = -99): Field => ({ key, label, value, min, max: 100, step: .1, unit: '%' });
const horizon: Field = { key: 'years', label: 'תקופת החישוב', value: 30, min: 0, max: 100, step: 1, unit: 'שנים' };

export function fieldsFor(kind: ToolKind): Field[] {
  const base = [cash('balance', 'יתרה התחלתית', 300000), cash('deposit', 'הפקדה חודשית', 2000), { ...horizon }, rate('return', 'תשואה שנתית נומינלית משוערת', 4)];
  if (kind === 'fees') return [...base,
    rate('depositFeeA', 'תרחיש א׳ — דמי ניהול מהפקדה', 1, 0), rate('feeA', 'תרחיש א׳ — דמי ניהול מצבירה, לשנה', .6, 0),
    rate('depositFeeB', 'תרחיש ב׳ — דמי ניהול מהפקדה', 0, 0), rate('feeB', 'תרחיש ב׳ — דמי ניהול מצבירה, לשנה', .4, 0)];
  if (kind === 'withdrawals') return [cash('balance', 'חיסכון זמין בתחילת התקופה', 600000), cash('withdrawal', 'משיכה חודשית בשקלים של היום', 6000),
    { ...horizon, label: 'אופק הבדיקה', value: 30 }, rate('return', 'תשואה שנתית נומינלית משוערת', 3),
    rate('inflation', 'אינפלציה שנתית משוערת', 2), rate('fee', 'דמי ניהול מצבירה, לשנה', .5, 0),
    { key: 'indexed', label: 'הצמדת המשיכות לאינפלציה', value: true },
    { key: 'timing', label: 'מועד המשיכה', value: 'start', options: [{ value: 'start', label: 'בתחילת החודש' }, { value: 'end', label: 'בסוף החודש' }] }];
  return [cash('balance', 'יתרה התחלתית', 500000), cash('deposit', 'הפקדה חודשית, אם יש', 1000),
    { ...horizon, value: 10 }, rate('return', 'תשואה שנתית נומינלית משוערת', 5),
    rate('inflation', 'אינפלציה שנתית משוערת', 2), rate('fee', 'דמי ניהול מצבירה, לשנה', .7, 0)];
}

export function defaultsFor(kind: ToolKind): Values { return Object.fromEntries(fieldsFor(kind).map(f => [f.key, f.value])); }
export function validateValues(kind: ToolKind, values: Values): Values {
  const result: Values = {};
  for (const f of fieldsFor(kind)) {
    const v = values[f.key];
    if (typeof f.value === 'boolean') {
      if (typeof v !== 'boolean') throw new RangeError(`יש לבחור ערך תקין בשדה ${f.label}.`);
    } else if (f.options) {
      if (!f.options.some(o => o.value === v)) throw new RangeError(`יש לבחור ערך תקין בשדה ${f.label}.`);
    } else if (typeof v !== 'number' || !Number.isFinite(v) || v < (f.min ?? 0) || v > (f.max ?? Infinity)) {
      throw new RangeError(`יש להזין ערך בין ${f.min} ל־${f.max} בשדה ${f.label}.`);
    }
    result[f.key] = v;
  }
  if (!Number.isInteger(Number(result.years) * 12)) throw new RangeError('תקופת החישוב צריכה להיות מספר שלם של חודשים.');
  return result;
}

export function valuesFromQuery(kind: ToolKind, query: string): { values: Values; invalid: string[] } {
  const params = new URLSearchParams(query);
  const values = defaultsFor(kind);
  const invalid: string[] = [];
  for (const f of fieldsFor(kind)) {
    if (!params.has(f.key)) continue;
    const raw = params.get(f.key)!;
    const v = typeof f.value === 'boolean' ? raw === '1' ? true : raw === '0' ? false : raw : f.options ? raw : raw.trim() === '' ? NaN : Number(raw);
    try { validateValues(kind, { ...values, [f.key]: v }); values[f.key] = v; }
    catch { invalid.push(f.label); }
  }
  return { values, invalid };
}

export function prefillUrl(kind: ToolKind, values: Values): string {
  const paths = { fees: '/knowledge/agents/fees/', withdrawals: '/knowledge/planners/withdrawals/', real: '/knowledge/wealth/real-return/' };
  const checked = validateValues(kind, values);
  const query = new URLSearchParams(Object.entries(checked).map(([k, v]) => [k, typeof v === 'boolean' ? v ? '1' : '0' : String(v)]));
  return `${paths[kind]}?${query}`;
}

export function simulationFor(values: Values): SimulationInput {
  return { initialBalance: Number(values.balance), months: Math.round(Number(values.years) * 12),
    deposit: Number(values.deposit ?? 0), monthlyReturn: annualToMonthly(Number(values.return ?? 0) / 100),
    monthlyInflation: annualToMonthly(Number(values.inflation ?? 0) / 100), annualAccumulationFee: Number(values.fee ?? 0) / 100,
    withdrawal: Number(values.withdrawal ?? 0), indexWithdrawals: values.indexed === true,
    withdrawalTiming: values.timing === 'end' ? 'end' : 'start' };
}

export function calculateTool(kind: ToolKind, values: Values): ToolResult {
  const v = validateValues(kind, values);
  const input = simulationFor(v);
  const money = (label: string, value: number): Metric => ({ label, value, unit: '₪' });
  if (kind === 'fees') {
    const r = compareScenarios({ ...input, depositFee: Number(v.depositFeeA) / 100, annualAccumulationFee: Number(v.feeA) / 100 },
      { ...input, depositFee: Number(v.depositFeeB) / 100, annualAccumulationFee: Number(v.feeB) / 100 });
    return { metrics: [money('יתרה בסוף התקופה — תרחיש א׳', r.scenarioA.finalBalance), money('יתרה בסוף התקופה — תרחיש ב׳', r.scenarioB.finalBalance),
      money('סך דמי הניהול — א׳', r.scenarioA.totalFees), money('סך דמי הניהול — ב׳', r.scenarioB.totalFees),
      money('הפרש ביתרה: ב׳ פחות א׳', r.difference), { label: 'ההפרש כאחוז מיתרת א׳', value: r.differencePercent ?? 'לא מוגדר — יתרת א׳ היא אפס', unit: r.differencePercent === null ? '' : '%' }],
      curves: [{ label: 'תרחיש א׳', values: [input.initialBalance, ...r.scenarioA.rows.map(m => m.closingBalance)] }, { label: 'תרחיש ב׳', values: [input.initialBalance, ...r.scenarioB.rows.map(m => m.closingBalance)] }],
      notes: ['סך דמי הניהול הוא סכום החיובים בפועל בסימולציה. ההפרש ביתרה כולל גם את השפעתם על הצבירה בהמשך.', 'דמי ניהול הם שיקול אחד לצד כיסוי, נזילות, תנאי המוצר והתאמה למטרות.'] };
  }
  if (kind === 'withdrawals') {
    const r = simulate(input);
    const horizon = input.months;
    const months = r.depletionMonth;
    const status = months === null ? `לא נצפתה התרוקנות בתוך ${horizon} חודשים` : `החיסכון מגיע לאפס בחודש ${months}`;
    return { metrics: [{ label: 'אורך התקופה לפי ההנחות', value: status },
      { label: 'משיכות חודשיות רצופות שמומנו במלואן', value: r.fundedMonths, unit: 'חודשים' },
      ...(months !== null ? [{ label: 'חודש ההתרוקנות, בשנים', value: months / 12, unit: 'שנים' }] : []),
      money('יתרה בסוף אופק הבדיקה', r.finalBalance), money('סך המשיכות ששולמו', r.totalWithdrawals),
      { label: 'החודש הראשון עם משיכה שלא מומנה במלואה', value: r.firstShortfallMonth ?? 'לא נצפה באופק הבדיקה' }],
      curves: [{ label: 'יתרה נומינלית', values: [input.initialBalance, ...r.rows.map(m => m.closingBalance)] }, { label: 'יתרה בשקלים של היום', values: [input.initialBalance, ...r.rows.map(m => m.realClosingBalance)] }],
      notes: [input.indexWithdrawals ? 'המשיכה הראשונה היא הסכום שהוזן. החל מהחודש השני הסכום עולה או יורד לפי האינפלציה שהוזנה.' : 'המשיכה נשארת קבועה בשקלים נומינליים; כוח הקנייה שלה משתנה עם האינפלציה.',
        'תשואה קבועה אינה מדמה תנודות או סיכון רצף תשואות. משיכה חלקית אינה נספרת כחודש שמומן במלואו.'] };
  }
  const r = decompose(input);
  return { metrics: [money('יתרה נומינלית בסוף התקופה', r.nominalFinal), money('יתרה בשקלים של היום', r.realFinal),
    money('סכום התחלתי והפקדות', r.contributions), money('צמיחה בתרחיש ללא דמי ניהול', r.growth), money('השפעת דמי הניהול על היתרה', r.feeDrag), money('פער כוח הקנייה בגלל אינפלציה', r.inflationDrag)],
    curves: [{ label: 'יתרה נומינלית אחרי דמי ניהול', values: [input.initialBalance, ...r.withFees.rows.map(m => m.closingBalance)] }, { label: 'יתרה בשקלים של היום', values: [input.initialBalance, ...r.withFees.rows.map(m => m.realClosingBalance)] }],
    notes: ['הפירוק נעשה בסדר קבוע: צמיחה ללא דמי ניהול, הפחתת השפעת דמי הניהול, ואז התאמה לאינפלציה. ההשפעה של דמי הניהול כוללת גם תשואה שנגרעה.', 'הפקדות עתידיות הן סכומים נומינליים קבועים. הפירוק אינו חישוב רווח ריאלי אישי או מס. באינפלציה שלילית פער כוח הקנייה יכול להיות שלילי.'] };
}

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}
