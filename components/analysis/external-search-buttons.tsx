"use client";

import Image, { type StaticImageData } from "next/image";

import behanceLogo from "@/assets/logo/behance.svg";
import dribbbleLogo from "@/assets/logo/dribble.svg";
import googleLogo from "@/assets/logo/google.png";
import pinterestLogo from "@/assets/logo/Pinterest.svg";
import { Button } from "@/components/ui/button";
import { buildSearchUrl } from "@/lib/search-urls";
import type { SearchPlatform } from "@/types/analysis";

const platforms: Array<{
  icon: StaticImageData | string;
  iconClassName?: string;
  label: string;
  value: SearchPlatform;
  className: string;
}> = [
  {
    icon: googleLogo,
    label: "Google",
    value: "google",
    className:
      "border-white/80 bg-white hover:bg-zinc-100 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.95),0_0_18px_rgba(66,133,244,0.75)]",
  },
  {
    icon: pinterestLogo,
    iconClassName: "brightness-0 invert",
    label: "Pinterest",
    value: "pinterest",
    className:
      "border-[#E60023]/70 bg-[#E60023] hover:bg-[#c9001f] hover:shadow-[0_0_0_1px_rgba(230,0,35,0.95),0_0_18px_rgba(230,0,35,0.72)]",
  },
  {
    icon: behanceLogo,
    iconClassName: "brightness-0 invert",
    label: "Behance",
    value: "behance",
    className:
      "border-[#1769FF]/70 bg-[#1769FF] hover:bg-[#0f55d8] hover:shadow-[0_0_0_1px_rgba(23,105,255,0.95),0_0_18px_rgba(23,105,255,0.72)]",
  },
  {
    icon: dribbbleLogo,
    iconClassName: "brightness-0 invert",
    label: "Dribbble",
    value: "dribbble",
    className:
      "border-[#EA4C89]/70 bg-[#EA4C89] hover:bg-[#d83a78] hover:shadow-[0_0_0_1px_rgba(234,76,137,0.95),0_0_18px_rgba(234,76,137,0.72)]",
  },
];

type ExternalSearchButtonsProps = {
  keyword: string;
};

export function ExternalSearchButtons({ keyword }: ExternalSearchButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {platforms.map((platform) => (
        <Button
          key={platform.value}
          asChild
          variant="outline"
          size="sm"
          className={`rounded-lg shadow-sm shadow-black/20 transition ${platform.className}`}
        >
          <a
            href={buildSearchUrl(platform.value, keyword)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Search ${keyword} on ${platform.label}`}
            title={`Search on ${platform.label}`}
            className="min-w-0"
          >
            <span className="relative flex h-5 w-14 items-center justify-center overflow-hidden">
              <Image
                src={platform.icon}
                alt=""
                fill
                sizes="56px"
                className={`object-contain ${platform.iconClassName ?? ""}`}
              />
            </span>
          </a>
        </Button>
      ))}
    </div>
  );
}
