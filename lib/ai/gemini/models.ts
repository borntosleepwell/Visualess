export const geminiModelFallbacks = [
  "gemini-2.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-3.5-flash",
] as const;

export type GeminiModelId = (typeof geminiModelFallbacks)[number];
