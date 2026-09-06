import { calculateTool, fieldsFor, formatNumber, valuesFromQuery, validateValues } from '../../lib/knowledge-calculators';
import type { ToolKind, ToolResult, Values } from '../../lib/knowledge-calculators';

function renderChart(svg: SVGSVGElement, result: ToolResult) {
  const ns = 'http://www.w3.org/2000/svg';
  const add = (tag: string, attrs: Record<string, string>, text?: string) => {
    const node = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    if (text !== undefined) node.textContent = text;
    svg.append(node); return node;
  };
  svg.replaceChildren();
  add('title', {}, 'יתרות בסוף כל חודש; ציר הזמן משמאל לימין');
  const all = result.curves.flatMap(c => c.values);
  const max = Math.max(1, ...all);
  const min = Math.min(0, ...all);
  const span = max - min;
  const horizon = Math.max(0, ...result.curves.map(c => c.values.length - 1));
  const months = Math.max(1, horizon);
  const colors = ['#1f3f8f', '#1c70b2', '#565f8b'];
  for (let i = 0; i <= 4; i++) {
    const y = 18 + i * 50;
    add('line', { x1: '72', x2: '548', y1: String(y), y2: String(y), stroke: '#dce8f7' });
    add('text', { x: '65', y: String(y + 4), 'text-anchor': 'end', direction: 'ltr' }, formatNumber(max - span * i / 4, 0));
  }
  const ticks = Math.min(4, horizon);
  for (let i = 0; i <= ticks; i++) add('text', { x: String(72 + i / Math.max(1, ticks) * 476), y: '243', 'text-anchor': 'middle', direction: 'ltr' }, formatNumber(horizon * i / Math.max(1, ticks), 0));
  add('text', { x: '310', y: '266', 'text-anchor': 'middle', direction: 'rtl' }, 'חודשים');
  add('text', { x: '24', y: '10', 'text-anchor': 'middle', direction: 'rtl' }, '₪');
  result.curves.forEach((curve, index) => {
    const points = curve.values.map((v, m) => `${72 + m / months * 476},${18 + (max - v) / span * 200}`).join(' ');
    add('polyline', { points, fill: 'none', stroke: colors[index % colors.length], 'stroke-width': '2.5', ...(index === 1 ? { 'stroke-dasharray': '6 4' } : {}) });
    if (horizon === 0) add('circle', { cx: '72', cy: String(18 + (max - curve.values[0]) / span * 200), r: '3.5', fill: colors[index % colors.length] });
  });
  return colors;
}

export function render(root: HTMLElement, result: ToolResult) {
  const dl = document.createElement('dl'); dl.className = 'kw-metrics';
  for (const m of result.metrics) {
    const group = document.createElement('div'); group.className = 'kw-metric';
    const dt = document.createElement('dt'); dt.textContent = m.label;
    const dd = document.createElement('dd');
    if (typeof m.value === 'number') {
      const number = document.createElement('bdi'); number.dir = 'ltr'; number.className = 'kw-number';
      number.textContent = `${formatNumber(m.value)}${m.unit ? ` ${m.unit}` : ''}`; dd.append(number);
    } else dd.textContent = m.value;
    group.append(dt, dd); dl.append(group);
  }
  root.querySelector('[data-results]')!.replaceChildren(dl);
  const colors = renderChart(root.querySelector<SVGSVGElement>('[data-chart]')!, result);
  const legend = root.querySelector('[data-legend]')!; legend.replaceChildren();
  result.curves.forEach((curve, i) => {
    const span = document.createElement('span'); const mark = document.createElement('i'); mark.style.backgroundColor = colors[i % colors.length]; mark.setAttribute('aria-hidden', 'true');
    span.append(mark, document.createTextNode(curve.label)); legend.append(span);
  });
  const notes = root.querySelector('[data-notes]')!; notes.replaceChildren();
  for (const note of result.notes) { const p = document.createElement('p'); p.textContent = note; notes.append(p); }
}

export function initializeCalculators() {
  document.querySelectorAll<HTMLElement>('[data-calculator]').forEach(root => {
    if (root.dataset.initialized) return; root.dataset.initialized = 'true';
    const kind = root.dataset.calculator as ToolKind;
    const form = root.querySelector<HTMLFormElement>('form')!;
    const error = root.querySelector<HTMLElement>('[data-error]')!;
    const parsed = valuesFromQuery(kind, location.search);
    for (const f of fieldsFor(kind)) {
      const control = form.elements.namedItem(f.key) as HTMLInputElement | HTMLSelectElement;
      if (control instanceof HTMLInputElement && control.type === 'checkbox') control.checked = parsed.values[f.key] === true;
      else control.value = String(parsed.values[f.key]);
    }
    const update = () => {
      try {
        const values: Values = {};
        for (const f of fieldsFor(kind)) {
          const control = form.elements.namedItem(f.key) as HTMLInputElement | HTMLSelectElement;
          values[f.key] = control instanceof HTMLInputElement && control.type === 'checkbox' ? control.checked : f.options ? control.value : control.value.trim() === '' ? NaN : Number(control.value);
        }
        validateValues(kind, values); render(root, calculateTool(kind, values));
        error.hidden = true; error.textContent = ''; return true;
      } catch (reason) {
        error.hidden = false; error.textContent = reason instanceof Error ? reason.message : 'יש לבדוק את הנתונים.';
        root.querySelector('[data-results]')!.replaceChildren(); root.querySelector('[data-chart]')!.replaceChildren();
        root.querySelector('[data-legend]')!.replaceChildren(); root.querySelector('[data-notes]')!.replaceChildren(); return false;
      }
    };
    form.addEventListener('submit', e => { e.preventDefault(); update(); });
    form.addEventListener('input', update);
    root.querySelector('[data-print]')!.addEventListener('click', () => { if (update()) window.print(); });
    update();
    if (parsed.invalid.length) { error.hidden = false; error.textContent = `בקישור נמצאו ערכים לא תקינים בשדות: ${parsed.invalid.join(', ')}. בשדות אלה הוחזרו ערכי הדוגמה.`; }
  });
}
