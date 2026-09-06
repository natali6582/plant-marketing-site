import { calculateScenario, scenarioFields, scenarioFromQuery, scenarioUrl } from '../../lib/knowledge-scenarios';
import type { ScenarioKind, ScenarioValues } from '../../lib/knowledge-scenarios';
import { cashLedger } from '../../lib/finance-core';
import type { CashFlow } from '../../lib/finance-core';
import { formatNumber } from '../../lib/knowledge-calculators';
import { render } from './calculators';

export function initializeScenarios() {
  document.querySelectorAll<HTMLElement>('[data-scenario]').forEach(root=>{
    const kind=root.dataset.scenario as ScenarioKind;const form=root.querySelector<HTMLFormElement>('form')!;
    const error=root.querySelector<HTMLElement>('[data-error]')!;const parsed=scenarioFromQuery(kind,location.search);
    const input=(key:string)=>form.elements.namedItem(key) as HTMLInputElement;
    const number=(field:HTMLInputElement)=>field.value.trim()===''?NaN:Number(field.value);
    const readFlows=():CashFlow[]=>Array.from(form.querySelectorAll<HTMLElement>('.kw-flow-row')).map(row=>({inflow:number(row.querySelector<HTMLInputElement>('[data-inflow]')!),outflow:number(row.querySelector<HTMLInputElement>('[data-outflow]')!)}));
    const writeFlows=(flows:CashFlow[])=>{
      const container=form.querySelector('[data-ledger-inputs]');if(!container)return;
      container.replaceChildren();flows.forEach((flow,index)=>{
        const row=document.createElement('fieldset');row.className='kw-flow-row';
        const legend=document.createElement('legend');legend.textContent=`חודש ${index+1}`;row.append(legend);
        for(const direction of ['inflow','outflow'] as const) {const label=document.createElement('label');label.className='kw-field';label.textContent=direction==='inflow'?'תקבול · ₪':'תשלום · ₪';const field=document.createElement('input');field.type='number';field.inputMode='decimal';field.min='0';field.max='1000000000';field.step='100';field.value=String(flow[direction]);field.setAttribute(`data-${direction}`,'');label.append(field);row.append(label);}
        container.append(row);
      });
    };
    const writeLedger=(v:ScenarioValues)=>{
      const host=root.querySelector('[data-ledger-results]')!;host.replaceChildren();if(kind!=='liquidity')return;
      const table=document.createElement('table');table.className='kw-table';const caption=document.createElement('caption');caption.textContent='הלוח החודשי — כל הסכומים ב־₪';table.append(caption);
      const head=document.createElement('thead');const heading=document.createElement('tr');for(const label of ['חודש','פתיחה','תקבול','תשלום','סגירה','פער']){const th=document.createElement('th');th.scope='col';th.textContent=label;heading.append(th);}head.append(heading);table.append(head);
      const body=document.createElement('tbody');for(const row of cashLedger(Number(v.fields.balance),v.flows).rows){const tr=document.createElement('tr');for(const value of [row.month,row.openingBalance,row.inflow,row.outflow,row.closingBalance,row.gap]){const td=document.createElement('td');const bdi=document.createElement('bdi');bdi.dir='ltr';bdi.textContent=formatNumber(value,2);td.append(bdi);tr.append(td);}body.append(tr);}table.append(body);host.append(table);
    };
    for(const f of scenarioFields(kind))input(f.key).value=String(parsed.values.fields[f.key]);
    if(kind==='liquidity')writeFlows(parsed.values.flows);
    const update=()=>{
      try {
        const fields=Object.fromEntries(scenarioFields(kind).map(f=>[f.key,number(input(f.key))]));let flows=kind==='liquidity'?readFlows():[];
        if(kind==='liquidity'&&Number.isInteger(fields.months)&&fields.months>=1&&fields.months<=120&&flows.length!==fields.months){flows=Array.from({length:fields.months},(_,i)=>flows[i]??{inflow:0,outflow:0});writeFlows(flows);}
        const values={fields,flows};const result=calculateScenario(kind,values);render(root,result);writeLedger(values);
        const share=root.querySelector<HTMLAnchorElement>('[data-share]')!;share.href=scenarioUrl(kind,values);share.hidden=false;
        error.textContent='';error.hidden=true;return true;
      } catch(reason) {
        error.hidden=false;error.textContent=reason instanceof Error?reason.message:'יש לבדוק את הנתונים.';
        for(const selector of ['[data-results]','[data-chart]','[data-legend]','[data-notes]','[data-ledger-results]'])root.querySelector(selector)!.replaceChildren();
        root.querySelector<HTMLAnchorElement>('[data-share]')!.hidden=true;return false;
      }
    };
    form.addEventListener('input',update);form.addEventListener('submit',event=>{event.preventDefault();update();});
    root.querySelector('[data-print]')!.addEventListener('click',()=>{if(update())window.print();});
    update();if(parsed.invalid){error.hidden=false;error.textContent='הקישור מכיל נתונים לא תקינים. הוחזרו נתוני הדוגמה.';}
  });
}
