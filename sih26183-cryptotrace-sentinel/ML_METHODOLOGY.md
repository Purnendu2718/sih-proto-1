# GRAPH-TEMPORAL MACHINE LEARNING METHODOLOGY (§17)
## Feature Engineering, Model Architecture, Explainability, and Ethical Boundaries

### 1. Architectural Role
The Machine Learning layer in CryptoTrace-Sentinel acts as an **investigative lead generator**, not an autonomous judicial decision-maker. It assists officers by prioritizing anomalous wallet subgraphs for human forensic review.

---

### 2. Feature Extraction Taxonomy

#### A. Structural Graph Features
- **In-Degree / Out-Degree:** Ratio of incoming to outgoing counterparties.
- **Betweenness & PageRank Centrality:** Quantifies bridge node importance in money flow.
- **Clustering Coefficient:** Local neighborhood transitivity.
- **Fan-In / Fan-Out Ratio:** Measures splitting vs aggregation structuring behavior.

#### B. Monetary Features
- **Value Fragmentation Index:** Entropy of output value distributions.
- **Fractional Remainder Ratio:** Detects non-round change structuring.
- **Retained Value Percentage:** Main branch value preservation vs fee peel.

#### C. Temporal Dynamics
- **Velocity (Interval between Hops):** Inter-transaction arrival times.
- **Burstiness Coefficient:** Clustering of transfers within short time windows.
- **Dormancy Windows:** Period of inactivity prior to sudden reactivation.

#### D. Behavioral Fingerprints
- **Address Freshness / Zero-History Flag:** Single-use deposit addresses.
- **Privacy Protocol Proximity:** Hop distance to Tornado Cash or Whirlpool pools.
- **Exchange Hot-Wallet Proximity:** Hop distance to verified VASP clusters.

---

### 3. Model Architecture & Baselines
- **Baseline:** Logistic Regression with L2 regularization.
- **Ensemble:** Balanced Random Forest & Gradient Boosting (LightGBM/XGBoost).
- **Explainability:** TreeSHAP / SHAP values computed for each feature contribution.

---

### 4. Honest Machine Learning Invariant (§17, §68)
In strict accordance with Section 17 and Rule 68:
> **"No externally validated production accuracy claim."**
> Because public blockchain fraud ground-truth datasets suffer from extreme label bias, all ML models are evaluated against synthetic demonstration sets. The UI and documentation explicitly label model scores as heuristic investigative leads rather than scientific proof of guilt.
