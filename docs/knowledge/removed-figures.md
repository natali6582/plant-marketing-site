# Figures removed from the knowledge hub

Nothing is deleted quietly. An entry that leaves `src/data/figures.yaml` is
copied here in full, with the reason and the evidence, so it can be restored
verbatim if the number turns out to be right after all.

Restoring means pasting the block back into `src/data/figures.yaml` under its
group and re-adding the id to any article that should cite it.

## pension-general-salary-ceiling — removed 06/09/2026

**Reason: the number fails its own arithmetic.** The source table pairs
41,307 ₪ with "3× the average wage" and 55,706 ₪ with "4×". But
4 × 13,769 = **55,076**, not 55,706 — the last two digits are transposed.

Beyond the transposition, a 3×/4× cap on insured salary in a קרן פנסיה כללית
is a fund-bylaw figure that varies between funds, not a regulatory ceiling, so
there is no single national number for this label to carry.

Evidence: the 2026 Harel table the figure came from —
<https://media.harel-group.co.il/media/eh3fyryd/>

```yaml
pension-general-salary-ceiling:
  value: 55706
  unit: "₪"
  year: 2026
  label: שכר קובע חודשי מרבי בקרן פנסיה כללית
  note: קרן פנסיה כללית קולטת הפקדות מעל התקרה של המקיפה, וללא הבטחת תשואה.
  group: pension
  source: { label: "רשות שוק ההון, ביטוח וחיסכון — gov.il", url: "", tier: 0 }
```

Also removed: the `{{keyfigures:pension-general-salary-ceiling}}` block and the
matching `figures:` entry in `src/content/knowledge/pension-fund.md`. The
sentence above it already carried no number and reads correctly without it.

## maof-contract-multiplier — removed 06/09/2026

**Reason: unresolvable from available sources, which conflict.** The TASE
planned to cut the ת״א-35 derivatives multiplier from 100 to 50 across
2022–2023 and announced derivatives-market changes in March 2024, yet a guide
from August 2026 still states 100. Only the TASE contract specification settles
it, and that page is rendered client-side, so it cannot be read headlessly.

Evidence, the three conflicting reports:

- TheMarker, 2022-12-05 — the planned cut from 100 to 50
- Calcalist, 2024-03-06 — the announced derivatives-market changes
- Bizportal, 2026-08-12 — a guide still stating 100

```yaml
maof-contract-multiplier:
  value: 50
  unit: "₪"
  year: 2026
  label: מכפיל גודל החוזה בנגזרי מדד ת״א-35
  # tase.co.il renders its specification pages client-side; curl returns the
  # shell and no figure. Verifying this needs the page opened in a browser, or
  # the TASE contract-specification PDF.
  note: גודל חוזה = המדד בנקודות כפול המכפיל. טרם אומת — עמוד המפרט בבורסה מרונדר בצד הלקוח.
  group: securities
  source: { label: "הבורסה לניירות ערך בתל אביב — tase.co.il, טרם נמשך", url: "", tier: 0 }
```

No article cited this figure, so no prose changed. If the specification page is
opened in a browser and confirms a value, restore the block with the TASE URL
and tier 1.
