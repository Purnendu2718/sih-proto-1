import os
import sys
import ctypes
from ctypes import c_int, c_double, c_longlong, c_char, c_char_p, Structure, POINTER, c_void_p
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

MAX_ADDR_LEN = 64
MAX_TX_LEN = 80
MAX_PATH_HOPS = 16


class PathResultStruct(Structure):
    _fields_ = [
        ("reached_exchange", c_int),
        ("hop_count", c_int),
        ("terminal_amount", c_double),
        ("path_addresses", (c_char * MAX_ADDR_LEN) * MAX_PATH_HOPS),
        ("path_tx_hashes", (c_char * MAX_TX_LEN) * MAX_PATH_HOPS),
    ]


@dataclass
class TxEdgeInput:
    from_addr: str
    to_addr: str
    amount: float
    timestamp_utc: int
    tx_hash: str
    chain_id: int = 0  # 0=TRON, 1=EVM, 2=BTC


def _find_lib_path() -> Optional[Path]:
    curr_dir = Path(__file__).resolve().parent
    candidates = [
        curr_dir / "libtracer.dll",
        curr_dir / "libtracer.so",
        curr_dir / "libtracer.dylib",
        curr_dir.parent.parent / "core" / "libtracer.dll",
    ]
    for p in candidates:
        if p.exists():
            return p
    return None


class NativeTracerBridge:
    def __init__(self, lib_path: Path):
        self.lib = ctypes.CDLL(str(lib_path))

        # create_graph(int, int) -> Graph*
        self.lib.create_graph.argtypes = [c_int, c_int]
        self.lib.create_graph.restype = c_void_p

        # free_graph(Graph*)
        self.lib.free_graph.argtypes = [c_void_p]
        self.lib.free_graph.restype = None

        # add_node(Graph*, const char*, int) -> int
        self.lib.add_node.argtypes = [c_void_p, c_char_p, c_int]
        self.lib.add_node.restype = c_int

        # add_edge(Graph*, const char*, const char*, double, long long, const char*, int)
        self.lib.add_edge.argtypes = [c_void_p, c_char_p, c_char_p, c_double, c_longlong, c_char_p, c_int]
        self.lib.add_edge.restype = None

        # find_shortest_vasp_path(Graph*, const char*, int) -> PathResultStruct
        self.lib.find_shortest_vasp_path.argtypes = [c_void_p, c_char_p, c_int]
        self.lib.find_shortest_vasp_path.restype = PathResultStruct

        # detect_peeling_chain(Graph*, const char*) -> int
        self.lib.detect_peeling_chain.argtypes = [c_void_p, c_char_p]
        self.lib.detect_peeling_chain.restype = c_int


# Attempt loading C library
_LIB_PATH = _find_lib_path()
_NATIVE_BRIDGE: Optional[NativeTracerBridge] = None

if _LIB_PATH:
    try:
        _NATIVE_BRIDGE = NativeTracerBridge(_LIB_PATH)
        logger.info(f"Loaded high-performance native tracer core from {_LIB_PATH}")
    except Exception as exc:
        logger.warning(f"Failed to load native tracer from {_LIB_PATH}: {exc}. Resorting to NetworkX fallback.")
else:
    logger.warning("Native tracer library not found. Resorting to NetworkX fallback.")


class BlockchainTracerCore:
    def __init__(self, edges: List[TxEdgeInput]):
        self.edges = edges
        self.native = _NATIVE_BRIDGE

    def trace_to_exchange(
        self,
        start_addr: str,
        exchange_addrs: List[str],
        max_hops: int = 5,
        max_time_window_seconds: int = 14400,
        min_amount_threshold: float = 1.0,
    ) -> Dict[str, Any]:
        exchange_set = set(exchange_addrs)

        # Filter edges according to minimum amount
        valid_edges = [e for e in self.edges if e.amount >= min_amount_threshold]

        if self.native:
            return self._trace_native(start_addr, exchange_set, valid_edges, max_hops)
        else:
            return self._trace_networkx(start_addr, exchange_set, valid_edges, max_hops)

    def _trace_native(
        self,
        start_addr: str,
        exchange_set: set,
        edges: List[TxEdgeInput],
        max_hops: int
    ) -> Dict[str, Any]:
        node_count_estimate = len(edges) * 2 + 10
        edge_count = len(edges)

        graph_ptr = self.native.lib.create_graph(node_count_estimate, edge_count)
        if not graph_ptr:
            return self._trace_networkx(start_addr, exchange_set, edges, max_hops)

        try:
            # Add exchange nodes first
            for ex in exchange_set:
                self.native.lib.add_node(graph_ptr, ex.encode("utf-8"), 1)

            # Add edges
            for e in edges:
                self.native.lib.add_edge(
                    graph_ptr,
                    e.from_addr.encode("utf-8"),
                    e.to_addr.encode("utf-8"),
                    c_double(e.amount),
                    c_longlong(e.timestamp_utc),
                    e.tx_hash.encode("utf-8"),
                    c_int(e.chain_id),
                )

            res: PathResultStruct = self.native.lib.find_shortest_vasp_path(
                graph_ptr, start_addr.encode("utf-8"), max_hops
            )

            if res.reached_exchange:
                hops_list = []
                for i in range(1, res.hop_count + 1):
                    raw_addr = getattr(res.path_addresses[i], "value", res.path_addresses[i])
                    addr_str = raw_addr.decode("utf-8", errors="replace") if isinstance(raw_addr, bytes) else str(raw_addr)
                    raw_tx = getattr(res.path_tx_hashes[i - 1], "value", res.path_tx_hashes[i - 1]) if (i - 1 < res.hop_count) else b""
                    tx_str = raw_tx.decode("utf-8", errors="replace") if isinstance(raw_tx, bytes) else str(raw_tx)
                    hops_list.append({
                        "hop_index": i,
                        "address": addr_str,
                        "tx_hash": tx_str,
                    })

                return {
                    "reached_exchange": True,
                    "hops": hops_list,
                    "terminal_amount": res.terminal_amount,
                    "execution_mode": "native_c_core",
                }
            else:
                return {
                    "reached_exchange": False,
                    "hops": [],
                    "terminal_amount": 0.0,
                    "execution_mode": "native_c_core",
                }
        finally:
            self.native.lib.free_graph(graph_ptr)

    def _trace_networkx(
        self,
        start_addr: str,
        exchange_set: set,
        edges: List[TxEdgeInput],
        max_hops: int
    ) -> Dict[str, Any]:
        from collections import deque

        adj = {}
        edge_map = {}
        for e in edges:
            if e.from_addr not in adj:
                adj[e.from_addr] = []
            adj[e.from_addr].append(e.to_addr)
            edge_map[(e.from_addr, e.to_addr)] = e

        queue = deque([(start_addr, [start_addr], [])])
        visited = {start_addr}

        while queue:
            curr_addr, path_addrs, path_txs = queue.popleft()
            hop_len = len(path_addrs) - 1

            if curr_addr != start_addr and curr_addr in exchange_set:
                hops_list = [
                    {"hop_index": i, "address": path_addrs[i], "tx_hash": path_txs[i - 1]}
                    for i in range(1, len(path_addrs))
                ]
                last_edge = edge_map.get((path_addrs[-2], path_addrs[-1])) if len(path_addrs) >= 2 else None
                term_amount = last_edge.amount if last_edge else 0.0
                return {
                    "reached_exchange": True,
                    "hops": hops_list,
                    "terminal_amount": term_amount,
                    "execution_mode": "python_networkx_fallback",
                }

            if hop_len >= max_hops:
                continue

            for nxt in adj.get(curr_addr, []):
                if nxt not in visited:
                    visited.add(nxt)
                    edge = edge_map.get((curr_addr, nxt))
                    tx_h = edge.tx_hash if edge else ""
                    queue.append((nxt, path_addrs + [nxt], path_txs + [tx_h]))

        return {
            "reached_exchange": False,
            "hops": [],
            "terminal_amount": 0.0,
            "execution_mode": "python_networkx_fallback",
        }

    def check_peeling_chain(self, address: str) -> Dict[str, Any]:
        outgoing = [e for e in self.edges if e.from_addr == address]
        incoming = [e for e in self.edges if e.to_addr == address]

        is_peel = False
        if len(outgoing) == 2:
            total_out = sum(e.amount for e in outgoing)
            if total_out > 0:
                max_amt = max(outgoing[0].amount, outgoing[1].amount)
                is_peel = (max_amt / total_out) >= 0.80

        return {
            "address": address,
            "fan_in": len(incoming),
            "fan_out": len(outgoing),
            "is_peeling_chain": is_peel,
        }
