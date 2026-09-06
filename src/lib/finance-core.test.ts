import { describe, expect, it } from 'vitest';
import { annualToMonthly, simulate, decompose, compareScenarios } from './finance-core';

describe('finance-core: independent hand/formula vectors', () => {
  it('V1: 100,000 / 1,000 = exactly 100 funded months; first shortfall 101', () => {
    const r = simulate({ initialBalance: 100000, months: 101, withdrawal: 1000 });
    expect(r.depletionMonth).toBe(100);
    expect(r.fundedMonths).toBe(100);
    expect(r.firstShortfallMonth).toBe(101);
    expect(r.rows[99].closingBalance).toBe(0);
    expect(r.totalWithdrawals).toBe(100000);
  });
  it('V2: 12 × 1,000 × 0.98 = 11,760', () => {
    const r = simulate({ initialBalance: 0, months: 12, deposit: 1000, depositFee: .02 });
    expect(r.finalBalance).toBe(11760);
    expect(r.totalDepositFees).toBe(240);
  });
  it('V3: 100,000 × 1.01^12 = 112,682.50 displayed', () => {
    const r = simulate({ initialBalance: 100000, months: 12, monthlyReturn: .01 });
    expect(r.finalBalance).toBeCloseTo(100000 * 1.01 ** 12, 7);
    expect(r.finalBalance.toFixed(2)).toBe('112682.50');
  });
  it('V4: nominal 100,000 / annual inflation 1.02 = real 98,039.22', () => {
    const r = simulate({ initialBalance: 100000, months: 12, monthlyInflation: annualToMonthly(.02) });
    expect(r.finalBalance).toBe(100000);
    expect(r.realFinalBalance).toBeCloseTo(100000 / 1.02, 7);
    expect(r.realFinalBalance.toFixed(2)).toBe('98039.22');
  });
  it('V5: annual fee 1.2% / 12 → 100,000 × 0.999^12', () => {
    const r = simulate({ initialBalance: 100000, months: 12, annualAccumulationFee: .012 });
    expect(r.finalBalance).toBeCloseTo(100000 * .999 ** 12, 7);
    expect(r.totalAccumulationFees + r.finalBalance).toBeCloseTo(100000, 7);
  });
  it('zero horizon preserves initial balance and records no cash flow', () => {
    const r = simulate({ initialBalance: 12345, months: 0, deposit: 200 });
    expect(r.finalBalance).toBe(12345); expect(r.rows).toEqual([]); expect(r.totalDeposits).toBe(0);
  });
  it('negative monthly return: 1,000 × 0.9 = 900', () => {
    expect(simulate({ initialBalance: 1000, months: 1, monthlyReturn: -.1 }).finalBalance).toBe(900);
  });
  it('fee > return: 1,000 × 1.001 × 0.998 = 998.998', () => {
    expect(simulate({ initialBalance: 1000, months: 1, monthlyReturn: .001, annualAccumulationFee: .024 }).finalBalance).toBeCloseTo(998.998, 9);
  });
  it('withdrawal timing: start (1,000−100)×1.1=990; end 1,000×1.1−100=1,000', () => {
    const input = { initialBalance: 1000, months: 1, withdrawal: 100, monthlyReturn: .1 };
    expect(simulate(input).finalBalance).toBeCloseTo(990, 9);
    expect(simulate({ ...input, withdrawalTiming: 'end' }).finalBalance).toBeCloseTo(1000, 9);
  });
  it('approved order: (1,000+200×.98−100)×1.01×.999=1,105.85304', () => {
    expect(simulate({ initialBalance: 1000, months: 1, deposit: 200, depositFee: .02, withdrawal: 100, monthlyReturn: .01, annualAccumulationFee: .012 }).finalBalance).toBeCloseTo(1105.85304, 8);
  });
  it('indexation starts in month 2: 100 then 110, both timing choices', () => {
    for (const withdrawalTiming of ['start', 'end'] as const) {
      const r = simulate({ initialBalance: 1000, months: 2, withdrawal: 100, monthlyInflation: .1, indexWithdrawals: true, withdrawalTiming });
      expect(r.rows.map(row => row.requestedWithdrawal)).toEqual([100, 110.00000000000001]);
      expect(r.finalBalance).toBeCloseTo(790, 9);
    }
  });
  it('partial withdrawal: 250 funds 100+100+50 and records 50 shortfall', () => {
    const r = simulate({ initialBalance: 250, months: 3, withdrawal: 100 });
    expect(r.fundedMonths).toBe(2); expect(r.firstShortfallMonth).toBe(3);
    expect(r.totalUnmetWithdrawals).toBe(50); expect(r.finalBalance).toBe(0);
  });
  it('100% deposit fee leaves zero net deposits', () => {
    const r = simulate({ initialBalance: 0, months: 1, deposit: 100, depositFee: 1 });
    expect(r.finalBalance).toBe(0); expect(r.totalDepositFees).toBe(100);
  });
  it('month overrides allow a paused deposit, no mutable input or hidden state', () => {
    const input = Object.freeze({ initialBalance: 0, months: 3, deposit: 100, schedule: Object.freeze({ 2: Object.freeze({ deposit: 0 }) }) });
    expect(simulate(input).finalBalance).toBe(200);
    expect(JSON.stringify(simulate(input))).toBe(JSON.stringify(simulate(input)));
  });
  it('every monthly row conserves cash: opening+deposit+return−fees−withdrawal=closing', () => {
    const r = simulate({ initialBalance: 150000, months: 36, deposit: 800, withdrawal: 500, depositFee: .02, annualAccumulationFee: .01, monthlyReturn: .003, monthlyInflation: .002, indexWithdrawals: true });
    for (const x of r.rows) expect(x.openingBalance + x.grossDeposit + x.returnAmount - x.depositFee - x.accumulationFee - x.withdrawal).toBeCloseTo(x.closingBalance, 7);
  });
  it('decomposition sums exactly to real final value, fee drag includes lost growth', () => {
    const d = decompose({ initialBalance: 100000, months: 120, deposit: 1000, monthlyReturn: annualToMonthly(.05), monthlyInflation: annualToMonthly(.02), annualAccumulationFee: .008 });
    expect(d.contributions + d.growth - d.feeDrag - d.inflationDrag).toBeCloseTo(d.realFinal, 7);
    expect(d.feeDrag).toBeGreaterThan(d.withFees.totalFees);
  });
  it('comparison uses A as denominator and null when A is zero', () => {
    expect(compareScenarios({ initialBalance: 100, months: 1 }, { initialBalance: 120, months: 1 }).differencePercent).toBe(20);
    expect(compareScenarios({ initialBalance: 0, months: 0 }, { initialBalance: 120, months: 0 }).differencePercent).toBeNull();
  });
  it.each([
    { initialBalance: -1, months: 12 }, { initialBalance: 1, months: -1 },
    { initialBalance: 1, months: 1.5 }, { initialBalance: 1, months: 1201 },
    { initialBalance: NaN, months: 1 }, { initialBalance: Infinity, months: 1 },
    { initialBalance: 1, months: 1, depositFee: 1.1 },
    { initialBalance: 1, months: 1, monthlyReturn: -1 },
    { initialBalance: 1, months: 1, monthlyInflation: -1 },
  ])('rejects invalid input %j', (input) => { expect(() => simulate(input)).toThrow(); });
});
