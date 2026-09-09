# REST API SPECIFICATION (§51)
## CryptoTrace-Sentinel OpenAPI v1 Reference

All endpoints are served under `/api/v1` with JSON request/response payloads.

---

### 1. Case Management Endpoints (§2)

#### `POST /cases`
Registers a new cyber-fraud FIR/NCRP case with 7-year statutory retention.
- **Request Body:**
  ```json
  {
    "case_id": "CASE-2026-0402",
    "fir_number": "FIR/CYBER/2026/0402",
    "ncrp_ack": "NCRP-2026-9021",
    "police_unit": "State Cyber Cell Bengaluru",
    "investigator": "Inspector Rajesh Sharma",
    "supervisor": "ACP K. V. Raman",
    "incident_date": "2026-09-01",
    "fraud_type": "Task Scam",
    "victim_identifier": "VIC-REF-9021",
    "reported_wallet": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX",
    "blockchain": "TRON",
    "asset": "USDT",
    "estimated_fraud_value_inr": 480000,
    "incident_description": "Telegram task scam",
    "priority": "HIGH"
  }
  ```
- **Response:** `200 OK` with created case record and retention expiry timestamp.

#### `GET /cases`
Lists registered cases with pagination, status, and priority filters.

#### `GET /cases/{id}`
Retrieves complete case metadata and attached investigative notes.

#### `GET /cases/dashboard/stats`
Returns 6 high-level KPI dashboard metrics for Section 37 console.

---

### 2. Multi-Hop Forensic Tracing Endpoints (§26)

#### `POST /trace`
Executes multi-hop graph traversal from victim wallet to nearest off-ramp.
- **Request Body:**
  ```json
  {
    "address": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX",
    "chain": "TRON",
    "max_hops": 6,
    "use_mock_fallback": true
  }
  ```
- **Response:** `200 OK` with `case_id`, `hop_count`, `trace_time_ms`, `destination_vasp`, `reached_exchange`, and primary path nodes.

#### `GET /trace/{case_id}/graph`
Returns nodes (9 types) and edges (4 certainty levels) for Cytoscape visualization.

#### `GET /trace/{case_id}/off-ramp`
Identifies nearest centralized exchange off-ramp terminal and value retained.

#### `POST /trace/expand`
Expands a node dynamically in inbound, outbound, or bidirectional mode.

---

### 3. Omnichain & Explainability Endpoints (§41, §73)

#### `POST /investigate/explain-node`
Section 41 Explainability Panel: returns 7-part disaggregation (Observation, Inference, Rules, Evidence, Alternatives, Confidence, Limitations).

#### `POST /investigate/peeling-chain`
Calculates peeling chain length, velocity, retained/peeled balances, and continuation path.

#### `POST /investigate/analyze-coinjoin`
Evaluates collaborative UTXOs, suppresses naive CIOH, and analyzes post-mix anonymity set degradation.

#### `GET /investigate/dossier/{case_id}`
Compiles complete 15-section Digital Forensic Dossier under Section 63 BSA.

---

### 4. Digital Evidence & Integrity Endpoints (§29, §30, §58)

#### `GET /evidence/{case_id}`
Returns list of preserved raw blockchain artifacts with SHA-256 digests.

#### `POST /evidence/verify`
Section 58 Verification Screen: independently recomputes all SHA-256 hashes from disk and verifies evidence manifest.

#### `GET /evidence/manifest/{case_id}`
Returns cryptographically signed JSON manifest with Merkle tree root.

#### `GET /evidence/bundle/{case_id}`
Downloads complete court-admissible `.zip` evidence archive.

---

### 5. Legal & Statutory Requisition Endpoints (§32-§34)

#### `GET /legal/vasps`
Returns controlled VASP compliance registry with nodal emails and FIU-IND registration numbers.

#### `POST /reports/freeze-notice`
Generates and downloads certified Section 94 BNSS Freezing Notice PDF with Section 63 BSA SHA-256 evidence seal.

#### `POST /reports/freeze-notice-v2`
Generates v2 Section 94 BNSS PDF with Merkle tree root and historical valuation.

---

### 6. Tamper-Evident Audit Trail Endpoints (§46)

#### `GET /audit`
Returns chronologically ordered audit records.

#### `GET /audit/verify/integrity`
Verifies SHA-256 hash chaining across all sequential audit log entries.
