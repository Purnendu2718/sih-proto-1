# COINJOIN FORENSICS & POST-MIX BEHAVIOR METHODOLOGY (§14, §15)
## Collaborative UTXO Decomposition & Post-Mix Anonymity Loss Analysis

### 1. The CoinJoin Forensic Problem
In Bitcoin and UTXO-model chains, legacy analytics tools apply the **Common Input Ownership Heuristic (CIOH)**, assuming that all inputs in a multi-input transaction are controlled by a single private key holder. In collaborative CoinJoin transactions (Wasabi Wallet, Samourai/Whirlpool, JoinMarket), multiple independent individuals coordinate to construct a transaction with identical output denominations. 

**Applying naive CIOH to a CoinJoin transaction is catastrophically invalid:** it incorrectly clusters hundreds of completely innocent participants with a criminal actor.

---

### 2. CoinJoin Structural Detection Pipeline
The platform evaluates structural features to detect collaborative CoinJoin transactions before applying clustering heuristics:
1. **Multi-Input / Multi-Output Count:** $\ge 3$ distinct inputs and $\ge 3$ outputs.
2. **Identical Standard Output Denominations:** Repeated equal values (e.g. 0.05 BTC, 0.1 BTC, 0.5 BTC) representing $\ge 40\%$ of total outputs.
3. **Unequal Residual Change Outputs:** Multiple irregular change outputs returning unmixed funds to participants.

**Enforced Invariant:** Once a transaction is classified as a probable CoinJoin, the engine **explicitly suppresses naive CIOH**.

---

### 3. Bounded Subset-Sum Candidate Mapping
To trace suspect UTXOs through the CoinJoin without combinatorial explosion:
- Exact subset-sum search is NP-complete.
- The engine implements **bounded branch-and-bound** with dynamic programming pruning up to depth 1,000.
- Evaluates fee-aware delta: $\text{Input Value} - \text{Equal Denomination} - \text{Coordinator Fee} = \text{Candidate Change}$.
- Generates candidate input-output pairings ranked probabilistically with explicit ambiguity metrics.

---

### 4. Post-Mix Anonymity-Loss Analysis (§15)
Anonymity in CoinJoin relies on participants keeping their mixed outputs strictly independent. In cyber-fraud syndicates, scammers frequently break their own anonymity set through operational negligence:

```text
[CoinJoin Transaction (5 Equal Outputs)]
   ├── Output #1 (0.1 BTC) ──┐
   ├── Output #2 (0.1 BTC) ──┤ (Post-Mix Consolidation)
   ├── Output #3 (0.1 BTC) ──┴───► [Single Aggregation Mule] ──► [Exchange Deposit]
   ├── Output #4 (0.1 BTC)
   └── Output #5 (0.1 BTC)
```

The engine tracks:
- **Consolidation:** Merging 2 or more candidate outputs into a single downstream transaction.
- **Address Reuse:** Spending mixed outputs back to previously tagged entity clusters.
- **Anonymity Reduction Percentage:** Quantifies the degradation of the anonymity set:

$$\text{Anonymity Reduction \%} = \frac{\text{Consolidated Outputs Affected}}{\text{Initial Candidate Count}} \times 100$$

All findings are explicitly presented as probabilistic heuristic reductions, not absolute cryptographic unmasking.
