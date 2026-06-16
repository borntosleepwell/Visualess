"use client";

import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildSearchUrl } from "@/lib/search-urls";
import type { SearchPlatform } from "@/types/analysis";

const platforms: Array<{ label: string; value: SearchPlatform }> = [
  { label: "Google", value: "google" },
  { label: "Pinterest", value: "pinterest" },
  { label: "Behance", value: "behance" },
  { label: "Dribbble", value: "dribbble" },
];

type ExternalSearchButtonsProps = {
  keyword: string;
};

export function ExternalSearchButtons({ keyword }: ExternalSearchButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {platforms.map((platform) => (
        <Button key={platform.value} asChild variant="outline" size="sm">
          <a
            href={buildSearchUrl(platform.value, keyword)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Search ${keyword} on ${platform.label}`}
            className="border-white/20 bg-white/10 text-zinc-100 hover:bg-white/20 hover:text-white"
          >
            <ExternalLink className="size-3.5" />
            {platform.label}
          </a>
        </Button>
      ))}
    </div>
  );
}
