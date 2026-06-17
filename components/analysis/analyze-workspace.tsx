"use client";

import { motion } from "motion/react";
import { ArrowRight, Loader2, Save } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import logo from "@/assets/logo/Logo.svg";
import mountainBackground from "@/assets/picture/mountain.png";
import { AnalysisResult } from "@/components/analysis/analysis-result";
import { ImagePreview } from "@/components/analysis/image-preview";
import { KeywordList } from "@/components/analysis/keyword-list";
import { UploadDropzone } from "@/components/analysis/upload-dropzone";
import { Button } from "@/components/ui/button";
import { extractColorPalette } from "@/lib/color-palette";
import { analyzeDesignResponseSchema } from "@/lib/validation/analysis-schema";
import type { DesignAnalysis } from "@/types/analysis";

const keywordLabel = "Search Keywords";

export function AnalyzeWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DesignAnalysis | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [paletteError, setPaletteError] = useState<string | null>(null);

  const canAnalyze = Boolean(file) && !isAnalyzing;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileAccepted(nextFile: File) {
    const nextPreviewUrl = URL.createObjectURL(nextFile);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(nextFile);
    setPreviewUrl(nextPreviewUrl);
    setErrorMessage(null);
    setAnalysis(null);
    setPalette([]);
    setPaletteError(null);

    extractColorPalette(nextPreviewUrl)
      .then(setPalette)
      .catch(() => setPaletteError("Palette extraction failed."));
  }

  function handleRemoveImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setErrorMessage(null);
    setPalette([]);
    setPaletteError(null);
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
        setErrorMessage(
          payload.data.rejectionReason ??
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
      return "Analyzing visual style...";
    }

    if (analysis) {
      return "Analysis ready";
    }

    if (file) {
      return "Image ready";
    }

    return "Waiting for a reference image";
  }, [analysis, file, isAnalyzing]);

  const activeKeywords = analysis?.searchKeywords;

  return (
    <main className="relative min-h-[100svh] overflow-x-hidden bg-[#1B1D1A] text-zinc-50">
      <div className="fixed inset-0 h-screen">
        <Image
          src={mountainBackground}
          alt=""
          fill
          priority
          className="object-cover object-[center_42%]"
          sizes="100vw"
        />
      </div>
      <div className="fixed inset-0 h-screen bg-black/10" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-[min(82vw,1440px)] flex-col py-4">
        <header className="flex shrink-0 items-center justify-center py-0">
          <Image
            src={logo}
            alt="Visualess"
            className="h-5 w-auto sm:h-9"
            priority
          />
        </header>

        <section className="grid flex-1 items-start gap-6 pt-6 pb-5 lg:grid-cols-[minmax(600px,1.35fr)_minmax(450px,0.95fr)] xl:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex min-h-[500px] flex-col rounded-[1.75rem] border border-white/70 bg-[#171a16] p-5 shadow-2xl shadow-black/20 sm:p-8 lg:h-[min(650px,calc(100svh-112px))] lg:min-h-[540px]"
          >
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-3xl">
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
              </div>
            </div>

            {errorMessage ? (
              <p className="mt-4 rounded-2xl border border-red-300/40 bg-red-950/70 px-4 py-3 text-sm font-light text-red-100">
                {errorMessage}
              </p>
            ) : null}

            {paletteError ? (
              <p className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-950/70 px-4 py-3 text-sm font-light text-amber-100">
                {paletteError}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="lg"
                disabled={!canAnalyze}
                onClick={handleAnalyze}
                className="rounded-full bg-zinc-50 px-5 text-zinc-950 hover:bg-white disabled:bg-zinc-500 disabled:text-zinc-300"
              >
                {isAnalyzing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
                <span className="font-pixel">Analyze design</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={!analysis}
                className="rounded-full border-white/30 bg-white/10 px-5 text-zinc-50 hover:bg-white/20 disabled:text-zinc-500"
              >
                <Save className="size-4" />
                <span className="font-pixel">Save analysis</span>
              </Button>
              <span className="ml-auto text-sm font-light text-zinc-300">
                {statusText}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
          >
            {analysis ? (
              <AnalysisResult
                analysis={analysis}
                palette={palette}
              />
            ) : (
              <section className="flex min-h-[500px] flex-col justify-between rounded-[1.75rem] border border-white/70 bg-[#171a16] p-6 text-zinc-50 shadow-2xl shadow-black/20 sm:p-8 lg:h-[min(650px,calc(100svh-112px))] lg:min-h-[540px]">
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-400">
                    Output
                  </p>
                  <h2 className="mt-8 max-w-md text-4xl font-semibold tracking-normal text-zinc-50">
                    Visual language will appear here.
                  </h2>
                  <p className="mt-5 max-w-lg text-lg font-light leading-7 text-zinc-300">
                    Upload a design reference to extract style taxonomy,
                    typography cues, mood, palette, and searchable keywords.
                  </p>
                </div>

                <div className="grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
                  {["Style tags", "Palette", "Search keywords"].map(
                    (item) => (
                      <div
                        key={item}
                        className="border-l border-white/20 pl-3 first:border-l-0 first:pl-0"
                      >
                        <p
                          className={`text-sm font-light text-zinc-300 ${
                            item === "Search keywords" ? "font-pixel" : ""
                          }`}
                        >
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

        {activeKeywords ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="pb-8"
          >
            <KeywordList
              label={keywordLabel}
              keywords={activeKeywords}
            />
          </motion.div>
        ) : null}
      </div>
    </main>
  );
}
