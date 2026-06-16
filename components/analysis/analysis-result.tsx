import { TagGroup } from "@/components/analysis/tag-group";
import type { DesignAnalysis, OutputLanguage } from "@/types/analysis";

type AnalysisResultProps = {
  analysis: DesignAnalysis;
  language: OutputLanguage;
  palette: string[];
};

export function AnalysisResult({
  analysis,
  language,
  palette,
}: AnalysisResultProps) {
  const content = analysis.localized[language];
  const visiblePalette = palette.length
    ? palette
    : ["#5599bd", "#263aa6", "#baff00", "#676767"];

  return (
    <article className="flex min-h-[500px] flex-col overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#171a16] p-6 text-zinc-50 shadow-2xl shadow-black/20 sm:p-8 lg:h-[min(650px,calc(100svh-158px))] lg:min-h-[500px]">
      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        <h2 className="text-4xl font-semibold leading-tight text-zinc-50">
          {content.title}
        </h2>

        <p className="mt-7 max-w-2xl text-lg font-light leading-7 text-zinc-300">
          {content.designNarrative}
        </p>

        <div className="mt-8 grid gap-5">
          <TagGroup label="Style" tags={content.styleTags} />
          <TagGroup label="Typography" tags={content.typographyTags} />
          <TagGroup label="Mood" tags={content.moodTags} />
          <TagGroup label="Layout" tags={content.layoutTags} />
          <TagGroup label="Color" tags={content.colorTags} />
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
    </article>
  );
}
