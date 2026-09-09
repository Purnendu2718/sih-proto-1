"""
app.services.legal.freeze_notice - Statutory Requisition Directive Generator
Provides draft text generation and ReportLab PDF rendering with prominent warning watermarks,
literal officer sign-off checkboxes, and strict validation against FreezeNoticeRequest fields.
"""

import os
from typing import List
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

from app.schemas import FreezeNoticeRequest


def _validate(req: FreezeNoticeRequest) -> None:
    """
    Validate that all required fields in FreezeNoticeRequest are present and valid.
    Raises ValueError with descriptive explanation if any requirement is violated.
    """
    if req is None:
        raise ValueError("FreezeNoticeRequest payload cannot be None")
    if not isinstance(req, FreezeNoticeRequest):
        raise ValueError("Invalid request type: expected FreezeNoticeRequest")

    required_str_fields = [
        ("case_id", req.case_id),
        ("fir_number", req.fir_number),
        ("investigating_officer", req.investigating_officer),
        ("police_station", req.police_station),
        ("exchange_name", req.exchange_name),
        ("compliance_email", req.compliance_email),
        ("narrative", req.narrative),
    ]
    for field_name, val in required_str_fields:
        if val is None or not str(val).strip():
            raise ValueError(f"Field '{field_name}' must be a non-empty string")

    if "@" not in req.compliance_email:
        raise ValueError(
            f"Field 'compliance_email' must be a valid email address: {req.compliance_email}"
        )

    if not req.frozen_addresses or len(req.frozen_addresses) == 0:
        raise ValueError("Field 'frozen_addresses' must contain at least one target address")
    for idx, addr in enumerate(req.frozen_addresses):
        if not addr or not str(addr).strip():
            raise ValueError(f"Target address at index {idx} cannot be empty")

    if not req.transaction_hashes or len(req.transaction_hashes) == 0:
        raise ValueError("Field 'transaction_hashes' must contain at least one transaction hash")
    for idx, tx in enumerate(req.transaction_hashes):
        if not tx or not str(tx).strip():
            raise ValueError(f"Transaction hash at index {idx} cannot be empty")

    if req.victim_amount_inr is None or req.victim_amount_inr < 0:
        raise ValueError("Field 'victim_amount_inr' must be a non-negative number")


def generate_freeze_notice_draft(req: FreezeNoticeRequest) -> str:
    """
    Returns a formatted plain-text draft of a statutory requisition notice,
    clearly watermarked 'DRAFT — UNOFFICIAL' at the top and bottom with an
    officer sign-off checklist near the end.
    """
    _validate(req)

    frozen_list = "\n".join([f"  • {addr.strip()}" for addr in req.frozen_addresses])
    tx_list = "\n".join([f"  • {tx.strip()}" for tx in req.transaction_hashes])

    return f"""*** DRAFT — UNOFFICIAL ***
================================================================================
FORMAL STATUTORY PRESERVATION & REQUISITION DIRECTIVE
Under Section 94, Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)
[Formerly Section 91 of the Code of Criminal Procedure, 1973]
================================================================================

*** DRAFT — UNOFFICIAL: THIS DOCUMENT IS A PRE-AUTHORIZATION DRAFT ***
*** FOR INVESTIGATIVE REVIEW ONLY — NOT AN ISSUED LEGAL REQUISITION ***

CASE / REQUISITION IDENTIFIERS:
  Case Tracking ID       : {req.case_id}
  Case Reference / FIR   : {req.fir_number}
  Investigating Officer  : {req.investigating_officer}
  Police Station / Cell  : {req.police_station}

RECIPIENT VASP / EXCHANGE DETAILS:
  Virtual Digital Asset Service Provider : {req.exchange_name}
  Designated Nodal / Compliance Email    : {req.compliance_email}

STATUTORY MANDATE & FREEZE DIRECTIVE:
  In exercise of powers under Section 94 of Bharatiya Nagarik Suraksha Sanhita, 2023,
  you are hereby directed to immediately PRESERVE, FREEZE, and RESTRICT any debit,
  withdrawal, liquidation, transfer, or conversion of all virtual digital assets
  and associated fiat balances held in or linked to the following target deposit wallet(s):

TARGET SUSPECT WALLET ADDRESS(ES):
{frozen_list}

FINANCIAL IMPACT & FRAUD MODUS OPERANDI:
  Estimated Complainant Loss : INR {req.victim_amount_inr:,.2f}
  Forensic Case Narrative    : {req.narrative}

EVIDENTIARY TRANSACTION CONDUITS:
{tx_list}

MANDATORY DATA REQUISITION CHECKLIST (Within 2 Hours SLA):
  1. Certified digital copies of complete KYC records (PAN, Aadhaar/Passport, Phone, Bank accounts).
  2. IP access audit logs with source port numbers, timestamps (UTC), and device identifiers.
  3. Internal deposit ledger transaction statements touching the suspect deposit wallet(s).
  4. Immediate debit freeze on all accounts associated with the beneficial owners.

--------------------------------------------------------------------------------
OFFICER SIGN-OFF & AUTHORIZATION CHECKLIST (To be verified & signed manually):
--------------------------------------------------------------------------------
[ ] Certified true copy of FIR / Complaint verified and attached
[ ] Multi-hop blockchain transaction graph verified and endorsed
[ ] Suspect exchange deposit address confirmed as destination of proceeds
[ ] Evidence integrity hash recorded in Police Station Case Diary
[ ] Authorized for formal dispatch to VASP Nodal / Compliance Officer

Investigating Officer Signature : ___________________________    Date: _______________
Officer Name & Belt / Rank No.  : ___________________________
Police Station / Cyber Cell     : ___________________________

Countersignature (SHO / In-Charge): ___________________________   Date: _______________
Police Station Official Stamp/Seal:

================================================================================
*** DRAFT — UNOFFICIAL ***
"""


class WatermarkedDraftCanvas(canvas.Canvas):
    """
    Draws a prominent warning border and header/footer warning bands in warning color,
    plus a large diagonal semi-transparent watermark across every page.
    This guarantees the 'DRAFT — UNOFFICIAL' status is visually unmissable even at a glance
    or in a small thumbnail preview.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        for page in self.pages:
            self.__dict__.update(page)
            self.draw_warning_decorations()
            super().showPage()
        super().save()

    def draw_warning_decorations(self):
        self.saveState()
        page_width, page_height = A4
        warning_dark = colors.HexColor("#B45309")    # Amber-700
        warning_border = colors.HexColor("#D97706")  # Amber-600

        # 1. Outer Warning Border (2.5pt solid stroke)
        self.setStrokeColor(warning_border)
        self.setLineWidth(2.5)
        self.rect(6 * mm, 6 * mm, page_width - 12 * mm, page_height - 12 * mm)

        # 2. Prominent Top Header Band in Warning Color
        header_band_height = 14 * mm
        self.setFillColor(warning_dark)
        self.rect(
            6 * mm,
            page_height - 6 * mm - header_band_height,
            page_width - 12 * mm,
            header_band_height,
            fill=1,
            stroke=0,
        )
        self.setFont("Helvetica-Bold", 11)
        self.setFillColor(colors.white)
        self.drawCentredString(
            page_width / 2,
            page_height - 15 * mm,
            "*** DRAFT — UNOFFICIAL: PRE-AUTHORIZATION COPY ***"
        )

        # 3. Prominent Bottom Footer Band in Warning Color
        footer_band_height = 10 * mm
        self.setFillColor(warning_dark)
        self.rect(
            6 * mm,
            6 * mm,
            page_width - 12 * mm,
            footer_band_height,
            fill=1,
            stroke=0,
        )
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.white)
        self.drawCentredString(
            page_width / 2,
            9.5 * mm,
            "DRAFT — UNOFFICIAL — PENDING OFFICER REVIEW & SIGN-OFF — NOT AN ISSUED REQUISITION"
        )

        # 4. Large Diagonal Watermark Across Page Center
        self.setFont("Helvetica-Bold", 42)
        self.setFillColor(colors.Color(0.85, 0.45, 0.10, alpha=0.16))
        self.translate(page_width / 2, page_height / 2)
        self.rotate(45)
        self.drawCentredString(0, 0, "DRAFT — UNOFFICIAL")
        self.restoreState()


def render_freeze_notice_pdf(req: FreezeNoticeRequest, output_path: str) -> str:
    """
    Renders the statutory freeze notice draft as a PDF instead of plain text, using ReportLab.
    Requirements:
    - Prominent 'DRAFT — UNOFFICIAL' watermark header/border band in warning color
    - Literal officer sign-off checkboxes with blank signature/date lines (not auto-filled)
    - All content sourced strictly from FreezeNoticeRequest fields
    - Validates req via _validate(req)
    - Returns output_path
    """
    _validate(req)

    # Ensure parent output directory exists
    parent_dir = os.path.dirname(os.path.abspath(output_path))
    if parent_dir:
        os.makedirs(parent_dir, exist_ok=True)

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        topMargin=24 * mm,
        bottomMargin=20 * mm,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    title_style = ParagraphStyle(
        "NoticeTitle",
        parent=styles["Heading1"],
        alignment=1,
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#1E3A8A"),  # Blue-900
        fontName="Helvetica-Bold",
    )
    subtitle_style = ParagraphStyle(
        "NoticeSubtitle",
        parent=styles["Heading3"],
        alignment=1,
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#991B1B"),  # Red-800
        fontName="Helvetica-Bold",
    )
    section_head_style = ParagraphStyle(
        "NoticeSectionHead",
        parent=styles["Heading4"],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#0F172A"),  # Slate-900
        fontName="Helvetica-Bold",
    )
    body_style = ParagraphStyle(
        "NoticeBody",
        parent=styles["BodyText"],
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1E293B"),
    )
    mono_style = ParagraphStyle(
        "NoticeMono",
        parent=styles["BodyText"],
        fontSize=7.5,
        leading=10,
        fontName="Courier",
        textColor=colors.HexColor("#0F172A"),
    )
    warning_notice_style = ParagraphStyle(
        "WarningNoticeText",
        parent=styles["Normal"],
        fontSize=7.5,
        leading=10,
        alignment=1,
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#92400E"),  # Amber-800
    )

    story = []

    # 1. Warning Box Alert Flowable
    warning_box = Table(
        [[Paragraph(
            "<b>PRE-AUTHORIZATION DRAFT:</b> This statutory freeze notice template was compiled "
            "from investigative trace records. It must be formally endorsed, verified against case files, "
            "and executed by the authorized Investigating Officer prior to service.",
            warning_notice_style,
        )]],
        colWidths=[178 * mm],
    )
    warning_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FEF3C7")),
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#D97706")),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(warning_box)
    story.append(Spacer(1, 4))

    # 2. Main Title & Statutory Statute
    story.append(Paragraph("FORMAL STATUTORY PRESERVATION & FREEZE REQUISITION DIRECTIVE", title_style))
    story.append(Paragraph("Under Section 94, Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)", subtitle_style))
    story.append(Spacer(1, 6))

    # 3. Requisition Metadata Table (Strictly from req fields)
    meta_data = [
        [
            Paragraph("<b>Case Tracking ID:</b>", body_style),
            Paragraph(req.case_id, body_style),
            Paragraph("<b>Case Reference / FIR:</b>", body_style),
            Paragraph(req.fir_number, body_style),
        ],
        [
            Paragraph("<b>Investigating Officer:</b>", body_style),
            Paragraph(req.investigating_officer, body_style),
            Paragraph("<b>Police Station / Cell:</b>", body_style),
            Paragraph(req.police_station, body_style),
        ],
        [
            Paragraph("<b>Virtual Digital Asset Service Provider:</b>", body_style),
            Paragraph(req.exchange_name, body_style),
            Paragraph("<b>Designated Nodal / Compliance Email:</b>", body_style),
            Paragraph(req.compliance_email, body_style),
        ],
    ]
    meta_table = Table(meta_data, colWidths=[42 * mm, 47 * mm, 42 * mm, 47 * mm])
    meta_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F1F5F9")),
        ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#F1F5F9")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 6))

    # 4. Section 1: Statutory Mandate & Freeze Directive
    story.append(Paragraph("1. STATUTORY MANDATE & FREEZE DIRECTIVE", section_head_style))
    story.append(Paragraph(
        "In exercise of powers under Section 94 of Bharatiya Nagarik Suraksha Sanhita, 2023, "
        "you are hereby directed to immediately PRESERVE, FREEZE, and RESTRICT any debit, "
        "withdrawal, liquidation, transfer, or conversion of all virtual digital assets and "
        "associated fiat balances held in or linked to the following target deposit wallet(s):",
        body_style,
    ))
    story.append(Spacer(1, 4))

    # 5. Section 2: Target Suspect Wallet Address(es)
    story.append(Paragraph("2. TARGET SUSPECT WALLET ADDRESS(ES)", section_head_style))
    addr_rows = [[Paragraph("Target Wallet", body_style), Paragraph(addr.strip(), mono_style)] for addr in req.frozen_addresses]
    addr_table = Table(addr_rows, colWidths=[40 * mm, 138 * mm])
    addr_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CBD5E1")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
    ]))
    story.append(addr_table)
    story.append(Spacer(1, 6))

    # 6. Section 3: Financial Impact & Fraud Modus Operandi
    story.append(Paragraph("3. FINANCIAL IMPACT & FRAUD MODUS OPERANDI", section_head_style))
    loss_table_data = [
        [
            Paragraph("<b>Estimated Complainant Loss:</b>", body_style),
            Paragraph(f"INR {req.victim_amount_inr:,.2f}", body_style),
        ],
        [
            Paragraph("<b>Forensic Case Narrative:</b>", body_style),
            Paragraph(req.narrative, body_style),
        ],
    ]
    loss_table = Table(loss_table_data, colWidths=[48 * mm, 130 * mm])
    loss_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CBD5E1")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
    ]))
    story.append(loss_table)
    story.append(Spacer(1, 6))

    # 7. Section 4: Evidentiary Transaction Conduits
    story.append(Paragraph("4. EVIDENTIARY TRANSACTION CONDUITS", section_head_style))
    tx_rows = [[Paragraph("Transaction Hash", body_style), Paragraph(tx.strip(), mono_style)] for tx in req.transaction_hashes]
    tx_table = Table(tx_rows, colWidths=[35 * mm, 143 * mm])
    tx_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CBD5E1")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
    ]))
    story.append(tx_table)
    story.append(Spacer(1, 6))

    # 8. Section 5: Mandatory Data Requisition Checklist
    story.append(Paragraph("5. MANDATORY DATA REQUISITION CHECKLIST (Within 2 Hours SLA)", section_head_style))
    story.append(Paragraph(
        "1. Certified digital copies of complete KYC records (PAN, Aadhaar/Passport, Phone, Bank accounts).<br/>"
        "2. IP access audit logs with source port numbers, timestamps (UTC), and device identifiers.<br/>"
        "3. Internal deposit ledger transaction statements touching the suspect deposit wallet(s).<br/>"
        "4. Immediate debit freeze on all accounts associated with the beneficial owners.",
        body_style,
    ))
    story.append(Spacer(1, 6))

    # 9. Section 6: Officer Sign-off Checklist & Literal Checkboxes (NOT auto-filled)
    story.append(Paragraph("6. OFFICER SIGN-OFF & AUTHORIZATION CHECKLIST (To be verified & signed manually)", section_head_style))
    checklist_rows = [
        [
            Paragraph("<b>[  ]</b>", mono_style),
            Paragraph("Certified true copy of FIR / Complaint verified and attached", body_style),
        ],
        [
            Paragraph("<b>[  ]</b>", mono_style),
            Paragraph("Multi-hop blockchain transaction graph verified and endorsed", body_style),
        ],
        [
            Paragraph("<b>[  ]</b>", mono_style),
            Paragraph("Suspect exchange deposit address confirmed as destination of proceeds", body_style),
        ],
        [
            Paragraph("<b>[  ]</b>", mono_style),
            Paragraph("Evidence integrity hash recorded in Police Station Case Diary", body_style),
        ],
        [
            Paragraph("<b>[  ]</b>", mono_style),
            Paragraph("Authorized for formal dispatch to VASP Nodal / Compliance Officer", body_style),
        ],
    ]
    checklist_table = Table(checklist_rows, colWidths=[12 * mm, 166 * mm])
    checklist_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 1.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 2),
    ]))
    story.append(checklist_table)
    story.append(Spacer(1, 6))

    # 10. Sign-off Boxes with Blank Lines for Manual / E-signature Execution
    sig_table_data = [
        [
            Paragraph(
                "<b>Investigating Officer Signature:</b> ___________________________<br/><br/>"
                "<b>Officer Name & Belt / Rank No.:</b> ___________________________<br/><br/>"
                "<b>Police Station / Cyber Cell:</b> ___________________________<br/><br/>"
                "<b>Date:</b> ___________________________",
                body_style,
            ),
            Paragraph(
                "<b>Countersignature (SHO / In-Charge):</b> ___________________________<br/><br/>"
                "<b>Designation / Rank:</b> ___________________________<br/><br/>"
                "<b>Police Station Official Stamp/Seal:</b><br/><br/><br/>"
                "<b>Date:</b> ___________________________",
                body_style,
            ),
        ]
    ]
    sig_table = Table(sig_table_data, colWidths=[89 * mm, 89 * mm])
    sig_table.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#94A3B8")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
    ]))
    story.append(sig_table)

    # Build the document with warning watermark canvas
    doc.build(story, canvasmaker=WatermarkedDraftCanvas)

    return output_path
