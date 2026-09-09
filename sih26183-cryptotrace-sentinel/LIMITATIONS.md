# EXPLICIT FORENSIC LIMITATIONS & UNCERTAINTY (§68, §69)
## Boundaries of On-Chain Analysis for Indian Law Enforcement

Forensic integrity requires transparent boundaries. CryptoTrace-Sentinel adheres strictly to Rule 68: **Never fabricate data or overstate certainty**. The following technical limitations are explicitly surfaced to investigators and judicial authorities.

---

### 1. On-Chain Attribution vs Natural Person Identity
- **The Boundary:** On-chain transaction analysis can establish with high certainty that an address is an internal deposit conduit for a specific exchange (e.g. CoinDCX or Binance).
- **The Limitation:** On-chain analysis **cannot** reveal the real-world identity, name, PAN, Aadhaar, phone number, or physical location of the individual holding the account.
- **Remedy:** Legal requisition under Section 94 BNSS must be served on the exchange's FIU-IND registered nodal compliance desk to obtain off-chain KYC records.

---

### 2. Mixer / Privacy Pool Cryptographic Irreversibility
- **The Boundary:** Tornado Cash, Railgun, and ZK-SNARK protocols utilize zero-knowledge proofs where withdrawal transactions do not reference deposit commitments.
- **The Limitation:** No algorithm can mathematically "break" ZK-SNARK cryptography from public ledger data alone.
- **Remedy:** The platform applies statistical candidate correlation based on operational metadata (timing windows, relayer funding, downstream sweeps) and clearly labels findings as probabilistic leads.

---

### 3. CoinJoin Subset-Sum NP-Completeness
- **The Boundary:** Unraveling multi-party CoinJoin transactions with arbitrary denominations requires solving the subset-sum problem.
- **The Limitation:** Subset-sum is NP-complete. For transactions with dozens of inputs and outputs, brute-force enumeration causes combinatorial explosion.
- **Remedy:** The engine bounds search depth to 1,000 branches and flags residual ambiguity rather than pretending to provide an exhaustive global mapping.

---

### 4. Cross-EVM Key Compromise & Vanity Addresses
- **The Boundary:** Generating the same address string across Ethereum, Polygon, and BSC usually implies common private key ownership.
- **The Limitation:** Smart-contract vanity deployers (`CREATE2`) or shared multi-sig frameworks can produce identical address strings with distinct controllers across chains.
- **Remedy:** Cross-EVM address matches are labeled *"Same address string; potentially same actor"* requiring corroborating behavioral evidence before entity-level clustering.
