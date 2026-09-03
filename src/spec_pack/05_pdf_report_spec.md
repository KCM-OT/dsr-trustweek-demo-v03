# 05 — Meridian Access Report (PDF) Spec

The artifact Marcus Bell receives. Generated as a **real PDF** bundled with the demo app (9 pages, US Letter). This is the most-scrutinized single asset in the demo — it will be projected, zoomed, and possibly printed and left on chairs. Budget real design care.

**Brand:** Meridian corporate system per `02` §2 — navy `#14304A`, copper `#C56A2D`, cream `#FAF6F0`, Meridian heading face, generous margins (0.9in), footer on every page: thin copper rule, "Meridian Brands · Privacy Report AR-4207 · Page N of 9", and the meridian-line wordmark small at left. Voice: plain, warm, direct (per the tone guide fixture). No legalese in body text; legal precision lives in the labeled disclosure tables.

**Redaction rendering:** true black bars with a tiny "REDACTED" microlabel — crisp rectangles, not gray boxes. Redactions appear only in the transcript appendix and are the visual proof of the Act 3 redaction story.

---

## Page-by-page

**Page 1 — Cover.** Cream field. Meridian wordmark. Title: `Your personal data report`. For: `Marcus Bell`. Meta block: `Request AR-4207 · Requested July 8, 2026 · Prepared July 10, 2026 · Covers: Northwind Outfitters, Cascade Home, Alpine Rewards`. One copper meridian line. Nothing else.

**Page 2 — A letter, not a form.** Heading: `Here's everything we have.`
Body (verbatim):
> Hi Marcus,
>
> On July 8 you asked to see the personal data Meridian holds about you. This report is our complete answer. It covers all three of our brands, every system where your data lives, and your full history with us — including your Alpine Rewards points, since we know that's what prompted your question.
>
> A quick guide to what follows: pages 3–4 summarize what we collect and why, as California law asks us to lay out. Pages 5–8 are your actual data. Page 9 explains your options from here — including deletion, if you still want it after reading.
>
> One note on privacy that isn't yours: a few of your support conversations mentioned other people — our agents, and in one case another customer from a shared purchase. We've blacked out their details, for the same reason we'd black out yours in someone else's report.
>
> If anything here looks wrong, page 9 tells you how to fix it.
>
> — The Meridian Privacy Team

**Pages 3–4 — What we collect and why (CCPA/CPRA disclosures).** Four clean tables, navy header rows: Categories of personal information collected (identifiers, commercial information, internet activity, geolocation-coarse, inferences) with plain-language examples; Sources (you directly, your devices, our stores, Alpine Rewards partners); Purposes (fulfill orders, run Alpine Rewards, support, marketing with consent, fraud prevention); Third parties we share with (payment processors, delivery carriers, analytics provider — named generically, e.g. "our payment processor"). Each table row ends with a small copper "where this appears in your data →" page reference.

**Page 5 — Your profile & accounts.** Salesforce-sourced: contact record (22 fields, two-column layout), account status, brand relationships, consent states. Source tag line at section top: `Source: customer records (Salesforce) · retrieved July 9, 2026`.

**Page 6 — Your Alpine Rewards history.** The page Marcus actually cares about — give it hierarchy: current balance `12,480 points` large; member since `March 14, 2019`; a compact earned/redeemed/expired summary table by year (fixture-plausible numbers summing to 12,480); the expiry schedule (next expiry: `2,140 points on Dec 31, 2026`). Source: internal warehouse extract.

**Page 7 — Your orders & transactions.** Summary table: 28 orders 2019–2026 across Northwind + Cascade, columns: date, brand, order #, total, points earned. Truncate elegantly: first 14 rows + `…and 14 earlier orders, included in the attached data file.`

**Page 8 — Your marketing profile & support history.** Marketo: subscription states, interest segments in plain language (`Hiking & trail · Home textiles`), engagement summary (`340 email events since 2019`). Zendesk: table of the 6 support conversations (date, topic, resolution) + **one transcript excerpt with visible redactions** (use the fixture excerpt: the ████ account identifier + ████ agent signature). Caption: `Names and details belonging to other people are redacted. 24 redactions were made across your transcripts and reviewed by our privacy team.`

**Page 9 — What you can do next.** Three plain option blocks: `Delete your data` (honest note: forfeits the 12,480 points, permanent), `Fix something` (correction request path), `Ask us anything` (privacy contact). Closing line: `This report was prepared with automated assistance and reviewed by the Meridian privacy team. Reference AR-4207.`

---

## Production notes

- Build with a real layout tool or HTML→PDF pipeline with print CSS — whatever the build session prefers — but the output committed to the repo is a static `AR-4207_access_report.pdf`.
- Typography: headings in the Meridian face, body 10.5–11pt, tables 9.5pt, tabular figures.
- The Spanish-language talk-track line ("if Marcus had submitted in Spanish…") needs no second PDF — do not build one unless time is abundant; if it is, translate pages 1–2 only as `AR-4207_es.pdf` for a flash moment.
- Every number must reconcile with `04_data_fixtures.json` (points balance, order counts, redaction counts, dates). The audience will not check; the presenter's confidence depends on it anyway.
