import { describe, expect, it } from 'vitest';
import { calculateTool, defaultsFor, valuesFromQuery, prefillUrl } from './knowledge-calculators';

describe('knowledge tool contracts and URL prefills', () => {
  it.each(['fees', 'withdrawals', 'real'] as const)('%s: every input survives URL round-trip and yields identical results', kind => {
    const values = defaultsFor(kind);
    const query = prefillUrl(kind, values).split('?')[1];
    const parsed = valuesFromQuery(kind, query);
    expect(parsed.invalid).toEqual([]); expect(parsed.values).toEqual(values);
    expect(calculateTool(kind, parsed.values)).toEqual(calculateTool(kind, values));
  });
  it('invalid/unknown/HTML query values cannot overwrite valid defaults', () => {
    const r = valuesFromQuery('fees', '?balance=%3Cscript%3E&years=-1&feeA=Infinity&unknown=7');
    expect(r.invalid).toHaveLength(3); expect(r.values).toEqual(defaultsFor('fees'));
  });
  it('zero withdrawal is not described as an infinite lifespan', () => {
    const r = calculateTool('withdrawals', { ...defaultsFor('withdrawals'), withdrawal: 0, years: 10 });
    expect(r.metrics[0].value).toContain('120'); expect(r.metrics[1].value).toBe(0);
  });
  it('negative rates are accepted when within the documented bounds', () => {
    expect(() => calculateTool('real', { ...defaultsFor('real'), return: -10, inflation: -1 })).not.toThrow();
  });
});
