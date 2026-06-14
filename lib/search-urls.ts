import type { SearchPlatform } from "@/types/analysis";

const searchUrlBuilders: Record<SearchPlatform, (keyword: string) => string> = {
  google: (keyword) =>
    `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
  pinterest: (keyword) =>
    `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(keyword)}`,
  behance: (keyword) =>
    `https://www.behance.net/search/projects?search=${encodeURIComponent(keyword)}`,
  dribbble: (keyword) =>
    `https://dribbble.com/search/${encodeURIComponent(keyword)}`,
};

export function buildSearchUrl(platform: SearchPlatform, keyword: string) {
  return searchUrlBuilders[platform](keyword);
}
