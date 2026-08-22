# Configuration record

Fill each row in as the step is completed. Keep secrets that are not needed at
build time (registrar login, monday API token, Cloudflare account password) out
of this file and out of the repo — this is a record of *what was configured*,
not a credential store.

## Make scenario — Website leads → monday

| Field | Value |
| --- | --- |
| Scenario name | `Website leads → monday` |
| Webhook URL | _[TBD — paste into `PUBLIC_LEAD_WEBHOOK_URL`, and into the Cloudflare Pages env vars]_ |
| monday board ID | _[TBD — ambiguity #3: existing CRM/leads board or a new one?]_ |
| Item name format | `[name] · [office]` |
| Confirmation email | _[TBD — Hebrew template, optional but recommended]_ |

### Modules

1. **Webhooks → Custom webhook** — receives the JSON below.
2. **monday.com → Create an Item** on the board above.
3. **Email → Send** the Hebrew confirmation to the visitor.
4. *(optional)* monday notification to the sales owner.

### Payload the site sends

```json
{
  "name": "ישראל ישראלי",
  "phone": "050-0000000",
  "email": "test@example.com",
  "office": "משרד לדוגמה",
  "role": "advisor",
  "message": "בדיקה",
  "source": "website-contact",
  "page": "/contact/",
  "utm_source": "",
  "utm_medium": "",
  "utm_campaign": ""
}
```

`role` arrives as one of `advisor`, `agent`, `pension`, `other`, or empty.
`source` is `website-home` / `website-product` / `website-solutions` /
`website-webinar` / `website-about` / `website-contact`.

### Column mapping

| JSON field | monday column | Filled |
| --- | --- | --- |
| `name` + `office` | item name | ☐ |
| `phone` | phone | ☐ |
| `email` | email | ☐ |
| `office` | text | ☐ |
| `role` | status/dropdown | ☐ |
| `message` | long text | ☐ |
| `source` | text | ☐ |
| `page` | text | ☐ |
| `utm_source` / `utm_medium` / `utm_campaign` | text ×3 | ☐ |
| — | date (creation) | ☐ |

### Test — two submissions, evidence required

```bash
curl -X POST "$PUBLIC_LEAD_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d '{"name":"בדיקה 1","phone":"050-0000001","email":"t1@example.com","office":"משרד בדיקה","role":"advisor","message":"בדיקה","source":"website-contact","page":"/contact/","utm_source":"","utm_medium":"","utm_campaign":""}'
```

| Evidence | Value |
| --- | --- |
| monday item ID #1 | _[TBD]_ |
| monday item ID #2 | _[TBD]_ |
| Make run log green | ☐ |
| Confirmation email received | ☐ |

## Domain and DNS

| Field | Value |
| --- | --- |
| Domain | plan-t.co.il (owned by Plan-T since May 2026, valid to 26.05.2028) |
| Registrar | DomainTheNet — panel section `תוינפהו תומושר לוהינ` |
| Nameservers | ns1–3.dtnt.info — **do not change** |
| Who added the records | _[TBD — Natali with panel access, or the domain manager]_ |
| Date added | _[TBD]_ |
| Host | Cloudflare Pages, project `plant-marketing-site` |

### Records added (copy exactly what Cloudflare asks for)

| Type | Name | Value | Added |
| --- | --- | --- | --- |
| _[TBD]_ | `@` | _[TBD]_ | ☐ |
| CNAME | `www` | _[TBD]_ | ☐ |

Do not touch MX or any other existing record.

| Verification | Done |
| --- | --- |
| `https://plan-t.co.il` loads with a padlock | ☐ |
| `https://www.plan-t.co.il` redirects to the root | ☐ |
| Form submitted once from the live domain → monday item | ☐ |

## Analytics

| Field | Value |
| --- | --- |
| Tool | _[TBD — ambiguity #5: GA4 (company Google) or Plausible]_ |
| Property / site ID | _[TBD]_ |
| Snippet location | `src/layouts/BaseLayout.astro`, marked with a comment in `<head>` |
| One page view tested | ☐ |

## Approvers

| Role | Name | Approved on |
| --- | --- | --- |
| Design | _[TBD — ambiguity #4]_ | _[TBD]_ |
| Copy | _[TBD — ambiguity #4]_ | _[TBD]_ |
| Legal (privacy policy) | _[TBD — ambiguity #7]_ | _[TBD]_ |
