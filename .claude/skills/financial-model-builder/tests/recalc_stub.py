import json
import os
import sys


case = os.environ.get("RECALC_TEST_CASE", "clean")

if case == "nonzero":
    print(json.dumps({"total_formulas": 83, "total_errors": 0}))
    print("forced recalc failure", file=sys.stderr)
    raise SystemExit(7)

if case == "invalid-json":
    print("not-json")
    raise SystemExit(0)

payloads = {
    "array": [83, 0],
    "missing-field": {"total_formulas": 83},
    "bool-count": {"total_formulas": True, "total_errors": 0},
    "float-count": {"total_formulas": 83.0, "total_errors": 0},
    "zero-formulas": {"total_formulas": 0, "total_errors": 0},
    "negative-errors": {"total_formulas": 83, "total_errors": -1},
    "model-errors": {"total_formulas": 83, "total_errors": 2},
    "recalc-error": {"error": "forced recalc error"},
    "clean": {
        "total_formulas": int(os.environ.get("RECALC_FORMULAS", "83")),
        "total_errors": 0,
    },
}

print(json.dumps(payloads[case]))
