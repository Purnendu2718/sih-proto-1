---
name: crypto-investigator
description: Trace victim-reported cryptocurrency fraud funds across TRON, EVM, and Bitcoin from a suspect wallet to the receiving exchange, attribute exchange deposit/hot-wallet addresses, detect peeling-chain and sweep patterns, and generate Section 94 BNSS statutory freeze notices with Section 63 BSA evidence seals.
---

## When to use this skill
Use whenever a task involves: tracing a cryptocurrency address forward through a chain of hops, identifying which exchange received victim funds, attributing an unlabelled address to a known or suspected VASP, or drafting a statutory freeze/requisition notice for exchange compliance teams.

## Available references
- `references/known_vasp_clusters.json` — seed VASP hot wallets, deposit addresses and compliance emails for CoinDCX, WazirX, ZebPay, Binance.

## Core workflow
1. Ingest transaction edges for the reported start address (mock or live).
2. Build a Graph via the C tracer core (`backend/core/tracer_core.*`), bridged through `backend/core/c_bridge.py`.
3. Run `bounded_bfs_to_exchange`, bounded by hop count, time window, and amount threshold, to find the shortest path to a known exchange address.
4. Run `detect_peeling_chain` on intermediate mule addresses to flag structuring behaviour.
5. Run the sweep heuristic (`app/services/vasp_service.detect_sweep_attribution`) to attribute previously-unseen deposit/hot-wallet addresses.
6. On confirmation from the investigating officer, call `/api/v1/reports/freeze-notice` to generate a sealed Section 94 BNSS PDF.

## Non-negotiables
- Every generated freeze notice must carry a SHA-256 evidence seal.
- Never fabricate transaction hashes, wallet balances, or VASP attributions — attribution confidence must reflect the method used (`static_seed` vs `sweep_heuristic`).
- All timestamps handled in UTC.
