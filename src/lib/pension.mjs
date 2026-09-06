/**
 * Annual, AUM-fee-only illustration; not a regulatory or product valuation model.
 * Inputs: p0/deposit in ILS; salaryGrowth/ret/feeAum as fractions; years 0..100.
 * Deposits arrive at year-end. Return and fee both use the opening balance.
 * Returns one { year, open, deposit, gain, fee, close } row per year, unrounded.
 * Zero years returns []; the unchanged final balance is then input.p0.
 * TypeError: malformed, missing or unsupported inputs. RangeError: invalid
 * numeric domain or non-finite computed amounts. No DOM, I/O or shared state.
 */
export function closingBalance(input) {
  if (input === null || typeof input !== 'object'
    || ![Object.prototype, null].includes(Object.getPrototypeOf(input))) {
    throw new TypeError('Expected a plain input object');
  }
  const keys = ['p0', 'deposit', 'salaryGrowth', 'ret', 'feeAum', 'years'];
  const actualKeys = Reflect.ownKeys(input);
  if (actualKeys.length !== keys.length || actualKeys.some((key) => !keys.includes(key))) {
    throw new TypeError(`Expected only: ${keys.join(', ')}`);
  }
  const values = Object.getOwnPropertyDescriptors(input);
  for (const key of keys) {
    if (!Number.isFinite(values[key]?.value)) {
      throw new TypeError(`${key} must be an own, finite numeric value`);
    }
  }
  const [p0, deposit, salaryGrowth, ret, feeAum, years] = keys.map((key) => values[key].value);
  if (p0 < 0 || deposit < 0 || feeAum < 0) {
    throw new RangeError('p0, deposit and feeAum must be non-negative');
  }
  const netFactor = 1 + (ret - feeAum);
  if (salaryGrowth < -1 || ret < -1 || netFactor < 0) {
    throw new RangeError('Annual growth factors must be non-negative');
  }
  // Bounded work for an interactive calculator, not a legal pension limit.
  if (!Number.isInteger(years) || years < 0 || years > 100) {
    throw new RangeError('years must be an integer from 0 through 100');
  }

  const rows = [];
  let open = p0;
  let contribution = deposit;
  for (let year = 1; year <= years; year += 1) {
    const gain = open * ret;
    const fee = open * feeAum;
    const close = open * netFactor + contribution;
    if (![contribution, gain, fee, close].every(Number.isFinite)) {
      throw new RangeError(`Calculation exceeds finite numeric range in year ${year}`);
    }
    rows.push({ year, open, deposit: contribution, gain, fee, close });
    open = close;
    // Do not compute an unused deposit after the final period. Iteration also
    // preserves zero deposits when a power of a large growth rate would overflow.
    if (year < years) contribution *= 1 + salaryGrowth;
  }
  return rows;
}
