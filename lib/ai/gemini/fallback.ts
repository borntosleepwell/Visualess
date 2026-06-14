import { analyzeWithGeminiModel } from "@/lib/ai/gemini/client";
import { geminiModelFallbacks } from "@/lib/ai/gemini/models";
import { parseGeminiAnalysis } from "@/lib/ai/gemini/parse-response";

type AnalyzeWithGeminiFallbackInput = {
  file: File;
  prompt: string;
};

export async function analyzeWithGeminiFallback({
  file,
  prompt,
}: AnalyzeWithGeminiFallbackInput) {
  const errors: string[] = [];

  for (const model of geminiModelFallbacks) {
    try {
      const rawText = await analyzeWithGeminiModel({
        model,
        file,
        prompt,
      });

      const analysis = parseGeminiAnalysis(rawText);

      return {
        analysis,
        usedModel: model,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      errors.push(`${model}: ${message}`);
    }
  }

  throw new Error(`All Gemini models failed: ${errors.join(", ")}`);
}
