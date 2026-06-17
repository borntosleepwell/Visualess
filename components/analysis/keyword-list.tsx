"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ExternalSearchButtons } from "@/components/analysis/external-search-buttons";

type KeywordListProps = {
  label: string;
  keywords: string[];
};

export function KeywordList({ label, keywords }: KeywordListProps) {
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  async function copyKeyword(keyword: string) {
    await navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    window.setTimeout(() => setCopiedKeyword(null), 1600);
  }

  async function copyAllKeywords() {
    await navigator.clipboard.writeText(keywords.join("\n"));
    setCopiedKeyword("all");
    window.setTimeout(() => setCopiedKeyword(null), 1600);
  }

  return (
    <section className="rounded-[1.75rem] border border-white/70 bg-[#171a16] p-5 text-zinc-50 shadow-2xl shadow-black/20 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-light uppercase text-zinc-400">
            Reference discovery
          </p>
          <h3 className="mt-1 font-pixel text-2xl font-semibold text-zinc-50">
            {label}
          </h3>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={copyAllKeywords}
          className="border-white/25 bg-white/10 text-zinc-50 hover:bg-white/20"
        >
          {copiedKeyword === "all" ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          Copy all
        </Button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {keywords.map((keyword) => (
          <article
            key={keyword}
            className="space-y-4 rounded-2xl border border-white/15 bg-black/20 p-4 transition hover:border-white/35 hover:bg-black/30"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="break-words text-base font-medium leading-6 text-zinc-100">
                {keyword}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => copyKeyword(keyword)}
                aria-label={`Copy ${keyword}`}
                className="text-zinc-100 hover:bg-white/10 hover:text-white"
              >
                {copiedKeyword === keyword ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
            <ExternalSearchButtons keyword={keyword} />
          </article>
        ))}
      </div>
    </section>
  );
}
