import { annualToMonthly, cashLedger, requiredMonthlyDeposit, simulate } from './finance-core.ts';
import type { CashFlow, MonthInput } from './finance-core.ts';
import type { Field, ToolResult, Values } from './knowledge-calculators.ts';
export type ScenarioKind = 'pause' | 'target' | 'liquidity';
export interface ScenarioValues { fields: Values; flows: CashFlow[] }
const money = (key: string, label: string, value: number): Field => ({ key, label, value, min: 0, max: 1e9, step: 100, unit: '₪' });
const percent = (key: string, label: string, value: number, min=-99): Field => ({ key, label, value, min, max: 100, step: .1, unit: '%' });
export function scenarioFields(kind: ScenarioKind): Field[] {
  if (kind==='liquidity') return [money('balance','מזומן זמין בתחילת הלוח',10000), {key:'months',label:'מספר חודשים',value:6,min:1,max:120,step:1}];
  const common = [money('balance','יתרה התחלתית',kind==='pause'?100000:50000),{key:'years',label:'תקופת החישוב בשנים',value:kind==='pause'?10:15,min:0,max:100,step:1},percent('return','תשואה שנתית נומינלית משוערת',4),percent('fee','דמי ניהול מצבירה, לשנה',.5,0)];
  if(kind==='pause') return [...common,money('deposit','הפקדה חודשית',2000),{key:'pauseStart',label:'תחילת ההפסקה — מספר חודש',value:13,min:1,max:1200,step:1},{key:'pauseMonths',label:'משך ההפסקה בחודשים',value:12,min:0,max:1200,step:1}];
  return [...common,money('target','יעד נומינלי בסוף התקופה',1000000),percent('returnB','תשואה שנתית בתרחיש ב׳',2)];
}
export function scenarioDefaults(kind: ScenarioKind): ScenarioValues {
  return {fields:Object.fromEntries(scenarioFields(kind).map(f=>[f.key,f.value])),flows:kind==='liquidity'?[{inflow:5000,outflow:8000},{inflow:5000,outflow:8000},{inflow:5000,outflow:12000},{inflow:20000,outflow:5000},{inflow:5000,outflow:5000},{inflow:5000,outflow:5000}]:[]};
}
export function validateScenario(kind: ScenarioKind, values: ScenarioValues): ScenarioValues {
  for(const f of scenarioFields(kind)) { const v=values.fields[f.key]; if(typeof v!=='number'||!Number.isFinite(v)||v<(f.min??0)||v>(f.max??Infinity)) throw new RangeError(`יש לבדוק את הטווח בשדה ${f.label}.`); }
  if(kind==='liquidity') {
    if(!Number.isInteger(values.fields.months)||values.flows.length!==values.fields.months) throw new RangeError('יש להזין שורה לכל חודש בלוח.');
    if(!values.flows.every(f=>[f.inflow,f.outflow].every(n=>Number.isFinite(n)&&n>=0&&n<=1e9))) throw new RangeError('תקבול ותשלום צריכים להיות בין 0 למיליארד ₪.');
  } else {
    const months=Number(values.fields.years)*12;
    if(!Number.isInteger(months)) throw new RangeError('האופק חייב להיות מספר שלם של חודשים.');
    if(kind==='pause'&&(!Number.isInteger(values.fields.pauseStart)||!Number.isInteger(values.fields.pauseMonths)||(Number(values.fields.pauseMonths)>0&&Number(values.fields.pauseStart)+Number(values.fields.pauseMonths)-1>months))) throw new RangeError('תקופת ההפסקה חייבת להיות בחודשים שלמים ובתוך אופק החישוב.');
  }
  return values;
}
export function scenarioFromQuery(kind: ScenarioKind, query: string) {
  const values=scenarioDefaults(kind); const params=new URLSearchParams(query);
  try {
    for(const f of scenarioFields(kind)) if(params.has(f.key)) {const raw=params.get(f.key)!;values.fields[f.key]=raw.trim()===''?NaN:Number(raw);}
    if(kind==='liquidity'&&params.has('flows')) {
      const raw=params.get('flows')!; if(raw.length>12000) throw new RangeError('הלוח בקישור ארוך מדי.');
      const parsed: unknown=JSON.parse(raw);
      if(!Array.isArray(parsed)||parsed.length>120||!parsed.every(row=>Array.isArray(row)&&row.length===2&&row.every(n=>typeof n==='number'))) throw new RangeError('מבנה הלוח בקישור אינו תקין.');
      values.flows=parsed.map(row=>({inflow:row[0],outflow:row[1]}));
    } else if(kind==='liquidity'&&Number.isInteger(values.fields.months)&&Number(values.fields.months)>=1&&Number(values.fields.months)<=120) {
      values.flows=Array.from({length:Number(values.fields.months)},(_,i)=>values.flows[i]??{inflow:0,outflow:0});
    }
    return {values:validateScenario(kind,values),invalid:false};
  } catch { return {values:scenarioDefaults(kind),invalid:true}; }
}
export function scenarioUrl(kind: ScenarioKind, values: ScenarioValues): string {
  validateScenario(kind,values);
  const query=new URLSearchParams(Object.entries(values.fields).map(([k,v])=>[k,String(v)]));
  if(kind==='liquidity')query.set('flows',JSON.stringify(values.flows.map(f=>[f.inflow,f.outflow])));
  const track={pause:'agents',target:'planners',liquidity:'wealth'}[kind];
  return `/knowledge/${track}/scenario-tool/?${query}`;
}
export function calculateScenario(kind: ScenarioKind, values: ScenarioValues): ToolResult {
  validateScenario(kind,values); const v=values.fields;
  const cash=(label:string,value:number)=>({label,value,unit:'₪'});
  if(kind==='liquidity') {
    const result=cashLedger(Number(v.balance),values.flows);
    return {metrics:[cash('יתרה בסוף הלוח',result.finalBalance),cash('פער המזומן המרבי',result.maximumGap),{label:'חודשים עם פער בסוף החודש',value:result.gapMonths.length?result.gapMonths.join(', '):'אין פער בסוף חודש לפי הנתונים'}],curves:[{label:'יתרת מזומן — כולל פערים',values:[Number(v.balance),...result.rows.map(r=>r.closingBalance)]}],notes:['יתרה שלילית היא פער לא ממומן שנגרר לחודשים הבאים, ללא ריבית או אשראי אוטומטי. החישוב אינו בודק סדר תשלומים בתוך החודש או ודאות תקבולים. כל הסכומים באותו מטבע — ₪.']};
  }
  const input={initialBalance:Number(v.balance),months:Math.round(Number(v.years)*12),monthlyReturn:annualToMonthly(Number(v.return)/100),annualAccumulationFee:Number(v.fee)/100};
  if(kind==='pause') {
    const schedule:Record<number,MonthInput>={};
    for(let month=Number(v.pauseStart);month<Number(v.pauseStart)+Number(v.pauseMonths);month++)schedule[month]={deposit:0};
    const continuous=simulate({...input,deposit:Number(v.deposit)});
    const paused=simulate({...input,deposit:Number(v.deposit),schedule});
    return {metrics:[cash('יתרה עם הפקדות רצופות',continuous.finalBalance),cash('יתרה עם הפסקה וחידוש',paused.finalBalance),cash('הפרש ביתרות',continuous.finalBalance-paused.finalBalance),cash('הפקדות שלא בוצעו',continuous.totalDeposits-paused.totalDeposits)],curves:[{label:'הפקדות רצופות',values:[input.initialBalance,...continuous.rows.map(r=>r.closingBalance)]},{label:'הפסקה וחידוש',values:[input.initialBalance,...paused.rows.map(r=>r.closingBalance)]}],notes:['החידוש מתבצע בחודש שאחרי סוף ההפסקה ובאותו סכום חודשי, ללא השלמת הפקדות שהוחסרו. ההשוואה היא לחיסכון בלבד; השפעות ביטוחיות, רצף כיסוי וזכויות אינן נבדקות.']};
  }
  if(input.months===0&&Number(v.target)>input.initialBalance) throw new RangeError('באופק אפס אין הפקדות עתידיות. יש להאריך את האופק או להקטין את היעד.');
  const alternative={...input,monthlyReturn:annualToMonthly(Number(v.returnB)/100)};
  const a=Math.ceil(requiredMonthlyDeposit(input,Number(v.target))*100)/100;
  const b=Math.ceil(requiredMonthlyDeposit(alternative,Number(v.target))*100)/100;
  const first=simulate({...input,deposit:a});const second=simulate({...alternative,deposit:b});
  return {metrics:[cash('הפקדה חודשית נדרשת — תרחיש א׳',a),cash('הפקדה חודשית נדרשת — תרחיש ב׳',b),cash('יתרה סופית — תרחיש א׳',first.finalBalance),cash('יתרה סופית — תרחיש ב׳',second.finalBalance)],curves:[{label:'תרחיש א׳',values:[input.initialBalance,...first.rows.map(r=>r.closingBalance)]},{label:'תרחיש ב׳',values:[input.initialBalance,...second.rows.map(r=>r.closingBalance)]}],notes:['היעד נומינלי, ללא התאמה לאינפלציה. ההפקדה קבועה ונכנסת בתחילת החודש; סכומה מעוגל כלפי מעלה לאגורה ורק אז מחושבת היתרה המוצגת. אפס פירושו שהיתרה ההתחלתית לפי ההנחות מספיקה ליעד בסוף האופק. אין הבטחה לתשואה או להשגת היעד בפועל.']};
}
