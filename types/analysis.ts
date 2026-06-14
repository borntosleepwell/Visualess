export type TagGroupKey =
  | "styleTags"
  | "layoutTags"
  | "colorTags"
  | "typographyTags"
  | "moodTags";

export type OutputLanguage = "id" | "en";

export type LocalizedAnalysisContent = {
  rejectionReason?: string | null;
  title: string;
  designNarrative: string;
  styleTags: string[];
  layoutTags: string[];
  colorTags: string[];
  typographyTags: string[];
  moodTags: string[];
  searchKeywords: string[];
};

export type DesignAnalysis = {
  id?: string;
  isDesignRelated: boolean;
  imageUrl?: string;
  localized: Record<OutputLanguage, LocalizedAnalysisContent>;
  createdAt?: string;
};

export type SearchPlatform = "google" | "pinterest" | "behance" | "dribbble";
