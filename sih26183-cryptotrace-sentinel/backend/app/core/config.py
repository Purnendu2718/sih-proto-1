"""
config.py - Application configuration and environment key management.
"""

import os
from pathlib import Path
from pydantic import BaseModel, Field


class Settings(BaseModel):
    # Application Info
    APP_NAME: str = "CryptoTrace-Sentinel"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "SIH26183 - Institutional-Grade Multi-Chain Forensic Investigation Workstation"

    # API Keys & Endpoints (with defaults / public RPC endpoints)
    TRONGRID_API_KEY: str = Field(default_factory=lambda: os.getenv("TRONGRID_API_KEY", ""))
    TRONGRID_BASE_URL: str = "https://api.trongrid.io"

    ETHERSCAN_API_KEY: str = Field(default_factory=lambda: os.getenv("ETHERSCAN_API_KEY", ""))
    ETHERSCAN_BASE_URL: str = "https://api.etherscan.io/api"

    ALCHEMY_API_KEY: str = Field(default_factory=lambda: os.getenv("ALCHEMY_API_KEY", ""))
    ALCHEMY_ETH_URL: str = Field(
        default_factory=lambda: f"https://eth-mainnet.g.alchemy.com/v2/{os.getenv('ALCHEMY_API_KEY', 'demo')}"
    )

    MEMPOOL_BASE_URL: str = "https://mempool.space/api"

    # Forensic & Statutory Parameters
    USD_TO_INR_CONVERSION_RATE: float = 87.50
    DEFAULT_DUST_THRESHOLD_USD: float = 1.0
    DEFAULT_MAX_HOPS: int = 5
    GOLDEN_HOUR_SLA_HOURS: int = 2

    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parents[2]
    DATA_DIR: Path = Path(__file__).resolve().parents[1] / "data"
    SAMPLE_CASES_DIR: Path = Path(__file__).resolve().parents[2] / "sample_cases"


settings = Settings()
