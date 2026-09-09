import argparse
import hashlib
import json
import os
from datetime import datetime

def generate_notice(trace_file: str, fir_no: str):
    if not os.path.exists(trace_file):
        print(f"[!] Error: {trace_file} not found. Run run_trace.py first.")
        return

    with open(trace_file, "r") as f:
        data = json.load(f)

    # Compute cryptographic SHA-256 evidence hash
    evidence_hash = hashlib.sha256(json.dumps(data, sort_keys=True).encode("utf-8")).hexdigest()
    attr = data["attribution"]
    case = data["case_metadata"]

    notice_content = f"""================================================================================
FORMAL PRESERVATION & REQUISITION DIRECTIVE UNDER SECTION 94 BNSS
(Formerly Section 91 of the Code of Criminal Procedure, 1973)
Issued by: Cyber Crime Police Station / Law Enforcement Agency (India)
================================================================================

Case Reference / FIR No.: {fir_no}
Date & Time of Requisition: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC
Jurisdiction: Indian Cyber Crime Coordination Centre (I4C) Protocol

TO:
The Nodal / Legal Compliance Officer
Virtual Asset Service Provider (VASP): {attr['destination_vasp']}
Contact Email: {attr['nodal_email']}

SUBJECT: IMMEDIATE ASSET FREEZE, KYC PRESERVATION & LOG SUBMISSION FOR SUSPECT ACCOUNT

1. STATUTORY MANDATE:
Under powers conferred by Section 94 of Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS),
you are hereby directed to immediately FREEZE all withdrawals and outbound transfers
associated with the identified customer deposit wallet specified below.

2. FORENSIC ATTRIBUTION DETAILS:
- Target Deposit Wallet : {attr['deposit_wallet']}
- Blockchain Network    : {case['chain']}
- Sweep Transaction Hash: {attr['sweep_tx_hash']}
- Master Hot Wallet     : {attr['master_hot_wallet']}
- Attribution Heuristic : {attr['confidence_score']}

3. REQUISITION REQUIREMENTS (Within 2 Hours SLA):
a) Complete KYC records (PAN, Aadhaar, Passport, Phone, Email, Bank Accounts linked).
b) All IP login logs with port numbers and timestamps.
c) Immediate debit freeze on associated INR and crypto trading balances.

4. DIGITAL EVIDENCE INTEGRITY CERTIFICATE (Section 63 BSA, 2023):
The blockchain forensic data was captured via verified deterministic RPC feeds.
Cryptographic SHA-256 Digest:
{evidence_hash}
================================================================================
"""

    out_notice = "output/Section_94_BNSS_Notice.txt"
    with open(out_notice, "w", encoding="utf-8") as f:
        f.write(notice_content)

    print(notice_content)
    print(f"\n[+] Statutory Notice generated successfully at: {out_notice}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--trace-result", default="output/trace_result.json")
    parser.add_argument("--fir-no", default="FIR-2026/CYBER-402/GSV")
    args = parser.parse_args()
    generate_notice(args.trace_result, args.fir_no)
