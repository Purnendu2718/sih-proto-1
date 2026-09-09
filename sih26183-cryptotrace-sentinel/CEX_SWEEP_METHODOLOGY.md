# ZERO-DAY CEX DEPOSIT SWEEP DETECTION METHODOLOGY (§10)
## Real-Time Behavioral Sweep Attribution vs Static Address Labeling

### 1. Problem Statement
Commercial blockchain analytics tools rely on static label datasets. When cyber-criminals generate single-use deposit addresses on centralized exchanges (e.g. Binance, CoinDCX, WazirX), these addresses have no prior public tag. Static tools label them as "Unknown". By the time manual investigators or external crowdsources identify the address days later, the fraud proceeds have already been traded or off-ramped.

### 2. Behavioral Forensic Discovery Pattern
CryptoTrace-Sentinel identifies zero-day exchange deposit addresses by analyzing the programmatic behavior of exchange custodial sweep scripts:

```text
[Victim Wallet]
       │
       ▼ (Stolen Funds)
[Intermediate Mule / Structuring Address]
       │
       ▼ (Single Inflow)
[UNKNOWN / UNLABELLED DEPOSIT ADDRESS]
       │
       ▼ (Automated Internal Sweep within < 60 mins)
[VERIFIED EXCHANGE MASTER HOT WALLET CLUSTER]
```

### 3. Heuristic Rule Weighting & Confidence Scoring
Exchange sweep attribution is computed across multiple corroborating operational indicators:

| Forensic Heuristic | Scoring Weight | Threshold / Condition |
| :--- | :---: | :--- |
| **Verified Destination Cluster** | +30 | Destination address matches verified VASP master hot wallet registry. |
| **Near-Full Balance Sweep** | +20 | Sweep transaction transfers $\ge 90\%$ of received balance (residual left for gas). |
| **Automated Temporal Proximity** | +15 | Time interval between deposit and sweep is $\le 60$ minutes (consistent with exchange batch sweep cron). |
| **Repeated Behavioral Pattern** | +15 | Destination cluster observed executing identical sweep transactions across prior case clusters. |
| **Fresh Unlabelled Origin** | +10 | Deposit address has zero transaction history prior to the incoming victim transfer. |
| **Transaction Structure Consistency**| +05 | Gas funded via exchange relayer/parent hot-wallet rather than external third party. |
| **Total Heuristic Confidence** | **95 / 100** | **PROBABLE EXCHANGE ATTRIBUTION** |

### 4. Confidence Categorization
- **Confirmed (99-100%):** Requires signed attestation from exchange compliance or official FIU-IND regulatory reporting.
- **High Confidence (90-95%):** Automated sweep pattern verified into known master hot wallet with near-full balance transfer under 60 minutes.
- **Probable (75-89%):** Sweep observed into known infrastructure with minor timing deviations.
- **Possible (50-74%):** Partial sweep or intermediate aggregation wallet detected.
- **Unresolved (<50%):** Inconclusive flow, ordinary peer-to-peer transfer, or external DEX routing.

### 5. False-Positive Controls
The engine rejects false sweeps when:
- The downstream transfer represents less than 75% of funds (partial merchant payment).
- The delay exceeds 48 hours without programmatic automation indicators.
- The destination address is an unverified individual wallet or smart-contract proxy.
