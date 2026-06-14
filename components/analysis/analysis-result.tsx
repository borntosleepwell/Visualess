import { Sparkles } from "lucide-react";

import { KeywordList } from "@/components/analysis/keyword-list";
import { TagGroup } from "@/components/analysis/tag-group";
import type { DesignAnalysis } from "@/types/analysis";

type AnalysisResultProps = {
  analysis: DesignAnalysis;
};

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <article className="space-y-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
          <Sparkles className="size-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-zinc-500">
            AI style reading
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
            {analysis.title}
          </h2>
        </div>
        <p className="text-sm leading-7 text-zinc-600">
          {analysis.designNarrative}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TagGroup label="Style" tags={analysis.styleTags} />
        <TagGroup label="Layout" tags={analysis.layoutTags} />
        <TagGroup label="Color" tags={analysis.colorTags} />
        <TagGroup label="Typography" tags={analysis.typographyTags} />
        <TagGroup label="Mood" tags={analysis.moodTags} />
      </div>

      <KeywordList keywords={analysis.searchKeywords} />
    </article>
  );
}
