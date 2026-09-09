# OMNICHAIN & CROSS-CHAIN TRACE METHODOLOGY (§18-§25)
## Bridge Protocol Correlation, DEX Tracing, and Asset Normalization

### 1. Problem Overview
Modern cyber-fraud syndicates operate across heterogeneous blockchain layers (Tron → Ethereum → Polygon → BSC). When funds cross a bridge or execute a decentralized swap, legacy single-chain wallet explorers terminate the trace. CryptoTrace-Sentinel implements an **Omnichain Trace Engine** capable of bridging semantic gaps across protocols.

---

### 2. Supported Bridge Protocol Adapters

#### A. LayerZero / Stargate Finance (§20)
- **Source Event:** OFT / Stargate router emits `SendMsg(dstChainId, recipient, amount, nonce)`.
- **Packet Correlation:** Extracts unique message GUID / payload packet ID.
- **Destination Event:** Correlates with destination router `ReceiveMsg` execution emitting credit/mint event.
- **Certainty:** Marked **Protocol-Derived Deterministic Linkage** when GUID matches; otherwise probabilistic.

#### B. Wormhole Portal Bridge (§21)
- **Source Event:** Core bridge contract emits `LogMessagePublished(emitterAddress, sequence, consistencyLevel)`.
- **Destination Event:** Wormhole relayer submits Guardian-signed VAA (Verifiable Action Approval).
- **Token Mapping:** Normalizes source wrapped token address against destination canonical contract.

#### C. THORChain Cross-Chain Swaps (§22)
- **Vault Inflow:** Detects deposit to THORChain Asgard Vault.
- **Memo Parser:** Inspects version-aware `OP_RETURN` or transaction memo containing routing instructions: `SWAP:POLYGON.USDT:0xRecipient`.
- **Destination Outflow:** Correlates outbound vault transaction with destination recipient.

---

### 3. DEX / Swap Trace & Value Preservation (§24)
When scammers swap assets (e.g. USDT → ETH via Uniswap or PancakeSwap), the platform does not treat the conversion as a loss of value:
- Identifies router contracts and swap pool event logs (`Swap(sender, amount0In, amount1In, amount0Out, amount1Out)`).
- Preserves input asset, output asset, conversion exchange rate, and value retention percentage.
- Represents the conversion as a single atomic `DEX_SWAP` edge connecting the token transformation.

---

### 4. Normalized Asset Identity Registry (§25)
Maintains canonical mappings across distinct chain deployments:
- `USDT` on Tron (`TR7NHqje...`) $\longleftrightarrow$ `USDT` on Ethereum (`0xdac17f...`) $\longleftrightarrow$ `USDT` on Polygon (`0xc2132d...`).
- Wrapped tokens (e.g. `WETH`, `anyUSDT`) are tracked as distinct on-chain representations until validated bridge mappings confirm equivalence.
