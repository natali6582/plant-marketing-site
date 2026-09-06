# Pension AUM-only calculation contract (B)

## Scope

`src/lib/pension.mjs` is a pure ES module shared by Node and the later knowledge-center calculator. It has no framework, DOM, network, spreadsheet or Node-specific dependency. It is not yet imported by any page; adding it and its build gate does not publish a calculator.

This is an annual illustration matching the supplied example workbook, not a representation of a provider's monthly fee rules, insurance costs or regulatory limits. V1 does not calculate deposit fees, withdrawals or taxes. The illustrative inputs are not figures claimed to be government-verified.

## Input

`closingBalance(input)` accepts exactly six own numeric data properties on a plain object (a null prototype is also accepted). No strings, coercion, getters, missing fields, extra fields, NaN or infinities are accepted. In particular, `feeDeposit: 0` is rejected, not silently ignored.

| Key | Unit and domain |
|---|---|
| `p0` | Initial balance in ILS, non-negative |
| `deposit` | First year's year-end contribution in ILS, non-negative |
| `salaryGrowth` | Annual growth of contributions, fraction, at least -1 |
| `ret` | Annual return on the opening balance, fraction, at least -1 |
| `feeAum` | Annual fee on the opening balance, fraction, non-negative |
| `years` | Integer from 0 through 100 inclusive |

The net annual factor `1 + (ret - feeAum)` must be non-negative. The 100-year bound limits browser computation; it is not a pension eligibility rule. No legal AUM fee cap is encoded here. Percentages must be divided by 100 at the future UI boundary, not inside this function.

## Output and arithmetic

The return value is a fresh array containing exactly `years` plain objects, in ascending order. Each object has these fields, in this order:

```text
{ year, open, deposit, gain, fee, close }
```

- `year` starts at 1.
- `open` is `p0` for the first row and the previous row's `close` thereafter.
- `deposit` is the first contribution multiplied by `(1 + salaryGrowth)` for each subsequent year; it arrives at year-end.
- `gain = open * ret` (may be negative).
- `fee = open * feeAum`.
- `close = open * (1 + (ret - feeAum)) + deposit`.

The model never rounds intermediate amounts. Use display formatting only at the UI boundary. Subtracting the fee from the return before adding one also avoids rejecting the valid decimal boundary `ret = -0.9, feeAum = 0.1` because of floating-point cancellation.

For `years: 0`, the result is `[]` and the unchanged closing balance is `input.p0`. A caller can obtain the final balance as `rows.at(-1)?.close ?? input.p0`.

Example: `p0=1000`, `deposit=200`, `salaryGrowth=0.5`, `ret=0.1`, `feeAum=0.02`, `years=1` produces exactly:

```json
[{ "year": 1, "open": 1000, "deposit": 200, "gain": 100, "fee": 20, "close": 1280 }]
```

Inputs are never modified. Results are not cached or shared between calls; changing a previous result cannot affect later calls.

## Errors

- `TypeError`: input shape, unsupported keys or non-finite/non-numeric inputs.
- `RangeError`: numeric domain violation or overflow in any returned amount.

All inputs are validated even for zero years. Errors are thrown before returning any partial array. The later calculator must catch them and show an input error, not silently substitute zero or retain a result labelled as current.

## Build gate and evidence boundary

```text
node scripts/check-model.mjs
node scripts/check-model.mjs --json
npm run build
```

The build runs the existing figure checks, then the model checks, and only then Astro. The model check uses Node's built-in assertions, not a new test framework or `npm test`. Python and LibreOffice are not required for this gate.

Exit 0 means all checks passed; exit 1 means a numeric/contract/provenance check failed (including a missing calculation module); exit 2 means evidence could not be read/parsed or the command was misused. A nonzero exit stops the build before Astro.

The gate pins the combined fixture JSON, the unchanged original nine scenarios, the base workbook/report, and the additional source archive, manifest and five workbook/report pairs with SHA-256. Updating these approved sources requires an explicit new export/review and corresponding pins; tests must not regenerate their own expected balances from the module under test. Scoped `.gitattributes` rules preserve exact model evidence bytes across Git checkouts.

Fourteen comparisons use original Excel cached balances, with absolute tolerance 1 ILS. The original nine vary return and AUM fee; five additions cover years=30, deposit=0, p0=0, salaryGrowth=0 and salaryGrowth=ret-feeAum. This is representative coverage, not all combinations or numeric ranges. Negative returns have no Excel fixture. Separate arithmetic examples, roll-forward checks, an independent closed form, boundary cases and input rejection checks cover the broader implementation contract. They are not additional Excel-recalculated scenarios or regulatory verification. The exact-rate closed form uses the removable-singularity limit, and the iterative production algorithm does not divide by the difference between rates.

Both plain-text and JSON reports omit timestamps and machine paths. Two clean-process runs must produce byte-identical output. Each run constructs its state anew and reads the committed evidence; no previous report is loaded.

UI, sensitivity table, download form, browser/content/typography checks and publication remain separate steps. No claim of browser verification follows from this numeric gate.
