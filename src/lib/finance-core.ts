/** Original, pure monthly arithmetic for the knowledge center. See calculation-contract.md. */
export type Timing = 'start' | 'end';
export interface MonthInput {
  deposit?: number;
  depositFee?: number;
  annualAccumulationFee?: number;
  monthlyReturn?: number;
  monthlyInflation?: number;
  withdrawal?: number;
  withdrawalTiming?: Timing;
  indexWithdrawals?: boolean;
}
export interface SimulationInput extends MonthInput {
  initialBalance: number;
  months: number;
  schedule?: Readonly<Record<number, Readonly<MonthInput>>>;
}
export interface MonthRow {
  month: number;
  openingBalance: number;
  grossDeposit: number;
  netDeposit: number;
  depositFee: number;
  requestedWithdrawal: number;
  withdrawal: number;
  unmetWithdrawal: number;
  returnAmount: number;
  accumulationFee: number;
  closingBalance: number;
  priceIndex: number;
  realClosingBalance: number;
}
export interface SimulationResult {
  rows: MonthRow[];
  finalBalance: number;
  realFinalBalance: number;
  totalDeposits: number;
  totalDepositFees: number;
  totalAccumulationFees: number;
  totalFees: number;
  totalReturns: number;
  totalWithdrawals: number;
  totalUnmetWithdrawals: number;
  depletionMonth: number | null;
  firstShortfallMonth: number | null;
  fundedMonths: number;
}

function finite(value: number, name: string, min: number, max = Number.MAX_VALUE): number {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name}: invalid value`);
  return value;
}

export function annualToMonthly(rate: number): number {
  finite(rate, 'annual rate', -1);
  if (rate <= -1) throw new RangeError('annual rate must exceed −100%');
  return Math.expm1(Math.log1p(rate) / 12);
}

function monthly(input: MonthInput): Required<MonthInput> {
  const value = {
    deposit: input.deposit ?? 0,
    depositFee: input.depositFee ?? 0,
    annualAccumulationFee: input.annualAccumulationFee ?? 0,
    monthlyReturn: input.monthlyReturn ?? 0,
    monthlyInflation: input.monthlyInflation ?? 0,
    withdrawal: input.withdrawal ?? 0,
    withdrawalTiming: input.withdrawalTiming ?? 'start',
    indexWithdrawals: input.indexWithdrawals ?? false,
  };
  finite(value.deposit, 'deposit', 0);
  finite(value.withdrawal, 'withdrawal', 0);
  finite(value.depositFee, 'deposit fee', 0, 1);
  finite(value.annualAccumulationFee, 'annual accumulation fee', 0, 1);
  finite(value.monthlyReturn, 'monthly return', -1);
  finite(value.monthlyInflation, 'monthly inflation', -1);
  if (value.monthlyReturn <= -1 || value.monthlyInflation <= -1) throw new RangeError('monthly rates must exceed −100%');
  if (!['start', 'end'].includes(value.withdrawalTiming)) throw new RangeError('invalid withdrawal timing');
  if (typeof value.indexWithdrawals !== 'boolean') throw new TypeError('indexation must be boolean');
  return value;
}

export function simulate(input: Readonly<SimulationInput>): SimulationResult {
  finite(input.initialBalance, 'initial balance', 0);
  finite(input.months, 'months', 0, 1200);
  if (!Number.isInteger(input.months)) throw new RangeError('months must be an integer');
  const defaults = monthly(input);
  for (const key of Object.keys(input.schedule ?? {})) {
    const month = Number(key);
    if (!Number.isInteger(month) || month < 1 || month > input.months) throw new RangeError('schedule month outside horizon');
  }
  const result: SimulationResult = {
    rows: [], finalBalance: input.initialBalance, realFinalBalance: input.initialBalance,
    totalDeposits: 0, totalDepositFees: 0, totalAccumulationFees: 0, totalFees: 0,
    totalReturns: 0, totalWithdrawals: 0, totalUnmetWithdrawals: 0,
    depletionMonth: null, firstShortfallMonth: null, fundedMonths: 0,
  };
  let balance = input.initialBalance;
  let priceIndex = 1;
  let consecutive = true;
  for (let month = 1; month <= input.months; month++) {
    const p = monthly({ ...defaults, ...input.schedule?.[month] });
    const openingBalance = balance;
    const depositFee = p.deposit * p.depositFee;
    const netDeposit = p.deposit - depositFee;
    balance += netDeposit;
    const requestedWithdrawal = p.withdrawal * (p.indexWithdrawals ? priceIndex : 1);
    let withdrawal = 0;
    if (month === 1 && balance === 0 && requestedWithdrawal > 0) result.depletionMonth = 0;
    if (p.withdrawalTiming === 'start') {
      withdrawal = Math.min(balance, requestedWithdrawal);
      balance -= withdrawal;
    }
    const returnAmount = balance * p.monthlyReturn;
    balance += returnAmount;
    const accumulationFee = balance * p.annualAccumulationFee / 12;
    balance -= accumulationFee;
    if (p.withdrawalTiming === 'end') {
      withdrawal = Math.min(balance, requestedWithdrawal);
      balance -= withdrawal;
    }
    if (Math.abs(balance) < 1e-8) balance = 0;
    const unmetWithdrawal = Math.max(0, requestedWithdrawal - withdrawal);
    if (unmetWithdrawal > 1e-8) {
      result.firstShortfallMonth ??= month;
      consecutive = false;
    }
    if (consecutive && requestedWithdrawal > 0) result.fundedMonths++;
    if (balance === 0 && requestedWithdrawal > 0) result.depletionMonth ??= month;
    priceIndex *= 1 + p.monthlyInflation;
    const realClosingBalance = balance / priceIndex;
    for (const amount of [balance, priceIndex, realClosingBalance, requestedWithdrawal]) finite(amount, 'simulation result', 0);
    if (priceIndex === 0) throw new RangeError('price index underflow');
    result.rows.push({ month, openingBalance, grossDeposit: p.deposit, netDeposit, depositFee,
      requestedWithdrawal, withdrawal, unmetWithdrawal, returnAmount, accumulationFee,
      closingBalance: balance, priceIndex, realClosingBalance });
    result.totalDeposits += p.deposit;
    result.totalDepositFees += depositFee;
    result.totalAccumulationFees += accumulationFee;
    result.totalReturns += returnAmount;
    result.totalWithdrawals += withdrawal;
    result.totalUnmetWithdrawals += unmetWithdrawal;
  }
  result.finalBalance = balance;
  result.realFinalBalance = balance / priceIndex;
  result.totalFees = result.totalDepositFees + result.totalAccumulationFees;
  return result;
}

export function compareScenarios(a: SimulationInput, b: SimulationInput) {
  const scenarioA = simulate(a);
  const scenarioB = simulate(b);
  const difference = scenarioB.finalBalance - scenarioA.finalBalance;
  return { scenarioA, scenarioB, difference,
    differencePercent: scenarioA.finalBalance === 0 ? null : 100 * difference / scenarioA.finalBalance };
}

export function decompose(input: SimulationInput) {
  if ((input.withdrawal ?? 0) !== 0 || Object.values(input.schedule ?? {}).some(m => (m.withdrawal ?? 0) !== 0)) {
    throw new RangeError('decomposition is for accumulation, without withdrawals');
  }
  const schedule = Object.fromEntries(Object.entries(input.schedule ?? {}).map(([month, p]) =>
    [month, { ...p, depositFee: 0, annualAccumulationFee: 0 }]));
  const withFees = simulate(input);
  const withoutFees = simulate({ ...input, depositFee: 0, annualAccumulationFee: 0, schedule });
  const contributions = input.initialBalance + withFees.totalDeposits;
  return { withFees, withoutFees, contributions,
    growth: withoutFees.finalBalance - contributions,
    feeDrag: withoutFees.finalBalance - withFees.finalBalance,
    inflationDrag: withFees.finalBalance - withFees.realFinalBalance,
    nominalFinal: withFees.finalBalance, realFinal: withFees.realFinalBalance };
}
