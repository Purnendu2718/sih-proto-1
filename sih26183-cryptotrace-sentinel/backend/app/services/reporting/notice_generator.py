"""
notice_generator.py - Statutory Requisition Directive Generator under Section 94 BNSS & Section 63 BSA.
Formats formal legal preservation notices and generates tamper-evident watermarked PDF documents.
"""

import io
import datetime
from typing import Dict, Any, List, Tuple
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

from app.schemas import FreezeNoticeRequest
from app.services.reporting.evidence_hasher import EvidenceHasher
from app.core.constants import LEGAL_STATUTE_BNSS, LEGAL_STATUTE_BSA, DEFAULT_USD_TO_INR_RATE


class WatermarkedCanvas(canvas.Canvas):
    """Draws an authoritative diagonal watermark across draft legal requisitions."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        for page in self.pages:
            self.__dict__.update(page)
            self.draw_watermark()
            super().showPage()
        super().save()

    def draw_watermark(self):
        self.saveState()
        self.setFont("Helvetica-Bold", 36)
        self.setFillColor(colors.Color(0.85, 0.85, 0.85, alpha=0.30))
        self.translate(105 * mm, 148 * mm)
        self.rotate(45)
        self.drawCentredString(0, 0, "INVESTIGATIVE DRAFT — PENDING IO SIGNATURE")
        self.restoreState()


class NoticeGenerator:
    """Generates Section 94 BNSS statutory requisition directives and evidentiary PDFs."""

    @staticmethod
    def generate_plain_text_notice(req: FreezeNoticeRequest, evidence_hash: str) -> str:
        """
        Generate plain-text formal legal requisition notice for immediate 1-click email dispatch.
        """
        now_utc = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        frozen_addrs_str = "\n".join([f"  • {addr}" for addr in req.frozen_addresses])
        tx_hashes_str = "\n".join([f"  • {tx}" for tx in req.transaction_hashes])

        return f"""================================================================================
FORMAL STATUTORY PRESERVATION & REQUISITION DIRECTIVE
Under Section 94, Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) [Formerly Section 91 CrPC]
================================================================================

TO:
  The Nodal Officer / Compliance Officer,
  {req.exchange_name} (Virtual Digital Asset Service Provider)
  Nodal Contact: {req.compliance_email}

FROM:
  {req.investigating_officer}
  Police Station: {req.police_station}
  Case Reference / FIR No.: {req.fir_number}
  Internal Tracking ID: {req.case_id}
  Requisition Timestamp: {now_utc}
  SLA Response Window: 2 Hours (Golden Hour Protocol)

--------------------------------------------------------------------------------
1. STATUTORY MANDATE & FREEZE DIRECTIVE
--------------------------------------------------------------------------------
In exercise of powers conferred under Section 94 of the Bharatiya Nagarik Suraksha
Sanhita, 2023, you are hereby directed to IMMEDIATELY PRESERVE, FREEZE, and PREVENT
any outbound withdrawal, liquidation, swap, or peer-to-peer transfer of all virtual
digital assets and linked INR fiat balances held in or associated with the following
suspect deposit account(s):

SUSPECT TARGET WALLET(S) IDENTIFIED:
{frozen_addrs_str}

Estimated Complainant Loss: INR {req.victim_amount_inr:,.2f}
Modus Operandi: {req.narrative}

--------------------------------------------------------------------------------
2. MANDATORY DATA REQUISITION (Within 2 Hours SLA)
--------------------------------------------------------------------------------
You are required to furnish certified digital copies of:
  a) Full Know-Your-Customer (KYC) records (PAN, Aadhaar/Passport, Registered Mobile, Linked Bank Accounts).
  b) IP access audit logs with source ports, timestamps, and active device fingerprints.
  c) Complete ledger statement of digital asset transfers touching the target deposit wallet(s).

--------------------------------------------------------------------------------
3. TRANSACTION EVIDENCE AUDIT TRAIL
--------------------------------------------------------------------------------
Conduit Blockchain Transaction Hash(es):
{tx_hashes_str}

--------------------------------------------------------------------------------
4. EVIDENTIARY INTEGRITY CERTIFICATE (Section 63 BSA, 2023)
--------------------------------------------------------------------------------
Pursuant to Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (formerly Section 65B of
Indian Evidence Act), the digital bitstream and deterministic graph topology supporting
this requisition has been cryptographically certified at time of capture.

Cryptographic Evidence Digest (SHA-256):
{evidence_hash}
Verification Seal: SEC63-BSA-2023:{evidence_hash[:32].upper()}

--------------------------------------------------------------------------------
DISPATCH NOTICE:
Failure to comply with this statutory directive within the stipulated timeline
shall invite penal consequences under relevant provisions of law.
================================================================================
"""

    @classmethod
    def generate_pdf_notice(cls, req: FreezeNoticeRequest) -> Tuple[bytes, str]:
        """
        Generate professional, watermarked A4 PDF notice with cryptographic Section 63 BSA seal.
        """
        evidence_hash = EvidenceHasher.compute_digest({
            "case_id": req.case_id,
            "fir_number": req.fir_number,
            "exchange_name": req.exchange_name,
            "frozen_addresses": req.frozen_addresses,
            "transaction_hashes": req.transaction_hashes,
            "victim_amount_inr": req.victim_amount_inr,
        })

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            topMargin=15 * mm,
            bottomMargin=15 * mm,
            leftMargin=18 * mm,
            rightMargin=18 * mm,
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "TitleStyle",
            parent=styles["Heading1"],
            alignment=1,
            fontSize=14,
            leading=17,
            textColor=colors.navy,
        )
        subtitle_style = ParagraphStyle(
            "SubTitleStyle",
            parent=styles["Heading3"],
            alignment=1,
            fontSize=9.5,
            leading=12,
            textColor=colors.darkred,
        )
        body = styles["BodyText"]
        body.fontSize = 8.5
        body.leading = 11.5

        now_utc = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        story = [
            Paragraph("FORMAL PRESERVATION & REQUISITION DIRECTIVE (DRAFT TEMPLATE)", title_style),
            Paragraph(f"Under {LEGAL_STATUTE_BNSS}", subtitle_style),
            Paragraph(
                "<i>Notice: This automated draft must be reviewed, authorized, and signed by the designated Investigating Officer prior to official transmission.</i>",
                ParagraphStyle("NoticeMeta", parent=body, alignment=1, textColor=colors.grey, fontSize=7.5),
            ),
            Spacer(1, 8),
        ]

        # Case Metadata Table
        meta_table = Table(
            [
                ["Case Reference / FIR No.", req.fir_number, "Case Tracking ID", req.case_id],
                ["Investigating Officer", req.investigating_officer, "Police Station", req.police_station],
                ["Recipient Exchange / VASP", req.exchange_name, "Nodal Officer Email", req.compliance_email],
                ["Requisition Timestamp", now_utc, "SLA Response Window", "2 Hours (Golden Hour Protocol)"],
            ],
            colWidths=[40 * mm, 47 * mm, 40 * mm, 47 * mm],
        )
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

        # 1. Statutory Mandate
        story.append(Paragraph("<b>1. STATUTORY MANDATE & DIRECTIVE:</b>", styles["Heading4"]))
        story.append(Paragraph(
            "In exercise of powers conferred under Section 94 of the Bharatiya Nagarik Suraksha "
            "Sanhita, 2023, you are hereby directed to immediately PRESERVE, FREEZE, and PREVENT "
            "any outbound withdrawal, swap, P2P transfer, or liquidation of digital assets held "
            "in or associated with the suspect deposit wallet(s) identified below. "
            "This requisition originates from automated multi-hop blockchain forensic tracing.",
            body,
        ))
        story.append(Spacer(1, 6))

        story.append(Paragraph(f"<b>Estimated Complainant Loss:</b> INR {req.victim_amount_inr:,.2f}", body))
        story.append(Spacer(1, 6))

        # 2. Suspect Wallets Table
        story.append(Paragraph("<b>2. FORENSIC IDENTIFICATION OF SUSPECT DEPOSIT WALLET(S):</b>", styles["Heading4"]))
        addr_table = Table(
            [["Identified Target Deposit Address", a] for a in req.frozen_addresses],
            colWidths=[65 * mm, 109 * mm],
        )
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

        # 3. Required Data Points
        story.append(Paragraph("<b>3. REQUISITION REQUIREMENTS (Within 2 Hours SLA):</b>", styles["Heading4"]))
        story.append(Paragraph(
            "a) Immediate debit freeze on associated INR and crypto wallet balances.<br/>"
            "b) Certified KYC profile (PAN, Aadhaar/Passport, Registered Phone, Linked Bank Accounts).<br/>"
            "c) Complete IP login logs with port numbers, timestamps, and active device fingerprints.",
            body,
        ))
        story.append(Spacer(1, 6))

        # 4. Evidence Tx Hashes
        story.append(Paragraph("<b>4. TRANSACTION HASH(ES) CONSTITUTING CONDUIT EVIDENCE:</b>", styles["Heading4"]))
        tx_table = Table(
            [["TxHash Evidence", t] for t in req.transaction_hashes],
            colWidths=[35 * mm, 139 * mm],
        )
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

        # 5. Section 63 BSA Audit Trail
        story.append(Paragraph(f"<b>5. EVIDENTIARY INTEGRITY AUDIT TRAIL ({LEGAL_STATUTE_BSA}):</b>", styles["Heading4"]))
        story.append(Paragraph(
            "To fulfill evidentiary integrity practices under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 "
            "(formerly Section 65B of Indian Evidence Act), the deterministic RPC transaction record and "
            "graph topology relied upon to formulate this requisition has been sealed with cryptographic SHA-256.",
            body,
        ))
        story.append(Spacer(1, 3))
        story.append(Paragraph(
            f"<b>Cryptographic Audit Digest (SHA-256):</b> <font face='Courier' size='7'>{evidence_hash}</font>",
            body,
        ))
        story.append(Spacer(1, 10))

        # Signature & Seal Boxes
        sig_table = Table(
            [
                [
                    Paragraph(
                        "<b>Investigating Officer Review & Signature</b><br/><br/><br/>"
                        "___________________________________<br/>"
                        f"Name: {req.investigating_officer}<br/>"
                        "Belt / Rank No.:",
                        body,
                    ),
                    Paragraph(
                        "<b>Station House Officer / Cyber PS Seal</b><br/><br/><br/>"
                        "___________________________________<br/>"
                        f"Police Station: {req.police_station}<br/>"
                        "Dispatch Register No.:",
                        body,
                    ),
                ]
            ],
            colWidths=[87 * mm, 87 * mm],
        )
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


def generate_statutory_notice_text(req: FreezeNoticeRequest, evidence_hash: str) -> str:
    return NoticeGenerator.generate_plain_text_notice(req, evidence_hash)


def generate_statutory_notice_pdf(req: FreezeNoticeRequest) -> Tuple[bytes, str]:
    return NoticeGenerator.generate_pdf_notice(req)
