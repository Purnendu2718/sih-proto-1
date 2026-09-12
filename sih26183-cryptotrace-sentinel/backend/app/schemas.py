from pydantic import BaseModel
from typing import List, Optional, Literal, Dict, Any

ProvenanceType = Literal["automated_clustering", "offchain_verified", "analyst_reviewed"]
RiskScoringMode = Literal["static_entity", "dynamic_behavioral"]


class GraphNode(BaseModel):
    id: str
    display_label: str
    truncated_address: str
    node_type: Literal["origin", "mule", "mixer_bridge", "bridge", "dex", "cex", "unknown"]
    cex_role: Optional[Literal["deposit", "hotwallet"]] = None
    exchange_name: Optional[str] = None
    attribution_rule: Optional[str] = None
    confidence: Optional[float] = None
    chain: str
    color: str
    provenance: Optional[ProvenanceType] = "automated_clustering"
    risk_score: Optional[int] = 0
    risk_mode: Optional[RiskScoringMode] = "dynamic_behavioral"


class GraphEdge(BaseModel):
    source: str
    target: str
    token_symbol: str
    amount: float
    usd_value: Optional[float] = None
    timestamp_utc: int
    tx_hash: str
    is_likely_change: bool = False
    edge_type: Optional[str] = "transfer"
    chain: Optional[str] = None
    description: Optional[str] = None
    bridge_protocol: Optional[str] = None
    chain_transition: Optional[str] = None


class Graph(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    total_count: Optional[int] = None
    offset: Optional[int] = None
    limit: Optional[int] = None
    has_more: Optional[bool] = None


class ModusOperandiBrief(BaseModel):
    title: str = ""
    typology: str = ""
    time_to_exchange_mins: int = 0
    stolen_amount_usd: float = 0.0
    intermediary_mules_count: int = 0
    identified_vasp: str = ""
    target_deposit_wallet: str = ""
    recommended_legal_action: str = ""
    narrative: str = ""
    case_risk_score: Optional[int] = 85
    case_risk_severity: Optional[str] = "HIGH"
    case_risk_breakdown: Optional[Dict[str, Any]] = None


class TraceGraphResponse(BaseModel):
    case_id: str = "CASE-LIVE"
    trace_id: str = "TRACE-LIVE"
    data_source: str = "live"
    nodes: List[Any] = []
    edges: List[Any] = []
    brief: Optional[ModusOperandiBrief] = None
    primary_path: List[str] = []


class OffRampPathEdge(BaseModel):
    source: str
    target: str
    amount: float
    token: str
    tx_hash: str
    timestamp_utc: int


class OffRampResponse(BaseModel):
    found: bool
    hops_searched: int
    truncated: bool
    path: List[OffRampPathEdge] = []
    terminal_label: str = ""
    disclaimer: str = ""


class NodeExpandRequest(BaseModel):
    case_id: str
    address: str
    direction: Optional[str] = "both"


class NodeExpandResponse(BaseModel):
    expanded_address: str
    new_nodes: List[Dict[str, Any]]
    new_edges: List[Dict[str, Any]]
    total_nodes: int
    total_edges: int


class NoticeTextResponse(BaseModel):
    case_id: str
    fir_number: str
    exchange_name: str
    compliance_email: str
    evidence_digest_sha256: str
    statutory_seal: str
    notice_text: str


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
    offset: int = 0
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
    provenance: ProvenanceType = "automated_clustering"


class ProvenanceUpdateRequest(BaseModel):
    address: str
    provenance: ProvenanceType


class ProvenanceUpdateResponse(BaseModel):
    address: str
    provenance: ProvenanceType
    success: bool
    message: str


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


class EvidenceExportRequest(BaseModel):
    case_id: str
    fir_number: Optional[str] = "FIR/CYBER/2026/001"
    ncrp_ack_number: Optional[str] = "NCRP-2026-091823"
    investigating_officer: Optional[str] = "Insp. Vikram Rathore"
    police_station: Optional[str] = "Cyber Crime Police Station"
    target_address: Optional[str] = None
    chain: str = "TRON"
    incident_date: Optional[str] = None
    victim_amount_inr: Optional[float] = 485000.0
    token_symbol: str = "USDT"
    narrative: Optional[str] = None
    nodes: Optional[List[Dict[str, Any]]] = None
    edges: Optional[List[Dict[str, Any]]] = None
    risk_score: Optional[int] = None
    risk_severity: Optional[str] = None
    risk_provenance: Optional[List[Dict[str, Any]]] = None


class ClusterDetectRequest(BaseModel):
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []
    timing_threshold_seconds: Optional[int] = 180


class ClusterDetectResponse(BaseModel):
    total_indirect_links: int
    indirect_edges: List[Dict[str, Any]]
    clusters: List[Dict[str, Any]]
    detection_summary: str


class RiskEvaluateRequest(BaseModel):
    address: str
    entity_name: Optional[str] = None
    entity_category: Optional[str] = None
    historical_hops: Optional[List[Dict[str, Any]]] = None
    incoming_txs: Optional[List[Dict[str, Any]]] = None
    outgoing_txs: Optional[List[Dict[str, Any]]] = None
    sanctioned_proximity_hops: Optional[int] = None
    mixer_interaction: Optional[bool] = None
    rapid_fan_out: Optional[bool] = None
    age_hours: Optional[float] = None


class RiskEvaluateResponse(BaseModel):
    address: str
    risk_score: int
    severity: str
    scoring_mode: RiskScoringMode
    risk_mode: RiskScoringMode
    is_blended: bool = False
    entity_match: Optional[Dict[str, Any]] = None
    breakdown: Dict[str, Any]
    rules_applied: List[str]
    explanation: str


class BatchScreeningRequest(BaseModel):
    addresses: List[str]
    case_id: Optional[str] = None
    file_name: Optional[str] = None


class ScreeningItemResult(BaseModel):
    address: str
    chain: str
    risk_score: int
    risk_mode: str
    severity: str
    sanctions_match: bool
    sanctions_entity: Optional[str] = None
    sanctions_authority: Optional[str] = None
    sanctions_program: Optional[str] = None
    provenance: str
    category: str
    entity_label: Optional[str] = None
    explanation: str


class BatchJobSummary(BaseModel):
    total_screened: int = 0
    sanctions_hits: int = 0
    critical_risk: int = 0
    high_risk: int = 0
    moderate_risk: int = 0
    clean_count: int = 0
    chains: Optional[Dict[str, int]] = None
    provenance: Optional[Dict[str, int]] = None
    duration_ms: Optional[int] = 0


class BatchScreeningJobResponse(BaseModel):
    job_id: str
    status: str
    total: int
    processed: int
    progress_pct: float
    created_utc: int
    completed_utc: Optional[int] = None
    duration_ms: int = 0
    file_name: Optional[str] = None
    summary: Optional[BatchJobSummary] = None
    results: List[ScreeningItemResult] = []
    error: Optional[str] = None


class TimelineSnapshotsRequest(BaseModel):
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []
    case_id: Optional[str] = None


class TimelineSnapshotsResponse(BaseModel):
    total_snapshots: int
    snapshots: List[Dict[str, Any]]


class GroundedDataPoint(BaseModel):
    type: str  # address | tx_hash | risk_score | provenance | sanctions | cluster
    value: str
    entity_label: Optional[str] = None
    relevance: str


class CaseChatRequest(BaseModel):
    query: str
    case_id: Optional[str] = None
    graph: Optional[Dict[str, Any]] = None
    case_meta: Optional[Dict[str, Any]] = None
    history: Optional[List[Dict[str, str]]] = None


class CaseChatResponse(BaseModel):
    answer: str
    grounded_data_points: List[GroundedDataPoint] = []
    recommended_police_actions: List[str] = []
    suggested_followups: List[str] = []
    is_grounded: bool = True
    model_name: str
    execution_time_ms: int = 0
    case_id: Optional[str] = None


class PublicLookupRequest(BaseModel):
    query: str
    chain_hint: Optional[str] = None


class PublicLookupResponse(BaseModel):
    query: str
    query_type: Literal["address", "tx_hash", "unknown"]
    chain: str
    risk_score: int
    severity: str
    risk_mode: str
    top_labels: List[str] = []
    sanctions_match: bool = False
    sanctions_details: Optional[Dict[str, Any]] = None
    provenance: str = "automated_clustering"
    summary: str
    rate_limit: Optional[Dict[str, Any]] = None



