import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


HERE = Path(__file__).resolve().parent
VERIFIER = HERE.parent / "scripts" / "verify_model.py"
BUDGET = HERE / "fixtures" / "budget_example.xlsx"
DCF = HERE / "fixtures" / "dcf_example.xlsx"
STUB = HERE / "recalc_stub.py"

CASES = [
    {"name": "missing-arg", "expected_exit": 2, "expected_result": "ERROR", "error": "--recalc PATH is required", "omit_recalc": True},
    {"name": "missing-path", "expected_exit": 2, "expected_result": "ERROR", "error": "not found or not a file", "recalc": "missing"},
    {"name": "directory-path", "expected_exit": 2, "expected_result": "ERROR", "error": "not found or not a file", "recalc": "directory"},
    {"name": "missing-libreoffice", "expected_exit": 2, "expected_result": "ERROR", "error": "LibreOffice", "without_lo": True},
    {"name": "nonzero", "expected_exit": 2, "expected_result": "ERROR", "error": "exited with code 7", "stub_case": "nonzero"},
    {"name": "invalid-json", "expected_exit": 2, "expected_result": "ERROR", "error": "invalid JSON", "stub_case": "invalid-json"},
    {"name": "array", "expected_exit": 2, "expected_result": "ERROR", "error": "must be an object", "stub_case": "array"},
    {"name": "missing-field", "expected_exit": 2, "expected_result": "ERROR", "error": "missing field: total_errors", "stub_case": "missing-field"},
    {"name": "bool-count", "expected_exit": 2, "expected_result": "ERROR", "error": "must be an integer", "stub_case": "bool-count"},
    {"name": "float-count", "expected_exit": 2, "expected_result": "ERROR", "error": "must be an integer", "stub_case": "float-count"},
    {"name": "zero-formulas", "expected_exit": 2, "expected_result": "ERROR", "error": "zero formulas", "stub_case": "zero-formulas"},
    {"name": "negative-errors", "expected_exit": 2, "expected_result": "ERROR", "error": "must be non-negative", "stub_case": "negative-errors"},
    {"name": "recalc-error", "expected_exit": 2, "expected_result": "ERROR", "error": "forced recalc error", "stub_case": "recalc-error"},
    {"name": "model-errors", "expected_exit": 1, "expected_result": "FAIL", "a1": "FAIL", "stub_case": "model-errors"},
    {"name": "clean-budget", "expected_exit": 0, "expected_result": "PASS", "a1": "PASS", "stub_case": "clean"},
    {"name": "clean-dcf", "expected_exit": 0, "expected_result": "PASS", "a1": "PASS", "stub_case": "clean", "model_type": "dcf", "source": DCF, "formulas": "90"},
]


def run_case(case, root):
    case_dir = root / case["name"]
    case_dir.mkdir()
    source = case.get("source", BUDGET)
    model = case_dir / "model.xlsx"
    shutil.copy2(source, model)
    report_path = case_dir / "verify_report.json"

    env = os.environ.copy()
    env["PYTHONUTF8"] = "1"
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    env["PYTHONHASHSEED"] = "0"
    env["RECALC_TEST_CASE"] = case.get("stub_case", "clean")
    env["RECALC_FORMULAS"] = case.get("formulas", "83")
    env["PATH"] = "" if case.get("without_lo") else str(HERE) + os.pathsep + env.get("PATH", "")

    cmd = [sys.executable, "-B", str(VERIFIER), str(model), "--type", case.get("model_type", "budget")]
    if not case.get("omit_recalc"):
        recalc = STUB
        if case.get("recalc") == "missing": recalc = case_dir / "missing.py"
        if case.get("recalc") == "directory": recalc = case_dir
        cmd += ["--recalc", str(recalc)]

    observed = []
    for _ in range(2):
        completed = subprocess.run(cmd, cwd=case_dir, env=env, capture_output=True, text=True, encoding="utf-8", errors="replace")
        if not report_path.is_file():
            raise AssertionError("verify_report.json was not written")
        report_text = report_path.read_text(encoding="utf-8")
        observed.append((completed.returncode, completed.stdout, completed.stderr, report_text))
    if observed[0] != observed[1]:
        raise AssertionError("two runs produced different exit/stdout/stderr/report output")

    exit_code, stdout, _, report_text = observed[0]
    report = json.loads(report_text)
    if exit_code != case["expected_exit"]:
        raise AssertionError(f"exit {exit_code}, expected {case['expected_exit']}")
    if report.get("result") != case["expected_result"]:
        raise AssertionError(f"result {report.get('result')}, expected {case['expected_result']}")
    if "error" in case and case["error"] not in (report.get("error") or ""):
        raise AssertionError(f"error does not contain {case.get('error')!r}: {report.get('error')!r}")
    if f"RESULT: {case['expected_result']}" not in stdout:
        raise AssertionError("stdout result disagrees with JSON report")
    if "a1" in case:
        a1 = [row for row in report["checks"] if row["id"] == "A1"]
        if len(a1) != 1 or a1[0]["status"] != case["a1"]:
            raise AssertionError(f"A1 status is not {case['a1']}")


def main():
    required = [VERIFIER, BUDGET, DCF, STUB, HERE / "soffice.cmd"]
    missing = [str(path) for path in required if not path.is_file()]
    if missing:
        print("Missing fixtures: " + ", ".join(missing), file=sys.stderr)
        raise SystemExit(2)

    passed = 0
    with tempfile.TemporaryDirectory(prefix="verify-recalc-contract-") as temp:
        root = Path(temp)
        for case in CASES:
            try:
                run_case(case, root)
            except Exception as exc:
                print(f"FAIL {case['name']}: {exc}")
            else:
                passed += 1
                print(f"PASS {case['name']} exit={case['expected_exit']} result={case['expected_result']} deterministic=yes")
    print(f"SUMMARY {passed}/{len(CASES)} PASS")
    raise SystemExit(0 if passed == len(CASES) else 1)


if __name__ == "__main__":
    main()
