import io
import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from app.schemas import FreezeNoticeRequest
from app.services.evidence_ledger import build_merkle_root
from app.services.attribution_store import lookup_attribution
from app.services.historical_price_service import get_historical_inr_price


def generate_freeze_notice_pdf(req: FreezeNoticeRequest):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        topMargin=20 * mm, bottomMargin=20 * mm, leftMargin=20 * mm, rightMargin=20 * mm,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("TitleStyle", parent=styles["Heading1"], alignment=1)
    body = styles["BodyText"]

    now_utc = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    merkle = build_merkle_root(req.case_id)
    historical_price = get_historical_inr_price(req.primary_token_symbol, req.fraud_date_ddmmyyyy)

    story = [
        Paragraph("STATUTORY REQUISITION NOTICE", title_style),
        Paragraph("Issued under Section 94, Bharatiya Nagarik Suraksha Sanhita, 2023", styles["Heading3"]),
        Spacer(1, 10),
    ]

    meta_table = Table([
        ["FIR Number", req.fir_number],
        ["NCRP Acknowledgement No.", req.ncrp_ack_number],
        ["Case ID", req.case_id],
        ["Investigating Officer", req.investigating_officer],
        ["Police Station", req.police_station],
        ["Issued To", f"{req.exchange_name} Compliance ({req.compliance_email})"],
        ["Notice Generated (UTC)", now_utc],
    ], colWidths=[55 * mm, 110 * mm])
    meta_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 0), (0, -1), colors.whitesmoke),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    story.append(Paragraph(
        "In exercise of powers under Section 94 of the Bharatiya Nagarik Suraksha "
        "Sanhita, 2023, you are hereby directed to preserve, freeze, and prevent "
        "further withdrawal, transfer, or liquidation of the digital assets held "
        "in the account(s)/address(es) listed below, pending further written "
        "orders from this office. This notice is issued on the basis of automated "
        "multi-hop blockchain transaction tracing linked to a victim-reported "
        "cybercrime complaint registered on the National Cyber Crime Reporting Portal (NCRP).", body))
    story.append(Spacer(1, 10))

    story.append(Paragraph(f"Victim reported loss (approx.): INR {req.victim_amount_inr:,.2f}", body))
    if historical_price:
        story.append(Paragraph(
            f"{req.primary_token_symbol} valuation on reported fraud date "
            f"({req.fraud_date_ddmmyyyy}): INR {historical_price:,.2f} per unit "
            f"(source: CoinGecko historical index — indicative, not a certified valuation).", body))
    else:
        story.append(Paragraph(
            f"Historical INR valuation for {req.primary_token_symbol} on "
            f"{req.fraud_date_ddmmyyyy} could not be retrieved automatically; "
            f"attach a manually sourced valuation before filing.", body))
    story.append(Spacer(1, 10))

    story.append(Paragraph("Frozen Address(es):", styles["Heading4"]))
    addr_table = Table([[a] for a in req.frozen_addresses], colWidths=[165 * mm])
    addr_table.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.4, colors.grey), ("FONTSIZE", (0, 0), (-1, -1), 8)]))
    story.append(addr_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Transaction Hash(es) Constituting Trace Evidence:", styles["Heading4"]))
    tx_table = Table([[t] for t in req.transaction_hashes], colWidths=[165 * mm])
    tx_table.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.4, colors.grey), ("FONTSIZE", (0, 0), (-1, -1), 8)]))
    story.append(tx_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Attribution Confidence Breakdown:", styles["Heading4"]))
    confidence_rows = [["Address", "Attribution Rule", "Confidence"]]
    for addr in req.frozen_addresses:
        attrib = lookup_attribution(addr)
        if attrib:
            confidence_rows.append([addr[:10] + "...", attrib["attribution_rule"], f"{attrib['confidence'] * 100:.1f}%"])
        else:
            confidence_rows.append([addr[:10] + "...", "manual_investigator_tag", "n/a"])
    confidence_table = Table(confidence_rows, colWidths=[45 * mm, 90 * mm, 30 * mm])
    confidence_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
        ("BACKGROUND", (0, 0), (-1, 0), colors.whitesmoke),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
    ]))
    story.append(confidence_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Investigation Narrative:", styles["Heading4"]))
    story.append(Paragraph(req.narrative, body))
    story.append(Spacer(1, 14))

    story.append(Paragraph(
        "Certificate under Section 63, Bharatiya Sakshya Adhiniyam, 2023 "
        "(formerly Section 65B, Indian Evidence Act, 1872):", styles["Heading4"]))
    story.append(Paragraph(
        f"Every raw blockchain RPC response relied upon in this investigation "
        f"({merkle['leaf_count']} response(s)) was individually sealed with a "
        f"SHA-256 digest at capture time and combined into a single Merkle "
        f"root below, so any one response can be independently re-verified "
        f"against the sealed root without exposing the others.", body))
    story.append(Spacer(1, 6))
    story.append(Paragraph(f"<b>Evidence Merkle Root:</b> {merkle['root'] or 'NO_RAW_EVIDENCE_RECORDED'}", body))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes, merkle["root"]
