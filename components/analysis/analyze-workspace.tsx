"use client";

import { motion } from "motion/react";
import { ArrowRight, Loader2, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AnalysisResult } from "@/components/analysis/analysis-result";
import { ImagePreview } from "@/components/analysis/image-preview";
import { UploadDropzone } from "@/components/analysis/upload-dropzone";
import { Button } from "@/components/ui/button";
import { analyzeDesignResponseSchema } from "@/lib/validation/analysis-schema";
import { cn } from "@/lib/utils";
import type { DesignAnalysis, OutputLanguage } from "@/types/analysis";

const outputLanguages: Array<{ label: string; value: OutputLanguage }> = [
  { label: "Indonesia", value: "id" },
  { label: "English", value: "en" },
];

export function AnalyzeWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DesignAnalysis | null>(null);
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>("id");

  const canAnalyze = Boolean(file) && !isAnalyzing;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileAccepted(nextFile: File) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setErrorMessage(null);
    setAnalysis(null);
  }

  function handleRemoveImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setErrorMessage(null);
  }

  async function handleAnalyze() {
    if (!file) {
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/analyze-design", {
        method: "POST",
        body: formData,
      });

      const payload = analyzeDesignResponseSchema.parse(await response.json());

      if (!payload.success) {
        setErrorMessage(payload.message);
        setAnalysis(null);
        return;
      }

      if (!payload.data.isDesignRelated) {
        setAnalysis(null);
        const rejectionContent = payload.data.localized[outputLanguage];
        setErrorMessage(
          rejectionContent.rejectionReason ??
            "This image does not look like a design reference. Please upload a UI, graphic design, poster, branding, or visual layout reference.",
        );
        return;
      }

      setAnalysis(payload.data);
    } catch {
      setAnalysis(null);
      setErrorMessage("Failed to analyze this image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  const statusText = useMemo(() => {
    if (isAnalyzing) {
      return "Reading layout, colors, typography, and mood...";
    }

    if (analysis) {
      return "Analysis ready";
    }

    if (file) {
      return "Image ready";
    }

    return "Waiting for a reference image";
  }, [analysis, file, isAnalyzing]);

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 py-4">
          <div>
            <p className="text-xs font-medium uppercase text-zinc-500">
              Visualess
            </p>
            <h1 className="text-xl font-semibold tracking-normal text-zinc-950">
              Design style analyzer
            </h1>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600">
            {statusText}
          </div>
        </header>

        <section className="grid flex-1 gap-4 py-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
          >
            {file && previewUrl ? (
              <ImagePreview
                file={file}
                previewUrl={previewUrl}
                onRemove={handleRemoveImage}
              />
            ) : (
              <UploadDropzone
                onFileAccepted={handleFileAccepted}
                onError={setErrorMessage}
              />
            )}

            {errorMessage ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <section className="space-y-2">
              <p className="text-xs font-medium uppercase text-zinc-500">
                Output language
              </p>
              <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-1">
                {outputLanguages.map((language) => (
                  <button
                    key={language.value}
                    type="button"
                    onClick={() => setOutputLanguage(language.value)}
                    className={cn(
                      "h-8 rounded-md px-3 text-sm font-medium text-zinc-500 transition",
                      outputLanguage === language.value &&
                        "bg-zinc-950 text-white shadow-sm",
                    )}
                    aria-pressed={outputLanguage === language.value}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                size="lg"
                disabled={!canAnalyze}
                onClick={handleAnalyze}
              >
                {isAnalyzing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
                Analyze design
              </Button>
              <Button type="button" variant="outline" size="lg" disabled={!analysis}>
                <Save className="size-4" />
                Save analysis
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
          >
            {analysis ? (
              <AnalysisResult analysis={analysis} language={outputLanguage} />
            ) : (
              <section className="flex min-h-[520px] flex-col justify-between rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-500">
                    Output
                  </p>
                  <h2 className="mt-2 max-w-md text-3xl font-semibold tracking-normal text-zinc-950">
                    Visual language will appear here.
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-zinc-500">
                    Upload a reference, run analysis, then use the generated
                    tags and keywords for research.
                  </p>
                </div>

                <div className="grid gap-3 border-t border-zinc-200 pt-5 sm:grid-cols-3">
                  {["Style tags", "Search keywords", "Reference actions"].map(
                    (item) => (
                      <div
                        key={item}
                        className="border-l border-zinc-200 pl-3 first:border-l-0 first:pl-0"
                      >
                        <p className="text-sm font-medium text-zinc-800">
                          {item}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}
          </motion.div>
        </section>
      </div>
    </main>
  );
}
