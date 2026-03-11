export interface AnalysisInput {
  duration: number;
  width: number;
  height: number;
  frames: string[]; // base64 data URLs
}

export interface StrategicFindings {
  hook: string;
  visual: string;
  audio: string;
}

export interface AnalysisResult {
  strategicFindings: StrategicFindings;
  actionPlan: string[];
  suggestedCaptions: [string, string];
}

export function buildAnalysisPrompt(): string {
  return `Kamu adalah ahli kreatif iklan Meta Ads. Analisis video iklan ini dan berikan respons HANYA dalam format JSON berikut (tanpa teks lain sebelum atau sesudah). Gunakan istilah dalam Bahasa Inggris untuk kategori (Hook, Visual, Audio). Isi analisis dalam Bahasa Indonesia. Jangan gunakan tanda bintang (*) di mana pun dalam output.

Format JSON:
{
  "strategicFindings": {
    "hook": "ringkasan temuan tentang hook/attention grab (1-3 kalimat)",
    "visual": "ringkasan temuan visual (1-3 kalimat)",
    "audio": "ringkasan temuan audio/narasi/music (1-3 kalimat)"
  },
  "actionPlan": ["poin perbaikan 1", "poin perbaikan 2", "..."],
  "suggestedCaptions": ["variasi caption 1", "variasi caption 2"]
}

Berikan analisis yang ringkas dan actionable.`;
}

export function parseAnalysisResponse(text: string): AnalysisResult | null {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]) as AnalysisResult;
    if (
      parsed?.strategicFindings?.hook != null &&
      parsed?.strategicFindings?.visual != null &&
      parsed?.strategicFindings?.audio != null &&
      Array.isArray(parsed?.actionPlan) &&
      Array.isArray(parsed?.suggestedCaptions) &&
      parsed.suggestedCaptions.length >= 2
    ) {
      return {
        strategicFindings: parsed.strategicFindings,
        actionPlan: parsed.actionPlan,
        suggestedCaptions: [parsed.suggestedCaptions[0], parsed.suggestedCaptions[1]],
      };
    }
  } catch {
    // ignore
  }
  return null;
}



