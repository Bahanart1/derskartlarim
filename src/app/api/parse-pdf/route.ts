import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { pathToFileURL } from "url";
import { PDFParse } from "pdf-parse";

let workerReady = false;

function ensurePdfWorker() {
  if (workerReady) return;

  const workerPath = path.join(
    process.cwd(),
    "node_modules/pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs"
  );

  PDFParse.setWorker(pathToFileURL(workerPath).href);
  workerReady = true;
}

function isPdfFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    file.type === "application/pdf" ||
    file.type === "application/octet-stream" ||
    name.endsWith(".pdf")
  );
}

export async function POST(request: NextRequest) {
  let parser: PDFParse | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    if (!isPdfFile(file)) {
      return NextResponse.json(
        { error: "Sadece PDF dosyaları desteklenir." },
        { status: 400 }
      );
    }

    ensurePdfWorker();

    const buffer = Buffer.from(await file.arrayBuffer());
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    if (!result.text?.trim()) {
      return NextResponse.json(
        { error: "PDF'den metin çıkarılamadı. Taranmış PDF olabilir." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: result.text.trim() });
  } catch (error) {
    console.error("PDF parse error:", error);
    const message =
      error instanceof Error ? error.message : "PDF okunurken hata oluştu.";
    return NextResponse.json(
      { error: `PDF okunamadı: ${message}` },
      { status: 500 }
    );
  } finally {
    if (parser) {
      await parser.destroy().catch(() => undefined);
    }
  }
}
