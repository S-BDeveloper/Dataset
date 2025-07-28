// Types for the Quranic Signs & Guidance app

// Enhanced error types for better error handling
export interface DataLoadError {
  message: string;
  code: "NETWORK_ERROR" | "PARSE_ERROR" | "NOT_FOUND" | "UNKNOWN";
  retryable: boolean;
}

// Authentication types
export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

export interface AuthError {
  code: string;
  message: string;
}

// Enhanced Quranic Miracle interface with better structure
export interface QuranicMiracle {
  type:
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
    source: string;
  };

  // For other types
  description?: string;
  location?: string;
  significance?: string;
  pattern?: string;
  examples?: string[];
  status?: "fulfilled" | "pending" | "in-progress" | "proven" | "yet-to-happen";
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

  // Remove the catch-all index signature for better type safety
  // [key: string]: unknown;
}

export interface MiracleFilters {
  type: string;
  status?: string;
  fulfillmentStatus?: string;
  prophecyCategory?: string;
  searchTerm: string;
  sortBy: string;
}

// Enhanced User interface
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

// Enhanced Quran Ayah interface with validation
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

// Enhanced Hadith Entry interface with proper structure
export interface HadithEntry {
  id: string;
  number: string;
  book: string;
  chapter: string;
  narrator: string;
  text: string;
  arabic?: string;
  translation?: string;
  grade?: string;
  reference?: string;
  // Remove the catch-all index signature for better type safety
  // [key: string]: string;
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

// Enhanced search result types
export interface UnifiedSearchResult {
  id: string;
  type: "miracle" | "quran" | "hadith";
  title: string;
  content: string;
  source: string;
  data: QuranicMiracle | QuranAyah | HadithEntry;
}

// Filter state interface for advanced search
export interface FilterState {
  types: string[];
  categories: string[];
  searchFields: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  fulfillmentStatus: string[];
  prophecyCategories: string[];
  yearRange: { min: number; max: number };
  dataSources: ("miracle" | "quran" | "hadith")[];
  quranSurahs: string[];
  quranVerseRange: { min: number; max: number };
  quranPlaceOfRevelation: string[];
  hadithNumberRange: { min: number; max: number };
  hadithCategories: string[];
}

// Pagination types
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

// Toast notification types
export interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartConfig {
  type: "bar" | "pie" | "line" | "scatter";
  data: ChartDataPoint[];
  title: string;
  height?: number;
  width?: number;
}
