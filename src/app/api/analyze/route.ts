import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult } from "@/lib/aiPrompt";

// Data dummy untuk development (AI dinonaktifkan)
const DUMMY_RESULT: AnalysisResult = {
  strategicFindings: {
    hook: "Hook cukup menarik di 3 detik pertama dengan teks overlay. Pertimbangkan tes variasi headline untuk meningkatkan CTR.",
    visual: "Kualitas visual baik, komposisi seimbang. Warna brand konsisten. Coba tambah gerakan subtle pada elemen CTA.",
    audio: "Narasi jelas dan tempo pas. Musik latar tidak mendominasi. Sesuaikan volume dengan standar Meta (tidak terlalu keras).",
  },
  actionPlan: [
    "Perkuat hook di 3 detik pertama dengan teks atau visual yang lebih mencolok",
    "A/B test beberapa variasi headline dan CTA",
    "Pastikan audio memenuhi standar loudness Meta Ads",
    "Tambahkan closed caption untuk aksesibilitas dan watch time",
  ],
  suggestedCaptions: [
    "Temukan solusi yang tepat untuk kebutuhan kamu. Coba sekarang dan lihat perbedaannya. Link di bio.",
    "Sudah coba yang ini? Ribuan orang sudah merasakan manfaatnya. Klik link di bio untuk info lengkap.",
  ],
};

export const maxDuration = 60;

interface Body {
  duration?: number;
  width?: number;
  height?: number;
  frames?: string[];
}

export async function POST(request: NextRequest) {
  try {
    await request.json(); // validasi body tetap ada, tapi tidak dipakai
  } catch {
    return NextResponse.json(
      { error: "Body harus JSON valid" },
      { status: 400 }
    );
  }

  // Delay minimal supaya progress bar sempat terlihat (dummy mode)
  await new Promise((r) => setTimeout(r, 250));

  return NextResponse.json(DUMMY_RESULT);
}



