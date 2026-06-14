import { analyzeWithGeminiFallback } from "@/lib/ai/gemini/fallback";
import { designAnalysisPrompt } from "@/lib/ai/prompt";

export async function analyzeDesignImage(file: File) {
  return analyzeWithGeminiFallback({
    file,
    prompt: designAnalysisPrompt,
  });
}
