import { describe, expect, it } from 'vitest';
import { cashLedger, requiredMonthlyDeposit, simulate } from './finance-core';
import { calculateScenario, scenarioDefaults, scenarioFromQuery, scenarioUrl } from './knowledge-scenarios';
describe('Batch 4 hand-computed scenario vectors',()=>{
  it('P1 identical scenarios (zero pause) have exactly identical results',()=>{
    const v=scenarioDefaults('pause');v.fields.pauseMonths=0;
    const r=calculateScenario('pause',v);expect(r.metrics[2].value).toBe(0);expect(r.curves[0].values).toEqual(r.curves[1].values);
  });
  it('P2 missed 12 deposits at 0% return and no fees: exactly 12 × 2,000 = 24,000',()=>{
    const v=scenarioDefaults('pause');v.fields.return=0;v.fields.fee=0;
    expect(calculateScenario('pause',v).metrics[2].value).toBe(24000);
  });
  it('T1 target 120,000, start 0, return 0, 12 months: 10,000 per month',()=>expect(requiredMonthlyDeposit({initialBalance:0,months:12},120000)).toBe(10000));
  it('T2 positive monthly r: independent annuity-due closed form matches the monthly core',()=>{
    const r=.01,n=12,start=10000,target=120000;
    const expected=(target-start*(1+r)**n)/((1+r)*(((1+r)**n-1)/r));
    const actual=requiredMonthlyDeposit({initialBalance:start,months:n,monthlyReturn:r},target);
    expect(actual).toBeCloseTo(expected,8);
    expect(simulate({initialBalance:start,months:n,monthlyReturn:r,deposit:actual}).finalBalance).toBeCloseTo(target,6);
  });
  it('T3 negative return and fee > return still solve a finite target',()=>{
    const input={initialBalance:10000,months:24,monthlyReturn:-.01,annualAccumulationFee:.012};
    const deposit=requiredMonthlyDeposit(input,50000);
    expect(simulate({...input,deposit}).finalBalance).toBeCloseTo(50000,6);
  });
  it('T4 zero horizon: no deposit if already reached; impossible unmet target is rejected',()=>{
    expect(requiredMonthlyDeposit({initialBalance:120000,months:0},120000)).toBe(0);
    expect(()=>requiredMonthlyDeposit({initialBalance:0,months:0},120000)).toThrow();
  });
  it('T5 cent-rounded deposit reaches or exceeds target; its actual balance is displayed',()=>{
    const result=calculateScenario('target',scenarioDefaults('target'));
    expect(Number(result.metrics[2].value)).toBeGreaterThanOrEqual(1000000);expect(Number(result.metrics[3].value)).toBeGreaterThanOrEqual(1000000);
  });
  it('L1 six-month ledger: 7,000; 4,000; −3,000; 12,000; 12,000; 12,000 — only month 3 has a gap',()=>{
    const v=scenarioDefaults('liquidity');const r=cashLedger(10000,v.flows);
    expect(r.rows.map(x=>x.closingBalance)).toEqual([7000,4000,-3000,12000,12000,12000]);expect(r.gapMonths).toEqual([3]);expect(r.maximumGap).toBe(3000);
  });
  it('L2 unpaid deficits carry forward; they are not silently clamped or financed',()=>{
    const r=cashLedger(0,[{inflow:0,outflow:100},{inflow:20,outflow:0}]);expect(r.rows.map(x=>x.closingBalance)).toEqual([-100,-80]);
    expect(cashLedger(10,[]).finalBalance).toBe(10);expect(()=>cashLedger(0,[{inflow:NaN,outflow:0}])).toThrow();
  });
  for(const kind of ['pause','target','liquidity'] as const)it(`URL ${kind}: exact round trip`,()=>{const v=scenarioDefaults(kind);expect(scenarioFromQuery(kind,scenarioUrl(kind,v).split('?')[1])).toEqual({values:v,invalid:false});});
  it('malformed/oversized cash query and a pause outside the horizon visibly reset',()=>{
    expect(scenarioFromQuery('liquidity','months=999999').invalid).toBe(true);
    expect(scenarioFromQuery('liquidity','flows=[["bad",0]]').invalid).toBe(true);
    expect(scenarioFromQuery('pause','years=1&pauseStart=13&pauseMonths=12').invalid).toBe(true);
  });
});
