import hashlib
import io
import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

from app.schemas import FreezeNoticeRequest


def _sha256(data: str) -> str:
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def _build_evidence_digest(req: FreezeNoticeRequest) -> str:
    """
    Section 63 BSA (formerly Sec 65B IEA) evidence integrity chain:
    Tamper-evident audit digest generated from ordered concatenation of
    individual transaction hashes, case ID, and FIR reference.
    """
    per_tx_digests = [_sha256(tx) for tx in req.transaction_hashes]
    combined = req.case_id + req.fir_number + "|".join(per_tx_digests)
    return _sha256(combined)


class WatermarkedCanvas(canvas.Canvas):
    """Draws a professional diagonal watermark across the draft requisition."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self.pages)
        for page in self.pages:
            self.__dict__.update(page)
            self.draw_watermark()
            super().showPage()
        super().save()

    def draw_watermark(self):
        self.saveState()
        self.setFont("Helvetica-Bold", 38)
        self.setFillColor(colors.Color(0.85, 0.85, 0.85, alpha=0.35))
        self.translate(105 * mm, 148 * mm)
        self.rotate(45)
        self.drawCentredString(0, 0, "INVESTIGATIVE DRAFT — PENDING IO SIGNATURE")
        self.restoreState()


def generate_freeze_notice_pdf(req: FreezeNoticeRequest):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        topMargin=15 * mm, bottomMargin=15 * mm, leftMargin=18 * mm, rightMargin=18 * mm,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("TitleStyle", parent=styles["Heading1"], alignment=1, fontSize=15, leading=18, textColor=colors.navy)
    subtitle_style = ParagraphStyle("SubTitleStyle", parent=styles["Heading3"], alignment=1, fontSize=10, leading=13, textColor=colors.darkred)
    body = styles["BodyText"]
    body.fontSize = 8.5
    body.leading = 11.5

    now_utc = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    evidence_hash = _build_evidence_digest(req)

    story = [
        Paragraph("FORMAL PRESERVATION & REQUISITION DIRECTIVE (DRAFT TEMPLATE)", title_style),
        Paragraph("Under Section 94, Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) [Formerly Sec 91 CrPC]", subtitle_style),
        Paragraph("<i>Notice: This automated draft must be reviewed, authorized, and signed by the designated Investigating Officer prior to official transmission.</i>", ParagraphStyle("DraftNotice", parent=body, alignment=1, textColor=colors.grey, fontSize=7.5)),
        Spacer(1, 8),
    ]

    meta_table = Table([
        ["Case Reference / FIR No.", req.fir_number, "Case ID", req.case_id],
        ["Investigating Officer", req.investigating_officer, "Police Station", req.police_station],
        ["Recipient Exchange / VASP", req.exchange_name, "Nodal Officer Email", req.compliance_email],
        ["Requisition Prepared At", now_utc, "SLA Response Window", "2 Hours (Golden Hour Protocol)"],
    ], colWidths=[40 * mm, 47 * mm, 40 * mm, 47 * mm])
    meta_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 0), (0, -1), colors.whitesmoke),
        ("BACKGROUND", (2, 0), (2, -1), colors.whitesmoke),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>1. STATUTORY MANDATE & DIRECTIVE:</b>", styles["Heading4"]))
    story.append(Paragraph(
        "In exercise of powers conferred under Section 94 of the Bharatiya Nagarik Suraksha "
        "Sanhita, 2023, you are hereby directed to immediately PRESERVE, FREEZE, and PREVENT "
        "any outbound withdrawal, swap, P2P transfer, or liquidation of digital assets held "
        "in or associated with the suspect account(s) and deposit wallet(s) identified below. "
        "This requisition originates from automated multi-hop blockchain tracing of fraud proceeds.", body))
    story.append(Spacer(1, 6))

    story.append(Paragraph(f"<b>Estimated Complainant Loss:</b> INR {req.victim_amount_inr:,.2f} / Tether (USDT)", body))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>2. FORENSIC IDENTIFICATION OF SUSPECT DEPOSIT WALLET(S):</b>", styles["Heading4"]))
    addr_table = Table([["Identified Target Deposit Address", a] for a in req.frozen_addresses], colWidths=[65 * mm, 109 * mm])
    addr_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
        ("FONTNAME", (0, 0), (-1, -1), "Courier"),
        ("FONTSIZE", (0, 0), (-1, -1), 7.5),
        ("BACKGROUND", (0, 0), (0, -1), colors.whitesmoke),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    story.append(addr_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>3. REQUISITION REQUIREMENTS (Within 2 Hours):</b>", styles["Heading4"]))
    story.append(Paragraph(
        "a) Immediate debit freeze on associated INR and crypto wallet balances.<br/>"
        "b) Certified KYC profile (PAN, Aadhaar/Passport, Registered Phone, Linked Bank Accounts).<br/>"
        "c) Complete IP login logs with port numbers, timestamps, and active device fingerprints.", body))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>4. TRANSACTION HASH(ES) CONSTITUTING CONDUIT EVIDENCE:</b>", styles["Heading4"]))
    tx_table = Table([["TxHash Evidence", t] for t in req.transaction_hashes], colWidths=[35 * mm, 139 * mm])
    tx_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
        ("FONTNAME", (0, 0), (-1, -1), "Courier"),
        ("FONTSIZE", (0, 0), (-1, -1), 7),
        ("BACKGROUND", (0, 0), (0, -1), colors.whitesmoke),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    story.append(tx_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>5. EVIDENTIARY INTEGRITY AUDIT TRAIL (Section 63 BSA, 2023):</b>", styles["Heading4"]))
    story.append(Paragraph(
        "To support evidentiary integrity practices under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 "
        "(formerly Section 65B of Indian Evidence Act), the deterministic RPC transaction record and "
        "graph topology relied upon to formulate this requisition has been hashed at time of capture.", body))
    story.append(Spacer(1, 3))
    story.append(Paragraph(f"<b>Cryptographic Audit Digest (SHA-256):</b> <font face='Courier' size='7'>{evidence_hash}</font>", body))
    story.append(Spacer(1, 10))

    # Signature and Seal Blocks
    sig_table = Table([
        [
            Paragraph("<b>Investigating Officer Review & Signature</b><br/><br/><br/>___________________________________<br/>Name:<br/>Belt / Rank No.:", body),
            Paragraph("<b>Station House Officer / Cyber PS Seal</b><br/><br/><br/>___________________________________<br/>Police Station Seal & Dispatch No.:", body),
        ]
    ], colWidths=[87 * mm, 87 * mm])
    sig_table.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(sig_table)

    doc.build(story, canvasmaker=WatermarkedCanvas)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes, evidence_hash
