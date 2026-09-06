import { closingBalance } from '../lib/pension.mjs';

const PENDING_MESSAGE = 'ההנחות השתנו. לחצו על חישוב מחדש.';
const UPDATED_MESSAGE = 'החישוב עודכן.';
const INVALID_MESSAGE = 'יש לתקן את השדות המסומנים ולנסות שוב.';
const ANNUAL_CAPTION = 'פירוט שנתי של החישוב';
const ZERO_YEARS_MESSAGE = 'תקופת החישוב היא אפס שנים, ולכן היתרה נשארת ללא שינוי.';
const AXIS_POINTS = 5;
const RETURN_AXIS_STEP = 0.01;
const FEE_AXIS_STEP = 0.001;
const ANNUAL_FIELDS = ['open', 'deposit', 'gain', 'fee', 'close'] as const;
const money = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percent = new Intl.NumberFormat('he-IL', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

type PensionInputs = {
  p0: number;
  deposit: number;
  salaryGrowth: number;
  ret: number;
  feeAum: number;
  years: number;
};

type PensionRow = {
  year: number;
  open: number;
  deposit: number;
  gain: number;
  fee: number;
  close: number;
};

function bdi(value: string): HTMLElement {
  const element = document.createElement('bdi');
  element.dir = 'ltr';
  element.textContent = value;
  return element;
}

function readInputs(inputs: HTMLInputElement[]): PensionInputs | null {
  if (inputs.some((input) => !Number.isFinite(input.valueAsNumber))) return null;

  const values = Object.fromEntries(inputs.map((input) => [input.name, input.valueAsNumber]));
  return {
    p0: values.p0,
    deposit: values.deposit,
    salaryGrowth: values.salaryGrowth / 100,
    ret: values.ret / 100,
    feeAum: values.feeAum / 100,
    years: values.years,
  };
}

function annualRows(rows: PensionRow[]): DocumentFragment {
  const fragment = document.createDocumentFragment();
  for (const row of rows) {
    const tableRow = document.createElement('tr');
    tableRow.className = 'border-t border-brand-100';
    tableRow.dataset.year = String(row.year);

    const year = document.createElement('th');
    year.className = 'px-4 py-3 text-right font-bold text-brand-800';
    year.scope = 'row';
    year.append(bdi(String(row.year)));
    tableRow.append(year);

    for (const field of ANNUAL_FIELDS) {
      const cell = document.createElement('td');
      cell.className = 'px-4 py-3 text-right text-ink-700';
      cell.dataset.field = field;
      cell.dataset.value = String(row[field]);
      cell.append(bdi(money.format(row[field])));
      tableRow.append(cell);
    }
    fragment.append(tableRow);
  }
  return fragment;
}

function updateAnnualCaption(caption: HTMLTableCaptionElement, years: number): void {
  caption.replaceChildren(ANNUAL_CAPTION);
  if (years !== 0) return;

  const explanation = document.createElement('span');
  explanation.className = 'mt-2 block text-sm font-normal leading-relaxed text-ink-700';
  explanation.textContent = ZERO_YEARS_MESSAGE;
  caption.append(explanation);
}

function axisAround(base: number, step: number, minimum: number, maximum: number): number[] {
  const width = step * (AXIS_POINTS - 1);
  const start = Math.min(Math.max(base - (step * 2), minimum), maximum - width);
  return Array.from({ length: AXIS_POINTS }, (_, index) => Number((start + (step * index)).toFixed(12)));
}

function sensitivityMarkup(inputs: PensionInputs): { head: DocumentFragment; body: DocumentFragment } {
  const returnAxis = axisAround(inputs.ret, RETURN_AXIS_STEP, -1, 1);
  const feeAxis = axisAround(inputs.feeAum, FEE_AXIS_STEP, 0, 1);
  const head = document.createDocumentFragment();
  const corner = document.createElement('th');
  corner.className = 'px-3 py-3 text-right';
  corner.scope = 'col';
  corner.textContent = 'תשואה / דמי ניהול';
  head.append(corner);

  for (const feeAum of feeAxis) {
    const column = document.createElement('th');
    column.className = 'px-3 py-3 text-center';
    column.scope = 'col';
    column.dataset.feeAum = String(feeAum);
    if (feeAum === inputs.feeAum) column.dataset.baseAxis = 'true';
    column.append(bdi(`${percent.format(feeAum * 100)}%`));
    head.append(column);
  }

  const body = document.createDocumentFragment();
  for (const ret of returnAxis) {
    const tableRow = document.createElement('tr');
    tableRow.className = 'border-t border-brand-100';

    const rowHeader = document.createElement('th');
    rowHeader.className = 'bg-surface-blue px-3 py-3 text-right font-bold text-brand-800';
    rowHeader.scope = 'row';
    rowHeader.dataset.return = String(ret);
    if (ret === inputs.ret) rowHeader.dataset.baseAxis = 'true';
    rowHeader.append(bdi(`${percent.format(ret * 100)}%`));
    tableRow.append(rowHeader);

    for (const feeAum of feeAxis) {
      const isBase = ret === inputs.ret && feeAum === inputs.feeAum;
      const cell = document.createElement('td');
      cell.className = isBase
        ? 'bg-accent-100 px-3 py-3 text-center font-bold text-brand-900'
        : 'px-3 py-3 text-center text-ink-700';
      cell.dataset.return = String(ret);
      cell.dataset.feeAum = String(feeAum);
      try {
        const scenarioRows = closingBalance({ ...inputs, ret, feeAum }) as PensionRow[];
        const value = scenarioRows.at(-1)?.close ?? inputs.p0;
        cell.dataset.value = String(value);
        if (isBase) cell.dataset.baseCase = 'true';
        cell.append(bdi(money.format(value)));
        if (isBase) {
          const label = document.createElement('span');
          label.className = 'mt-1 block text-xs';
          label.textContent = 'תרחיש הבסיס';
          cell.append(label);
        }
      } catch {
        cell.dataset.invalid = 'true';
        cell.setAttribute('aria-label', 'השילוב מחוץ לתחום החישוב');
        cell.textContent = '—';
      }
      tableRow.append(cell);
    }
    body.append(tableRow);
  }

  return { head, body };
}

function wireCalculator(root: HTMLElement): void {
  if (root.dataset.initialized === 'true') return;

  const form = root.querySelector<HTMLFormElement>('[data-pension-form]');
  const fieldset = form?.querySelector<HTMLFieldSetElement>('fieldset');
  const results = root.querySelector<HTMLElement>('[data-pension-results]');
  const status = root.querySelector<HTMLElement>('[data-pension-status]');
  const error = root.querySelector<HTMLElement>('[data-pension-error]');
  const balance = root.querySelector<HTMLElement>('[data-pension-balance]');
  const annualCaption = root.querySelector<HTMLTableCaptionElement>('[data-pension-years] caption');
  const annualBody = root.querySelector<HTMLTableSectionElement>('[data-pension-years] tbody');
  const sensitivityHead = root.querySelector<HTMLTableRowElement>('[data-pension-sensitivity] thead tr');
  const sensitivityBody = root.querySelector<HTMLTableSectionElement>('[data-pension-sensitivity] tbody');
  const reset = root.querySelector<HTMLButtonElement>('[data-pension-reset]');
  const inputs = [...(form?.querySelectorAll<HTMLInputElement>('input[type="number"]') ?? [])];

  if (!form || !fieldset || !results || !status || !error || !balance || !annualCaption || !annualBody
    || !sensitivityHead || !sensitivityBody || !reset || inputs.length !== 6) {
    throw new Error('Pension calculator markup is incomplete.');
  }

  function hideError(): void {
    error.hidden = true;
    error.classList.add('hidden');
    error.textContent = '';
  }

  function reportInvalid(invalidInputs: HTMLInputElement[]): void {
    inputs.forEach((input) => input.removeAttribute('aria-invalid'));
    invalidInputs.forEach((input) => input.setAttribute('aria-invalid', 'true'));
    root.dataset.state = 'invalid';
    results.hidden = true;
    status.textContent = '';
    error.textContent = INVALID_MESSAGE;
    error.classList.remove('hidden');
    error.hidden = false;
    invalidInputs[0]?.focus();
  }

  function markDirty(): void {
    root.dataset.state = 'dirty';
    results.hidden = true;
    status.textContent = PENDING_MESSAGE;
    hideError();
  }

  inputs.forEach((input) => input.addEventListener('input', () => {
    input.removeAttribute('aria-invalid');
    markDirty();
  }));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nativeInvalid = inputs.filter((input) => !input.checkValidity()
      || !Number.isFinite(input.valueAsNumber));
    if (nativeInvalid.length > 0) {
      reportInvalid(nativeInvalid);
      return;
    }

    const values = readInputs(inputs);
    if (!values) {
      reportInvalid(inputs);
      return;
    }

    try {
      const rows = closingBalance(values) as PensionRow[];
      const finalBalance = rows.at(-1)?.close ?? values.p0;
      const sensitivity = sensitivityMarkup(values);

      balance.dataset.value = String(finalBalance);
      balance.replaceChildren(bdi(money.format(finalBalance)));
      updateAnnualCaption(annualCaption, values.years);
      annualBody.replaceChildren(annualRows(rows));
      sensitivityHead.replaceChildren(sensitivity.head);
      sensitivityBody.replaceChildren(sensitivity.body);
      inputs.forEach((input) => input.removeAttribute('aria-invalid'));
      hideError();
      status.textContent = UPDATED_MESSAGE;
      root.dataset.state = 'ready';
      results.hidden = false;
    } catch {
      const domainInvalid = inputs.filter((input) => ['ret', 'feeAum'].includes(input.name));
      reportInvalid(domainInvalid);
    }
  });
  reset.addEventListener('click', () => {
    form.reset();
    inputs.forEach((input) => input.removeAttribute('aria-invalid'));
    hideError();
    form.requestSubmit();
  });

  root.dataset.initialized = 'true';
  fieldset.disabled = false;
}

export function initPensionCalculators(): void {
  document.querySelectorAll<HTMLElement>('[data-pension-calculator="aum-v1"]').forEach(wireCalculator);
}
