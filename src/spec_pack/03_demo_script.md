# 03 — Demo Script & Cue Map

Every string the audience reads or the presenter triggers, verbatim. UI implementers: copy exactly, including punctuation. Presenter talk track (spoken lines) is in the demo flow doc and is NOT built into the UI. `[CUE n]` = advance-key beats in order within each scene. `[CLICK]` = a deliberate presenter mouse action, called out because timing depends on it.

Conventions: the agent's product name in UI is **Privacy Agent** (admin side) and unnamed on the consumer side (it speaks as the brand). Admin persona: **Amara Osei, Privacy Program Lead**. Warehouse owner: **Daniel Okafor, Data Platform Engineering**. Requester: **Marcus Bell**.

---

## Act 1 — Agent Setup (/setup)

**[CUE 1] Agent greeting + profile card**

> Agent: Welcome, Amara. Before we set anything up, I researched Meridian Brands. Here's what I found — confirm or correct anything.

Profile card rows:
- Brands: Northwind Outfitters · Cascade Home · Alpine Rewards
- Privacy regulations in scope: CCPA/CPRA (California) · VCDPA (Virginia) · CPA (Colorado) · GDPR (Germany)
- Customer countries: United States · Germany · Austria
- Employees: United States · Germany

**[CLICK] Amara removes "Austria"** (row edit → remove)

> Agent: Got it — removing Austria. That takes Austrian consumer obligations out of scope. Everything else confirmed.

**[CUE 2] Document request**

> Agent: Next: the documents that describe how Meridian actually works. A DSAR procedure, retention policies, data flow diagrams, past response letters, brand guidelines — anything you'd hand a new privacy hire, hand to me.

**[CUE 3] Uploads appear** (four chips): `DSAR Standard Operating Procedure.pdf` · `Customer Data Flows.pdf` · `Response Letter Examples.docx` · `Meridian Brand + Tone Guide.pdf`

**[CUE 4] Decomposed playbook card**

> Agent: I've read them. Here's your operating playbook as I understand it — this is the context I'll follow on every request.

Playbook card (three columns; source tag on each entry):
- **Process rules** — "Access packages containing support transcripts: redact third-party personal information; privacy sign-off required before disclosure" `SOP §4.2` · "Identity verification required before any data handling" `SOP §2.1` · "Deletion holds: accounts with open disputes route to Legal" `SOP §5.3`
- **Data landscape** — "Customer records: Salesforce" · "Marketing profiles: Marketo" · "Support tickets + transcripts: Zendesk" · "Transactions + Alpine Rewards balances: internal warehouse (owner: Daniel Okafor)" — all tagged `Customer Data Flows`
- **Voice & brand** — "Plain, warm, direct; short sentences; no legalese in body text" `Brand + Tone Guide` · "Loyalty program is always 'Alpine Rewards'" `Brand + Tone Guide` · "Response letters follow the Meridian letter structure" `Response Letter Examples`

**[CUE 5] Intake agent proposal**

> Agent: Based on your brands and jurisdictions, I suggest four branded intake agents — structured request experiences that can also answer requesters' questions. One per consumer brand, one for employees.

Tiles: `Northwind Outfitters` · `Cascade Home` · `Alpine Rewards` · `Meridian Employees` — each: "Request types: Access · Deletion · Correction · Opt-Out" + jurisdiction chips. **[CLICK]** Amara opens the Northwind preview. Approve button label: `Approve all four`.

**[CUE 6] Systems & integrations**

> Agent: To fulfill requests I'll work in your systems. Your data map and your data flow diagram agree on four: Salesforce, Marketo, Zendesk, and your internal warehouse. I have pre-built integrations for the first three. I need two things only you know: your Salesforce instance URL and an API credential.

Amara's reply (appears as her message): `meridian.my.salesforce.com — credential added to the vault.`

Provisioning rows animate: `Salesforce — Connected` → `Marketo — Connected` → `Zendesk — Connected` (staggered; each shows a one-line config note, e.g. "Configured from template v3.2 for meridian.my.salesforce.com"). Warehouse row: `Internal warehouse — No integration · Tasks will route to Daniel Okafor (Data Platform) in Microsoft Teams, tracked in your ITSM.`

**[CUE 7] Handoff to flow chart**

> Agent: That's everything I need. Here's the process I'll follow for every request — review it, and change anything you'd like.

→ transitions to /setup/flow. `[CLICK]` Amara zooms the **Access** lane. "Suggest a change" affordance text: `Tell me what to change about this process…`

---

## Act 2 — Northwind intake agent (/intake)

Header: Northwind Outfitters wordmark. Title: `Your data, your call.` Subtitle: `Ask us for a copy of your data, or ask us to delete it. We'll handle the rest.` Steps: `Identify → Request → Confirm`.

**[CUE 1]** (fallback autofill) Identity: `Marcus Bell` · `marcus.bell@—mail.com` · `California, United States` · Customer of: `Northwind Outfitters` (+ Alpine Rewards member badge auto-noted)

**[CLICK] Marcus selects request type card `Delete my data`** (cards: `See my data` · `Delete my data` · `Fix my data` · `Stop marketing to me` — each with a one-line plain description)

**[CUE 2] Assistant exchange** (in the docked assistant strip):

> Marcus: If I delete my account, do I lose my loyalty points?

> Agent: Yes — deleting your account permanently forfeits your Alpine Rewards balance (currently 12,480 points), and we can't restore it later. If you'd like to see everything we have about you first — including your points history — you can request a copy of your data instead, and decide about deletion after.
> `[ Switch to "See my data" ]` ← inline action chip

**[CLICK] Marcus taps the chip.** Confirmation microcopy under the request card: `Changed to: See my data. You can request deletion any time after.`

**[CUE 3] California adaptation + submit.** "Why we ask" note: `Because you're a California resident, your report will include the categories of information we collect, where it comes from, why we use it, and who we share it with — along with the data itself. (CCPA/CPRA)` **[CLICK] Submit.** Confirmation screen: `Request received.` / `Your request number is AR-4207. We've emailed a confirmation to m•••@—mail.com. Most access requests are completed well within the 45-day requirement — we'll keep you posted.`

---

## Act 3 — Request AR-4207 (/requests/4207)

Header: `Marcus Bell · Access request · California, US (CCPA/CPRA) · Received Jul 8 · 41 days remaining` · status pill `Agent fulfilling`.

**[CUE 1] Plan appears** (staggered): see fixtures §marcus.plan for the six items + chips.

**[CUE 2–4] Reasoning panel sections open in order** — "How I planned this request":

- **Classification** — `Access request · Consumer · California resident → CCPA/CPRA governs` · `Verified: Marcus is an active Northwind customer and Alpine Rewards member` chips: `CCPA/CPRA` `Intake AR-4207`
- **Obligations** — `Verify identity before disclosure` `CCPA §1798.130` · `Respond within 45 days (one 45-day extension available)` `CCPA §1798.130` · `Disclose: categories, sources, purposes, third parties, and specific pieces of personal information` `CCPA §1798.110`
- **Your context** — `Marcus's data lives in: Salesforce, Marketo, Zendesk, internal warehouse` `Customer Data Flows` · `Support transcripts require third-party redaction with privacy sign-off before disclosure` `SOP §4.2` · `Response follows Meridian letter structure, plain and warm, in the requester's language` `Brand + Tone Guide`

**[CUE 5] Fast-forward.** Items 1–3 → `Done` with timestamps; item 4 → `Done · Redaction summary ready` ; item 5 → `Awaiting human · In progress with Daniel Okafor` (this state opens the door to the split screen).

### Split screen (/requests/4207/subtask)

Left (OneTrust): subtask card `Warehouse extract — transactions + Alpine Rewards history` · assignee `Daniel Okafor · Data Platform Engineering` · linked ticket chip `SNOW-88412 · Open` · status `In progress`.

Right (Teams thread, "Meridian Privacy Agent → Daniel Okafor"):

**[CUE 1]**
> Agent: Hi Daniel — I'm fulfilling privacy request AR-4207 (access request, CCPA). I need Marcus Bell's records from the warehouse: tables `txn_orders`, `txn_refunds`, and `loyalty_ledger`, filtered to customer_id `C-102-448-871`, full history. Return as CSV here and I'll take it from there. Ticket SNOW-88412 is tracking this — I'll keep it updated so you don't have to.

**[CUE 2]**
> Daniel: does loyalty_ledger include the points expiry rows or do you need those separately from loyalty_expiry?

**[CUE 3]**
> Agent: Good catch — include `loyalty_expiry` too. Marcus specifically cares about his points, so expiry history is in scope for "specific pieces of personal information."

**[CUE 4]**
> Daniel: `AR-4207_warehouse_extract.csv` 〔file chip〕 done ✔

**[CUE 5] The sync** (staggered, in order): Teams shows agent's `Thanks — verified 214 rows, all four tables. You're done.` → OneTrust subtask flips `Complete · Jul 10, 2:14 PM` → ServiceNow strip flips `SNOW-88412 · Resolved` + work note `Extract delivered via Teams; verified by Privacy Agent. Auto-resolved.`

### Redaction summary (/requests/4207/redaction)

Header: `Redaction complete — awaiting your sign-off` · context: `Source: 6 Zendesk support transcripts (2019–2026) included in the access package. I redacted other people's personal information per SOP §4.2. Review my work below.`

Findings table (fixtures §marcus.redaction): `Support agent names & email signatures — 14 instances — High confidence` · `Another customer's name + order details (shared purchase, Dec 2023) — 3 instances — High confidence` · `Internal account identifiers — 7 instances — Medium confidence` + note on the Medium row: `Some identifier formats were ambiguous between internal IDs and order references — I redacted all candidates. Worth a spot-check.`

**[CLICK]** reviewer opens the Medium row → excerpt viewer (redacted bars inline; one excerpt per fixtures). **[CLICK]** `Approve & sign off` (primary) — logs `Privacy sign-off · Amara Osei · Jul 10, 2:31 PM` to the activity trail. Secondary: `Return to agent with note`.

**[CUE — final] Report ready card:** `Access report for Marcus Bell` · `English (US) · 9 pages · Generated to Meridian brand + tone guide · All six sources included · Redactions applied` · button `Open report` → PDF (see 05).

---

## Act 4 — Dashboard (/dashboard)

Timeframe control: `Today · Since yesterday · 7 days · 30 days` (default: Since yesterday). All values from fixtures §history — the hero read at "Since yesterday": `47 received` · `39 fulfilled end-to-end by agent ▲ (30-day view shows the climb from 31/day avg)` · `Median time to fulfill: 2.1 days ▼ 61% vs prior 30 days` · `8 awaiting human`.

Needs-attention items (8; the two scripted, verbatim):

1. `Identity match — low confidence` / `Request AR-4198 · I found two candidate records for "J. Whitfield" in Salesforce — same email, different addresses. I paused before disclosure. Review the match.` → **[CLICK]** `Review match` → compare card → `Approve match` → resolve note: `Approved · Agent resumed fulfillment.`
2. `Stalled — deadline risk` / `Request AR-4211 · Warehouse extract open 6 days; deadline in 9. I've reminded Daniel Okafor twice in Teams. Recommend escalating to his manager.` → **[CLICK]** `Escalate` → resolve note: `Escalated to R. Vance (Eng Manager) · Ticket SNOW-88419 updated.`

If asked "what happens below a confidence threshold?" (Q&A, not UI): low confidence never blocks silently — it routes here, with the reason attached.

---

## Presenter cue map (rehearsal card)

| Key | Lands on |
|---|---|
| 1 | Act 1 · /setup, beat 0 |
| 2 | Act 2 · /intake, beat 0 |
| 3 | Act 3 · /requests/4207, beat 0 |
| 4 | Act 4 · /dashboard |
| 5 | PDF report |
| 6 | Holding screen (Meridian wordmark on cream) |
| → / Space | Next beat · ← previous beat · Esc presenter overlay |

Beat counts (build must match): Act 1 = 7 cues + 3 clicks · Act 2 = 3 cues + 4 clicks · Act 3 = 6 cues (detail) + 5 cues (split) + 3 clicks (redaction) + 1 cue (report) · Act 4 = 0 cues + 4 clicks.
