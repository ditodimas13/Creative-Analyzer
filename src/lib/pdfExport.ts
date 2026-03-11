import { jsPDF } from "jspdf";
import type { AnalysisResult } from "./aiPrompt";

const MARGIN = 16;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 5;
const FOOTER_Y = 285;

function checkNewPage(doc: jsPDF, y: number, needSpace: number): number {
  if (y + needSpace > FOOTER_Y) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

export function exportAnalysisToPdf(
  fileName: string,
  result: AnalysisResult,
  onDone: (blob: Blob, name: string) => void
): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 0;

  // —— Header band ——
  doc.setFillColor(124, 58, 237);
  doc.rect(0, 0, PAGE_WIDTH, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Video Creative Analyzer", MARGIN, 14);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const shortName =
    fileName.length > 58 ? fileName.slice(0, 55) + "..." : fileName;
  doc.text(shortName, MARGIN, 22);
  doc.setTextColor(0, 0, 0);
  y = 40;

  // —— Section title: Temuan Strategis ——
  y = checkNewPage(doc, y, 22);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(88, 28, 135);
  doc.text("Temuan Strategis", MARGIN, y);
  y += 10;

  // —— 3 cards (Hook, Visual, Audio) ——
  const cardPadding = 5;
  const cardGap = 6;
  const cardWidth = (CONTENT_WIDTH - cardGap * 2) / 3;
  const cardH = 38;
  const labels = ["Hook", "Visual", "Audio"] as const;
  const colors: [number, number, number][] = [
    [253, 230, 138],
    [125, 211, 252],
    [134, 239, 172],
  ];
  const texts = [
    result.strategicFindings.hook,
    result.strategicFindings.visual,
    result.strategicFindings.audio,
  ];

  const cardStartY = y;
  for (let i = 0; i < 3; i++) {
    const x0 = MARGIN + i * (cardWidth + cardGap);
    doc.setFillColor(...colors[i]);
    doc.rect(x0, cardStartY, cardWidth, cardH, "F");
    doc.setDrawColor(200, 200, 200);
    doc.rect(x0, cardStartY, cardWidth, cardH, "S");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 70, 50);
    doc.text(labels[i], x0 + cardPadding, cardStartY + cardPadding + 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    const wrapped = doc.splitTextToSize(texts[i], cardWidth - cardPadding * 2);
    for (let j = 0; j < Math.min(wrapped.length, 5); j++) {
      doc.text(wrapped[j], x0 + cardPadding, cardStartY + cardPadding + 11 + j * 4);
    }
  }
  y = cardStartY + cardH + cardGap + 6;

  // —— Section: Action Plan ——
  y = checkNewPage(doc, y, 20);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(88, 28, 135);
  doc.text("Action Plan", MARGIN, y);
  y += 10;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  for (const point of result.actionPlan) {
    const lines = doc.splitTextToSize(point, CONTENT_WIDTH - 12);
    for (const line of lines) {
      y = checkNewPage(doc, y, 6);
      doc.setFillColor(139, 92, 246);
      doc.circle(MARGIN + 4, y + 2.5, 1.2, "F");
      doc.text(line, MARGIN + 10, y + 4);
      y += 5;
    }
    y += 2;
  }
  y += 4;

  // —— Section: Suggested Captions ——
  y = checkNewPage(doc, y, 28);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(88, 28, 135);
  doc.text("Suggested Captions", MARGIN, y);
  y += 10;

  const captionWidth = CONTENT_WIDTH - 14;
  for (let i = 0; i < 2; i++) {
    const caption = result.suggestedCaptions[i];
    const lines = doc.splitTextToSize(caption, captionWidth);
    const boxH = Math.max(18, lines.length * 5 + 10);
    y = checkNewPage(doc, y, boxH + 4);
    doc.setFillColor(i === 0 ? 207 : 224, i === 0 ? 250 : 242, 254);
    doc.rect(MARGIN, y, CONTENT_WIDTH, boxH, "F");
    doc.setDrawColor(103, 232, 249);
    doc.rect(MARGIN, y, CONTENT_WIDTH, boxH, "S");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 100, 120);
    doc.text(String(i + 1), MARGIN + 5, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(25, 55, 55);
    doc.text(lines, MARGIN + 12, y + 7);
    y += boxH + 4;
  }

  // —— Footer ——
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text("Dibuat dengan Video Creative Analyzer", MARGIN, FOOTER_Y);

  const blob = doc.output("blob");
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 80);
  onDone(blob, `analisis-${safeName}.pdf`);
}



