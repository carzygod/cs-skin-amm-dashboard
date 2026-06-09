from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "恢复文档合集.pdf"
DOCS = [
    ("需求文档", ROOT / "docs" / "需求文档.md"),
    ("开发文档", ROOT / "docs" / "开发文档.md"),
    ("数据采集与价格预言机", ROOT / "docs" / "数据采集与价格预言机.md"),
    ("平台接入矩阵", ROOT / "docs" / "平台接入矩阵.md"),
    ("恢复说明", ROOT / "docs" / "恢复说明.md"),
]


def main():
    pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
    styles = build_styles()
    story = build_cover(styles)

    for index, (title, file_path) in enumerate(DOCS):
        if index:
            story.append(PageBreak())
        story.append(Paragraph(escape(title), styles["DocTitle"]))
        story.extend(render_markdown(file_path.read_text(encoding="utf-8"), styles))

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=12 * mm,
        leftMargin=12 * mm,
        topMargin=14 * mm,
        bottomMargin=15 * mm,
        title="CS-AMM 文档合集",
        author="CS-AMM",
    )
    doc.build(story)
    print(f"rendered {OUTPUT}")


def build_styles():
    base = getSampleStyleSheet()
    for style in base.byName.values():
        style.fontName = "STSong-Light"

    return {
        "CoverPill": ParagraphStyle(
            "CoverPill",
            parent=base["Normal"],
            fontName="STSong-Light",
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#5532b8"),
            backColor=colors.HexColor("#eee8ff"),
            borderPadding=(5, 8, 5, 8),
            borderRadius=6,
        ),
        "CoverTitle": ParagraphStyle(
            "CoverTitle",
            parent=base["Title"],
            fontName="STSong-Light",
            fontSize=28,
            leading=36,
            textColor=colors.HexColor("#10233d"),
            spaceBefore=48,
            spaceAfter=18,
        ),
        "CoverBody": ParagraphStyle(
            "CoverBody",
            parent=base["BodyText"],
            fontName="STSong-Light",
            fontSize=12,
            leading=20,
            textColor=colors.HexColor("#526175"),
        ),
        "DocTitle": ParagraphStyle(
            "DocTitle",
            parent=base["Title"],
            fontName="STSong-Light",
            fontSize=24,
            leading=30,
            textColor=colors.HexColor("#10233d"),
            spaceAfter=14,
        ),
        "H1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="STSong-Light",
            fontSize=18,
            leading=24,
            textColor=colors.HexColor("#10233d"),
            spaceBefore=12,
            spaceAfter=8,
        ),
        "H2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="STSong-Light",
            fontSize=14,
            leading=20,
            textColor=colors.HexColor("#173d63"),
            spaceBefore=10,
            spaceAfter=6,
        ),
        "Body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="STSong-Light",
            fontSize=9,
            leading=15,
            textColor=colors.HexColor("#172033"),
            spaceAfter=6,
        ),
        "Bullet": ParagraphStyle(
            "Bullet",
            parent=base["BodyText"],
            fontName="STSong-Light",
            fontSize=9,
            leading=14,
            leftIndent=12,
            firstLineIndent=-8,
            textColor=colors.HexColor("#172033"),
            spaceAfter=3,
        ),
        "Code": ParagraphStyle(
            "Code",
            parent=base["Code"],
            fontName="Courier",
            fontSize=7,
            leading=10,
            textColor=colors.white,
            backColor=colors.HexColor("#10172a"),
            borderPadding=6,
            spaceAfter=8,
        ),
    }


def build_cover(styles):
    return [
        Paragraph("CS-AMM", styles["CoverPill"]),
        Paragraph("CS2 饰品库存对敲套利系统文档合集", styles["CoverTitle"]),
        Paragraph(
            "本 PDF 汇总需求文档、开发文档、数据采集与价格预言机设计、恢复说明。"
            "内容用于工程恢复、继续开发和后续验收，不包含时间戳、账号凭证、会话、令牌或支付信息。",
            styles["CoverBody"],
        ),
        PageBreak(),
    ]


def render_markdown(markdown, styles):
    elements = []
    lines = markdown.splitlines()
    in_code = False
    code_lines = []
    table_lines = []
    list_lines = []

    def flush_table():
        nonlocal table_lines
        if not table_lines:
            return
        rows = []
        for line in table_lines:
            clean = line.strip().strip("|")
            cells = [cell.strip() for cell in clean.split("|")]
            if all(set(cell.replace(":", "").strip()) <= {"-"} and cell.strip() for cell in cells):
                continue
            rows.append([Paragraph(escape(cell), styles["Body"]) for cell in cells])
        if rows:
            table = Table(rows, repeatRows=1)
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2947")),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                        ("FONTNAME", (0, 0), (-1, -1), "STSong-Light"),
                        ("FONTSIZE", (0, 0), (-1, -1), 7),
                        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#d7e1eb")),
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 4),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                        ("TOPPADDING", (0, 0), (-1, -1), 4),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                    ]
                )
            )
            elements.append(table)
            elements.append(Spacer(1, 6))
        table_lines = []

    def flush_list():
        nonlocal list_lines
        for item in list_lines:
            elements.append(Paragraph(f"• {escape(item)}", styles["Bullet"]))
        list_lines = []

    for line in lines:
        if line.startswith("```"):
            flush_list()
            flush_table()
            if in_code:
                elements.append(Preformatted("\n".join(code_lines), styles["Code"]))
                code_lines = []
                in_code = False
            else:
                in_code = True
            continue

        if in_code:
            code_lines.append(line)
            continue

        if line.startswith("|"):
            flush_list()
            table_lines.append(line)
            continue

        flush_table()

        if line.startswith("## "):
            flush_list()
            elements.append(Paragraph(escape(line[3:]), styles["H1"]))
        elif line.startswith("### "):
            flush_list()
            elements.append(Paragraph(escape(line[4:]), styles["H2"]))
        elif line.startswith("# "):
            flush_list()
            elements.append(Paragraph(escape(line[2:]), styles["DocTitle"]))
        elif line.startswith("- "):
            list_lines.append(line[2:])
        elif line.strip():
            flush_list()
            elements.append(Paragraph(escape(line), styles["Body"]))
        else:
            flush_list()

    flush_list()
    flush_table()
    return elements


def escape(value):
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


if __name__ == "__main__":
    main()
