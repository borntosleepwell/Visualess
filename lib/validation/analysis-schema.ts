import { z } from "zod";

// This schema is the single source of truth for analysis data used by API and UI.
export const analysisSchema = z.object({
  isDesignRelated: z.boolean(),
  rejectionReason: z.string().nullable().optional(),
  title: z.string().min(1),
  imageUrl: z.string().optional(),
  designNarrative: z.string().min(1),
  styleTags: z.array(z.string()).min(3).max(8),
  layoutTags: z.array(z.string()).min(3).max(8),
  colorTags: z.array(z.string()).min(3).max(8),
  typographyTags: z.array(z.string()).min(3).max(8),
  moodTags: z.array(z.string()).min(3).max(8),
  searchKeywords: z.array(z.string()).min(6).max(8),
});

export const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => ["image/png", "image/jpeg", "image/webp"].includes(file.type),
      "Unsupported file format. Please upload PNG, JPG, JPEG, or WEBP.",
    )
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File is too large. Maximum upload size is 10MB.",
    ),
});

export const analyzeDesignResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: analysisSchema,
    meta: z
      .object({
        usedModel: z.string().min(1),
      })
      .optional(),
  }),
  z.object({
    success: z.literal(false),
    message: z.string().min(1),
  }),
]);
