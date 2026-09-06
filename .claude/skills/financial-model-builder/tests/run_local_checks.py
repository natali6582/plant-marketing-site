"""Run the local stub suites and two clean builds; save evidence in a new directory.

This does not perform LibreOffice recalculation or certify spreadsheet results.
"""
import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path


def workbook_parts(path):
    with zipfile.ZipFile(path) as archive:
        parts = {name: archive.read(name) for name in sorted(archive.namelist())}
    # Normalize only volatile timestamps; retain all other core metadata.
    core = ET.fromstring(parts["docProps/core.xml"])
    for tag in ("created", "modified"):
        for node in core.findall(f"{{http://purl.org/dc/terms/}}{tag}"):
            node.text = "2000-01-01T00:00:00Z"
    parts["docProps/core.xml"] = ET.tostring(core, encoding="utf-8")
    return parts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True, type=Path, help="must not already exist")
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=False)
    here = Path(__file__).resolve().parent
    env = os.environ.copy()
    env.update(PYTHONUTF8="1", PYTHONDONTWRITEBYTECODE="1", PYTHONHASHSEED="0", RECALC_TEST_CASE="clean", RECALC_FORMULAS="83")
    env.pop("VERIFY_TEST_SPECIAL_CACHE", None)
    suites = ("computed_values_tests.py", "recalc_contract_tests.py", "pension_a9_contract_tests.py",
              "horizon_contract_tests.py", "subtotal_contract_tests.py", "base_axes_contract_tests.py")
    evidence = {"mode": "stub and structural checks only", "real_recalc": "NOT RUN", "suites": [], "builds": []}
    for suite in suites:
        runs = []
        for number in (1, 2):
            result = subprocess.run([sys.executable, "-B", str(here / suite)], env=env,
                                    capture_output=True, text=True, encoding="utf-8", errors="replace")
            log = result.stdout + result.stderr
            (args.out / f"{suite}.run{number}.txt").write_text(log, encoding="utf-8")
            runs.append((result.returncode, result.stdout, result.stderr))
        summary = re.search(r"SUMMARY (\d+)/(\d+) PASS", runs[0][1])
        success = runs[0] == runs[1] and runs[0][0] == 0 and summary is not None and summary[1] == summary[2]
        row = {"suite": suite, "pass": success, "deterministic": runs[0] == runs[1],
               "exit_codes": [run[0] for run in runs], "summary": summary[0] if summary else None}
        evidence["suites"].append(row)
        print(f"{'PASS' if success else 'FAIL'} {suite}: {row['summary']}; identical={row['deterministic']}", flush=True)
    for model in ("pension", "dcf", "budget"):
        outputs = []
        for number in (1, 2):
            folder = args.out / f"build-{number}"
            folder.mkdir(exist_ok=True)
            output = folder / f"{model}.xlsx"
            result = subprocess.run([sys.executable, "-B", str(here.parent / "examples" / f"build_{model}_example.py"),
                                     "--out", str(output)], env=env, capture_output=True, text=True, encoding="utf-8")
            if result.returncode != 0: raise RuntimeError(result.stderr)
            outputs.append(workbook_parts(output))
        identical = outputs[0] == outputs[1]
        evidence["builds"].append({"model": model, "identical_after_timestamp_normalization": identical,
                                  "parts_sha256": {name: hashlib.sha256(data).hexdigest() for name, data in outputs[0].items()}})
        print(f"{'PASS' if identical else 'FAIL'} {model}: two normalized builds identical={identical}", flush=True)
    evidence["pass"] = all(row["pass"] for row in evidence["suites"]) and all(row["identical_after_timestamp_normalization"] for row in evidence["builds"])
    (args.out / "evidence.json").write_text(json.dumps(evidence, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    raise SystemExit(not evidence["pass"])


if __name__ == "__main__":
    main()
