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
  [key: string]: unknown;
}
