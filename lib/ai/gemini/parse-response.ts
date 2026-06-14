import { analysisSchema } from "@/lib/validation/analysis-schema";

function stripJsonMarkdown(text: string) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

export function parseGeminiAnalysis(text: string) {
  // Gemini output is untrusted text until it parses as JSON and passes the shared schema.
  const cleaned = stripJsonMarkdown(text);
  const json = JSON.parse(cleaned);

  return analysisSchema.parse(json);
}
