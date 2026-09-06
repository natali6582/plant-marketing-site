# Pension AUM-only fixtures (A3 plus additional coverage)

These are developer sources for the knowledge-center calculator, not public downloads or regulatory defaults. The approved source pair is preserved byte-for-byte:

- `pension_example_recalc.xlsx`: SHA-256 `061a3c8e95d20439bb0268247bcf003e25597de6cc13223001358d78eb3cca73`.
- `verify_report.json`: SHA-256 `b1f7be46eac1b29c7a298ed4773ae1d57dc6eb79ec11449184b9189049750f6c`.

The supplied report records 18 PASS checks after real LibreOffice recalculation. Its `/tmp/fresh/pension/pension.xlsx` path identifies the verification environment, not a required repository location. The exporter checks the approved hashes and report and copies cached values; it does not run or simulate LibreOffice.

## Reproduce

From the repo root, with Python and openpyxl available (also used by the model skill):

```text
python -B scripts/export-model-fixtures.py --out src/data/model-fixtures.json
```

Optional `--workbook`, `--report` and `--extra-dir` accept relocated copies with the same hashes. `--extra-dir` must contain the preserved archive, manifest and five workbook/report pairs; missing additional sources are an error, never a fallback to nine fixtures. Output content is independent of machine paths and timestamps. Validation happens before replacing output; the base inputs and additional-source directory may not be overwritten. Changed source hashes require a new real-recalc review and explicit exporter update.

This is a manual developer operation. Python/openpyxl are not dependencies of npm build, deployment, or browser code.

## Contract

The generated `src/data/model-fixtures.json` has schema version 1, model `pension-aum-v1`, currency ILS, `toleranceIls: 1`, provenance and fourteen fixtures. The first nine remain unchanged from A3. Each fixture contains `id`, `inputs`, `expectedClosingBalance`, and source cell addresses. Each of the five additions also includes its own workbook/report paths and SHA-256 hashes, keyed input addresses, and verification provenance.

| Input | Meaning |
|---|---|
| `p0` | Opening balance, ILS |
| `deposit` | First year's contribution, ILS, deposited at year-end |
| `salaryGrowth` | Annual growth of contributions, decimal fraction |
| `ret` | Annual return on the opening balance, decimal fraction |
| `feeAum` | Annual AUM fee on the opening balance, decimal fraction |
| `years` | Integer number of annual periods |

The recurrence is `close = open * (1 + ret - feeAum) + deposit * (1 + salaryGrowth) ** yearIndex`, with `yearIndex` starting at zero. Exported expected balances are never computed from this recurrence: they are copied from Excel caches without rounding.

The base case uses `Output!B1` (447626.821064296), corroborated by the final keyed Calc close and `Output!D7`. Eight other cases use grid corners and edge midpoints. Together they cover returns 0.02/0.04/0.06 and AUM fees 0.002/0.005/0.008.

Within the original nine, `p0=100000`, `deposit=24000`, `salaryGrowth=0.02`, and `years=10` stay fixed. Their original coverage statement is retained in `coverage.originalGrid`.

## Additional five headline fixtures

The original archive and all eighteen supplied members are preserved under `extra/`, without resaving a workbook. The archive SHA-256 is `08221ad309480636518a3a6b6490b7fa6e74f312e8ab4f01a2c61b8f89b4ce91`; the manifest SHA-256 is `5803cb7af0ddf53cdd9827dac261d8096d531d140d30ac386683eeb348aa7544`. `extra/README.md` is the supplier's original note, not the site's verification claim.

| Fixture ID | Change from the base case |
|---|---|
| years-30 | years = 30 |
| deposit-0 | deposit = 0 |
| p0-0 | p0 = 0 |
| salgrowth-0 | salaryGrowth = 0 |
| n-equals-g | salaryGrowth = 0.035 = ret - feeAum |

Each expected balance comes from that workbook's original `Output!B1` cache, linked to its final keyed Calc close. The exporter checks inputs and headline against the pinned manifest, requires 18 distinct PASS checks, and reconciles the base grid. It does not calculate an expected balance from JavaScript or the closed form.

The supplier reports real LibreOffice PASS/0 and two identical native runs. Only run-1 native artifacts are supplied; neither native recalculation nor native repeatability is replayed by the exporter. The separate receipt audit compared 130 cached headline/grid balances and 350 annual amounts with the unchanged JS engine; these extra grid/annual comparisons are audit evidence, not more exported fixtures.

Across fourteen fixtures, selected variations of all six inputs are represented, so global `coverage.fixedInputs` is empty. This does not cover all combinations or the entire supported numeric range. `coverage.negativeReturnsVerified` is explicitly false. Negative returns, zero-year horizons and other boundary cases still rely on independent arithmetic/contract checks rather than Excel fixtures. The equality case exercises Excel's closed-form limit; `pension.mjs` uses a recurrence and has no division by `net - growth`.

The build gate pins the combined JSON, the original nine fixtures' canonical content, the base source pair, the additional archive/manifest and all five additional workbook/report pairs. Scoped `.gitattributes` rules disable line-ending conversion only for hashed model data/evidence so Windows Git checkout preserves their byte-level signatures.

V1 has no `feeDeposit`, deposit-fee deduction, withdrawal or tax calculation. The later calculator and calculation-module contract must not silently accept those as supported features. Example amounts/rates are model assumptions, not legal caps or contribution requirements. Separately verified public figures continue to belong in `figures.yaml`.

The legacy pension workbook in `.claude/skills/financial-model-builder/tests/fixtures/` remains an input to that skill's test suite; it is not the source for this JSON. A3 does not modify the model or skill.

A3 prepares data only. The calculation module, build gate, calculator UI and publication are subsequent steps. No live-site code imports this JSON yet.

The subsequent B step adds the pure calculation module and its Node build gate. See [calculation-contract.md](calculation-contract.md) for exact inputs, output fields, errors and the evidence boundary. The calculator UI is still a separate step.
