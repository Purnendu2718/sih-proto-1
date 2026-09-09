"""
graph_model.py - Unified Forensic Transaction Graph Data Model.
Conforms to Section 6 specifications:
9 Node Types: ADDRESS, ENTITY, TRANSACTION, TOKEN, CONTRACT, VASP, BRIDGE, MIXER, DEX.
4 Edge Classes: OBSERVED, INFERRED, HEURISTIC, CONFIRMED_EXTERNAL.
"""

from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
import time


class NodeType(str, Enum):
    ADDRESS = "address"
    ENTITY = "entity"
    TRANSACTION = "transaction"
    TOKEN = "token"
    CONTRACT = "contract"
    VASP = "vasp"
    BRIDGE = "bridge"
    MIXER = "mixer"
    DEX = "dex"


class EdgeClass(str, Enum):
    OBSERVED = "OBSERVED"                           # Direct verified on-chain ledger transfer
    INFERRED = "INFERRED"                           # Temporal or behavioral linkage
    HEURISTIC = "HEURISTIC"                         # Peeling chain, change output, sweep consolidation
    CONFIRMED_EXTERNAL = "CONFIRMED_EXTERNAL"       # Subpoenaed VASP KYC, TagPack, agency intel


class ForensicNode(BaseModel):
    id: str
    label: str
    node_type: NodeType = NodeType.ADDRESS
    entity_name: Optional[str] = None
    chain: str = "EVM"
    balance_hint: Optional[float] = None
    risk_score: int = 0
    confidence: float = 1.0
    is_core_path: bool = False
    evidence_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ForensicEdge(BaseModel):
    id: str
    source: str
    target: str
    asset: str = "USDT"
    amount: float
    amount_inr: Optional[float] = None
    timestamp_utc: int
    tx_hash: str
    block_number: Optional[int] = None
    chain: str = "EVM"
    evidence_id: Optional[str] = None
    edge_class: EdgeClass = EdgeClass.OBSERVED
    relationship_type: str = "TRANSFER"
    confidence: float = 1.0
    is_primary: bool = False
    metadata: Dict[str, Any] = Field(default_factory=dict)


class UnifiedForensicGraph:
    """In-memory heterogeneous forensic graph structure."""

    def __init__(self, case_id: str):
        self.case_id = case_id
        self.nodes: Dict[str, ForensicNode] = {}
        self.edges: List[ForensicEdge] = []

    def add_node(self, node: ForensicNode):
        self.nodes[node.id] = node

    def add_edge(self, edge: ForensicEdge):
        self.edges.append(edge)

    def to_cytoscape(self) -> Dict[str, Any]:
        """Serialize into Cytoscape.js format for canvas rendering."""
        cy_nodes = [
            {
                "data": {
                    "id": n.id,
                    "label": n.label,
                    "role": n.node_type.value,
                    "node_type": n.node_type.value,
                    "node_class": n.node_type.value,
                    "entity_name": n.entity_name,
                    "chain": n.chain,
                    "risk_score": n.risk_score,
                    "label_confidence": n.confidence,
                    "isCorePath": n.is_core_path,
                    "evidence_id": n.evidence_id,
                    **n.metadata,
                }
            }
            for n in self.nodes.values()
        ]

        cy_edges = [
            {
                "data": {
                    "id": e.id,
                    "source": e.source,
                    "target": e.target,
                    "label": f"{e.asset} {e.amount:,.2f}",
                    "asset": e.asset,
                    "amount": e.amount,
                    "amount_inr": e.amount_inr,
                    "timestamp_utc": e.timestamp_utc,
                    "tx_hash": e.tx_hash,
                    "chain": e.chain,
                    "edge_class": e.edge_class.value,
                    "relationship_type": e.relationship_type,
                    "confidence": e.confidence,
                    "is_primary": e.is_primary,
                    "isCorePath": e.is_primary,
                    "evidence_id": e.evidence_id,
                    **e.metadata,
                }
            }
            for e in self.edges
        ]

        return {"nodes": cy_nodes, "edges": cy_edges}
