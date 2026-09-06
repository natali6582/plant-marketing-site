import json
import math
import os
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path


HERE = Path(__file__).resolve().parent
VERIFIER = HERE.parent / "scripts" / "verify_model.py"
PENSION = HERE / "fixtures" / "pension_example.xlsx"
RECALC = HERE / "recalc_stub.py"
MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
DOC_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"


def sheet_part_name(archive, sheet_name):
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    sheet = next(
        node for node in workbook.findall(f".//{{{MAIN_NS}}}sheet")
        if node.get("name") == sheet_name
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
    return "/".join(("xl", target))


def patch_output(source, destination, mutate):
    with zipfile.ZipFile(source, "r") as archive:
        part = sheet_part_name(archive, "Output")
        entries = [(info, archive.read(info.filename)) for info in archive.infolist()]

    found = False
    updated = []
    for info, data in entries:
        if info.filename == part:
            root = ET.fromstring(data)
            mutate(root)
            data = ET.tostring(root, encoding="utf-8", xml_declaration=True)
            found = True
        updated.append((info, data))
    if not found:
        raise AssertionError("Output worksheet part was not found")

    with zipfile.ZipFile(destination, "w") as archive:
        for info, data in updated:
            archive.writestr(info, data)


def output_cell(root, coordinate):
    cell = root.find(f".//{{{MAIN_NS}}}c[@r='{coordinate}']")
    if cell is None:
        raise AssertionError(f"Output cell {coordinate} was not found")
    return cell


def set_cached_value(cell, value):
    value_node = cell.find(f"{{{MAIN_NS}}}v")
    if value_node is None:
        value_node = ET.SubElement(cell, f"{{{MAIN_NS}}}v")
    cell.attrib.pop("t", None)
    value_node.text = repr(float(value))


def closed_form(p0, deposit, salary_growth, ret, fee, years):
    n = ret - fee
    growth_factor = (1 + n) ** years
    salary_factor = (1 + salary_growth) ** years
    if math.isclose(n, salary_growth, rel_tol=0.0, abs_tol=1e-12):
        deposit_value = deposit * years * (1 + salary_growth) ** (years - 1)
    else:
        deposit_value = deposit * (growth_factor - salary_factor) / (n - salary_growth)
    return p0 * growth_factor + deposit_value


def make_contract_fixture(source, destination, fee_axis=0.005):
    p0, deposit, salary_growth, years = 100000.0, 24000.0, 0.02, 10
    returns = [0.02, 0.03, 0.04, 0.05, 0.06]

    def mutate(root):
        set_cached_value(output_cell(root, "D4"), fee_axis)
        for row, ret in enumerate(returns, start=5):
            set_cached_value(
                output_cell(root, f"D{row}"),
                closed_form(p0, deposit, salary_growth, ret, fee_axis, years),
            )

    patch_output(source, destination, mutate)


def make_drift(source, destination):
    def mutate(root):
        cell = output_cell(root, "D5")
        value = float(cell.find(f"{{{MAIN_NS}}}v").text)
        set_cached_value(cell, value + 1000.0)

    patch_output(source, destination, mutate)


def make_values(source, destination):
    def mutate(root):
        cell = output_cell(root, "D5")
        formula = cell.find(f"{{{MAIN_NS}}}f")
        if formula is None:
            raise AssertionError("Output!D5 is not a formula cell")
        cell.remove(formula)

    patch_output(source, destination, mutate)


def make_unbound(source, destination):
    def mutate(root):
        cell = output_cell(root, "D5")
        formula = cell.find(f"{{{MAIN_NS}}}f")
        if formula is None:
            raise AssertionError("Output!D5 is not a formula cell")
        formula.text = "1"
        set_cached_value(cell, 1.0)

    patch_output(source, destination, mutate)


def make_missing_base_fee(source, destination):
    make_contract_fixture(source, destination, fee_axis=0.006)


def invoke(model):
    env = os.environ.copy()
    env["PYTHONUTF8"] = "1"
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    env["PYTHONHASHSEED"] = "0"
    env["RECALC_TEST_CASE"] = "clean"
    env["PATH"] = str(HERE) + os.pathsep + env.get("PATH", "")
    report_path = model.parent / "verify_report.json"
    observed = []
    for _ in range(2):
        if report_path.exists():
            report_path.unlink()
        completed = subprocess.run(
            [sys.executable, "-B", str(VERIFIER), str(model), "--type", "pension", "--recalc", str(RECALC)],
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


def a9_detail(report):
    rows = [row for row in report.get("checks", []) if row.get("id") == "A9"]
    if len(rows) != 1:
        raise AssertionError(f"A9 was not recorded exactly once: {rows!r}")
    return rows[0]


def assert_expected(completed, report, expected_result, expected_detail):
    if completed.returncode != (0 if expected_result == "PASS" else 1):
        raise AssertionError(f"exit={completed.returncode}, expected result={expected_result}")
    if report.get("result") != expected_result:
        raise AssertionError(f"result={report.get('result')}, expected {expected_result}")
    row = a9_detail(report)
    if row.get("status") != expected_result:
        raise AssertionError(f"A9 status={row.get('status')}, expected {expected_result}")
    if expected_detail not in row.get("detail", ""):
        raise AssertionError(f"A9 detail lacks {expected_detail!r}: {row.get('detail')!r}")
    if "Traceback" in completed.stdout + completed.stderr:
        raise AssertionError("a traceback was emitted")


def main():
    cases = [
        ("clean-pension", make_contract_fixture, "PASS", "independently recomputed"),
        ("grid-drift", make_drift, "FAIL", "grid differs from independent calculation"),
        ("grid-values", make_values, "FAIL", "cells are values, not formulas"),
        ("grid-unbound", make_unbound, "FAIL", "formulas not bound to Calc/Assumptions"),
        ("missing-base-fee", make_missing_base_fee, "FAIL", "base axes must appear exactly once"),
    ]
    passed = 0
    with tempfile.TemporaryDirectory(prefix="pension-a9-contract-") as temp:
        root = Path(temp)
        for name, builder, expected_result, expected_detail in cases:
            model = root / name / "model.xlsx"
            model.parent.mkdir()
            builder(PENSION, model)
            try:
                completed, report = invoke(model)
                assert_expected(completed, report, expected_result, expected_detail)
            except Exception as exc:
                print(f"FAIL {name}: {exc}")
            else:
                passed += 1
                print(f"PASS {name} exit={completed.returncode} result={expected_result} deterministic=yes")
    print(f"SUMMARY {passed}/{len(cases)} PASS")
    raise SystemExit(0 if passed == len(cases) else 1)


if __name__ == "__main__":
    main()
