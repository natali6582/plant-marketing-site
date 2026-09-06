# pension-aum-v1 — additional fixtures (fixed-input coverage)

Five workbooks built with the installed skill's `examples/build_pension_example.py`
(skill .skill SHA-256 BA941D7D…), each recalculated by real LibreOffice through
skill-xlsx `recalc.py`, then verified with `scripts/verify_model.py --type pension`.

Per scenario: `<id>/<id>.xlsx` (recalculated, cached values present),
`<id>/verify_report.json` (RESULT PASS, 18 checks, 0 warn), `<id>/verify_run1.txt`.
Each verify ran twice; stdout and JSON identical. `manifest.json` carries inputs,
expected closing balance (Output!B1 = final Calc.close), and full SHA-256 of both files.

Contract is identical to model-fixtures.json (annual, end-of-period deposit,
return and AUM fee on opening balance, no deposit fee/withdrawals/tax).

What these add: p0, deposit, salaryGrowth and years are varied — the four inputs
the A3 grid fixtures hold fixed. `n-equals-g` hits the closed-form limit branch
(net rate == salary growth), which the Excel grid handles via IFERROR fallback.

Not covered, still: negative returns. The builder's sensitivity axes are a fixed
list (2%..6%); a negative `ret` would fail A9 "base case missing" by design. Adding
it means extending the axes in the builder and re-running the skill tests.
