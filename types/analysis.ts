export type TagGroupKey =
  | "styleTags"
  | "layoutTags"
  | "colorTags"
  | "typographyTags"
  | "moodTags";

export type DesignAnalysis = {
  id?: string;
  isDesignRelated: boolean;
  rejectionReason?: string | null;
  title: string;
  imageUrl?: string;
  designNarrative: string;
  styleTags: string[];
  layoutTags: string[];
  colorTags: string[];
  typographyTags: string[];
  moodTags: string[];
  searchKeywords: string[];
  createdAt?: string;
};

export type SearchPlatform = "google" | "pinterest" | "behance" | "dribbble";
