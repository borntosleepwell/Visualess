"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TagGroup } from "@/components/analysis/tag-group";
import type { DesignAnalysis } from "@/types/analysis";

type AnalysisResultProps = {
  analysis: DesignAnalysis;
  palette: string[];
};

export function AnalysisResult({
  analysis,
  palette,
}: AnalysisResultProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const visiblePalette = palette.length
    ? palette
    : ["#5599bd", "#263aa6", "#baff00", "#676767"];

  const updateScrollState = useCallback(() => {
    const element = scrollAreaRef.current;

    if (!element) {
      return;
    }

    const maxScroll = element.scrollHeight - element.clientHeight;
    setCanScroll(maxScroll > 8);
    setScrollProgress(maxScroll > 0 ? element.scrollTop / maxScroll : 0);
  }, []);

  useEffect(() => {
    updateScrollState();

    const element = scrollAreaRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);

    return () => observer.disconnect();
  }, [analysis, updateScrollState]);

  return (
    <article className="relative flex min-h-[500px] flex-col overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#171a16] p-6 text-zinc-50 shadow-2xl shadow-black/20 sm:p-8 lg:h-[min(650px,calc(100svh-158px))] lg:min-h-[500px]">
      <div
        ref={scrollAreaRef}
        onScroll={updateScrollState}
        className="min-h-0 flex-1 overflow-y-auto pr-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <h2 className="text-4xl font-semibold leading-tight text-zinc-50">
          {analysis.title}
        </h2>

        <p className="mt-7 max-w-2xl text-lg font-light leading-7 text-zinc-300">
          {analysis.designNarrative}
        </p>

        <div className="mt-8 grid gap-5">
          <TagGroup label="Style" tags={analysis.styleTags} />
          <TagGroup label="Typography" tags={analysis.typographyTags} />
          <TagGroup label="Mood" tags={analysis.moodTags} />
          <TagGroup label="Layout" tags={analysis.layoutTags} />
          <TagGroup label="Color" tags={analysis.colorTags} />
        </div>

        <section className="mt-6 space-y-3 pb-1">
          <h3 className="text-[1.05rem] font-semibold text-zinc-50">Palette</h3>
          <div className="flex overflow-hidden">
            {visiblePalette.map((color) => (
              <span
                key={color}
                className="h-9 w-16 border-y border-white/10 first:border-l last:border-r"
                style={{ backgroundColor: color }}
                title={color}
                aria-label={`Palette color ${color}`}
              />
            ))}
          </div>
        </section>
      </div>
      <LiquidScrollDots progress={scrollProgress} visible={canScroll} />
    </article>
  );
}

type LiquidScrollDotsProps = {
  progress: number;
  visible: boolean;
};

function LiquidScrollDots({ progress, visible }: LiquidScrollDotsProps) {
  const segments = 4;
  const rawIndex = progress * segments;
  const activeIndex = Math.min(segments, Math.floor(rawIndex));
  const fraction = rawIndex - activeIndex;
  const liquidHeight = 12 + Math.sin(fraction * Math.PI) * 34;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute right-4 top-1/2 hidden h-44 w-5 -translate-y-1/2 transition-opacity duration-300 sm:block ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative h-full">
        <span
          className="absolute left-1/2 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.45)] transition-[top,height] duration-150 ease-out"
          style={{
            top: `${progress * 100}%`,
            height: `${liquidHeight}px`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
}
