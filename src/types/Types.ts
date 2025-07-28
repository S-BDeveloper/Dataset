// Types for the Quranic Signs & Guidance app
export interface QuranicMiracle {
  type:
    | "pair"
    | "middle"
    | "numerical"
    | "structure"
    | "linguistic"
    | "prophecy"
    | "scientific";
  title: string;
  notes: string;
  sources?: {
    primary: string;
    verification: string;
    methodology: string;
    references: string[];
    academic: string;
  };
  // For pairs
  pair?: string[];
  lifeCount?: number;
  deathCount?: number;
  manCount?: number;
  womanCount?: number;
  heavenCount?: number;
  hellCount?: number;
  worldCount?: number;
  hereafterCount?: number;
  angelsCount?: number;
  devilsCount?: number;
  goodCount?: number;
  evilCount?: number;
  lightCount?: number;
  darknessCount?: number;
  guidanceCount?: number;
  misguidanceCount?: number;
  dayCount?: number;
  nightCount?: number;
  patienceCount?: number;
  impatienceCount?: number;
  // For other types
  description?: string;
  location?: string;
  significance?: string;
  pattern?: string;
  examples?: string[];
  status?: string;
  source?: string;

  // Prophetic Fulfillment Tracking
  fulfillmentStatus?:
    | "fulfilled"
    | "in-progress"
    | "pending"
    | "partially-fulfilled";
  yearRevealed?: number;
  yearFulfilled?: number;
  fulfillmentEvidence?: string;
  prophecyCategory?:
    | "historical"
    | "scientific"
    | "social"
    | "natural"
    | "cosmological"
    | "technological";
  relatedEvents?: {
    event: string;
    year: number;
    description: string;
    evidence: string;
  }[];
  fulfillmentConfidence?: "high" | "medium" | "low";
  academicSources?: string[];

  [key: string]: unknown;
}

export interface MiracleFilters {
  type: string;
  status?: string;
  fulfillmentStatus?: string;
  prophecyCategory?: string;
  searchTerm: string;
  sortBy: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  favorites?: string[];
  preferences?: {
    darkMode?: boolean;
    language?: string;
  };
}

export interface QuranAyah {
  surah_no: number;
  surah_name_en: string;
  surah_name_ar: string;
  surah_name_roman: string;
  ayah_no_surah: number;
  ayah_no_quran: number;
  ayah_ar: string;
  ayah_en: string; // English translation
  hizb_quarter: number;
  total_ayah_surah: number;
  total_ayah_quran: number;
  place_of_revelation: string;
  sajah_ayah: boolean;
  sajdah_no: string;
  no_of_word_ayah: number;
}

export interface HadithEntry {
  [key: string]: string; // Dynamic key-value pairs for hadith content
}

export interface QuranFilters {
  surah?: number;
  searchTerm: string;
  placeOfRevelation?: string;
  sortBy: string;
}

export interface HadithFilters {
  searchTerm: string;
  sortBy: string;
}
