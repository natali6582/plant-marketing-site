# Knowledge-center calculation contract — batch 1

Scope: `/knowledge/` only. Base: updated `main`, e8ee526c2118354ec4237c623d16aafcd773c392. Professional owner: Natali (נטלי). Every definition, number and text awaits her line-by-line approval. One PR per batch. The user's instruction to finish all stages removes intermediate execution gates; it does not constitute content approval or permission to merge/publish. All new pages remain noindex.

Page sequence: professional question → short explanation → tool/template → worked example → standard demo CTA. Existing knowledge disclaimer; visible owner/update line; original writing/design/code; external tools linked with credit. Calculators: shared engine, visible assumptions, tested vectors, URL-prefill, print/PDF, no email. Templates: fillable A4 HTML, no backend/storage. Hebrew RTL, numbers LTR. Evidence: desktop/mobile, print samples, vector output, link checks and honest approval table.

## Inputs and conventions

The pure TypeScript core accepts an initial balance, integer horizon in months (0–1200), monthly defaults, and optional per-month overrides. Month numbers are 1-based. Opening balance always comes from the previous closing balance; it is not independently editable. Monetary inputs use one common currency. Public tools use shekels. Rates inside the core are decimal fractions (0.01 means 1%); forms use percentages.

Monthly inputs: gross deposit, deposit fee, annual accumulation fee, nominal monthly return, monthly inflation, withdrawal at today's prices, withdrawal timing (`start` default / `end`), withdrawal indexation (`false` default in core). No tax rates, statutory ceilings, insurance costs or product-specific rules are built in.

Annual return and inflation convert by `(1 + annualRate)^(1/12) − 1`. Accumulation fees deliberately use `annualFee / 12`, not that conversion. The fee base is the balance after that month's return and before an end-of-month withdrawal. This is a disclosed simulation convention, not a claim about any provider's actual daily fee method.

## Monthly order (approved in conversation)

1. Add gross deposit less its deposit fee at the start of the month.
2. Make a start-of-month withdrawal, if selected.
3. Apply nominal monthly return to the remaining balance.
4. Deduct the accumulation fee from the resulting balance.
5. Make an end-of-month withdrawal, if selected.
6. Update the cumulative price index, then express closing balance in today's money.

The first withdrawal equals the entered amount under either timing convention. With indexation enabled, month m's withdrawal is multiplied by the cumulative inflation through month m−1. Thus end timing changes investment exposure, not the first nominal withdrawal. Deposits are fixed nominal amounts unless explicitly overridden in a monthly schedule.

Withdrawals cannot overdraw the investment account. Record requested withdrawal, paid withdrawal and unmet withdrawal separately. Do not hide shortfalls by silently treating a partial payment as fully funded. `depletionMonth` is the first month the available savings reach zero while withdrawals are requested (zero initially with no deposit means 0). `firstShortfallMonth` records the first underfunded request. At zero rates and no fees, 100,000 with 1,000 withdrawals supports exactly 100 full withdrawals; the first shortfall is month 101 if simulated. Later deposits can replenish the account; the first depletion marker is retained. The depletion UI also states the number of fully funded consecutive withdrawals.

## Outputs

Every monthly row includes month, opening balance, gross/net deposit, deposit fee, requested/paid/unmet withdrawal, return amount, accumulation fee, closing balance, cumulative price index and real closing balance. Summary includes final nominal/real balance, gross deposits, fees by type, returns, paid/unmet withdrawals, first depletion/shortfall and consecutive fully funded withdrawals. Graphs and worked examples consume these outputs directly.

No rounding inside the loop. Display money to two decimal places with separators and ₪; percentage differences to two decimal places. Floating comparison tolerance is 1e−8 for cash exhaustion and 0.005 for displayed money. Tests also check raw formula agreement, not just rendered strings. Reject NaN, infinity, negative cash inputs, fractional/negative horizon, fees outside 0–100%, monthly return/inflation ≤−100%, and non-finite intermediate results. UI limits are computational bounds, never regulatory limits.

## Three views

- Fees: same balance, deposits, horizon and return in A/B; independent deposit/accumulation fees. Signed difference B−A and `(B−A)/A`; denominator A=0 gives an undefined percentage, never infinity. Total fees are cash charges; the balance difference additionally includes their compounding effect.
- Withdrawals: balance, horizon, monthly withdrawal, return, inflation, indexation (UI default on), annual accumulation fee and timing. Constant return/inflation; no probability of success or longevity prediction. If depletion is not observed, say only that the entered schedule is funded through the selected horizon.
- Real/nominal: first run without fees and with fees using identical cash flows. Contributions = opening balance + gross deposits. Growth = no-fee nominal final − contributions. Fee drag = no-fee nominal final − fee-paying nominal final, including foregone returns. Inflation drag = fee-paying nominal final − fee-paying real final. Contributions + growth − fee drag − inflation drag = real final. This ordered attribution is not a unique causal decomposition. Future deposits stay nominal; their purchasing power is not individually restated as a measure of real investment profit.

## Required evidence

V1: 100,000 / 1,000 monthly / all rates 0 → exactly 100 full withdrawals. V2: 12 × 1,000, 2% deposit fee → 11,760. V3: 100,000 × 1.01^12 → 112,682.50. V4: nominal 100,000 / 1.02 → real 98,039.22. V5: 100,000 × 0.999^12 with annual fee 1.2%. Additional tests: zero horizon, loss, fees greater than return, timing, indexation, partial withdrawal, full deposit fee, invalid rates, row conservation, decomposition identity, deterministic repeat and input immutability.

The CI report lists each vector. Deterministic numeric JSON is generated in fresh directories twice and compared byte for byte; execution timestamps and durations are excluded from that JSON. Numeric defaults/examples are explicitly fictional assumptions, not forecasts. Natali's approval is pending; no signature or approval date may be inferred from naming her as owner.
