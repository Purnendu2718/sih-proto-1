from pydantic import BaseModel
from typing import List


class FreezeNoticeRequestV2(BaseModel):
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
