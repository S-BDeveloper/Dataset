import { useContext } from "react";
import { AccessibilityContext } from "../contexts/AccessibilityContext";

interface AccessibilityContextType {
  focusTrap: (element: HTMLElement) => void;
  announceToScreenReader: (message: string) => void;
  skipToMainContent: () => void;
}

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};
