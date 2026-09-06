#!/usr/bin/env bash
# rebuild_compare.sh <build_script.py> <output_filename.xlsx> [extra build args...]
# Runs the build twice into fresh dirs, strips docProps timestamps, compares every other zip member.
set -euo pipefail
BUILD="$1"; NAME="$2"; shift 2
TS=$(date +%Y%m%d_%H%M%S)
A="out_${TS}_a"; B="out_${TS}_b"
rm -rf "$A" "$B"; mkdir "$A" "$B"
find . -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
python -B "$BUILD" --out "$A/$NAME" "$@" >/dev/null
python -B "$BUILD" --out "$B/$NAME" "$@" >/dev/null
TA=$(mktemp -d); TB=$(mktemp -d)
unzip -q "$A/$NAME" -d "$TA"; unzip -q "$B/$NAME" -d "$TB"
rm -f "$TA/docProps/core.xml" "$TB/docProps/core.xml"
if diff -rq "$TA" "$TB" >/tmp/rebuild_diff.txt; then
  echo "IDENTICAL  ($A/$NAME == $B/$NAME, docProps/core.xml excluded)"
else
  echo "DIFF"; cat /tmp/rebuild_diff.txt
fi
rm -rf "$TA" "$TB"
