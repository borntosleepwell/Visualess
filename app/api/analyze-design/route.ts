import { analyzeDesignImage } from "@/lib/ai/analyze-design";
import { uploadSchema } from "@/lib/validation/analysis-schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return Response.json(
        {
          success: false,
          message: "Please upload an image before analyzing.",
        },
        { status: 400 },
      );
    }

    // The route handler is the backend boundary, so file validation is repeated here.
    const uploadResult = uploadSchema.safeParse({ file: image });

    if (!uploadResult.success) {
      return Response.json(
        {
          success: false,
          message: uploadResult.error.issues[0]?.message ?? "Invalid image file.",
        },
        { status: 400 },
      );
    }

    const { analysis, usedModel } = await analyzeDesignImage(image);

    return Response.json({
      success: true,
      data: analysis,
      meta: {
        usedModel,
      },
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to analyze design image.",
      },
      { status: 500 },
    );
  }
}
