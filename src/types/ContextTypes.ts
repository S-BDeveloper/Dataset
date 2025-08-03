import { createContext } from "react";

// Language Context Types
export type Language = "en" | "ar" | "ur" | "tr" | "fr" | "es" | "de";

export interface LanguageContextType {
  readonly language: Language;
  readonly setLanguage: (lang: Language) => void;
  readonly t: (key: string) => string; // Translation function
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Dark Mode Context Types
export interface DarkModeContextType {
  readonly isDarkMode: boolean;
  readonly toggleDarkMode: () => void;
  readonly setDarkMode: (dark: boolean) => void;
}

export const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

// Accessibility Context Types
export interface AccessibilityContextType {
  readonly focusTrap: (element: HTMLElement) => void;
  readonly announceToScreenReader: (message: string) => void;
  readonly skipToMainContent: () => void;
  readonly isHighContrast: boolean;
  readonly toggleHighContrast: () => void;
  readonly isReducedMotion: boolean;
  readonly toggleReducedMotion: () => void;
  readonly fontSize: "small" | "medium" | "large";
  readonly setFontSize: (size: "small" | "medium" | "large") => void;
  readonly isKeyboardNavigation: boolean;
  readonly setIsKeyboardNavigation: (enabled: boolean) => void;
  readonly registerKeyboardShortcut: (
    key: string,
    callback: () => void
  ) => void;
  readonly unregisterKeyboardShortcut: (key: string) => void;
}

export const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

// Auth Context Types
export interface AuthContextType {
  readonly user: import("./Types").AuthUser | null;
  readonly loading: boolean;
  readonly error: import("./Types").AuthError | null;
  readonly signIn: (email: string, password: string) => Promise<void>;
  readonly signUp: (email: string, password: string) => Promise<void>;
  readonly signOut: () => Promise<void>;
  readonly resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
