# STATUTORY LEGAL REVIEW & REQUISITION WORKFLOW (§32, §33)
## Section 94 BNSS Directives & Section 63 BSA Digital Evidence Packaging

```text
       FORENSIC ANALYSIS COMPLETE
                   │
                   ▼
       ATTRIBUTED TO PROBABLE VASP (e.g. CoinDCX)
                   │
                   ▼
       AUTOMATIC FREEZE NOT PERMITTED BY ENGINE
                   │
                   ▼
    ┌─────────────────────────────────────────────┐
    │     HUMAN INVESTIGATIVE & LEGAL REVIEW      │
    │  (Authorized Officer: Inspector / IO / ACP) │
    └──────────────────────┬──────────────────────┘
                           │
                           ▼
    ┌─────────────────────────────────────────────┐
    │     GENERATE STATUTORY REQUISITION DRAFT    │
    │            (Section 94 BNSS)                │
    └──────────────────────┬──────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
[Certified PDF with QR & Seal]    [JSON Evidence Bundle ZIP]
         │                                   │
         ▼                                   ▼
Dispatched to Verified Nodal Desk   Filed with Learned Magistrate
 (nodal.leaid@coindcx.com)           under Section 63 BSA, 2023
```

---

### 1. Section 94 BNSS Statutory Directive Structure
The generated requisition contains 10 structured components:
1. **Issuing Authority:** Police Unit, State Cyber Crime Cell, Investigating Officer Name and Rank.
2. **Statutory Reference:** Formally issued under Section 94 of the Bharatiya Nagarik Suraksha Sanhita, 2023 (or Section 91 CrPC where applicable).
3. **FIR / Crime Reference:** Crime No., Section of Law (e.g. Section 318(4) BNS / 66D IT Act), NCRP Acknowledgment Number.
4. **Target Entity Details:** Name of Centralized Exchange / VASP, FIU-IND Registration Number, Verified Nodal Compliance Desk.
5. **Identified Wallet Infrastructure:** Suspected Deposit Address, Verified Master Hot Wallet Cluster, Attribution Confidence Rating.
6. **Transaction Timeline:** UTC timestamps, transaction hashes, block numbers, transferred asset denomination, and INR equivalent valuation.
7. **Primary Evidence References:** Unique Evidence IDs (`EV-2026-XXXX`) and Merkle Tree Root Digest.
8. **Mandated Action Directives:**
   - Immediate preservation and freezing of associated exchange user account.
   - Comprehensive KYC disclosure (PAN, Aadhaar, Passport, Mobile, IP logs, linked bank accounts).
   - Inward and outward INR/Crypto ledger statements.
9. **Compliance Timetable:** Directive to comply within 24–48 hours in accordance with statutory cybercrime escalation SOPs.
10. **Certification & Signature:** Officer signature block and institutional seal.
