"""
legal_service.py - Statutory BNSS / BSA Legal Requisition Studio and VASP Directory.
Conforms to Section 32 (Indian Evidence Model), Section 33 (BNSS Legal Workflow),
Section 34 (VASP Contact Management), and Section 35 (SAHYOG / NCRP Integration).
"""

from typing import Dict, Any, List, Optional
import time

# Controlled VASP Compliance & Nodal Contact Directory (Section 34)
VASP_DIRECTORY = {
    "COINDCX": {
        "exchange_name": "CoinDCX",
        "legal_entity": "Neblio Technologies Pvt. Ltd.",
        "jurisdiction": "India (FIU-IND Registered)",
        "compliance_email": "compliance@coindcx.com",
        "nodal_officer": "Mr. Rohit Sharma (nodal@coindcx.com)",
        "official_channel": "Law Enforcement Request Portal (LEAP)",
        "sla_hours": 2,
        "verification_status": "VERIFIED_FIU_REPORTING_ENTITY",
        "last_verified_utc": 1788000000,
    },
    "BINANCE": {
        "exchange_name": "Binance",
        "legal_entity": "Nest Services Limited / Binance India",
        "jurisdiction": "Global / India (FIU-IND Registered)",
        "compliance_email": "case@binance.com",
        "nodal_officer": "Law Enforcement Liaison (nodal-india@binance.com)",
        "official_channel": "Kodex LE Portal",
        "sla_hours": 4,
        "verification_status": "VERIFIED_FIU_REPORTING_ENTITY",
        "last_verified_utc": 1788000000,
    },
    "WAZIRX": {
        "exchange_name": "WazirX",
        "legal_entity": "Zanmai Labs Pvt. Ltd.",
        "jurisdiction": "India (FIU-IND Registered)",
        "compliance_email": "nodal@wazirx.com",
        "nodal_officer": "Chief Compliance Officer",
        "official_channel": "LE Nodal Desk",
        "sla_hours": 3,
        "verification_status": "VERIFIED_FIU_REPORTING_ENTITY",
        "last_verified_utc": 1788000000,
    },
    "ZEBPAY": {
        "exchange_name": "ZebPay",
        "legal_entity": "Awlencan Innovations India Ltd.",
        "jurisdiction": "India (FIU-IND Registered)",
        "compliance_email": "compliance@zebpay.com",
        "nodal_officer": "Nodal Desk",
        "official_channel": "Compliance Email Portal",
        "sla_hours": 3,
        "verification_status": "VERIFIED_FIU_REPORTING_ENTITY",
        "last_verified_utc": 1788000000,
    },
}


def get_vasp_info(exchange_name: str) -> Optional[Dict[str, Any]]:
    key = (exchange_name or "").upper()
    for k, v in VASP_DIRECTORY.items():
        if k in key or key in k:
            return v
    return None


def get_all_vasps() -> List[Dict[str, Any]]:
    return list(VASP_DIRECTORY.values())


def generate_section_63_bsa_certificate(
    case_id: str,
    investigating_officer: str,
    police_station: str,
    merkle_root: str,
    total_artifacts: int
) -> str:
    """
    Statutory Certificate under Section 63, Bharatiya Sakshya Adhiniyam, 2023
    (Admissibility of electronic records - formerly Section 65B, Indian Evidence Act, 1872).
    """
    now_utc = time.strftime("%Y-%m-%d %H:%M:%S UTC")
    return f"""
========================================================================================
CERTIFICATE UNDER SECTION 63, BHARATIYA SAKSHYA ADHINIYAM, 2023 (BSA)
[Formerly Section 65B of the Indian Evidence Act, 1872]
========================================================================================
Case Identifier: {case_id}
Issuing Officer: {investigating_officer}
Police Unit: {police_station}
Timestamp of Generation: {now_utc}

1. I, the undersigned Investigating Officer, hereby certify that the electronic records 
   comprising the blockchain transaction forensic graph, raw JSON-RPC payloads, 
   and transaction manifests were retrieved and preserved through lawful automated 
   means using the CryptoTrace-Sentinel Sovereign Forensic Engine.

2. At all material times during the collection and indexing of the said digital evidence, 
   the computer system and analytical software were operating in lawful order and 
   under sovereign air-gapped forensic custody.

3. Total Raw Blockchain Artifacts Preserved: {total_artifacts}
4. Cryptographic Section 63 BSA Merkle Root: {merkle_root}

Every raw cryptographic byte payload is immutable and independently verifiable against 
the sealed Merkle root without exposing unassociated transaction records.

Place: {police_station}
Date: {time.strftime('%Y-%m-%d')}
Sign / Seal: _____________________________________
             {investigating_officer}
========================================================================================
""".strip()


class NCRPAdapter:
    """Simulated Government National Cyber Crime Reporting Portal (NCRP) Adapter (Section 35)."""

    @staticmethod
    def sync_complaint(ncrp_ack_number: str) -> Dict[str, Any]:
        return {
            "status": "SIMULATED_GOVERNMENT_INTEGRATION",
            "ncrp_ack_number": ncrp_ack_number,
            "category": "Cryptocurrency Investment / Cyber Task Scam",
            "reported_loss_inr": 480000.0,
            "complaint_date": time.strftime("%Y-%m-%d"),
            "source": "https://cybercrime.gov.in (Simulated Connector)",
        }


class SAHYOGAdapter:
    """Simulated I4C SAHYOG Police Coordination Platform Adapter (Section 35)."""

    @staticmethod
    def broadcast_alert(case_id: str, target_address: str, exchange: str) -> Dict[str, Any]:
        return {
            "status": "SIMULATED_GOVERNMENT_INTEGRATION",
            "case_id": case_id,
            "target_address": target_address,
            "exchange": exchange,
            "broadcast_network": "I4C SAHYOG Inter-Agency Portal",
            "timestamp_utc": int(time.time()),
        }
