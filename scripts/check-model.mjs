// Headless numeric evidence only. No browser, spreadsheet engine or test framework.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

async function main(args) {
  if (args.some((arg) => arg !== '--json') || args.length > 1) {
    throw new Error('Usage: node scripts/check-model.mjs [--json]');
  }
  const json = args.includes('--json');
  const results = [];
  const check = (name, run) => {
    try {
      run();
      results.push({ name, result: 'PASS' });
    } catch (error) {
      results.push({ name, result: 'FAIL', message: error.message });
    }
  };
  const finish = (extra = {}) => {
    const failed = results.filter((row) => row.result === 'FAIL');
    const report = {
      model: 'pension-aum-v1', result: failed.length ? 'FAIL' : 'PASS',
      checks: results.length, passed: results.length - failed.length,
      failed: failed.length, ...extra, results,
    };
    if (json) console.log(JSON.stringify(report, null, 2));
    else {
      console.log(`MODEL ${report.result} — ${report.passed}/${report.checks} checks`);
      for (const row of failed) console.error(`  FAIL ${row.name}: ${row.message}`);
      if (report.maxExcelDeltaIls !== undefined) {
        console.log(`  Excel: ${report.excelFixtures} cached fixtures; max delta ${report.maxExcelDeltaIls} ILS (limit 1 ILS)`);
      }
    }
    process.exitCode = failed.length ? 1 : 0;
  };

  let closingBalance;
  try {
    ({ closingBalance } = await import('../src/lib/pension.mjs'));
    assert.equal(typeof closingBalance, 'function');
  } catch {
    results.push({ name: 'calculation module is available', result: 'FAIL', message: 'src/lib/pension.mjs must export closingBalance' });
    finish();
    return;
  }

  const raw = await readFile(new URL('../src/data/model-fixtures.json', import.meta.url));
  const data = JSON.parse(raw);
  const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
  // Pin the combined export and source pairs: editing both code and expected
  // balances must not silently replace the independently verified evidence.
  check('approved combined fixture bytes', () => assert.equal(sha256(raw), '04dcf064b6524a59be54041aa126c6a1cb94189ded171f289bf6acd799c785c6'));
  const sourceFiles = [
    ['workbook', 'docs/models/pension-aum-v1/pension_example_recalc.xlsx', '061a3c8e95d20439bb0268247bcf003e25597de6cc13223001358d78eb3cca73'],
    ['report', 'docs/models/pension-aum-v1/verify_report.json', 'b1f7be46eac1b29c7a298ed4773ae1d57dc6eb79ec11449184b9189049750f6c'],
  ];
  for (const [kind, path, expectedHash] of sourceFiles) {
    const bytes = await readFile(new URL(`../${path}`, import.meta.url));
    check(`approved ${kind} provenance`, () => {
      assert.equal(sha256(bytes), expectedHash);
      assert.equal(data.source[kind], path);
      assert.equal(data.source[`${kind}Sha256`], expectedHash);
    });
  }
  const keys = ['p0', 'deposit', 'salaryGrowth', 'ret', 'feeAum', 'years'];
  check('fixture schema and AUM-only contract', () => {
    assert.equal(data.schemaVersion, 1);
    assert.equal(data.model, 'pension-aum-v1');
    assert.equal(data.currency, 'ILS');
    assert.equal(data.toleranceIls, 1);
    assert.deepEqual(data.contract.supportedInputs, keys);
    assert.deepEqual(data.contract.excluded, ['feeDeposit', 'withdrawals', 'taxes']);
    assert.equal(data.fixtures.length, 14);
    assert.equal(new Set(data.fixtures.map((row) => row.id)).size, 14);
  });
  check('original nine A3 scenarios remain unchanged', () => {
    assert.equal(sha256(JSON.stringify(data.fixtures.slice(0, 9))), 'db6f99d8b14477aae2014ccbcb4183acc45879c7eed583708e258566a0168cc8');
  });
  check('additional scenario inventory and honest coverage', () => {
    assert.deepEqual(data.fixtures.slice(9).map((row) => row.id), ['years-30', 'deposit-0', 'p0-0', 'salgrowth-0', 'n-equals-g']);
    assert.deepEqual(data.coverage.variedInputs, keys);
    assert.deepEqual(data.coverage.fixedInputs, {});
    assert.equal(data.coverage.negativeReturnsVerified, false);
  });

  const extraRoot = 'docs/models/pension-aum-v1/extra';
  const archivePath = `${extraRoot}/pension-aum-v1-fixtures-extra.zip`;
  const archiveHash = '08221ad309480636518a3a6b6490b7fa6e74f312e8ab4f01a2c61b8f89b4ce91';
  const manifestPath = `${extraRoot}/manifest.json`;
  const manifestHash = '5803cb7af0ddf53cdd9827dac261d8096d531d140d30ac386683eeb348aa7544';
  const archiveBytes = await readFile(new URL(`../${archivePath}`, import.meta.url));
  const manifestBytes = await readFile(new URL(`../${manifestPath}`, import.meta.url));
  check('approved additional archive provenance', () => {
    assert.equal(sha256(archiveBytes), archiveHash);
    assert.equal(data.additionalSource.archive, archivePath);
    assert.equal(data.additionalSource.archiveSha256, archiveHash);
  });
  check('approved additional manifest provenance', () => {
    assert.equal(sha256(manifestBytes), manifestHash);
    assert.equal(data.additionalSource.manifest, manifestPath);
    assert.equal(data.additionalSource.manifestSha256, manifestHash);
  });
  const manifest = JSON.parse(manifestBytes);
  const extraIds = ['years-30', 'deposit-0', 'p0-0', 'salgrowth-0', 'n-equals-g'];
  check('additional manifest inventory', () => {
    assert.equal(manifest.model, 'pension-aum-v1');
    assert.deepEqual(manifest.scenarios.map((row) => row.id), extraIds);
  });
  for (const id of extraIds) {
    const source = manifest.scenarios.find((row) => row.id === id);
    const fixture = data.fixtures.find((row) => row.id === id);
    // Paths are constructed from the fixed approved IDs, never arbitrary manifest URLs.
    for (const [kind, filename] of [['workbook', `${id}.xlsx`], ['report', 'verify_report.json']]) {
      const relativePath = `${id}/${filename}`;
      const path = `${extraRoot}/${relativePath}`;
      const bytes = await readFile(new URL(`../${path}`, import.meta.url));
      check(`approved ${id} ${kind} provenance`, () => {
        assert.equal(source[kind], relativePath);
        assert.equal(sha256(bytes), source[`${kind}Sha256`]);
        assert.equal(fixture.source[kind], path);
        assert.equal(fixture.source[`${kind}Sha256`], source[`${kind}Sha256`]);
        if (kind === 'report') {
          const report = JSON.parse(bytes);
          assert.equal(report.type, 'pension');
          assert.equal(report.result, 'PASS');
          assert.equal(report.error, null);
          assert.equal(report.checks.length, 18);
          assert.equal(new Set(report.checks.map((row) => row.id)).size, 18);
          assert.ok(report.checks.every((row) => row.status === 'PASS'));
          assert.equal(fixture.source.verifiedAtPath, report.file);
        }
      });
    }
    check(`${id} matches verified manifest inputs and original headline`, () => {
      assert.deepEqual(fixture.inputs, source.inputs);
      assert.equal(fixture.expectedClosingBalance, source.expectedClosingBalance);
      assert.equal(source.closingBalanceCell, 'Output!B1');
      assert.equal(fixture.source.closingBalanceCell, 'Output!B1');
      assert.equal(fixture.source.verificationResult, 'PASS');
      assert.equal(fixture.source.verificationChecks, 18);
      assert.equal(source.result, 'PASS');
      assert.equal(source.exit, 0);
      assert.equal(source.checks, 18);
      assert.deepEqual(source.warn, []);
    });
  }

  const base = Object.freeze({ p0: 100000, deposit: 24000, salaryGrowth: 0.02, ret: 0.04, feeAum: 0.005, years: 10 });
  const last = (input) => closingBalance(input).at(-1)?.close ?? input.p0;
  const near = (actual, expected, tolerance = 1e-7) => {
    assert.ok(Number.isFinite(actual) && Number.isFinite(expected), 'balances must be finite');
    assert.ok(Math.abs(actual - expected) <= tolerance, `delta ${Math.abs(actual - expected)} exceeds ${tolerance}`);
  };
  let maxExcelDeltaIls = 0;
  for (const fixture of data.fixtures) {
    check(`Excel ${fixture.id}`, () => {
      assert.ok(Number.isFinite(fixture.expectedClosingBalance));
      const actual = last(fixture.inputs);
      near(actual, fixture.expectedClosingBalance, 1);
      maxExcelDeltaIls = Math.max(maxExcelDeltaIls, Math.abs(actual - fixture.expectedClosingBalance));
    });
  }

  check('one annual row exposes exact deposit timing and fee basis', () => {
    assert.deepEqual(closingBalance({ p0: 1000, deposit: 200, salaryGrowth: 0.5, ret: 0.1, feeAum: 0.02, years: 1 }),
      [{ year: 1, open: 1000, deposit: 200, gain: 100, fee: 20, close: 1280 }]);
  });
  check('every row rolls forward and reconciles without rounding', () => {
    const rows = closingBalance(base);
    assert.equal(rows.length, base.years);
    for (const [index, row] of rows.entries()) {
      assert.deepEqual(Object.keys(row), ['year', 'open', 'deposit', 'gain', 'fee', 'close']);
      assert.equal(row.year, index + 1);
      assert.equal(row.open, index ? rows[index - 1].close : base.p0);
      near(row.deposit, base.deposit * (1 + base.salaryGrowth) ** index);
      near(row.gain, row.open * base.ret);
      near(row.fee, row.open * base.feeAum);
      near(row.close, row.open + row.gain - row.fee + row.deposit);
    }
    assert.notEqual(rows[1].close, Math.round(rows[1].close));
  });
  check('zero years returns no annual rows', () => {
    assert.deepEqual(closingBalance({ ...base, years: 0 }), []);
    assert.equal(last({ ...base, years: 0 }), base.p0);
  });
  check('zero rates and zero fees', () => assert.equal(last({ ...base, salaryGrowth: 0, ret: 0, feeAum: 0 }), 340000));
  check('zero balance and zero deposits remain zero', () => assert.equal(last({ ...base, p0: 0, deposit: 0 }), 0));
  check('zero growth factor pays the first deposit only', () => assert.equal(last({ ...base, p0: 100, deposit: 10, salaryGrowth: -1, ret: 0, feeAum: 0 }), 110));
  check('total loss does not erase the end-of-period deposit', () => assert.equal(last({ ...base, deposit: 200, salaryGrowth: 0, ret: -1, feeAum: 0 }), 200));
  check('return plus fee at exactly total loss remains valid', () => assert.equal(last({ ...base, deposit: 200, salaryGrowth: 0, ret: -0.9, feeAum: 0.1 }), 200));
  check('fractional ILS are not rounded internally', () => near(last({ ...base, p0: 0.01, deposit: 0.02, salaryGrowth: 0, ret: 0.1, feeAum: 0, years: 1 }), 0.031, 1e-15));

  // Independent closed form for varied inputs. The equal-rate branch is the
  // removable singularity; the production module must not divide by n - g.
  const closedForm = ({ p0, deposit, salaryGrowth: g, ret, feeAum, years: nYears }) => {
    if (nYears === 0) return p0;
    const net = ret - feeAum;
    const savings = p0 * (1 + net) ** nYears;
    return savings + (net === g
      ? deposit * nYears * (1 + net) ** (nYears - 1)
      : deposit * ((1 + net) ** nYears - (1 + g) ** nYears) / (net - g));
  };
  const independentCases = [
    ['different balance, deposit, growth and horizon', { p0: 52000, deposit: 3500, salaryGrowth: 0.01, ret: 0.03, feeAum: 0.002, years: 37 }],
    ['negative return and decreasing deposits', { p0: 70000, deposit: 900, salaryGrowth: -0.02, ret: -0.04, feeAum: 0.01, years: 24 }],
    ['no deposits', { ...base, deposit: 0, years: 60 }],
    ['equal net return and deposit growth', { ...base, ret: 0.025, feeAum: 0.005, salaryGrowth: 0.02, years: 30 }],
    ['zero equal rates', { ...base, ret: 0, feeAum: 0, salaryGrowth: 0, years: 100 }],
    ['both growth factors zero', { ...base, ret: -1, feeAum: 0, salaryGrowth: -1, years: 2 }],
  ];
  for (const [name, input] of independentCases) {
    check(`closed form: ${name}`, () => near(last(input), closedForm(input), 1e-5));
  }
  check('near-equal rates stay stable', () => {
    const exact = { ...base, ret: 0.025, feeAum: 0.005, salaryGrowth: 0.02, years: 30 };
    near(last({ ...exact, ret: exact.ret + 1e-14 }), closedForm(exact), 1e-5);
  });
  check('higher fees reduce the closing balance', () => assert.ok(last({ ...base, feeAum: 0.008 }) < last(base)));
  check('higher return raises the closing balance', () => assert.ok(last({ ...base, ret: 0.06 }) > last(base)));

  for (const key of keys) {
    check(`required numeric input: ${key}`, () => {
      const missing = { ...base };
      delete missing[key];
      assert.throws(() => closingBalance(missing), TypeError);
      for (const value of [undefined, null, '', '0.02', true, NaN, Infinity, -Infinity]) {
        assert.throws(() => closingBalance({ ...base, [key]: value }), TypeError);
      }
    });
  }
  for (const name of ['feeDeposit', 'withdrawals', 'taxes', 'return']) {
    check(`unsupported input rejected: ${name}`, () => assert.throws(() => closingBalance({ ...base, [name]: 0 }), TypeError));
  }
  check('unsupported symbol key rejected', () => assert.throws(() => closingBalance({ ...base, [Symbol('feeDeposit')]: 0 }), TypeError));
  check('input must be a plain object with own values', () => {
    for (const input of [null, undefined, [], 1, 'input', Object.create(base), new Date()]) {
      assert.throws(() => closingBalance(input), TypeError);
    }
    assert.deepEqual(closingBalance(Object.assign(Object.create(null), base)), closingBalance(base));
  });
  check('accessor inputs are rejected without invoking them', () => {
    let called = false;
    const input = { ...base, get p0() { called = true; return 100000; } };
    assert.throws(() => closingBalance(input), TypeError);
    assert.equal(called, false);
  });
  const outsideDomain = [
    ['negative opening balance', { p0: -1 }], ['negative deposit', { deposit: -1 }],
    ['negative fee', { feeAum: -0.001 }], ['growth below total loss', { salaryGrowth: -1.01 }],
    ['return below total loss', { ret: -1.01 }], ['negative net factor', { ret: -0.9, feeAum: 0.2 }],
    ['fractional horizon', { years: 2.5 }], ['negative horizon', { years: -1 }],
    ['horizon above technical limit', { years: 101 }],
  ];
  for (const [name, overrides] of outsideDomain) {
    check(`domain: ${name}`, () => assert.throws(() => closingBalance({ ...base, ...overrides }), RangeError));
  }
  check('zero horizon still validates all inputs', () => assert.throws(() => closingBalance({ ...base, p0: -1, years: 0 }), RangeError));
  check('fee range is not a claimed legal cap', () => assert.ok(Number.isFinite(last({ ...base, feeAum: 0.008 }))));
  check('overflow in closing balance is rejected', () => assert.throws(() => closingBalance({ ...base, p0: Number.MAX_VALUE, ret: 1, feeAum: 0, years: 1 }), RangeError));
  check('overflow in deposits is rejected', () => assert.throws(() => closingBalance({ ...base, p0: 0, deposit: Number.MAX_VALUE, salaryGrowth: 1, ret: -1, feeAum: 0, years: 2 }), RangeError));
  check('zero amounts stay zero even with huge finite rates', () => assert.equal(last({ ...base, p0: 0, deposit: 0, salaryGrowth: Number.MAX_VALUE, ret: Number.MAX_VALUE }), 0));
  check('input is immutable and no previous output leaks into another call', () => {
    const first = closingBalance(base);
    const expected = JSON.stringify(first);
    first[0].close = -123;
    first.push({ year: -1 });
    assert.equal(JSON.stringify(closingBalance(base)), expected);
    assert.deepEqual(base, { p0: 100000, deposit: 24000, salaryGrowth: 0.02, ret: 0.04, feeAum: 0.005, years: 10 });
  });
  check('interleaved calls are byte-for-byte deterministic', () => {
    const first = JSON.stringify(closingBalance(base));
    closingBalance({ ...base, ret: -0.05, years: 25 });
    assert.equal(JSON.stringify(closingBalance(base)), first);
  });
  finish({ excelFixtures: data.fixtures.length, maxExcelDeltaIls });
}

main(process.argv.slice(2)).catch((error) => {
  // Missing/unreadable evidence is an operational error, not a numeric pass.
  console.error(`MODEL ERROR — ${error.message}`);
  process.exitCode = 2;
});
