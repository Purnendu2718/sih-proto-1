# PRIVACY PROTOCOL & MIXER FORENSIC METHODOLOGY (§13, §16)
## Tornado Cash-Style Privacy Pool Analysis & Statistical Candidate Linkage

### 1. Protocol Architecture & Invariants
Smart-contract privacy protocols (e.g. Tornado Cash, Railgun) utilize Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (ZK-SNARKs). A depositor submits a fixed denomination along with a cryptographic commitment hash $C = H(k, r)$. When withdrawing, a proof is submitted proving knowledge of an unspent commitment without disclosing which deposit it belongs to. A public nullifier hash is recorded to prevent double spending.

**Core Scientific Invariant:** On-chain cryptographic proofs make deterministic, 100% deanonymization of a single withdrawal mathematically impossible from ledger data alone. The platform strictly rejects claims of "unmasking" Tornado Cash and instead implements **statistical candidate correlation based on operational metadata**.

---

### 2. Statistical Candidate Ranking Pipeline

#### Feature 1: Temporal Proximity Window
Scammers laundering illicit fraud proceeds demonstrate operational urgency. The engine measures time delta $\Delta t = t_{\text{withdrawal}} - t_{\text{deposit}}$:
- Sub-1 hour ($\Delta t < 3600\text{s}$): Immediate withdrawal heuristic (+15 score).
- 1 to 48 hours ($3600\text{s} \le \Delta t \le 172800\text{s}$): High-probability syndicate velocity window (+25 score).
- Dormant (> 30 days): Low temporal correlation.

#### Feature 2: Relayer Gas-Funding Overlap
Withdrawers typically lack clean gas on their fresh recipient address and rely on third-party relayers. Where a relayer's funding source exhibits transactional linkages or shared deposit addresses with the depositor, operational linkage is flagged (+30 score).

#### Feature 3: Post-Mix Sweep & Off-Ramp Consolidation
Withdrawals that subsequently deposit into the same centralized exchange sweep infrastructure within 4 hours of withdrawal are linked with elevated heuristic confidence.

---

### 3. Transparent Explainability Output (§16)
Every candidate linkage produces explicit disclaimers:
```text
CANDIDATE PRIVACY POOL LINKAGE
Deposit: 0xVictimScamLayer1 (100 ETH Pool)
Withdrawal: 0xPolygonMuleAddress
Temporal Similarity: 84% (Delta: 2.1 hours)
Operational Linkage: Relayer funded via known mule network
Overall Confidence: 82% (PROBABILISTIC LEAD)
Alternative Candidates: 46 other pool withdrawals in window

LIMITATION:
Zero-Knowledge cryptographic guarantees prevent definitive on-chain identification.
Findings represent an investigative lead for Section 94 BNSS exchange subpoena.
```
