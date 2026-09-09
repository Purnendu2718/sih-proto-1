# SOVEREIGN SECURITY ARCHITECTURE (§47, §48)
## Role-Based Access Control, Cryptographic Integrity, and Keyless Invariant

### 1. Fundamental Keyless Invariant
CryptoTrace-Sentinel operates under a non-negotiable security guarantee:
- **Zero Private Key Storage:** The platform never generates, accepts, stores, transmits, or handles cryptocurrency private keys or seed phrases.
- **Zero Transaction Broadcast:** The platform possesses no wallet engine and cannot initiate on-chain transfers.
- **Pure Analytical & Evidentiary Scope:** Strictly limited to reading public distributed ledgers, generating intelligence, and compiling judicial evidence packages.

---

### 2. Role-Based Access Control (RBAC) Hierarchy (§47)
Access to cases, audit records, and export functions is restricted across 6 defined institutional roles:

| User Role | Case Intake & Edit | Graph Tracing & Explainability | Evidence Bundle Export | Statutory Notice Approval | Audit Trail Verification |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **`Investigator (IO)`** | Yes | Yes | Yes | Draft Only | View |
| **`Cyber Analyst`** | Read-Only | Yes | View Only | No | View |
| **`Supervisor (ACP/SP)`**| Yes | Yes | Yes | **Full Approval** | View |
| **`Legal Reviewer`** | Read-Only | Yes | Yes | **Legal Signoff** | View |
| **`Auditor`** | Read-Only | Read-Only | No | No | **Full Verification** |
| **`Administrator`** | System Only | Yes | Admin Export | Config Only | Full Access |

---

### 3. Cryptographic Controls & Data Protection
- **Transport Security:** TLS 1.3 encryption across all client-server communications.
- **Storage Encryption:** AES-256 encryption at rest for SQLite databases and evidence object files.
- **Tamper-Evident Audit Logging:** Every investigator operation is appended to `audit_logs.db` with SHA-256 hash chaining:
  $$\text{Hash}_i = \text{SHA-256}(\text{Timestamp} \parallel \text{User} \parallel \text{Role} \parallel \text{Action} \parallel \text{Details} \parallel \text{Hash}_{i-1})$$
- **Statutory Retention Enforcement:** Automated 7-year retention policy under Bharatiya Nagarik Suraksha Sanhita (BNSS) with deletion prevention until expiry.
