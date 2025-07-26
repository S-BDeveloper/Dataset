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
  type?: string;
  status?: string;
  fulfillmentStatus?: string;
  prophecyCategory?: string;
  searchTerm?: string;
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
