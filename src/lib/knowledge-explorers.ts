/** Educational examples, unrelated to the site's pension/withdrawal engines.
 * All rates are percentage points. No accrued interest, tax or default model. */
export function bondPrice(coupon: number, yieldRate: number, years: number): number {
  if (![coupon, yieldRate, years].every(Number.isFinite) || coupon < 0 || coupon > 15 ||
      yieldRate <= -100 || yieldRate > 100 || !Number.isInteger(years) || years < 1 || years > 30) {
    throw new RangeError('Invalid annual bond inputs');
  }
  let price = 0;
  for (let year = 1; year <= years; year++) {
    price += (coupon + (year === years ? 100 : 0)) / (1 + yieldRate / 100) ** year;
  }
  return price;
}

export function bondScenario(coupon: number, yieldRate: number, years: number) {
  return {
    base: bondPrice(coupon, yieldRate, years),
    lower: bondPrice(coupon, yieldRate - 1, years),
    higher: bondPrice(coupon, yieldRate + 1, years),
  };
}

/** One fictional note: observation only at maturity, initial index/face 100,
 * barrier 60 inclusive, participation 100%, gain capped at 20%, no coupons. */
export function maturityNote(level: number) {
  if (!Number.isFinite(level) || level < 0 || level > 200) throw new RangeError('Invalid final index');
  const repayment = level < 60 ? level : 100 + Math.min(Math.max(level - 100, 0), 20);
  const branch = level < 60 ? 'loss' : level <= 100 ? 'protected' : level < 120 ? 'participation' : 'capped';
  return { repayment, profit: repayment - 100, branch };
}
