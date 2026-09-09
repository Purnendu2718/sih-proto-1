# SYSTEM ARCHITECTURE (§5, §50)
## CryptoTrace-Sentinel Sovereign Blockchain Forensics Engine

```text
                    ┌─────────────────────────────────────────┐
                    │      Investigator Web Console (UI)      │
                    │   React 18 + Cytoscape.js + Lucide      │
                    └────────────────────┬────────────────────┘
                                         │
                    ┌────────────────────▼────────────────────┐
                    │      Sovereign API Gateway (FastAPI)    │
                    │   CORS Protected • TLS • RBAC Auth      │
                    └────────────────────┬────────────────────┘
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         │                               │                               │
         ▼                               ▼                               ▼
  Case Management              Investigation Engine               Evidence Vault
 (Section 2 BNSS)            (Omnichain Pathfinder)             (Section 63 BSA)
         │                               │                               │
         │             ┌─────────────────┼─────────────────┐             │
         │             ▼                 ▼                 ▼             │
         │       Graph Engine       Rule Heuristics   ML Layer           │
         │       (Unified Model)   (Sweep, Peeling)  (Explainable)       │
         │             │                 │                 │             │
         │             └─────────────────┼─────────────────┘             │
         │                               │                               │
         │                               ▼                               │
         │                     VASP / Attribution Store                  │
         │                     (Persistent DB & Cache)                   │
         │                               │                               │
         └───────────────────────────────┼───────────────────────────────┘
                                         ▼
                             Localized Analytical Layer
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
          SQLite / PostgreSQL      Network Indexes        Evidence Store
          (Cases & Audit Chain)   (Graph & Ingestion)   (Raw Binary Payloads)
```

---

### Layer Breakdown

#### 1. Ingestion Layer (§3, §4)
- **Adapter Interface (`BlockchainAdapter`):** Provides 11 core forensic methods (`getBlock`, `getTransaction`, `getTransactionReceipt`, `getAddressTransactions`, `getTokenTransfers`, `getBalance`, `getLogs`, `getBlockTimestamp`, `getInternalTransactions`, `getUTXOs`, `verifyTransaction`).
- **Chain Implementations:** Concrete adapters for Account-model chains (`EVMAdapter`), UTXO chains (`BitcoinAdapter`), and Account-delegated chains (`TronAdapter`).
- **Raw Provenance Store:** Captures source node endpoint, retrieval timestamp, raw JSON payload, canonical byte serialization, and SHA-256 digest before any analytical transformation.

#### 2. Analytical & Graph Layer (§5, §6)
- **Unified Graph Model:** 9 distinct entity types (`ADDRESS`, `ENTITY`, `TRANSACTION`, `TOKEN`, `CONTRACT`, `VASP`, `BRIDGE`, `MIXER`, `DEX`).
- **Edge Certainty Classification:**
  - `OBSERVED`: Direct cryptographic ledger proof.
  - `INFERRED`: Derived via behavioral relationships.
  - `HEURISTIC`: Algorithmic evaluation (e.g. automated sweep).
  - `CONFIRMED_EXTERNAL`: Corroborated with FIU-IND or judicial reporting.

#### 3. Strategy-Switching Investigation Engine (§26, §73)
The engine automatically navigates obfuscation topology by switching analytical techniques:
1. Standard fund transfer → Direct BFS Graph Search.
2. 1-in-2-out asymmetric decay → Peeling Chain Continuation Follower.
3. Collaborative UTXO structure → CoinJoin Forensics & CIOH Suppression.
4. Smart-contract privacy pool → Statistical Temporal Candidate Linkage.
5. Cross-chain state transition → Bridge OFT & Wormhole GUID Message Correlation.
6. Token swap conversion → DEX Swap Tracer (Value Preservation).
7. Single-use unlabelled deposit → Zero-Day CEX Sweep Attribution.
8. Terminal hot-wallet cluster → Section 94 BNSS Freezing Requisition.

#### 4. Cryptographic Evidence Subsystem (§29, §30)
- Immutable raw artifact vault.
- SHA-256 digest computation on canonical payload bytes.
- Binary Merkle tree generation for court verification under Section 63 BSA.
- Tamper-evident hash-chained audit logging (`audit_logs.db`).
