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
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-950">{label}</h3>
        <Button type="button" variant="outline" size="sm" onClick={copyAllKeywords}>
          {copiedKeyword === "all" ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          Copy all
        </Button>
      </div>

      <div className="space-y-3">
        {keywords.map((keyword) => (
          <article
            key={keyword}
            className="space-y-3 border-t border-zinc-200 py-3 first:border-t-0 first:pt-0"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium leading-6 text-zinc-800">
                {keyword}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => copyKeyword(keyword)}
                aria-label={`Copy ${keyword}`}
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
