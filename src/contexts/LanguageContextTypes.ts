import { createContext } from "react";

export type Language = "en" | "ar" | "ur" | "tr" | "fr" | "es" | "de";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Translation function
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);
