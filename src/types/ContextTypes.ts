import { createContext } from "react";

// Language Context Types
export type Language = "en" | "ar" | "ur" | "tr" | "fr" | "es" | "de";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Translation function
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Dark Mode Context Types
export interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
}

export const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

// Accessibility Context Types
export interface AccessibilityContextType {
  focusTrap: (element: HTMLElement) => void;
  announceToScreenReader: (message: string) => void;
  skipToMainContent: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  isReducedMotion: boolean;
  toggleReducedMotion: () => void;
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
  isKeyboardNavigation: boolean;
  setIsKeyboardNavigation: (enabled: boolean) => void;
  registerKeyboardShortcut: (key: string, callback: () => void) => void;
  unregisterKeyboardShortcut: (key: string) => void;
}

export const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);
