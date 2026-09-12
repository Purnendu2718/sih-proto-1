# SIH26183 — Feature Build Prompt for Antigravity
**Role framing for the agent:** You are a senior full-stack web developer joining an existing repository. Do not scaffold a new project. Audit what exists, then extend it. Every feature below must ship **free and unauthenticated-or-basic-auth-only** (no paywall, no token-gating) — this platform is for law enforcement / public-sector investigators, not paying subscribers.

Repo: `https://github.com/Purnendu2718/sih-proto-1.git`

---

## PHASE 0 — Mandatory Repo Audit (run this before writing any code)

```
TASK 0: Audit current implementation
1. Clone/open the repo at https://github.com/Purnendu2718/sih-proto-1.git
2. Detect and report: frontend framework, backend framework/language, database,
   auth mechanism (if any), existing routes/pages, existing data model, and any
   blockchain/chain-parsing libraries already imported.
3. Cross-reference against the "Master Feature Checklist" in Phase 2 below and
   mark each row as: [EXISTS] / [PARTIAL] / [MISSING].
4. Output this as a table before touching any code. Do not implement anything
   in Phase 2 until this audit table is produced and confirmed.
```

This matters because everything after this point assumes you know what's already built — don't duplicate, don't break existing routes/schemas.

---

## PHASE 1 — Competitive Context (why these features, in one paragraph each)

- **MistTrack (SlowMist)** — tiered SaaS ($229 → $689 → $2,069/mo). Everything that makes an investigation *usable* (tracing canvas, DEX/bridge parsing, bulk screening, one-click regulator export, AI agent/MCP access) sits behind the $689/mo tier or above.
- **Bubblemaps** — core wallet-clustering visual engine is 100% free, no login. Only deeper analytics (AI cluster interpretation, wallet P&L, historical depth) are gated — and gated by holding its BMT token, not a card.
- **Crystal Intelligence** — no self-serve pricing at all. 100% sales-led enterprise. Its standout capabilities (provenance-tagged attribution, configurable risk rule-sets, natural-language "Ask Crystal" analyst) are the ones worth stealing conceptually, since they're aimed at exactly our audience (law enforcement / regulators).

**The gap we're exploiting:** none of the three give away the features that make an investigation *defensible in court* — clustering depth, a tracing workspace, and audit-ready evidence export. Making exactly those free is our differentiator.

---

## PHASE 2 — Master Feature Checklist (build against repo audit results)

Legend: **P0** = must-have for MVP demo · **P1** = strong differentiator · **P2** = stretch/forward-looking

| # | Feature | Source | Priority | What it does |
|---|---|---|---|---|
| 1 | Tracing Canvas / Risk Graph workspace | MistTrack (locked @ $689/mo) | P0 | Interactive node-link canvas for building a trace manually — pin addresses, drag to expand, save a case state |
| 2 | One-click STR / court-ready evidence export | MistTrack (locked @ $689/mo) | P0 | Single button → PDF/JSON export mapped to Section 63 BSA/65B and Section 94 BNSS, with hash + timestamp for chain-of-custody |
| 3 | Magic Nodes — hidden/indirect cluster detection | Bubblemaps (free, flagship) | P0 | Auto-surface wallets linked by shared gas-funding source or common intermediary, even if not top holders |
| 4 | Provenance-tagged entity attribution | Crystal (core feature) | P0 | Every label carries `source: automated_clustering \| offchain_verified \| analyst_reviewed` — non-negotiable for court-admissibility |
| 5 | Dual-mode risk scoring engine | Crystal (core feature) | P0 | Pre-assigned score for known/attributed entities (exchanges, darknet markets) + dynamic behavioral score for unattributed wallets |
| 6 | Bulk/batch address screening (KYA-style) | MistTrack (locked @ $689/mo) | P1 | Upload a list (e.g. seized wallet's full tx history) → screen all addresses in one pass against sanctions + risk DB |
| 7 | Bubble-map visual view (alongside technical graph) | Bubblemaps (free) | P1 | Size/position-encoded bubble view as the default for non-technical investigators; toggle to technical graph for analysts |
| 8 | Time Travel — historical snapshot playback | Bubblemaps (free) | P1 | Scrub a timeline slider to replay how a wallet cluster's holdings evolved |
| 9 | AI Agent Skills / MCP-style query layer | MistTrack (locked @ $689/mo) | P1 | Let an investigator query the case ("show me all addresses linked to X above ₹5L") via a chat interface backed by an LLM wrapper over your own data — same spirit as Crystal's "Ask Crystal" |
| 10 | Frictionless no-login instant lookup | Bubblemaps (free, zero-friction) | P1 | Public-facing single-address/tx lookup requiring no auth, separate from the authenticated investigator dashboard |
| 11 | Sanctions/watchlist screening | MistTrack + Crystal | P0 | Ingest OFAC (+ any India-specific list available) and flag matches automatically on ingestion, not on-demand only |
| 12 | Cross-chain / bridge & DEX tracing | MistTrack (locked @ $689/mo) | P1 | Follow a fund flow across a bridge or DEX swap in a single unified graph, not as separate per-chain views |
| 13 | Structured public-tip intake (Intel Desk pattern, no token) | Bubblemaps | P2 | A moderated queue where external tips on a wallet/case get triaged and prioritized — skip the token-staking mechanic entirely |
| 14 | Real-time agentic-payment risk decisioning | Crystal (forward-looking) | P2 | Expose a risk-check API endpoint that can approve/flag a transfer pre-settlement, not just after the fact |

---

## PHASE 3 — Per-Feature Build Commands (feed to Antigravity one block at a time)

```
TASK 1: Build the Tracing Canvas
- Add a new authenticated route/page: an interactive canvas (use a graph library
  already idiomatic to the repo's stack — e.g. react-flow if React, or vis.js/
  cytoscape.js as a fallback) where an investigator can:
  - Search and drop an address node onto the canvas
  - Expand a node to reveal its direct counterparties (paginated, not all at once)
  - Manually pin/label nodes and save the canvas state as a named "Case"
  - Load a previously saved Case
- Persist canvas state in the existing DB (new table: cases, case_nodes, case_edges)
- No feature flag, no plan check — available to every authenticated user.
```

```
TASK 2: Build one-click evidence export
- Add an "Export Evidence" action on any Case or address-profile view.
- Generate a PDF (or signed JSON, whichever the repo already supports) containing:
  address history, cluster graph snapshot, risk score with provenance, and a
  SHA-256 hash + UTC timestamp of the export itself for chain-of-custody.
- Map the report sections explicitly to Section 63 BSA/65B and Section 94 BNSS
  evidentiary requirements — add a short legend explaining the mapping in the
  report footer.
```

```
TASK 3: Build Magic-Nodes-style cluster detection
- Add a clustering pass (batch job or on-demand) that flags wallets as
  "indirectly linked" when they share: (a) a common gas-funding source address,
  (b) a common first-funding intermediary, or (c) near-identical transaction
  timing patterns to a known cluster.
- Surface these as a distinct edge type ("indirect_link") in the graph view,
  visually distinguished from direct transfer edges.
```

```
TASK 4: Add provenance tagging to the data model
- Add a `provenance` enum field to every label/entity-attribution record:
  automated_clustering | offchain_verified | analyst_reviewed.
- Backfill existing labels as `automated_clustering` by default.
- Surface the provenance tag as a visible badge anywhere a label is shown in
  the UI — this is a hard requirement, not cosmetic.
```

```
TASK 5: Build the dual-mode risk engine
- For known/attributed entities (exchanges, mixers, darknet markets): assign a
  static base risk score from a maintained entity list.
- For unattributed wallets: compute a dynamic score from behavior signals
  (mixer interaction, rapid fan-out, sanctioned-address proximity, age of
  first activity).
- Store both the score AND which mode produced it — never silently blend them.
```

```
TASK 6: Build bulk/batch address screening
- Add an "Upload list" flow (CSV/TXT) on the screening page.
- Screen every address in the list against the risk DB + sanctions list in one
  batch job; return a downloadable results table (address, risk score,
  sanctions match y/n, provenance).
- Handle lists in the thousands without blocking the UI thread — queue it.
```

```
TASK 7: Add the bubble-map view
- Add a view toggle on the graph screen: "Bubble View" vs "Technical Graph".
- Bubble View: node size = holding size / transaction volume, proximity =
  relationship strength. Keep it a simplified, low-jargon default for
  non-technical investigators (e.g. state police without blockchain training).
```

```
TASK 8: Add Time Travel playback
- Add a timeline scrubber component above the graph view.
- Store periodic snapshots of a cluster's state (or compute on-the-fly from
  historical tx data if snapshots aren't feasible yet) and let the scrubber
  replay how the cluster's holdings/links changed over the selected range.
```

```
TASK 9: Add a natural-language case assistant
- Add a chat panel scoped to a single Case.
- Wire it to an LLM call that receives: the case's graph data, risk scores,
  and provenance as structured context, and answers investigator questions
  in plain language ("summarize this case", "which addresses touched a
  sanctioned entity"). Always attach the underlying data point(s) the answer
  is based on — never let it answer ungrounded.
```

```
TASK 10: Add a public no-login lookup tool
- Add an unauthenticated route (separate from the investigator dashboard) where
  anyone can paste a single address/tx hash and get: basic risk score, chain,
  and top labels — no case creation, no export, no auth wall.
- Rate-limit by IP, not by account, since there is no account.
```

```
TASK 11: Wire sanctions ingestion into the pipeline
- Ingest OFAC's published SDN list (and any additional list already scoped for
  the project) as a scheduled ETL job, not an on-demand API call.
- Flag matches automatically at ingestion time so risk scores are already
  computed before an investigator opens the address, not calculated lazily.
```

```
TASK 12: Add cross-chain / bridge tracing
- When a traced address interacts with a known bridge or DEX contract, resolve
  the destination-chain address and continue the trace across chains in the
  same graph view, rather than stopping at the bridge contract or forcing the
  investigator to switch chain context manually.
```

---

## PHASE 4 — Explicit "Keep This Free" Rules for Antigravity

Do NOT implement any of the following, even if the codebase already has scaffolding for them:
- Subscription tiers, plan checks, or feature flags gating any feature above by payment
- Token-gating (BMT-style) of any analytics feature
- A "Get a demo" / sales-contact wall in place of a working feature
- Locking bulk screening, tracing canvas, or evidence export behind anything beyond a basic authenticated investigator account

Every feature in the checklist above ships in the free/open core. This is the platform's core differentiation versus all three competitors and should be treated as a hard constraint, not a suggestion.

---

## HOW TO USE THIS FILE
1. Paste **Phase 0** into Antigravity first, alone, and get the audit table back.
2. Paste **Phase 2's table** for shared context.
3. Feed **Phase 3's TASK blocks** one at a time (or in small batches) — each is self-contained enough to be a single agent turn.
4. Paste **Phase 4** at the start of the session (or pin it) so no task drifts into building a paywall by default.
