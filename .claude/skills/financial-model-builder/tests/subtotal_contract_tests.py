"""A7/A3 integration cases using cached fixtures and the explicit recalc stub."""
import json
import os
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

from pension_a9_contract_tests import MAIN_NS, sheet_part_name

HERE = Path(__file__).resolve().parent


def patch_cell(source, destination, sheet, coordinate, value):
    with zipfile.ZipFile(source) as archive:
        part = sheet_part_name(archive, sheet)
        entries = [(entry, archive.read(entry.filename)) for entry in archive.infolist()]
    with zipfile.ZipFile(destination, "w") as archive:
        for entry, data in entries:
            if entry.filename == part:
                root = ET.fromstring(data)
                cell = root.find(f".//{{{MAIN_NS}}}c[@r='{coordinate}']")
                assert cell is not None, coordinate
                original_cache = cell.find(f"{{{MAIN_NS}}}v").text
                for child in list(cell):
                    if child.tag in (f"{{{MAIN_NS}}}f", f"{{{MAIN_NS}}}v", f"{{{MAIN_NS}}}is"):
                        cell.remove(child)
                cell.attrib.pop("t", None)
                if isinstance(value, str) and value.startswith("="):
                    ET.SubElement(cell, f"{{{MAIN_NS}}}f").text = value[1:]
                # Preserve the known result: these formula mutations either keep
                # the result or deliberately simulate a stale cache, as A7 is structural.
                if value is not None:
                    ET.SubElement(cell, f"{{{MAIN_NS}}}v").text = original_cache
                data = ET.tostring(root, encoding="utf-8", xml_declaration=True)
            archive.writestr(entry, data)


def invoke(model, mtype="budget"):
    env = os.environ.copy()
    env.update(PYTHONUTF8="1", PYTHONDONTWRITEBYTECODE="1", PYTHONHASHSEED="0", RECALC_TEST_CASE="clean")
    env.pop("VERIFY_TEST_SPECIAL_CACHE", None)
    env["PATH"] = str(HERE) + os.pathsep + env.get("PATH", "")
    observations = []
    report_path = model.parent / "verify_report.json"
    for _ in range(2):
        report_path.unlink(missing_ok=True)
        result = subprocess.run(
            [sys.executable, "-B", str(HERE.parent / "scripts" / "verify_model.py"), str(model),
             "--type", mtype, "--recalc", str(HERE / "recalc_stub.py")],
            env=env, capture_output=True, text=True, encoding="utf-8", errors="replace",
        )
        observations.append((result.returncode, result.stdout, result.stderr, report_path.read_text(encoding="utf-8")))
    assert observations[0] == observations[1], "exit/stdout/stderr/JSON differ on rerun"
    assert "Traceback" not in result.stdout + result.stderr
    return result.returncode, json.loads(observations[0][3])


def main():
    cases = [
        ("calc-sum", "Calc", "C5", "=SUM(C3:C4)", "PASS", "PASS"),
        ("calc-subtotal9", "Calc", "C5", "=SUBTOTAL(9,C3:C4)", "PASS", "PASS"),
        ("calc-subtotal109", "Calc", "C5", "=SUBTOTAL(109,$C$3:$C$4)", "PASS", "PASS"),
        ("calc-addition", "Calc", "C5", "=C3+C4", "FAIL", "PASS"),
        ("calc-average", "Calc", "C5", "=AVERAGE(C3:C4)", "FAIL", "PASS"),
        ("calc-self-range", "Calc", "C5", "=SUM(C3:C5)", "FAIL", "PASS"),
        ("calc-wrong-column", "Calc", "C5", "=SUM(D3:D4)", "FAIL", "PASS"),
        ("calc-subtotal-count", "Calc", "C5", "=SUBTOTAL(1,C3:C4)", "FAIL", "PASS"),
        ("calc-adjusted-sum", "Calc", "C5", "=SUM(C3:C4)+1", "FAIL", "PASS"),
        ("output-sum", "Output", "B1", "=SUM('Calc'!$C$2:$N$2)", "PASS", "PASS"),
        ("output-subtotal109", "Output", "B1", "=SUBTOTAL(109,Calc!C2:N2)", "PASS", "PASS"),
        ("output-hardcoded", "Output", "B1", 123, "FAIL", "PASS"),
        ("output-blank", "Output", "B1", None, "FAIL", "PASS"),
        ("output-average", "Output", "B1", "=AVERAGE(Calc!C2:N2)", "FAIL", "PASS"),
        ("output-truncated-periods", "Output", "B1", "=SUM(Calc!D2:N2)", "FAIL", "PASS"),
        ("output-structural9-only", "Output", "B1", "=SUBTOTAL(9,Calc!C2:N2)+9", "FAIL", "FAIL"),
    ]
    passed = 0
    with tempfile.TemporaryDirectory(prefix="subtotal-contract-") as directory:
        for name, sheet, coordinate, value, a7, a3 in cases:
            model = Path(directory) / name / "model.xlsx"
            model.parent.mkdir()
            patch_cell(HERE / "fixtures" / "budget_example.xlsx", model, sheet, coordinate, value)
            try:
                code, report = invoke(model)
                checks = {check["id"]: check for check in report["checks"]}
                assert checks["A7"]["status"] == a7, checks["A7"]
                assert checks["A3"]["status"] == a3, checks["A3"]
                expected_code = 0 if a7 == a3 == "PASS" else 1
                assert code == expected_code, (code, report)
                if a7 == "FAIL":
                    assert f"{sheet}!{coordinate}" in checks["A7"]["detail"], checks["A7"]
                print(f"PASS {name} A7={a7} A3={a3} exit={code} deterministic=yes")
                passed += 1
            except AssertionError as error:
                print(f"FAIL {name}: {error}")
    print(f"SUMMARY {passed}/{len(cases)} PASS (stub)")
    raise SystemExit(passed != len(cases))


if __name__ == "__main__":
    main()
