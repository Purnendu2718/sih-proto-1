---
name: crypto-investigator
description: Trace victim-reported cryptocurrency fraud funds across TRON, EVM, and Bitcoin from a suspect wallet to the receiving exchange, attribute deposit/hot-wallet addresses persistently across cases, detect peeling and sweep patterns, and generate Section 94 BNSS statutory freeze notices with Section 63 BSA evidence seals.
---

## Core workflow
1. Universal search (`/api/v1/search`) or a mock case (`/api/v1/trace/start`) ingests transaction edges.
2. The C tracer core (`backend/core/`) runs bounded BFS to the nearest known-or-suspected exchange address.
3. `sweep_attribution.py` persists zero-day exchange attributions into `attribution_store.db`, propagating exchange names across future, unrelated cases.
4. For BTC, `heuristics/common_input_ownership.py` clusters co-spent input addresses.
5. `/api/v1/investigate/auto` is the one-click "Golden Hour" flow combining all of the above into a single answer.
6. `/api/v1/reports/freeze-notice` generates the sealed, NCRP-numbered, historically-valued statutory notice once an exchange is confirmed.

## Non-negotiables
- All labels flow through `attribution_store.db` — never read `known_vasp_clusters.json` or `entity_labels.json` directly at request time; they are seed data only, loaded once at startup.
- Every freeze notice must carry a non-null Merkle root once at least one live RPC call was made with that `case_id`.
- Never fabricate transaction hashes, balances, or attributions. Confidence must reflect the method that produced it.
- All timestamps in UTC. `AIR_GAPPED_MODE=true` must make every live-network function fail closed, not silently succeed.
