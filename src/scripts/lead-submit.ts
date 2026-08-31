/*
  Shared submit behaviour for every lead-style form on the site.

  Extracted from LeadForm.astro so the community form does not duplicate the
  logic. The contract, in order:

    1. Native validity first (reportValidity), plus an optional per-form
       validate() hook for rules HTML cannot express.
    2. A filled honeypot shows the success message and sends NOTHING.
    3. An empty webhook URL shows the form's notConnected message and sends
       NOTHING — no network request of any kind, no fake success.
    4. Otherwise POST the form's payload as JSON; success resets the form,
       any failure (non-2xx or thrown) shows the failure message. The submit
       button is locked for the duration.

  Messages and payload are per-form configuration — this module never invents
  copy and never adds fields.
*/

export interface LeadSubmitConfig {
  /** name of the honeypot field */
  honeypot: string;
  messages: { success: string; notConnected: string; failure: string };
  /** build the JSON body from the form's data */
  payload: (data: FormData, form: HTMLFormElement) => Record<string, unknown>;
  /** extra validation after reportValidity; return an error message to block, null to pass */
  validate?: (data: FormData, form: HTMLFormElement) => string | null;
}

export function wireLeadForm(form: HTMLFormElement, config: LeadSubmitConfig): void {
  const status = form.querySelector<HTMLElement>('.form-status')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  function show(message: string, ok: boolean) {
    status.textContent = message;
    status.classList.remove('hidden', 'bg-brand-50', 'text-brand-800', 'bg-red-50', 'text-red-800');
    status.classList.add(...(ok ? ['bg-brand-50', 'text-brand-800'] : ['bg-red-50', 'text-red-800']));
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);

    const problem = config.validate ? config.validate(data, form) : null;
    if (problem) {
      show(problem, false);
      return;
    }

    // Honeypot filled → silently pretend success, send nothing
    if (data.get(config.honeypot)) {
      form.reset();
      show(config.messages.success, true);
      return;
    }

    const webhook = form.dataset.webhook ?? '';
    if (!webhook) {
      show(config.messages.notConnected, false);
      return;
    }

    button.disabled = true;
    try {
      const response = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config.payload(data, form)),
      });
      if (response.ok) {
        form.reset();
        show(config.messages.success, true);
      } else {
        show(config.messages.failure, false);
      }
    } catch {
      show(config.messages.failure, false);
    } finally {
      button.disabled = false;
    }
  });
}

/** utm_* readers share one sanitiser: letters, digits, underscore, hyphen; capped length. */
export function cleanTrackingValue(raw: string | null, maxLength = 64): string {
  if (!raw) return '';
  const value = raw.trim();
  return /^[A-Za-z0-9_-]+$/.test(value) ? value.slice(0, maxLength) : '';
}
