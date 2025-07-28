import { createContext } from "react";

interface AccessibilityContextType {
  focusTrap: (element: HTMLElement) => void;
  announceToScreenReader: (message: string) => void;
  skipToMainContent: () => void;
}

export const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);
