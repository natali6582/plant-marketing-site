import { describe, expect, it } from 'vitest';
import { cases } from '../data/knowledge-batches/batch-3';
import { valuesFromQuery, simulationFor } from './knowledge-calculators';
import { simulate } from './finance-core';
describe('Fictional case links and hand-computed cash coverage', () => {
  it('all 9 scenario URLs preserve the exact inputs used in the displayed calculations', () => {
    for (const c of cases) for (const s of c.scenarios) {
      const parsed=valuesFromQuery(s.kind,s.url.split('?')[1]);
      expect(parsed.invalid).toEqual([]); expect(parsed.values).toEqual(s.values);
    }
  });
  it('120,000 / 40,000 = 3 full months; reducing to 30,000 gives 4; no illiquid asset enters the cash model', () => {
    const wealth=cases.find(c=>c.track==='wealth')!;
    expect(simulate(simulationFor(wealth.scenarios[0].values)).fundedMonths).toBe(3);
    expect(simulate(simulationFor(wealth.scenarios[1].values)).fundedMonths).toBe(4);
    expect(simulate(simulationFor(wealth.scenarios[0].values)).totalDeposits).toBe(0);
  });
});
