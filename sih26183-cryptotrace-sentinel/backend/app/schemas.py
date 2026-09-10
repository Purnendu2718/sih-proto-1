from pydantic import BaseModel
from typing import List, Optional, Literal


class GraphNode(BaseModel):
    id: str
    display_label: str
    truncated_address: str
    node_type: Literal["origin", "mule", "mixer_bridge", "cex", "unknown"]
    cex_role: Optional[Literal["deposit", "hotwallet"]] = None
    exchange_name: Optional[str] = None
    attribution_rule: Optional[str] = None
    confidence: Optional[float] = None
    chain: str
    color: str


class GraphEdge(BaseModel):
    source: str
    target: str
    token_symbol: str
    amount: float
    usd_value: Optional[float] = None
    timestamp_utc: int
    tx_hash: str
    is_likely_change: bool = False


class Graph(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]


class TraceStartRequest(BaseModel):
    case_id: str
    fir_number: str
    start_address: str
    chain: Literal["TRON", "EVM", "BTC"]
    data_mode: Literal["mock", "live"] = "mock"
    network: Optional[Literal["ETH", "BSC", "POLYGON"]] = "ETH"
    max_hops: int = 5
    max_time_window_seconds: int = 14400
    min_amount_threshold: float = 1.0


class TraceStartResponse(BaseModel):
    trace_id: str
    reached_exchange: bool
    exchange_attribution_message: Optional[str] = None
    terminal_amount: float
    hop_count: int
    trace_time_ms: float


class SearchRequest(BaseModel):
    query: str
    chain_hint: Optional[Literal["TRON", "EVM", "BTC"]] = None
    network: Optional[Literal["ETH", "BSC", "POLYGON"]] = "ETH"
    case_id: str = "LIVE-SEARCH"


class SearchResponse(BaseModel):
    detected_chain: str
    detected_type: str
    resolved_query: str
    graph: Graph


class ExpandRequest(BaseModel):
    address: str
    chain: Literal["TRON", "EVM", "BTC"]
    network: Optional[Literal["ETH", "BSC", "POLYGON"]] = "ETH"
    direction: Literal["in", "out", "both"] = "both"
    limit: int = 25
    case_id: str = "LIVE-SEARCH"


class VaspAttributionRequest(BaseModel):
    address: str


class VaspAttributionResponse(BaseModel):
    address: str
    is_known: bool
    category: str = "unknown"
    exchange_name: Optional[str] = None
    entity_label: Optional[str] = None
    attribution_rule: Optional[str] = None
    confidence: float = 0.0


class AutoInvestigateRequest(BaseModel):
    victim_address: str
    chain_hint: Optional[Literal["TRON", "EVM", "BTC"]] = None
    network: Optional[Literal["ETH", "BSC", "POLYGON"]] = "ETH"
    max_hops: int = 5
    max_time_window_seconds: int = 14400
    case_id: str = "AUTO-CASE"


class AutoInvestigateResponse(BaseModel):
    detected_chain: str
    reached_exchange: bool
    exchange_attribution_message: Optional[str] = None
    hop_count: int
    trace_time_ms: float
    golden_hour_seconds_elapsed: float


class FreezeNoticeRequest(BaseModel):
    case_id: str
    fir_number: str
    ncrp_ack_number: str
    investigating_officer: str
    police_station: str
    exchange_name: str
    compliance_email: str
    frozen_addresses: List[str]
    transaction_hashes: List[str]
    victim_amount_inr: float
    narrative: str
    fraud_date_ddmmyyyy: str
    primary_token_symbol: str = "USDT"
