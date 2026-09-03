# Agentic DSAR — TrustWeek Demo Flow & Prototype Spec

**Format:** 10-minute demo, full arc (setup → intake → fulfillment → oversight)
**Fidelity:** Mixed — real product surfaces where they exist today, staged/scripted where the agentic layer doesn't exist yet
**Working title for the narrative:** *"Day zero. Day one. Every day after."*

---

## The narrative spine

The demo tells one continuous story about one fictional company across three moments in time. The through-line the audience should walk away with: **you never configured a workflow, and yet every request got fulfilled — consistently, compliantly, and with a full audit trail.**

The story deliberately mirrors how the product feels today at each moment, so every scene lands as a before/after without you ever showing the "before" on screen. You narrate the before; you show the after.

**Demo cast and data:**

- **Company:** a fictional multi-brand consumer company (e.g., "Meridian Brands" — 3 consumer brands, operating in the US and EU, customers in California, Virginia, Colorado, and Germany). Multi-brand and multi-jurisdiction matters because it's what makes today's configuration painful — that's the setup for every payoff.
- **Data subject:** Marcus Bell, a California consumer. He arrives intending to delete his account, learns from the intake agent that deletion forfeits his loyalty points, and pivots to an access request to see his data first. (The pivot is a deliberate story beat: the intake agent produces a better outcome for both Marcus and Meridian.)
- **Customer documents:** a DSAR standard operating procedure (PDF), a data flow diagram for Meridian's customer data, example response letters, and Meridian's brand guidelines + comms tone-of-voice guide. These get uploaded in Act 1 and cited by the agent in Acts 2 and 3 — because in practice, the customer's internal process and tech landscape drive most of the fulfillment "how"; regulations set the obligations.
- **The Meridian brand:** we need to invent it — name/logo/color palette/typography for the fictional company — because the branded intake agents (Act 1), the intake experience (Act 2), and the generated PDF report (Act 3) all wear it. A small but load-bearing design asset; build it once, early.
- **Systems landscape:** 4–5 recognizable systems in the data map — e.g., Salesforce, Marketo, Zendesk, an internal data warehouse. At least one system deliberately has *no* integration available, so the agent has to route a user subtask to the asset owner. That gap is a feature of the story, not a bug — it shows the agent handles the real world, not just the happy path.
- **Pre-seeded history:** ~100 requests processed "overnight" so the oversight scene has real-looking volume and distribution.

---

## Timing budget

| Scene | Time | What's on screen |
|---|---|---|
| Cold open: the problem | 1:00 | One slide, no product |
| Act 1 — Day zero (setup agents) | 2:15 | Setup agent conversation + generated artifacts |
| Act 2 — Intake (the branded intake agent) | 1:00 | Marcus asks a question, changes his mind, submits |
| Act 3 — Day one (fulfillment agent) | 3:30 | Request detail: agent plan, execution, show-its-work |
| Act 4 — Every day after (the oversight experience) | 1:45 | Request queue + morning digest + needs-attention |
| Close: the trust message | 0:30 | Back to one slide |

Total: 10:00. If you run long, Act 1 is the accordion — it compresses to 90 seconds without losing the story. Act 3 never gets cut.

---

## Cold open — the problem (1:00, slide only)

Don't open in the product. Open with the pain, in the audience's own words:

> "Think about how much time your team has spent in OneTrust *configuring* versus *fulfilling*. Web form rules. Workflow logic for every jurisdiction, every request type, every subject type. Integration setup. And then a regulation changes, and you do it again. Meanwhile, the number one thing you tell us you want isn't another configuration screen — it's visibility. Where are my requests stuck, and what needs me today?"

Then the thesis, stated once and paid off three times:

> "If we were building DSAR for the first time today, with agents available to us, we would not build workflows. So we didn't. Let me show you what we built instead."

**Build requirement:** one slide. Optionally a second slide with the architecture diagram as a 10-second orientation ("agents in the middle, your knowledge grounding them below, your familiar queue and dashboards on top") — then you never show it again.

---

## Act 1 — Day zero: setup agents (2:15)

**Scene:** Brand-new tenant, first login to Privacy Rights Automation. Instead of an empty module and a setup checklist, the admin is greeted by the setup agent.

**Beat 1 — The company profile (staged, ~40s).** The agent has already researched Meridian Brands (this is the Athena company profile concept, extended):

> "I researched your company. You operate three consumer brands. Based on where you do business, you're in scope for CCPA/CPRA, VCDPA, CPA, and GDPR. I think you have customers in these countries. Does this look right?"

Admin confirms with one click, corrects one detail (e.g., removes a country) to show it's collaborative, not a black box.

**Beat 2 — Your process becomes the agent's playbook (staged, ~30s).** The agent asks for the documents that actually describe how this company handles data and speaks to its customers: "Do you have a DSAR procedure, retention policies, or data flow diagrams? Upload them and I'll use them." Admin drags in the SOP PDF, the data flow diagram, a couple of example response letters, and Meridian's brand guidelines and comms tone-of-voice guide; the agent decomposes them into an operational playbook it shows back — approval steps from the SOP, which systems hold customer data from the diagram, and how communications should look and sound from the brand and tone documents. **Key line:** *"Regulations tell the agent what you owe the data subject. Your documents tell it how your organization actually works — and that's what drives most of fulfillment. Configuration stops being screens and rules; it becomes handing the agent your context."*

**Beat 3 — Branded intake agents (staged, ~40s).** The agent proposes: "I suggest four branded intake agents — one per brand plus one for employees — each configured with the request types, subject types, and fields required by your jurisdictions, grounded in DataGuidance regulatory content, and styled to your brand guidelines." These are the successor to web forms: still structured within the UX — fields and options where structure is right — but able to answer the requester's questions (Act 2 shows this live). Admin previews one, approves. **Key line:** *"Notice what didn't happen: nobody built form rules to route these to workflows. There are no workflows."*

**Beat 4 — Systems and integrations (staged chat over real screens, ~40s).** The agent asks about systems — cross-referencing the data map and the uploaded data flow diagram: "Your data map and your diagram both show Salesforce, Marketo, Zendesk, and an internal warehouse. I have pre-built integration templates for the first three. I need two things from you: your Salesforce instance URL and an API credential." Admin pastes them into the conversation. Behind the scenes the integration is provisioned from OneTrust's template library — the admin never sees the integration builder.

> "The integration builder still exists. It's just not your job anymore. We maintain a library of pre-built integrations; the agent configures them for your instance, and all it needs from you is what only you know — your URL, your credential."

For the warehouse: "There's no integration for your internal warehouse — so when a request touches it, I'll route a task to the asset owner from your data map." (This plants the seed that pays off in Act 3.)

**Build requirements:**
- Setup agent conversational UI (new surface — staged/scripted responses are fine; the conversation should be on rails)
- Company profile summary card (staged data)
- Document upload + "decomposed playbook" review card — the moment where the agent reflects the SOP and data flow diagram back as structured, editable operational context (new surface, staged decomposition)
- Intake agent preview — **real base**: back the branded intake agent with an actual working web form in the tenant, because Act 2 depends on it and form creation exists in the product today (build it ahead of time; the "generation" moment and the assistive layer are staged; the "intake agent" framing is presentation-layer)
- Integration provisioning "in the background" — staged progress/confirmation UI; the underlying connection can be a real sandbox connection configured ahead of time if credentials for one system are obtainable, otherwise mocked (see Risks)
- **Generated workflow visualization (new):** all of this configuration should culminate in an in-product flow chart that visualizes the process the agent will follow — n8n-style: nodes for intake → classification → per-system actions → review gates → response, with branches. This is the admin's "here's what will happen" artifact: reviewable, and the place to suggest changes before anything runs. It's also the capstone review moment that closes Act 1. (Note only — do not build yet.) **Design decision made:** one unified chart, with the request-type split (Access / Deletion / Opt-Out / Correction / etc.) as the first branch after intake, and an easy zoom/focus interaction to isolate the branch you care about — the full map for orientation, the zoomed branch for review.

---

## Act 2 — Intake: the branded intake agent (1:00)

**Scene:** Cut to the consumer's view. Marcus Bell opens Meridian's intake agent — fully in Meridian's branding. It still has the *structure* of a form — fields, selectable options, the patterns that work for structured input — but it's conversationally capable. The scripted sequence:

1. Marcus selects **deletion** as his request type, then hesitates and asks inline: *"If I delete my account, do I lose my loyalty points?"*
2. The intake agent answers honestly, grounded in Meridian's own policy from the ingested documents: *"Yes — deleting your account permanently forfeits your loyalty balance. If you'd like to see what data Meridian holds about you before deciding, you can submit an access request instead."*
3. Marcus changes his mind and submits an **access request** — he wants to see his data before deciding on deletion.
4. Along the way, the experience adapted: because Marcus identified as a California consumer, it surfaced exactly the fields and disclosures CCPA/CPRA requires — nothing else.

> "We didn't turn intake into an open-ended chatbot — nobody wants to negotiate with a text box to submit a request. Structure is still the right pattern where structure works. But watch what just happened: the old web form would have silently accepted a deletion Marcus would regret. The intake agent answered his question, and he made a better decision — better for Marcus, better for Meridian, and one less angry support ticket. That's the difference between a form and an agent with the structure of a form."

**Build requirements:** the real published form from Act 1 as the base, skinned in Meridian branding, plus the assistive/conversational layer (staged — the loyalty-points exchange and the request-type switch, on rails). Submission flows into the real request queue. Skip email verification live; say "Marcus verified his email" and cut.

---

## Act 3 — Day one: the fulfillment agent (3:30) — the money shot

**Scene:** Back in the admin view. Marcus's request is in the queue. Open the request detail. Where the workflow diagram used to be, there's the **agent's plan** — generated for this specific request.

**Beat 1 — Classification and grounding (~60s).** The agent shows its reasoning, visibly and legibly — and critically, it cites *two* sources:

- Classified: access request, consumer, California → CCPA/CPRA applies
- Obligations derived (grounded in DataGuidance): verify identity, 45-day deadline with extension conditions, disclosure scope — categories collected, sources, purposes, third parties shared with, and the specific pieces of personal information
- Execution plan derived from *Meridian's own context*: the uploaded data flow diagram says customer records live in Salesforce, Marketo, Zendesk, and the warehouse; the uploaded SOP says access packages containing support ticket transcripts require redaction of other people's personal information (agent names, other customers on shared orders) with privacy sign-off before disclosure — so the agent plans to perform the redaction itself and route its work to the privacy reviewer
- **Key line:** *"The regulation tells the agent what Marcus is owed. Your data flow diagram tells it where Marcus's data actually lives, and your SOP tells it how your team wants this handled — including that redactions get privacy sign-off before anything goes out the door. Today, all of that knowledge lives in someone's head and a rule tree they maintain by hand. Here, it's context the agent reasons over — and when your process or a regulation changes, you update a document, not a workflow."*

**Beat 2 — The dynamic plan (~60s).** The agent composed a plan *for this request* from the curated subtask library:

1. Identity verification (system subtask)
2. Retrieve Marcus's records from Salesforce (system subtask — integration from Act 1)
3. Retrieve marketing profile and engagement history from Marketo (system subtask)
4. Retrieve support tickets and transcripts from Zendesk (system subtask) → **redact** third-party personal information and produce a redaction summary for privacy sign-off, per the SOP
5. Query the internal warehouse for Marcus's transaction and loyalty data → **agentic user subtask**: the agent opens a Teams conversation with the asset owner from the data map, opens a linked ServiceNow ticket, and guides them through exactly what to query and how to return it (the Act 1 seed pays off — see Beat 3)
6. Compile the disclosure and generate Marcus's branded access report — governed by Meridian's instructions, example letters, and brand guidelines

**Anticipate the consistency objection before anyone asks it** — this audience is privacy professionals:

> "The agent isn't inventing tasks or free-writing whatever it wants. It selects actions from a curated subtask library, and its responses are governed by your own instructions, your example letters, your brand guardrails, and your approval gates. Two identical requests get equivalent treatment. You get the judgment of an agent with the consistency of a workflow — without maintaining the workflow, or twelve translations of a response template."

**Beat 3 — Execution, the human in the loop, and the response (~90s).** Advance time ("let's fast-forward two days"). System subtasks show completed with logs. Then the two showpiece moments:

*The agentic user subtask — split screen.* Present this as a split-screen view: OneTrust on one side showing the agent's actions and subtask state, and on the other side the warehouse owner's world — a Teams thread where the agent has already told them exactly which tables to query for Marcus's transaction and loyalty records, answered a clarifying question, and received the extract. As the owner confirms in Teams, the audience watches the OneTrust subtask complete *and* the linked ServiceNow ticket resolve in real time on the same screen — because IT lives in their ITSM, not in a privacy tool. **Key line:** *"Today, a user subtask is an email into the void and a nagging reminder. Now it's a guided conversation in the tool that person already lives in, with the paper trail kept in both systems automatically."*

*The generated report and the redaction review.* The agent compiles everything — CRM records, marketing profile, redacted support transcripts, warehouse data — into a **polished, Meridian-branded PDF access report**: the company's logo, colors, and voice; a plain-language summary up front; organized sections per CCPA/CPRA disclosure categories; in Marcus's language. Show the actual PDF, and let it linger — this is the artifact the data subject receives, and it should look like something a brand would be proud to send. Note on stage: *"If Marcus had submitted in Spanish, this report comes back in Spanish. Nobody maintained a translation catalog, and nobody shoved his data into a generic table template. Your brand guidelines, your example letters, your instructions — the agent generated this to your spec."*

The report sits at the privacy sign-off gate — but the redaction work is already done. What the reviewer sees is the **redaction summary**: what types of other people's data the agent found in the transcripts and redacted — e.g., support agent names and email signatures (14 instances), another customer's name and order details from a shared purchase (3 instances), internal account identifiers (7 instances) — each with a confidence level reflecting how thoroughly the agent was able to review that category, and each linked to the redacted excerpts for spot-checking. The reviewer scans the summary, spot-checks one low-confidence item, approves. **Key line:** *"Today, redaction means someone opening a redaction tool and manually reviewing every transcript line by line. Here, the agent did the redaction and shows you exactly what it found, how much of it, and how confident it is. Your reviewer's job went from doing the work to verifying it — and the confidence levels tell them where to look."*

Open the **agent activity trail**: every decision, every action, every message to the warehouse owner, every redaction, timestamped, with reasoning and grounding attached.

**Build requirements:**
- Request detail view with agent plan replacing the workflow visualization (new surface — highest-value build)
- Reasoning/grounding panel citing both regulations and the customer's own documents (staged content, but the design should look like a real audit artifact, not a chat bubble)
- Subtask execution states — **mix**: reuse real subtask components and statuses from today's product wherever possible; the Salesforce integration can be real against a sandbox if obtainable, others simulated
- **Split-screen demo view (decision made):** mock realistic Teams and ServiceNow UIs — no real instances needed. Build a presentation layout that shows OneTrust beside the Teams thread / ServiceNow ticket, with scripted state changes choreographed across both sides (owner confirms in Teams → OneTrust subtask completes → ServiceNow ticket resolves). The choreography timing is part of the build, not just the screens.
- **Meridian-branded PDF access report (note — build later):** requires the Meridian brand asset (logo, palette, typography) plus a genuinely polished report design — plain-language summary, CCPA/CPRA disclosure sections, redaction marks visible on transcript excerpts (redactions make the privacy-review story tangible). This artifact will be scrutinized up close; budget real design time.
- **Redaction summary panel (note — build later):** the reviewer's surface for the agent's redaction work — data element types found, instance counts per type, confidence level per category, links into the redacted transcript excerpts for spot-checking, one-click approve. Design note: this doubles as the concept preview for reimagining today's redaction tool as an agentic capability — worth treating as a first-class surface, not a modal.
- Approval/sign-off interaction wired to the redaction summary (staged)
- Agent activity trail / audit log view (new surface, staged data)

---

## Act 4 — Every day after: the oversight experience (1:45)

**A framing discipline for the whole team:** this is *not* a third agent, and we shouldn't present it as one. The digest is summarized from the fulfillment agent's audit trail; stall and deadline detection are deterministic monitoring rules; the only agentic sliver is the prioritization of what needs a human. Presenting it as "the app is the artifact sitting on top of the agent" is both more honest and more reassuring — it's a window into the one agent you supervise, not another autonomous thing to trust. If someone in the audience asks "so is that another agent?", the answer is a confident no.

**Scene:** "Now imagine it's a month later." Cut to the reimagined request queue page — which is now two distinct pieces:

**Piece 1 — The program dashboard (top of the queue).** The "since yesterday" story lives in a new dashboard that sits at the top of the queue page — not a card, a first-class surface. It has a timeframe filter (today / since yesterday / 7 days / 30 days) and the values recompute per timeframe. Critically, it shows **change over time**, not just snapshots: requests received and fulfilled end-to-end (with trend deltas vs. the prior period), distribution by request type and jurisdiction, average time-to-fulfill trending down, agent-vs-human resolution mix trending toward the agent. The request list itself sits below and occupies **much less screen real estate than today** — a deliberate design statement: when the agent handles the happy path, the queue stops being where you live.

> "Since yesterday: 47 new requests, 39 fulfilled end-to-end — that's up from 31 a month ago as the agent learned your systems. Time-to-fulfill is down 60%. And notice what's shrunk: the queue. You don't manage a list anymore."

**Piece 2 — Needs-attention (a separate, dynamic agentic task list).** Distinct from the dashboard: a living work list of the things the agent needs a human for, each with the reason attached. Show two flavors:
1. **Low confidence:** "I couldn't confidently match this requester across systems — review the identity match." Admin reviews, clicks approve, agent resumes.
2. **Stalled:** "The warehouse data extract for request #4211 has been open 6 days and the deadline is in 9 — I've reminded the owner in Teams twice. Escalate?"

**Key line:** *"This is the number one thing you've asked us for — not more configuration, but knowing exactly where things stand and what needs you. Your job shifts from operating the machine to supervising it."*

**Build requirements:**
- **Program dashboard (new surface — note, build later):** timeframe filter, recomputing values, and change-over-time visualization (trend deltas and sparklines, not just numbers). This is your team's own "priority updates" research made real. Needs a designed layout where the dashboard leads and the request list is visibly subordinate — the shrunken queue is itself a demo point.
- **Needs-attention agentic task list (new surface — note, build later):** separate from the dashboard; dynamic list of agent-raised items, each with reason, context, and a one-click resolve action. Two scripted resolve interactions.
- Pre-seeded 30 days of history so the trends have a believable shape (the "39, up from 31" arc)

---

## Close — the trust message (0:30, slide)

Reprise the thesis and land the governance point, because this room's first question is always "how do I defend this to a regulator":

> "In ten minutes: an agent set up your program, fulfilled a request with no workflow, and told you exactly what needed you. And every single action it took is grounded in regulatory content, constrained to your approved libraries, gated by your approval rules, and written to an audit trail. That's not AI replacing your privacy program. That's your privacy program, finally running at the speed of the requests coming into it."

---

## Build summary for the team

**Real (exists today, configure ahead of time):** web form base + publication (presented as the intake agent), request intake and queue, subtask components and statuses, one sandbox integration if credentials are obtainable.

**New surfaces to prototype (staged data, scripted paths):**
1. Setup agent conversation UI (Act 1) — on rails
2. Company profile + generated-artifacts review cards (Act 1)
3. Document ingestion + decomposed-playbook review card for policies/SOPs/data flow diagrams/response examples/brand + tone guides (Act 1)
4. Generated workflow visualization — one unified n8n-style flow chart, request-type branch first, zoomable per branch (Act 1 capstone)
5. Branded intake agent — Meridian-skinned form with scripted assistive layer, including the deletion→access pivot exchange (Act 2)
6. Agent plan view on request detail (Act 3) — **highest priority**
7. Reasoning/grounding panel citing both regulations and the customer's own documents + agent activity trail (Act 3)
8. Split-screen agentic user subtask: mocked Teams thread + mocked ServiceNow ticket + OneTrust subtask, with choreographed state changes (Act 3)
9. Redaction summary panel — data element types, instance counts, confidence per category, spot-check links, sign-off (Act 3; also the concept preview for the reimagined redaction tool)
10. Meridian-branded PDF access report (Act 3)
11. Program dashboard: timeframe filter, change-over-time trends, subordinated request list (Act 4)
12. Needs-attention agentic task list with one-click resolves (Act 4)

**Supporting design assets:** the Meridian brand (name, logo, palette, typography) — used by items 5 and 10 and the demo dataset; build early because it's a dependency for both.

**Deliberately out of scope for the demo:** fully open-ended chat intake (the structured intake agent is the deliberate counter-position), live integration template *generation* (use the "pre-built library" framing instead), live LLM generation of the response on stage (show a pre-generated artifact), regulation-change replay (mention it verbally as future-proofing — don't demo it).

## Risks and cheats

- **Live integration risk:** Marketo/Salesforce sandbox API keys are hard to obtain (known from internal testing). Decide early: either secure one sandbox (Salesforce dev orgs are free and the most recognizable logo) or fully simulate all integration execution with realistic logs. Do not attempt a live third-party API call on stage without a recorded fallback.
- **Teams + ServiceNow are mocked, by decision:** no real instances — build realistic UI mockups and choreograph the split-screen state changes. This removes two external dependencies and makes the timing fully controllable; the trade is that the mockups must be pixel-credible, since half the audience uses both tools daily.
- **Scripted, not generative, on stage:** every agent response in the demo should be deterministic/pre-scripted in the prototype. Live LLM calls on conference Wi-Fi with a variable model is how demos die. The prototype can be genuinely agentic in development; the stage build runs on rails.
- **Record everything:** a full screen-recording of the golden path as the break-glass fallback.
- **The one-liner to rehearse until it's reflexive:** *"There are no workflows."* It's the sentence the audience will repeat to each other afterward — every act should earn it again.
