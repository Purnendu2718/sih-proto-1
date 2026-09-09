# CryptoTrace-Sentinel
### Sovereign Blockchain Cyber-Fraud Forensic Intelligence Engine for Indian Law Enforcement

> **"TRACE THE MONEY. PRESERVE THE EVIDENCE. IDENTIFY THE OFF-RAMP."**  
> A sovereign, self-hostable digital forensics platform purpose-built for Indian cybercrime investigators, state cyber cells, and the Indian Cyber Crime Coordination Centre (I4C / MHA).

---

## 0. Executive Positioning

**CryptoTrace-Sentinel** is not a general-purpose crypto market analytics platform, portfolio tracker, or whale-watching intelligence tool. It is an **investigation-first, evidence-first forensic engine** designed to solve the critical "Golden Hour" bottleneck faced by police officers:

$$\text{Victim Wallet} \longrightarrow \text{Fund Flow} \longrightarrow \text{Unknown Deposit} \longrightarrow \text{CEX Attribution} \longrightarrow \text{Off-Ramp} \longrightarrow \text{Evidence Package} \longrightarrow \text{Legal Review}$$

---

## 1. Five Core Differentiators Against Legacy Tools

| Capability | Legacy Commercial Analytics (Arkham / Breadcrumbs) | CryptoTrace-Sentinel (This Platform) |
| :--- | :--- | :--- |
| **Zero-Day CEX Deposit Detection** | Relies primarily on static address labeling databases. Newly generated deposit addresses remain unknown until externally tagged. | **Flagship Feature (§10):** Real-time behavioral sweep detector attributes unlabelled addresses via automated near-full sweeps into verified hot wallets. |
| **One-Click Off-Ramp Pathfinding** | Open-ended graph exploration requiring manual node expansion across thousands of noisy edges. | **Answer-First Traversal (§26):** Multi-layer graph search finds the shortest path to the actionable exchange off-ramp in under 1 millisecond. |
| **Digital Evidence Integrity** | Screenshots and proprietary PDF exports without cryptographic provenance. | **Section 63 BSA Vault (§29, §30):** Every raw RPC artifact receives an immutable SHA-256 hash, Merkle tree root, and verifiable JSON-ZIP bundle. |
| **Statutory Freezing Directives** | Generic reports with no Indian statutory mapping. | **Section 94 BNSS Workflow (§33):** Auto-generates certified requisition drafts with verified FIU-IND registered VASP nodal points of contact. |
| **Sovereign Air-Gapped Operation** | Mandatory foreign cloud SaaS; sensitive case data and FIR numbers transmitted across foreign borders. | **100% Sovereign (§49):** Self-contained Dockerized deployment; runs completely offline or on closed police intranet with zero external telemetry. |

---

## 2. Core Forensic Capabilities

- **Multi-Chain Adapter Architecture (§3):** Chain-agnostic interfaces for Account-model chains (Ethereum, Polygon, BSC, Arbitrum) and UTXO-model chains (Bitcoin), with extensible support for Tron and Solana.
- **Peeling-Chain & Splitting Engine (§7, §8):** Identifies 1-in-2-out structuring decay, calculates velocity (min/hop), retained/peeled balances, and tracks the main continuation path.
- **CoinJoin Forensics (§14, §15):** Detects collaborative Wasabi/Whirlpool transactions, explicitly halts naive Common Input Ownership Heuristic (CIOH), and quantifies post-mix anonymity set collapse.
- **Privacy Pool Analysis (§13, §16):** Analyzes Tornado Cash and Railgun smart-contract interactions; ranks withdrawal candidates statistically via temporal windows and relayer gas-funding links without claiming deterministic unmasking.
- **Omnichain Tracing (§18-§25):** Tracks cross-chain hops across LayerZero/Stargate OFT packets, Wormhole Portal GUIDs, THORChain memos, and DEX token swap conversions.
- **Explainability Panel (§40, §41):** Every inference exposes:
  1. Direct Ledger Observation
  2. Engine Forensic Inference
  3. Applied Heuristic Rules
  4. Supporting Cryptographic Evidence
  5. Competing Hypotheses / Alternatives
  6. Confidence Score & Level
  7. Technical & Legal Limitations
- **Tamper-Evident Audit Trail (§46):** SHA-256 hash-chained operational ledger documenting every officer action, evidence inspection, and requisition export.

---

## 3. Quickstart & Local Installation

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- (Optional) Docker and Docker Compose

### Option A: Direct Local Setup (Fastest for Evaluation)

#### 1. Backend Service
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at `http://localhost:8000/docs`.

#### 2. Frontend Console
```bash
cd frontend
npm install
npm run dev
```
The investigation console will be live at `http://localhost:5173`.

### Option B: Sovereign Docker Deployment (§49)
```bash
docker compose up -d --build
```
Access the investigator console directly at `http://localhost:3000`.

---

## 4. Running the Demonstration Suites

### Automated Master Test Suite (§62)
Execute the comprehensive 15-test validation suite covering UTXO, Account Model, CEX Sweeps, Mixers, Cross-Chain, Evidence Integrity, and Audit Trails:
```bash
cd backend
.venv\Scripts\python.exe test_master_suite.py
```
*Expected Result: 15/15 Tests Passed (100% OK).*

### 15-Stage Master Demo Runner (§67)
1. Open the console at `http://localhost:5173`.
2. Click **Run Demo** in the top navigation bar.
3. The platform will automatically execute all 15 stages:
   `Create Case → Load Wallet → Build Graph → Detect Peeling → Correlate Bridge → Flag Mixer → Post-Mix Linkage → Fresh CEX Deposit → Balance Sweep → CoinDCX Attribution → Shortest Path → Evidence Hashing → Verify Integrity → Generate Dossier → Prepare Section 94 BNSS Requisition`.
4. Inspect the resulting 27 verified evidence artifacts and export the court-ready ZIP archive.

---

## 5. Technical Documentation Index

- [`REQUIREMENTS_TRACEABILITY.md`](REQUIREMENTS_TRACEABILITY.md): Complete requirements decomposition matrix mapping §0 to §74.
- [`TECHNICAL_VALIDATION.md`](TECHNICAL_VALIDATION.md): Protocol-specific fact validation matrix and algorithmic boundaries.
- [`LEGAL_VALIDATION.md`](LEGAL_VALIDATION.md): Bharatiya Nagarik Suraksha Sanhita (BNSS) and Bharatiya Sakshya Adhiniyam (BSA) mapping.
- [`FINAL_VALIDATION_REPORT.md`](FINAL_VALIDATION_REPORT.md): Final quality gate, test results, and performance benchmarks.
- [`ARCHITECTURE.md`](ARCHITECTURE.md): Distributed multi-layer system architecture and data lake flow.
- [`API.md`](API.md): Complete OpenAPI REST reference for all investigative endpoints.
- [`AIR_GAPPED_DEPLOYMENT.md`](AIR_GAPPED_DEPLOYMENT.md): Deployment guide for disconnected / air-gapped sovereign police networks.
- [`THREAT_MODEL.md`](THREAT_MODEL.md): Adversarial threat model covering poisoned attributions, RPC attacks, and insider abuse.

---

## 6. Statutory Disclaimer

*CryptoTrace-Sentinel is designed exclusively for authorized law enforcement, intelligence, and regulatory agencies. Analytical attributions, heuristic scores, and off-ramp linkages constitute investigative intelligence leads and do not replace formal legal process. Beneficial ownership of exchange accounts must be formally requisitioned from registered reporting entities under Section 94 of the Bharatiya Nagarik Suraksha Sanhita, 2023.*
