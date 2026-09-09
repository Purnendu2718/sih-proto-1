# DIGITAL FORENSIC EVIDENCE & INTEGRITY METHODOLOGY (§29, §30)
## Section 63 BSA Compliance, SHA-256 Ledger, and Cryptographic Merkle Root

### 1. Statutory Mandate
Under **Section 63 of the Bharatiya Sakshya Adhiniyam, 2023 (BSA)** (replacing Section 65B of the Indian Evidence Act, 1872), electronic records are admissible in judicial proceedings only when accompanied by a certificate identifying the electronic record, describing the manner of production, certifying the integrity of the operating computer system, and signed by an authorized officer having lawful control.

**Core Architectural Rule:** Screen captures and derived analytical charts do not constitute primary evidence. The system preserves the original raw JSON-RPC bytes received from blockchain nodes and seals each artifact with an immutable cryptographic digest.

---

### 2. Evidence Pipeline

```text
RAW NODE JSON-RPC RESPONSE
        │
        ▼ (Preserve Exact Bytes & Canonical Ordering)
CANONICAL SERIALIZATION
        │
        ▼ (Compute SHA-256 Digest)
EVIDENCE LEDGER ENTRY (`evidence_entries`)
        │
        ├── artifact_id: EV-2026-000184
        ├── source_endpoint: http://local-geth:8545
        ├── payload_sha256: 532163c7010e8208f2ec34...
        └── captured_utc: 1788887400
        │
        ▼ (Build Binary Merkle Tree over all leaves)
MERKLE TREE ROOT DIGEST
        │
        ▼ (Produce Signed Court-Admissible Package)
SECTION 63 BSA CERTIFICATE + ZIP BUNDLE
```

---

### 3. Binary Merkle Tree Verification Algorithm
To ensure that an entire case containing hundreds of transactions can be verified by a defense counsel or judicial magistrate with a single 32-byte digest:
1. Every raw evidence entry's SHA-256 hash forms a leaf: $L_i = H(\text{payload}_i)$.
2. Adjacent leaves are paired and hashed: $N_{parent} = H(L_i \parallel L_{i+1})$.
3. If a leaf count is odd, the last node is duplicated.
4. Tree ascends iteratively until a single 32-byte **Merkle Root** is produced.
5. The Merkle Root is printed at the top of the Section 94 BNSS requisition and Section 63 BSA certificate.

---

### 4. Independent Verification Utility (§58)
The platform includes an automated integrity verification utility accessible via `POST /api/v1/evidence/verify`:
- Reads every raw binary artifact from disk (`/data/evidence_store/EV-*.bin`).
- Recomputes SHA-256 from raw disk bytes independently.
- Compares computed digest against the manifest and database ledger.
- Returns verification status: `PASS` (27/27 verified) or flags tampering if a single byte has altered.

---

### 5. Court Evidence Bundle Archive (§59)
The one-click evidence bundle export creates a structured ZIP archive containing:
```text
evidence_bundle_[CASE_ID].zip
├── case_metadata.json          (FIR, NCRP, IO, incident details)
├── investigation_summary.json  (Executive findings, timeline, off-ramp)
├── evidence_manifest.json      (Full register of all 27 artifacts and SHA-256 hashes)
├── audit_log.json              (Tamper-evident audit trail)
├── raw_evidence/               (Individual raw JSON-RPC node responses)
│   ├── EV-0001.json
│   └── EV-0002.json
└── reports/
    └── README_LEGAL.txt        (Section 63 BSA statutory custody notice)
```
