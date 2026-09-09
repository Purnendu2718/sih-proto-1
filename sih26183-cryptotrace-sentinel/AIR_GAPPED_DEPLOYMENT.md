# SOVEREIGN AIR-GAPPED DEPLOYMENT GUIDE (§49)
## Disconnected Infrastructure Installation for Indian Police & State Cyber Cells

### 1. Overview & Sovereign Guarantees
To comply with Ministry of Home Affairs (MHA) and Indian Cyber Crime Coordination Centre (I4C) security directives, CryptoTrace-Sentinel is engineered to operate completely offline in an **Air-Gapped Sovereign Environment**:
- **Zero Outbound Telemetry:** No analytics pings, no license verification beacons, no external Google Fonts or CDN requests.
- **Local Embedded Datastores:** SQLite/PostgreSQL databases running inside isolated container boundaries.
- **Local Cryptographic Verification:** All SHA-256 and Merkle tree calculations execute on local CPU.
- **Keyless Architecture:** Zero private key handling or transaction broadcasting capabilities.

---

### 2. Air-Gapped Deployment Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│              Sovereign Police Workstation (Offline)         │
│  Browser: http://localhost:3000 (React Forensic Console)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Internal Docker Bridge)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            FastAPI Sovereign Gateway (Container)            │
│  Port: 8000 • AIR_GAPPED_MODE=true • Local RBAC            │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│ Cases & Audit│        │  Local VASP  │        │   Evidence   │
│ SQLite DB    │        │  Attribution │        │ Object Vault │
│ (Local disk) │        │  (Local DB)  │        │ (Local disk) │
└──────────────┘        └──────────────┘        └──────────────┘
```

---

### 3. Step-by-Step Air-Gapped Provisioning

#### Step 1: Package Container Images on Staging Machine
On an internet-connected staging terminal with Docker installed:
```bash
# Clone the verified repository
git clone https://github.com/your-org/cryptotrace-sentinel.git
cd cryptotrace-sentinel

# Build the sovereign production containers
docker compose build

# Save container images to compressed tar archives
docker save -o cryptotrace-backend.tar cryptotrace-sentinel-backend:latest
docker save -o cryptotrace-frontend.tar cryptotrace-sentinel-frontend:latest
```

#### Step 2: Transfer Artifacts to Secure Media
Transfer `cryptotrace-backend.tar`, `cryptotrace-frontend.tar`, `docker-compose.yml`, and `sample_cases/` to a government-approved encrypted USB drive conforming to state cyber SOPs.

#### Step 3: Load & Launch in Disconnected Forensic Lab
On the air-gapped forensic workstation:
```bash
# Load container images into local Docker daemon
docker load -i cryptotrace-backend.tar
docker load -i cryptotrace-frontend.tar

# Verify environment configuration
export AIR_GAPPED_MODE=true
export DATA_MODE=mock # Or connect to local sovereign full node RPC

# Launch sovereign stack
docker compose up -d
```

---

### 4. Air-Gapped Mode Safety Invariant (§49)
When `AIR_GAPPED_MODE=true` is set in `.env`:
- Any outbound network request to public explorers (TronGrid, Etherscan, Mempool.space) is **blocked programmatically at the network client level**.
- Attempting an external live call immediately raises an explicit error:
  > `"Network access blocked: AIR_GAPPED_MODE=true. System is running in disconnected sovereign mode. Use local analytical indexes or pre-imported case datasets."`
- Guarantees 100% data sovereignty; zero case metadata leaves the police station.
