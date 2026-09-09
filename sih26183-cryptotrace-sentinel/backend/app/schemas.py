from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class TraceStartRequest(BaseModel):
    # Support both address (Prompt 3) and start_address (legacy)
    address: Optional[str] = None
    start_address: Optional[str] = None
    victim_address: Optional[str] = None
    tx_hash: Optional[str] = None
    scenario: Optional[str] = None
    case_id: Optional[str] = None
    fir_number: Optional[str] = "FIR/CYBER/2026/0402"
    chain: Optional[str] = None  # "TRON" | "EVM" | "BTC"
    data_mode: Optional[str] = "mock"  # "mock" | "live"
    use_mock_fallback: bool = True
    max_hops: int = 5
    max_time_window_seconds: int = 14400
    min_amount_threshold: float = 1.0

    def get_target_address(self) -> str:
        return (self.address or self.start_address or self.victim_address or "").strip()


class TraceStartResponse(BaseModel):
    case_id: str
    trace_id: str
    detected_chain: str
    transfer_count: int
    data_source: str  # "live" | starts with "mock_fallback:"
    warning: Optional[str] = None
    reached_exchange: bool = False
    destination_vasp: Optional[str] = None
    terminal_amount: float = 0.0
    hop_count: int = 0
    trace_time_ms: float = 0.0
    primary_path_addresses: List[str] = []
    typology_summary: str = ""


class GraphNode(BaseModel):
    id: str
    label: str
    node_type: str  # victim | mule | peel_outlet | exchange_deposit | exchange_hotwallet
    node_class: Optional[str] = None  # alias for frontend styling
    risk_score: int
    role_tag: str
    cluster_label: str
    balance_hint: Optional[str] = None
    label_confidence: float = 1.0
    is_on_primary_path: bool = False
    isCorePath: Optional[bool] = None
    parentBoxId: Optional[str] = None
    risk_severity: Optional[str] = "HIGH"
    risk_breakdown: Optional[Dict[str, Any]] = None
    risk_rules: Optional[List[Dict[str, Any]]] = None
    risk_explanation: Optional[str] = None


class GraphEdge(BaseModel):
    source: str
    target: str
    amount: float
    token: str
    token_symbol: Optional[str] = None
    timestamp_utc: int
    time_str: str
    tx_hash: str
    is_primary: bool
    isCorePath: Optional[bool] = None
    parentBoxId: Optional[str] = None
    velocity_mins: int


class ModusOperandiBrief(BaseModel):
    title: str
    typology: str
    time_to_exchange_mins: int
    stolen_amount_usd: float
    intermediary_mules_count: int
    identified_vasp: str
    target_deposit_wallet: str
    recommended_legal_action: str
    narrative: str
    case_risk_score: Optional[int] = 85
    case_risk_severity: Optional[str] = "HIGH"
    case_risk_breakdown: Optional[Dict[str, Any]] = None


class TraceGraphResponse(BaseModel):
    case_id: str
    trace_id: str
    data_source: str = "live"
    nodes: List[GraphNode]
    edges: List[GraphEdge]
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
    path: List[OffRampPathEdge]
    terminal_label: str
    disclaimer: str = (
        "Heuristic off-ramp detection is an investigative lead, not conclusive proof of account "
        "ownership or CEX deposit attribution. Verification with exchange compliance under Section 94 BNSS is required."
    )


class VaspAttributionRequest(BaseModel):
    address: str


class VaspAttributionResponse(BaseModel):
    address: str
    attributed: bool = False
    attributed_to: Optional[str] = None
    confidence: float = 0.0
    rule: str = "NONE"
    evidence_tx_hash: Optional[str] = None
    disclaimer: str = (
        "Attribution based on known VASP cluster heuristics. Exchange records must be "
        "subpoenaed to establish beneficial ownership."
    )
    # Backwards compatibility fields
    is_known_vasp: bool = False
    exchange_name: Optional[str] = None
    entity_label: Optional[str] = None
    compliance_email: Optional[str] = None
    attribution_method: str = "none"


class FreezeNoticeRequest(BaseModel):
    case_id: str
    fir_number: str
    investigating_officer: str
    police_station: str
    exchange_name: str
    compliance_email: str
    frozen_addresses: List[str]
    transaction_hashes: List[str]
    victim_amount_inr: float
    narrative: str


class NodeExpandRequest(BaseModel):
    case_id: str
    address: str
    direction: Optional[str] = "both"  # "inbound" | "outbound" | "both"


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

