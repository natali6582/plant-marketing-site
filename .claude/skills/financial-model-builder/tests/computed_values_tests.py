import json
import os
import posixpath
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path


HERE = Path(__file__).resolve().parent
VERIFIER = HERE.parent / "scripts" / "verify_model.py"
BUDGET = HERE / "fixtures" / "budget_example.xlsx"
DCF = HERE / "fixtures" / "dcf_example.xlsx"
RECALC = HERE / "recalc_stub.py"
MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
DOC_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"


def calc_part_name(archive):
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    sheet = next(
        node for node in workbook.findall(f".//{{{MAIN_NS}}}sheet")
        if node.get("name") == "Calc"
    )
    relationship_id = sheet.get(f"{{{DOC_REL_NS}}}id")
    relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    relationship = next(
        node for node in relationships.findall(f"{{{PKG_REL_NS}}}Relationship")
        if node.get("Id") == relationship_id
    )
    target = relationship.get("Target")
    if target.startswith("/"):
        return target.lstrip("/")
    if target.startswith("xl/"):
        return target
    return posixpath.normpath(posixpath.join("xl", target))


def corrupt_cached_value(source, destination, coordinate, mode):
    with zipfile.ZipFile(source, "r") as archive:
        part = calc_part_name(archive)
        entries = [(info, archive.read(info.filename)) for info in archive.infolist()]

    updated = []
    found = False
    for info, data in entries:
        if info.filename == part:
            root = ET.fromstring(data)
            cell = root.find(f".//{{{MAIN_NS}}}c[@r='{coordinate}']")
            if cell is None or cell.find(f"{{{MAIN_NS}}}f") is None:
                raise AssertionError(f"{coordinate} is not a formula cell")
            formula = cell.find(f"{{{MAIN_NS}}}f")
            value = cell.find(f"{{{MAIN_NS}}}v")
            if mode == "blank":
                cell.remove(formula)
                if value is not None:
                    cell.remove(value)
                cell.attrib.pop("t", None)
            elif mode == "hardcoded":
                cell.remove(formula)
                if value is None:
                    value = ET.SubElement(cell, f"{{{MAIN_NS}}}v")
                cell.set("t", "n")
                value.text = "123"
            elif mode == "missing":
                if value is not None:
                    cell.remove(value)
            else:
                if value is None:
                    value = ET.SubElement(cell, f"{{{MAIN_NS}}}v")
                cell.set("t", "e" if mode == "error" else "b" if mode == "bool" else "n")
                value.text = {
                    "error": "#N/A",
                    "bool": "1",
                    "nan": "NaN",
                    "inf": "INF",
                    "zero": "0",
                    "max": "1E308",
                    "negmax": "-1E308",
                }[mode]
            data = ET.tostring(root, encoding="utf-8", xml_declaration=True)
            found = True
        updated.append((info, data))
    if not found:
        raise AssertionError("Calc worksheet part was not found")

    with zipfile.ZipFile(destination, "w") as archive:
        for info, data in updated:
            archive.writestr(info, data)


def remove_period_headers(source, destination):
    with zipfile.ZipFile(source, "r") as archive:
        part = calc_part_name(archive)
        entries = [(info, archive.read(info.filename)) for info in archive.infolist()]

    updated = []
    removed = 0
    for info, data in entries:
        if info.filename == part:
            root = ET.fromstring(data)
            row = root.find(f".//{{{MAIN_NS}}}row[@r='1']")
            if row is None:
                raise AssertionError("Calc row 1 was not found")
            for cell in list(row):
                coordinate = cell.get("r", "")
                letters = "".join(ch for ch in coordinate if ch.isalpha())
                column = 0
                for letter in letters:
                    column = column * 26 + ord(letter.upper()) - 64
                if column >= 3:
                    row.remove(cell)
                    removed += 1
            data = ET.tostring(root, encoding="utf-8", xml_declaration=True)
        updated.append((info, data))
    if removed == 0:
        raise AssertionError("no Calc period headers were removed")

    with zipfile.ZipFile(destination, "w") as archive:
        for info, data in updated:
            archive.writestr(info, data)


def remove_period_header(source, destination, coordinate):
    with zipfile.ZipFile(source, "r") as archive:
        part = calc_part_name(archive)
        entries = [(info, archive.read(info.filename)) for info in archive.infolist()]

    updated = []
    found = False
    for info, data in entries:
        if info.filename == part:
            root = ET.fromstring(data)
            cell = root.find(f".//{{{MAIN_NS}}}c[@r='{coordinate}']")
            if cell is None:
                raise AssertionError(f"Calc period header {coordinate} was not found")
            row = root.find(f".//{{{MAIN_NS}}}row[@r='1']")
            row.remove(cell)
            data = ET.tostring(root, encoding="utf-8", xml_declaration=True)
            found = True
        updated.append((info, data))
    if not found:
        raise AssertionError("Calc worksheet part was not found")

    with zipfile.ZipFile(destination, "w") as archive:
        for info, data in updated:
            archive.writestr(info, data)


def create_unheaded_later_period(source, destination):
    with zipfile.ZipFile(source, "r") as archive:
        part = calc_part_name(archive)
        entries = [(info, archive.read(info.filename)) for info in archive.infolist()]

    updated = []
    found = False
    for info, data in entries:
        if info.filename == part:
            root = ET.fromstring(data)
            for row in root.findall(f".//{{{MAIN_NS}}}row"):
                row_number = int(row.get("r"))
                for cell in list(row):
                    coordinate = cell.get("r", "")
                    letters = "".join(ch for ch in coordinate if ch.isalpha())
                    column = 0
                    for letter in letters:
                        column = column * 26 + ord(letter.upper()) - 64
                    if (row_number == 1 and column >= 5) or (row_number >= 2 and column == 5):
                        row.remove(cell)
            data = ET.tostring(root, encoding="utf-8", xml_declaration=True)
            found = True
        updated.append((info, data))
    if not found:
        raise AssertionError("Calc worksheet part was not found")

    with zipfile.ZipFile(destination, "w") as archive:
        for info, data in updated:
            archive.writestr(info, data)


def invoke(model, model_type, special_cache=None, recalc_case="clean"):
    env = os.environ.copy()
    env["PYTHONUTF8"] = "1"
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    env["PYTHONHASHSEED"] = "0"
    env["RECALC_TEST_CASE"] = recalc_case
    env["PYTHONPATH"] = str(HERE) + os.pathsep + env.get("PYTHONPATH", "")
    if special_cache:
        env["VERIFY_TEST_SPECIAL_CACHE"] = special_cache
    else:
        env.pop("VERIFY_TEST_SPECIAL_CACHE", None)
    env["PATH"] = str(HERE) + os.pathsep + env.get("PATH", "")
    report_path = model.parent / "verify_report.json"
    observed = []
    for _ in range(2):
        if report_path.exists():
            report_path.unlink()
        completed = subprocess.run(
            [sys.executable, "-B", str(VERIFIER), str(model), "--type", model_type, "--recalc", str(RECALC)],
            cwd=model.parent,
            env=env,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        if not report_path.is_file():
            raise AssertionError("verify_report.json was not written")
        report_text = report_path.read_text(encoding="utf-8")
        observed.append((completed.returncode, completed.stdout, completed.stderr, report_text))
    if observed[0] != observed[1]:
        raise AssertionError("two runs produced different exit/stdout/stderr/report output")
    return completed, json.loads(observed[0][3])


def single_check(report, check_id):
    rows = [row for row in report.get("checks", []) if row.get("id") == check_id]
    if len(rows) != 1:
        raise AssertionError(f"{check_id} was not recorded exactly once: {rows!r}")
    return rows[0]


def assert_error(completed, report, expected_detail):
    combined = completed.stdout + completed.stderr
    if completed.returncode != 2 or report.get("result") != "ERROR":
        raise AssertionError(f"exit/result was {completed.returncode}/{report.get('result')}, expected 2/ERROR")
    if expected_detail not in (report.get("error") or ""):
        raise AssertionError(f"error does not contain {expected_detail!r}: {report.get('error')!r}")
    if "RESULT: ERROR" not in completed.stdout:
        raise AssertionError("stdout does not contain RESULT: ERROR")
    if "Traceback" in combined:
        raise AssertionError("a traceback was emitted")


def assert_fail(completed, report, check_id, expected_detail):
    combined = completed.stdout + completed.stderr
    if completed.returncode != 1 or report.get("result") != "FAIL":
        raise AssertionError(f"exit/result was {completed.returncode}/{report.get('result')}, expected 1/FAIL")
    if report.get("error"):
        raise AssertionError(f"model failure was reported as verifier error: {report.get('error')!r}")
    row = single_check(report, check_id)
    if row.get("status") != "FAIL":
        raise AssertionError(f"{check_id} was not recorded as FAIL: {row!r}")
    if expected_detail not in row.get("detail", ""):
        raise AssertionError(f"{check_id} detail does not contain {expected_detail!r}: {row.get('detail')!r}")
    if "RESULT: FAIL" not in completed.stdout:
        raise AssertionError("stdout does not contain RESULT: FAIL")
    if "Traceback" in combined:
        raise AssertionError("a traceback was emitted")


def expect_invalid_cache(mode, root):
    case_dir = root / mode
    case_dir.mkdir()
    model = case_dir / "model.xlsx"
    special_cache = mode if mode in ("nan", "inf") else None
    if special_cache:
        shutil.copy2(BUDGET, model)
    else:
        corrupt_cached_value(BUDGET, model, "C5", mode)
    recalc_case = "model-errors" if mode == "error" else "clean"
    completed, report = invoke(model, "budget", special_cache, recalc_case)
    assert_fail(completed, report, "C3", "expense: invalid cached result Calc!C5")
    if mode == "error":
        a1 = single_check(report, "A1")
        if a1.get("status") != "FAIL":
            raise AssertionError(f"A1 did not own the recalc-detected Excel error: {a1!r}")


def expect_missing_formula(name, coordinate, key, root):
    case_dir = root / name
    case_dir.mkdir()
    model = case_dir / "model.xlsx"
    corrupt_cached_value(BUDGET, model, coordinate, "blank")
    completed, report = invoke(model, "budget")
    assert_fail(completed, report, "C3", f"{key}: missing formula at Calc!{coordinate}")


def expect_hardcoded_period(root):
    case_dir = root / "hardcoded-period"
    case_dir.mkdir()
    model = case_dir / "model.xlsx"
    corrupt_cached_value(BUDGET, model, "C5", "hardcoded")
    completed, report = invoke(model, "budget")
    assert_fail(completed, report, "A13", "Calc!C5")
    assert_fail(completed, report, "C3", "expense: missing formula at Calc!C5")


def expect_nonfinite_arithmetic(root):
    case_dir = root / "nonfinite-arithmetic"
    case_dir.mkdir()
    intermediate = case_dir / "intermediate.xlsx"
    model = case_dir / "model.xlsx"
    corrupt_cached_value(BUDGET, intermediate, "C2", "max")
    corrupt_cached_value(intermediate, model, "C5", "negmax")
    completed, report = invoke(model, "budget")
    assert_fail(completed, report, "C3", "arithmetic returned a non-finite value in Calc column C")


def expect_independent_checks_continue(root):
    case_dir = root / "independent-checks-continue"
    case_dir.mkdir()
    model = case_dir / "model.xlsx"
    corrupt_cached_value(DCF, model, "D5", "missing")
    completed, report = invoke(model, "dcf")
    assert_fail(completed, report, "C2c", "nopat: invalid cached result Calc!D5")
    for check_id in ("C2d", "C2e"):
        row = single_check(report, check_id)
        if row.get("status") != "SKIP":
            raise AssertionError(f"{check_id} did not continue to its expected SKIP: {row!r}")


def expect_period_header_failure(name, coordinate, expected_detail, root):
    case_dir = root / name
    case_dir.mkdir()
    model = case_dir / "model.xlsx"
    remove_period_header(BUDGET, model, coordinate)
    completed, report = invoke(model, "budget")
    assert_fail(completed, report, "C0", expected_detail)


def expect_unheaded_later_period(root):
    case_dir = root / "unheaded-later-period"
    case_dir.mkdir()
    model = case_dir / "model.xlsx"
    create_unheaded_later_period(BUDGET, model)
    completed, report = invoke(model, "budget")
    assert_fail(completed, report, "C0", "missing at Calc!F1 for populated column")


def expect_no_periods(root):
    case_dir = root / "no-periods"
    case_dir.mkdir()
    model = case_dir / "model.xlsx"
    remove_period_headers(DCF, model)
    completed, report = invoke(model, "dcf")
    assert_fail(completed, report, "C0", "Calc has no active period headers from C1")


def expect_corrupt_workbook(root):
    case_dir = root / "corrupt-workbook"
    case_dir.mkdir()
    model = case_dir / "model.xlsx"
    model.write_bytes(b"not an xlsx")
    completed, report = invoke(model, "budget")
    assert_error(completed, report, "BadZipFile")


def expect_clean(name, source, model_type, root, zero_cell=None):
    case_dir = root / name
    case_dir.mkdir()
    model = case_dir / "model.xlsx"
    if zero_cell:
        corrupt_cached_value(source, model, zero_cell, "zero")
    else:
        shutil.copy2(source, model)
    completed, report = invoke(model, model_type)
    if completed.returncode != 0 or report["result"] != "PASS":
        raise AssertionError(f"exit/result was {completed.returncode}/{report['result']}, expected 0/PASS")


def main():
    required = [VERIFIER, BUDGET, DCF, RECALC, HERE / "sitecustomize.py", HERE / "soffice.cmd"]
    missing = [str(path) for path in required if not path.is_file()]
    if missing:
        print("Missing fixtures: " + ", ".join(missing), file=sys.stderr)
        raise SystemExit(2)

    cases = ["missing", "error", "bool", "nan", "inf"]
    passed = 0
    with tempfile.TemporaryDirectory(prefix="verify-computed-values-") as temp:
        root = Path(temp)
        for mode in cases:
            try:
                expect_invalid_cache(mode, root)
            except Exception as exc:
                print(f"FAIL invalid-{mode}: {exc}")
            else:
                passed += 1
                print(f"PASS invalid-{mode} exit=1 result=FAIL check=C3 cell=Calc!C5 traceback=no")

        formula_cases = [
            ("missing-formula-first", "C2", "revenue"),
            ("missing-formula-other", "C5", "expense"),
        ]
        for name, coordinate, key in formula_cases:
            try:
                expect_missing_formula(name, coordinate, key, root)
            except Exception as exc:
                print(f"FAIL {name}: {exc}")
            else:
                passed += 1
                print(f"PASS {name} exit=1 result=FAIL check=C3 cell=Calc!{coordinate} traceback=no")

        model_failure_cases = [
            ("hardcoded-period", expect_hardcoded_period),
            ("nonfinite-arithmetic", expect_nonfinite_arithmetic),
            ("independent-checks-continue", expect_independent_checks_continue),
            ("noncontiguous-periods", lambda root: expect_period_header_failure(
                "noncontiguous-periods", "D1", "blank Calc!D1 before Calc!E1", root)),
            ("missing-final-period-header", lambda root: expect_period_header_failure(
                "missing-final-period-header", "N1", "missing at Calc!N1 for populated column", root)),
            ("unheaded-later-period", expect_unheaded_later_period),
        ]
        for name, check in model_failure_cases:
            try:
                check(root)
            except Exception as exc:
                print(f"FAIL {name}: {exc}")
            else:
                passed += 1
                print(f"PASS {name} exit=1 result=FAIL traceback=no")

        try:
            expect_no_periods(root)
        except Exception as exc:
            print(f"FAIL no-periods: {exc}")
        else:
            passed += 1
            print("PASS no-periods exit=1 result=FAIL check=C0 traceback=no")

        try:
            expect_corrupt_workbook(root)
        except Exception as exc:
            print(f"FAIL corrupt-workbook: {exc}")
        else:
            passed += 1
            print("PASS corrupt-workbook exit=2 result=ERROR traceback=no")

        clean_cases = [
            ("clean-budget", BUDGET, "budget", None),
            ("clean-dcf", DCF, "dcf", None),
            ("valid-zero", DCF, "dcf", "C9"),
        ]
        for name, source, model_type, zero_cell in clean_cases:
            try:
                expect_clean(name, source, model_type, root, zero_cell)
            except Exception as exc:
                print(f"FAIL {name}: {exc}")
            else:
                passed += 1
                print(f"PASS {name} exit=0 result=PASS")

    total = len(cases) + len(formula_cases) + len(model_failure_cases) + 2 + len(clean_cases)
    print(f"SUMMARY {passed}/{total} PASS")
    raise SystemExit(0 if passed == total else 1)


if __name__ == "__main__":
    main()
