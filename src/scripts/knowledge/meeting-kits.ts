/** No storage, network, URL serialization or mutable module state. */
export function initializeMeetingKits() {
  document.querySelectorAll<HTMLElement>('[data-meeting-kit]').forEach(root => {
    const fields = Array.from(root.querySelectorAll<HTMLTextAreaElement>('textarea[data-print-field]'));
    const sync = () => fields.forEach(field => {
      const printable = field.parentElement?.querySelector<HTMLElement>('.kw-print-value');
      if (printable) printable.textContent = field.value || 'לא מולא';
    });
    const status = (message: string) => { const el = root.querySelector('[data-kit-status]'); if (el) el.textContent = message; };
    // Explicit reset also covers history restoration and browser autofill.
    fields.forEach(f => { f.value = ''; }); sync();
    root.addEventListener('input', sync);
    root.querySelector('[data-kit-example]')?.addEventListener('click', () => { fields.forEach(f => { f.value = f.dataset.sample ?? ''; }); sync(); status('מולאה דוגמה בדיונית להמחשה.'); });
    root.querySelector('[data-kit-clear]')?.addEventListener('click', () => { fields.forEach(f => { f.value = ''; }); sync(); status('הטופס נוקה.'); fields[0]?.focus(); });
    root.querySelector('[data-kit-print]')?.addEventListener('click', () => { sync(); window.print(); });
    window.addEventListener('beforeprint', sync);
    window.addEventListener('pageshow', event => { if (event.persisted) { fields.forEach(f => { f.value = ''; }); sync(); status('הטופס נוקה בחזרה לדף.'); } });
  });
}
