import { describe, expect, it } from 'vitest';
import { bondPrice, bondScenario, maturityNote } from './knowledge-explorers';

describe('annual fixed-coupon bond, face value 100', () => {
  it('prices at par when coupon equals yield', () => {
    for (const years of [1, 5, 30]) expect(bondPrice(4, 4, years)).toBeCloseTo(100, 10);
  });
  it('discounts a zero coupon independently', () => {
    expect(bondPrice(0, 5, 10)).toBeCloseTo(100 / 1.05 ** 10, 10);
  });
  it('supports zero and negative yields', () => {
    expect(bondPrice(5, 0, 3)).toBe(115);
    expect(bondPrice(0, -2, 1)).toBeCloseTo(100 / .98, 10);
  });
  it('reprices each cash flow for one percentage-point shocks', () => {
    const result = bondScenario(4, 4, 2);
    expect(result.lower).toBeCloseTo(4 / 1.03 + 104 / 1.03 ** 2, 10);
    expect(result.higher).toBeCloseTo(4 / 1.05 + 104 / 1.05 ** 2, 10);
    expect(result.lower).toBeGreaterThan(result.base);
    expect(result.higher).toBeLessThan(result.base);
  });
  it.each([[NaN,4,5],[4,Infinity,5],[4,4,2.5],[4,4,0],[4,-100,5],[16,4,5]])('rejects invalid numeric inputs %j', (coupon, yieldRate, years) => {
    expect(() => bondPrice(coupon, yieldRate, years)).toThrow();
  });
});

describe('fictional maturity-only barrier note, face value 100', () => {
  it.each([[0,0],[40,40],[59.99,59.99],[60,100],[80,100],[100,100],[110,110],[120,120],[160,120]])('final index %s repays %s', (level, expected) => {
    expect(maturityNote(level).repayment).toBeCloseTo(expected, 10);
  });
  it('states the loss branch at the cliff instead of joining it continuously', () => {
    expect(maturityNote(59.99).branch).toBe('loss');
    expect(maturityNote(60).branch).toBe('protected');
    expect(maturityNote(150).branch).toBe('capped');
  });
  it.each([NaN, Infinity, -1, 201])('rejects invalid index %s', (level) => {
    expect(() => maturityNote(level)).toThrow();
  });
});
