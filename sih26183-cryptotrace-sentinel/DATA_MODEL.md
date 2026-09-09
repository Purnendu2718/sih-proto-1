# DATA MODEL SPECIFICATION (§5)
## Relational Schemas, Analytical Indexes, and Evidence Store

### 1. Case Management Schema (`cases.db` / `cases` table)
```sql
CREATE TABLE IF NOT EXISTS cases (
    case_id TEXT PRIMARY KEY,               -- Unique identifier (e.g. CASE-2026-0402)
    fir_number TEXT NOT NULL,               -- Police First Information Report reference
    ncrp_ack_number TEXT,                   -- National Cyber Crime Reporting Portal reference
    police_unit TEXT NOT NULL,              -- State Cyber Crime Cell / Police Station
    investigating_officer TEXT NOT NULL,    -- Investigating Officer name/designation
    supervisor TEXT NOT NULL,               -- Supervisory ACP/SP reviewer
    incident_date TEXT NOT NULL,            -- Date of reported offense
    fraud_type TEXT NOT NULL,               -- Typology (Task Scam, Pig-Butchering, etc.)
    victim_identifier TEXT NOT NULL,        -- Anonymized complainant reference ID
    reported_wallet TEXT NOT NULL,          -- Primary entry point blockchain address
    blockchain TEXT NOT NULL,               -- Network (TRON, EVM, Bitcoin, etc.)
    asset TEXT NOT NULL,                    -- Primary defrauded asset symbol (USDT, ETH, BTC)
    estimated_fraud_inr REAL NOT NULL,      -- Estimated fraud value in Indian Rupees
    estimated_fraud_usd REAL NOT NULL,      -- Equivalent USD valuation at incident date
    incident_description TEXT,              -- Modus operandi narrative
    priority TEXT NOT NULL DEFAULT 'HIGH',  -- CRITICAL, HIGH, MEDIUM, LOW
    status TEXT NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, PENDING_REVIEW, REQUISITION_ISSUED, CLOSED
    retention_period_years INTEGER NOT NULL DEFAULT 7, -- Statutory 7-year retention
    created_utc INTEGER NOT NULL,           -- Ingestion epoch timestamp
    updated_utc INTEGER NOT NULL            -- Last modified epoch timestamp
);
CREATE INDEX IF NOT EXISTS idx_cases_wallet ON cases(reported_wallet);
CREATE INDEX IF NOT EXISTS idx_cases_fir ON cases(fir_number);
```

---

### 2. Evidence Ledger Schema (`evidence_ledger.db` / `evidence_entries` table)
```sql
CREATE TABLE IF NOT EXISTS evidence_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT NOT NULL,                  -- Case reference linking this artifact
    source_endpoint TEXT NOT NULL,          -- Full node RPC URL or verified API
    raw_payload TEXT NOT NULL,              -- Immutable canonical byte serialization
    payload_sha256 TEXT NOT NULL,           -- SHA-256 cryptographic digest of exact bytes
    captured_utc INTEGER NOT NULL           -- Retrieval epoch timestamp
);
CREATE INDEX IF NOT EXISTS idx_evidence_case ON evidence_entries(case_id);
```

---

### 3. Tamper-Evident Audit Log Schema (`audit_log.db` / `audit_logs` table)
```sql
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp_utc INTEGER NOT NULL,         -- Action execution epoch
    user_id TEXT NOT NULL,                  -- Investigating officer username / badge ID
    role TEXT NOT NULL,                     -- RBAC role (Investigator, Supervisor, Legal Reviewer)
    case_id TEXT,                           -- Associated case reference (if applicable)
    action TEXT NOT NULL,                   -- Action verb (CASE_CREATED, TRACE_EXECUTED, etc.)
    target_entity TEXT,                     -- Target address or evidence ID
    details TEXT,                           -- Contextual operational narrative
    previous_state TEXT,                    -- Prior state serialized representation
    new_state TEXT,                         -- New state serialized representation
    previous_sha256 TEXT NOT NULL,          -- SHA-256 digest of immediately preceding log row
    entry_sha256 TEXT NOT NULL              -- SHA-256 digest of current row + previous_sha256
);
CREATE INDEX IF NOT EXISTS idx_audit_case ON audit_logs(case_id);
```

---

### 4. VASP & Persistent Attribution Schema (`attribution_store.db` / `attributions` table)
```sql
CREATE TABLE IF NOT EXISTS attributions (
    address TEXT PRIMARY KEY,               -- Blockchain address
    exchange_name TEXT NOT NULL,            -- Attributed VASP (CoinDCX, Binance, WazirX)
    attribution_method TEXT NOT NULL,       -- ZERO_DAY_SWEEP, STATIC_SEED, MANUAL
    confidence REAL NOT NULL,               -- Heuristic confidence score (0.0 to 1.0)
    evidence_tx_hash TEXT,                  -- Supporting transaction hash on ledger
    entity_label TEXT,                      -- Formatted label ([CoinDCX Master Hot Wallet])
    compliance_email TEXT,                  -- Verified nodal compliance desk email
    first_observed_utc INTEGER,             -- Timestamp first discovered
    last_updated_utc INTEGER                -- Timestamp last updated
);
```
