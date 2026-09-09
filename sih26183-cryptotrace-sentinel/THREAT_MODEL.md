# FORENSIC THREAT MODEL (§61)
## Adversarial Attack Vectors, Forensic Risks, and Defensive Controls

**System:** CryptoTrace-Sentinel  
**Threat Actors Considered:** Sophisticated Cyber-Fraud Syndicates, Money Launderers, Malicious Node Operators, Discredited Witnesses, Corrupt Insiders.

---

### Threat Vector Analysis & Mitigations

| Threat Vector ID | Adversarial Threat Description | Potential Forensic Impact | Platform Defensive Mitigation |
| :--- | :--- | :--- | :--- |
| **TM-01** | **Poisoned Attribution Datasets**<br>Adversary injects malicious or spoofed address tags into public attribution datasets to frame innocent entities. | False accusation of legitimate individuals; ruined prosecution in court. | **Provenance & Version-Controlled TagPacks (§11).** Attribution history is immutable. Tags require verifiable evidence source (FIU-IND, judicial warrant) and explicit confidence level. Static tags are separated from dynamic behavioral observations. |
| **TM-02** | **Malicious RPC Node Responses**<br>Compromised third-party RPC node feeds fabricated transaction receipts or hides illicit fund transfers. | Incomplete traces; fabricated evidence submitted to judicial magistrate. | **Source Provenance & Dual-Node Cross-Verification (§4).** Every raw payload records endpoint URI, timestamp, and byte digest. Air-gapped deployments bind exclusively to sovereign, trusted local full nodes. |
| **TM-03** | **Dusting & Sybil Cluster Poisoning**<br>Scammers send tiny amounts of cryptocurrency (dust) to thousands of wallets to poison automated graph clustering. | Exponential graph explosion; false-positive clustering of thousands of innocent wallets. | **Dust Filtering & Economically Meaningful Traversal (§26).** Configurable dust threshold (default: $50 USD equivalent). Insignificant transfers are pruned during BFS pathfinding to off-ramps. |
| **TM-04** | **Malicious Smart Contract Decoys**<br>Smart contracts simulate token transfers without real value movement (fake USDT / scam tokens). | Misleading investigator on stolen value; phantom money laundering claims. | **Canonical Asset Identity Registry (§25).** Validates token contract against canonical factory addresses (e.g. Tether USDT `0xdac17f...` on Ethereum). Unverified contracts are marked as `UNVERIFIED_ASSET`. |
| **TM-05** | **Evidence Tampering & Insider Modification**<br>Corrupt insider or attacker modifies local case logs or alters transaction amounts in database. | Admissibility rejected in court under Section 63 BSA; collapsed prosecution. | **Cryptographic Hash-Chained Audit Trail (§46) & Binary Merkle Root (§30).** Any alteration to a transaction or log entry immediately breaks the SHA-256 chain and causes verification failure. |
| **TM-06** | **Private Key Exfiltration / Custody Liability**<br>Malware or attacker attempts to steal investigator private keys or broadcast transactions. | Compromise of police agency funds or unlawful asset seizure claims. | **Strict Keyless Architecture Invariant (§48).** The system never requests, stores, or handles private keys. It possesses zero wallet functionality and cannot initiate on-chain transfers. |
| **TM-07** | **Cloud SaaS Jurisdictional Interception**<br>Foreign cloud analytics providers intercept Indian police FIR numbers and victim wallet addresses. | Sovereign intelligence leak; violation of Indian data sovereignty directives. | **100% Sovereign Air-Gapped Operation (§49).** Complete system operates offline within state police intranet; zero outbound telemetry. |
