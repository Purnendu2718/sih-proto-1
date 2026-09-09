# UNIFIED TRANSACTION GRAPH MODEL (§6)
## Multi-Layer Ontological Graph Specification

### 1. Graph Entities (9 Node Classes)

| Node Class | Cytoscape Type | Description & Forensic Context |
| :--- | :--- | :--- |
| **`ADDRESS`** | `address` | Standard individual or unlabelled blockchain wallet address. |
| **`ENTITY`** | `entity` | Clustered group of addresses inferred to share common administrative control. |
| **`TRANSACTION`** | `transaction` | On-chain execution event transferring value between participants. |
| **`TOKEN`** | `token` | Canonical asset representation (ERC-20, TRC-20, native asset). |
| **`CONTRACT`** | `contract` | Verified smart contract (router, token proxy, staking pool). |
| **`VASP`** | `vasp` | Verified Centralized Exchange or Virtual Asset Service Provider infrastructure. |
| **`BRIDGE`** | `bridge` | Cross-chain interoperability protocol endpoint (LayerZero, Stargate, Wormhole). |
| **`MIXER`** | `mixer` | Privacy pool or collaborative obfuscation contract (Tornado Cash, Whirlpool). |
| **`DEX`** | `dex` | Decentralized exchange liquidity pool or automated market maker router. |

---

### 2. Edge Classification (4 Certainty Levels)

Every directed edge $E = (u, v)$ carries an explicit epistemic certainty rating:

```text
       DIRECT ON-CHAIN PROOF               BEHAVIORAL DERIVATION
       ┌─────────────────────┐             ┌─────────────────────┐
       │     OBSERVED        │             │      INFERRED       │
       │ (100% Ledger Data)  │             │ (Common Input/Change│
       └─────────────────────┘             └─────────────────────┘

       ALGORITHMIC SCORING                 REGULATORY ATTESTATION
       ┌─────────────────────┐             ┌─────────────────────┐
       │     HEURISTIC       │             │ CONFIRMED EXTERNAL  │
       │ (Sweep / Velocity)  │             │ (FIU-IND / Subpoena)│
       └─────────────────────┘             └─────────────────────┘
```

#### A. `OBSERVED` (100% Certainty)
- Directly observable on public distributed ledger (e.g. transfer transaction from $A$ to $B$ with valid signature and block receipt).
- Preserved with raw JSON-RPC payload and SHA-256 hash.

#### B. `INFERRED` (Probabilistic / Analytical)
- Derived through structural heuristics such as Bitcoin Change Address Heuristic or Common Input Ownership Heuristic (with CoinJoin suppression).

#### C. `HEURISTIC` (Dynamic Scoring)
- Computed via algorithmic pattern matching, such as Zero-Day CEX Deposit Sweep Detection or Cross-Chain Message Correlation.

#### D. `CONFIRMED_EXTERNAL` (Ground Truth)
- Confirmed via external authoritative disclosure (e.g., official Section 94 BNSS response from CoinDCX/Binance or FIU-IND Gazette).

---

### 3. Edge Attribute Schema
```json
{
  "source": "0xVictimWalletAddress",
  "target": "0xMuleLayerAAddress",
  "asset": "USDT",
  "amount": 4850.0,
  "timestamp_utc": 1788887400,
  "tx_hash": "0xec4eee61b996f2cc8828558177bc2b6966f294cc",
  "block_number": 19482910,
  "chain": "TRON",
  "evidence_id": "EV-2026-000184",
  "relationship_type": "DIRECT_TRANSFER",
  "certainty_level": "OBSERVED",
  "confidence_score": 1.0
}
```
