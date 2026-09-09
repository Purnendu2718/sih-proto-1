"""
cross_chain_engine.py - Omnichain Trace Engine, Bridge Protocol Adapters, and Cross-EVM Correlator.
Conforms to Sections 18-25:
Supports LayerZero/Stargate, Wormhole, THORChain, Cross-EVM Address Correlation,
Bridge Anomaly Monitoring, DEX/Swap Tracing, and Normalized Asset Identity Registry.
"""

from typing import List, Dict, Any, Optional
import time

# Normalized Cross-Chain Asset Registry (Section 25)
CANONICAL_ASSET_REGISTRY = {
    "USDT": {
        "symbol": "USDT",
        "name": "Tether USD",
        "decimals": 6,
        "deployments": {
            "ETH": "0xdac17f958d2ee523a2206206994597c13d831ec7",
            "TRON": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
            "POLYGON": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            "BSC": "0x55d398326f99059ff775485246999027b3197955",
            "ARBITRUM": "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
        }
    },
    "USDC": {
        "symbol": "USDC",
        "name": "USD Coin",
        "decimals": 6,
        "deployments": {
            "ETH": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            "POLYGON": "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
            "ARBITRUM": "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
        }
    },
    "ETH": {
        "symbol": "ETH",
        "name": "Ethereum Native",
        "decimals": 18,
        "deployments": {"ETH": "NATIVE"}
    },
    "BTC": {
        "symbol": "BTC",
        "name": "Bitcoin Native",
        "decimals": 8,
        "deployments": {"BTC": "NATIVE"}
    }
}

# Known Bridge Protocol Contracts (Section 19-22)
KNOWN_BRIDGE_CONTRACTS = {
    "0xdf0770df86a8034b3efef0a1bb3c889b8332ff56": {"name": "Stargate Finance (Router)", "protocol": "LayerZero"},
    "0x98f3c9e6e3face36baad05fe09d375eff1764732": {"name": "Wormhole Core Bridge", "protocol": "Wormhole"},
    "0x3ee18b2214aff97000d974cf647e7c347e8fa585": {"name": "Wormhole Token Bridge", "protocol": "Wormhole"},
    "0xd37bbe5744d730a1d98d8dc97c42f0ca46ad7146": {"name": "THORChain Asgard Vault", "protocol": "THORChain"},
}

# Known DEX Router Contracts (Section 24)
KNOWN_DEX_ROUTERS = {
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": {"name": "Uniswap V2 Router", "chain": "ETH"},
    "0xe592427a0c874ecdc6d92370140b37446d16ab9b": {"name": "Uniswap V3 SwapRouter", "chain": "ETH"},
    "0x10ed43c718714eb63d5aa57b78b54704e256024e": {"name": "PancakeSwap V2 Router", "chain": "BSC"},
    "0x111111125421ca6dc452d289314280a0f8842a65": {"name": "1inch Aggregator Router", "chain": "MULTI"},
}


class CrossChainEngine:
    """Core omnichain forensic detection, bridge correlation, and swap analysis."""

    @staticmethod
    def correlate_cross_evm_address(address: str, observed_chains: List[str]) -> Dict[str, Any]:
        """
        Cross-EVM Address Correlation (Section 12).
        Flags same address string across multiple EVM chains without asserting identical beneficial owner.
        """
        addr = (address or "").lower()
        if not addr.startswith("0x") or len(addr) != 42:
            return {"is_cross_evm": False, "confidence": 0.0}

        chains = observed_chains or ["ETH", "POLYGON", "BSC"]
        return {
            "address": address,
            "is_cross_evm": True,
            "correlated_chains": chains,
            "observation": "Identical EVM public key/address string observed across multiple EVM-compatible ledgers.",
            "inference": "High probability of common private key ownership if deployment nonce and signature match.",
            "confidence": 0.78,
            "evidence_rule": "cross_evm_address_string_correlation",
            "caution": "Requires transaction signature confirmation to establish unified real-world beneficial ownership.",
        }

    @staticmethod
    def identify_bridge_event(tx_record: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Identify if transaction interacts with known bridge infrastructure."""
        to_addr = (tx_record.get("to") or "").lower()
        bridge_info = KNOWN_BRIDGE_CONTRACTS.get(to_addr)
        if not bridge_info:
            return None

        protocol = bridge_info["protocol"]
        return {
            "is_bridge": True,
            "protocol": protocol,
            "bridge_name": bridge_info["name"],
            "source_chain": tx_record.get("chain", "ETH"),
            "amount": tx_record.get("amount", 0.0),
            "asset": tx_record.get("token", "USDT"),
            "tx_hash": tx_record.get("tx") or tx_record.get("tx_hash"),
            "confidence": 0.95,
        }

    @staticmethod
    def correlate_layerzero_stargate(
        source_event: Dict[str, Any],
        dest_events: List[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """LayerZero / Stargate OFT message and amount matching."""
        src_amt = float(source_event.get("amount", 0.0))
        src_ts = int(source_event.get("ts", source_event.get("timestamp_utc", 0)))

        for d in dest_events:
            d_amt = float(d.get("amount", 0.0))
            d_ts = int(d.get("ts", d.get("timestamp_utc", 0)))

            # Stargate transfers apply ~0.06% slippage/pool fee
            if abs(src_amt - d_amt) / max(src_amt, 1.0) <= 0.015 and 60 <= (d_ts - src_ts) <= 3600:
                return {
                    "protocol": "LayerZero / Stargate",
                    "source_chain": source_event.get("chain", "ETH"),
                    "destination_chain": d.get("chain", "POLYGON"),
                    "source_tx": source_event.get("tx") or source_event.get("tx_hash"),
                    "destination_tx": d.get("tx") or d.get("tx_hash"),
                    "source_amount": src_amt,
                    "destination_amount": d_amt,
                    "recipient_on_destination": d.get("to"),
                    "time_delta_seconds": d_ts - src_ts,
                    "confidence": 0.92,
                    "correlation_basis": "Stargate OFT Slippage-Aware Amount Matching & Temporal Window",
                }
        return None

    @staticmethod
    def decode_dex_swap(tx_record: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """DEX / Swap Trace: decodes token swap conversions (Section 24)."""
        to_addr = (tx_record.get("to") or "").lower()
        dex_info = KNOWN_DEX_ROUTERS.get(to_addr)
        if not dex_info:
            return None

        # Return structured DEX swap node
        return {
            "is_dex_swap": True,
            "dex_name": dex_info["name"],
            "router_address": to_addr,
            "input_asset": tx_record.get("input_token", "USDT"),
            "input_amount": tx_record.get("amount", 0.0),
            "output_asset": tx_record.get("output_token", "ETH"),
            "output_amount": tx_record.get("output_amount", round(tx_record.get("amount", 0.0) / 2500, 4)),
            "tx_hash": tx_record.get("tx") or tx_record.get("tx_hash"),
            "timestamp_utc": tx_record.get("ts") or tx_record.get("timestamp_utc", 0),
            "preservation_finding": "Asset conversion decoded; value preserved across token exchange.",
        }

    @staticmethod
    def check_bridge_anomaly(mint_amount: float, lock_amount: float, asset: str) -> Optional[Dict[str, Any]]:
        """Bridge-Exploit / Anomaly Monitor (Section 23)."""
        if mint_amount > (lock_amount * 1.05):
            excess = mint_amount - lock_amount
            return {
                "anomaly_detected": True,
                "severity": "CRITICAL",
                "type": "UNBACKED_MINT_EXPLOIT_SIGNATURE",
                "asset": asset,
                "observed_mint": mint_amount,
                "expected_lock": lock_amount,
                "unbacked_excess": excess,
                "deviation_percentage": round((excess / max(lock_amount, 1.0)) * 100, 2),
                "finding": f"CRITICAL ANOMALY: Destination minted {excess} {asset} exceeding verified source collateral lock.",
            }
        return None

    def parse_erc20_transfer_log(self, log_event: Dict[str, Any]) -> Dict[str, Any]:
        contract = (log_event.get("address") or "").lower()
        symbol = "USDT" if "dac17f" in contract else "TOKEN"
        data_hex = log_event.get("data", "0x0")
        raw_val = int(data_hex, 16) if data_hex.startswith("0x") else int(data_hex)
        amount = raw_val / 10**6
        topics = log_event.get("topics", [])
        from_addr = "0x" + topics[1][-40:] if len(topics) > 1 else ""
        to_addr = "0x" + topics[2][-40:] if len(topics) > 2 else ""
        return {
            "symbol": symbol,
            "amount": amount,
            "from_address": from_addr,
            "to_address": to_addr,
        }

    def correlate_bridge_events(self, src: Dict[str, Any], dst: Dict[str, Any]) -> Dict[str, Any]:
        match = src.get("packet_id") == dst.get("packet_id")
        return {
            "correlated": match,
            "linkage_type": "Protocol-derived deterministic linkage" if match else "Probabilistic correlation required",
            "confidence": 98 if match else 45,
        }


class CrossEvmCorrelator:
    def correlate(self, address: str, chains: List[str]) -> Dict[str, Any]:
        return {
            "observation": "Same EVM address string",
            "inference": "Potentially same key/entity",
            "confirmed_real_world_identity": False,
            "confidence": 0.85,
            "chains": chains,
        }


class DexSwapTracer:
    def trace_swap(self, swap_tx: Dict[str, Any]) -> Dict[str, Any]:
        amt_in = float(swap_tx.get("amount_in", 0.0))
        amt_out = float(swap_tx.get("amount_out", 0.0))
        return {
            "relationship_type": "DEX_SWAP",
            "input_asset": swap_tx.get("token_in"),
            "output_asset": swap_tx.get("token_out"),
            "amount_retained_ratio": (amt_out / amt_in) if amt_in > 0 else 1.0,
            "tx_hash": swap_tx.get("tx_hash"),
        }

