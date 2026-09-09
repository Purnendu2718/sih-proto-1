"""
Pure Python + NetworkX implementation of the bounded-BFS pathfinder and
peeling-chain detector for CryptoTrace-Sentinel.

Serves two purposes:
1. Explainable pure-Python implementation for hackathon technical evaluations.
2. Direct benchmarking comparison against the compiled C-Core (libtracer.dll).
"""

from collections import deque
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
import networkx as nx


@dataclass
class TxEdgeInput:
    from_addr: str
    to_addr: str
    amount: float
    timestamp_utc: int
    tx_hash: str
    chain_id: int


class NetworkXTracerCore:
    def __init__(self, edges: List[TxEdgeInput]):
        self.g = nx.MultiDiGraph()
        for e in edges:
            self.g.add_edge(
                e.from_addr,
                e.to_addr,
                amount=e.amount,
                timestamp_utc=e.timestamp_utc,
                tx_hash=e.tx_hash,
                chain_id=e.chain_id,
            )

    def trace_to_exchange(
        self,
        start_addr: str,
        exchange_addrs: List[str],
        max_hops: int = 5,
        max_time_window_seconds: int = 14400,
        min_amount_threshold: float = 1.0,
    ) -> Dict[str, Any]:
        """
        Bounded BFS searching for the shortest time-ordered path from start_addr
        to any address in exchange_addrs.
        """
        exchange_set = set(exchange_addrs)
        if start_addr not in self.g:
            return {"reached_exchange": False, "terminal_amount": 0.0, "hops": []}

        # Queue items: (current_node, depth, current_amount, last_timestamp, path_hops)
        queue = deque([(start_addr, 0, 0.0, 0, [])])
        visited = {start_addr}
        origin_ts = -1

        while queue:
            current, depth, amount, last_ts, path = queue.popleft()

            # Target CEX check
            if current in exchange_set and len(path) > 0:
                return {
                    "reached_exchange": True,
                    "terminal_amount": amount,
                    "hops": path,
                }

            if depth >= max_hops:
                continue

            # Expand outgoing edges
            for _, neighbor, key, edge_data in self.g.out_edges(current, keys=True, data=True):
                edge_amt = edge_data["amount"]
                edge_ts = edge_data["timestamp_utc"]
                edge_tx = edge_data["tx_hash"]

                if edge_amt < min_amount_threshold:
                    continue

                # Enforce temporal ordering (funds cannot travel backward in time)
                if len(path) > 0 and edge_ts < last_ts:
                    continue

                if origin_ts < 0:
                    origin_ts = edge_ts

                if max_time_window_seconds > 0 and (edge_ts - origin_ts) > max_time_window_seconds:
                    continue

                if neighbor in visited:
                    continue

                new_hop = {
                    "address": neighbor,
                    "hop_index": depth + 1,
                    "amount": edge_amt,
                    "timestamp_utc": edge_ts,
                    "tx_hash": edge_tx,
                }

                visited.add(neighbor)
                queue.append((
                    neighbor,
                    depth + 1,
                    edge_amt,
                    edge_ts,
                    path + [new_hop],
                ))

        return {"reached_exchange": False, "terminal_amount": 0.0, "hops": []}

    def check_peeling_chain(
        self, candidate_addr: str, fan_out_ratio_threshold: float = 2.0
    ) -> Dict[str, Any]:
        """
        Detects structuring peeling behavior: low fan-in (<=1) and rapid multi-output
        fan-out (>=2) with ratio above threshold.
        """
        if candidate_addr not in self.g:
            return {
                "address": candidate_addr,
                "fan_in": 0,
                "fan_out": 0,
                "fan_out_ratio": 0.0,
                "is_peeling_chain": False,
            }

        fan_in = self.g.in_degree(candidate_addr)
        fan_out = self.g.out_degree(candidate_addr)
        ratio = (fan_out / fan_in) if fan_in > 0 else 0.0
        is_peel = bool(fan_in <= 1 and fan_out >= 2 and ratio >= fan_out_ratio_threshold)

        return {
            "address": candidate_addr,
            "fan_in": fan_in,
            "fan_out": fan_out,
            "fan_out_ratio": round(ratio, 2),
            "is_peeling_chain": is_peel,
        }
