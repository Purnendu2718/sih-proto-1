import ctypes
import os
import platform
from dataclasses import dataclass
from typing import List

MAX_LABEL_LEN = 64
MAX_ADDR_LEN = 64
MAX_PATH_HOPS = 8


class Edge(ctypes.Structure):
    _fields_ = [
        ("from_addr", ctypes.c_char * MAX_ADDR_LEN),
        ("to_addr", ctypes.c_char * MAX_ADDR_LEN),
        ("amount", ctypes.c_double),
        ("timestamp_utc", ctypes.c_int64),
        ("tx_hash", ctypes.c_char * MAX_ADDR_LEN),
        ("chain_id", ctypes.c_int),
    ]


class PathHop(ctypes.Structure):
    _fields_ = [
        ("address", ctypes.c_char * MAX_ADDR_LEN),
        ("hop_index", ctypes.c_int),
        ("amount_at_hop", ctypes.c_double),
        ("timestamp_utc", ctypes.c_int64),
        ("tx_hash", ctypes.c_char * MAX_ADDR_LEN),
        ("is_exchange_hit", ctypes.c_int),
        ("exchange_label", ctypes.c_char * MAX_LABEL_LEN),
    ]


class TraceResult(ctypes.Structure):
    _fields_ = [
        ("hops", PathHop * MAX_PATH_HOPS),
        ("hop_count", ctypes.c_int),
        ("reached_exchange", ctypes.c_int),
        ("terminal_amount", ctypes.c_double),
        ("time_to_trace_ms", ctypes.c_double),
    ]


class PeelingSignal(ctypes.Structure):
    _fields_ = [
        ("cluster_address", ctypes.c_char * MAX_ADDR_LEN),
        ("fan_in_count", ctypes.c_int),
        ("fan_out_count", ctypes.c_int),
        ("fan_out_ratio", ctypes.c_double),
        ("is_peeling_chain", ctypes.c_int),
    ]


class _GraphOpaque(ctypes.Structure):
    pass


def _load_library():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    if platform.system() == "Windows":
        return ctypes.WinDLL(os.path.join(base_dir, "libtracer.dll"))
    return ctypes.CDLL(os.path.join(base_dir, "libtracer.so"))


_lib = _load_library()

_lib.graph_create.argtypes = [ctypes.c_int]
_lib.graph_create.restype = ctypes.POINTER(_GraphOpaque)

_lib.graph_add_edge.argtypes = [
    ctypes.POINTER(_GraphOpaque), ctypes.c_char_p, ctypes.c_char_p,
    ctypes.c_double, ctypes.c_int64, ctypes.c_char_p, ctypes.c_int,
]
_lib.graph_add_edge.restype = None

_lib.graph_free.argtypes = [ctypes.POINTER(_GraphOpaque)]
_lib.graph_free.restype = None

_lib.bounded_bfs_to_exchange.argtypes = [
    ctypes.POINTER(_GraphOpaque), ctypes.c_char_p,
    ctypes.POINTER(ctypes.c_char_p), ctypes.c_int,
    ctypes.c_int, ctypes.c_int64, ctypes.c_double,
]
_lib.bounded_bfs_to_exchange.restype = TraceResult

_lib.detect_peeling_chain.argtypes = [ctypes.POINTER(_GraphOpaque), ctypes.c_char_p, ctypes.c_double]
_lib.detect_peeling_chain.restype = PeelingSignal


@dataclass
class TxEdgeInput:
    from_addr: str
    to_addr: str
    amount: float
    timestamp_utc: int
    tx_hash: str
    chain_id: int


class BlockchainTracerCore:
    def __init__(self, edges: List[TxEdgeInput]):
        self._graph = _lib.graph_create(max(len(edges), 16))
        for e in edges:
            _lib.graph_add_edge(
                self._graph,
                e.from_addr.encode("utf-8"), e.to_addr.encode("utf-8"),
                e.amount, e.timestamp_utc, e.tx_hash.encode("utf-8"), e.chain_id,
            )

    def trace_to_exchange(self, start_addr: str, exchange_addrs: List[str],
                           max_hops: int = 5, max_time_window_seconds: int = 14400,
                           min_amount_threshold: float = 1.0) -> dict:
        addr_array = (ctypes.c_char_p * len(exchange_addrs))(
            *[a.encode("utf-8") for a in exchange_addrs]
        )
        result = _lib.bounded_bfs_to_exchange(
            self._graph, start_addr.encode("utf-8"),
            addr_array, len(exchange_addrs),
            max_hops, max_time_window_seconds, min_amount_threshold,
        )
        hops = []
        for i in range(result.hop_count):
            h = result.hops[i]
            hops.append({
                "address": h.address.decode("utf-8"),
                "hop_index": h.hop_index,
                "amount": h.amount_at_hop,
                "timestamp_utc": h.timestamp_utc,
                "tx_hash": h.tx_hash.decode("utf-8"),
            })
        return {
            "reached_exchange": bool(result.reached_exchange),
            "terminal_amount": result.terminal_amount,
            "hops": hops,
        }

    def check_peeling_chain(self, candidate_addr: str, fan_out_ratio_threshold: float = 2.0) -> dict:
        signal = _lib.detect_peeling_chain(self._graph, candidate_addr.encode("utf-8"), fan_out_ratio_threshold)
        return {
            "address": signal.cluster_address.decode("utf-8"),
            "fan_in": signal.fan_in_count,
            "fan_out": signal.fan_out_count,
            "fan_out_ratio": signal.fan_out_ratio,
            "is_peeling_chain": bool(signal.is_peeling_chain),
        }

    def __del__(self):
        try:
            _lib.graph_free(self._graph)
        except Exception:
            pass
