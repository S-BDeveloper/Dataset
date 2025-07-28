import React, { useEffect, useRef, useCallback } from "react";
import { AccessibilityContext } from "../contexts/AccessibilityContext";

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Focus trap for modals and dropdowns
  const focusTrap = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    element.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();

    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  };

  // Announce messages to screen readers
  const announceToScreenReader = (message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
      // Clear the message after a short delay
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = "";
        }
      }, 1000);
    }
  };

  // Skip to main content functionality
  const skipToMainContent = useCallback(() => {
    const mainContent = document.querySelector("main");
    if (mainContent) {
      (mainContent as HTMLElement).focus();
      announceToScreenReader("Navigated to main content");
    }
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content with Alt + M
      if (e.altKey && e.key === "m") {
        e.preventDefault();
        skipToMainContent();
      }

      // Toggle dark mode with Alt + D
      if (e.altKey && e.key === "d") {
        e.preventDefault();
        const darkModeToggle = document.querySelector(
          '[data-testid="dark-mode-toggle"]'
        ) as HTMLElement;
        darkModeToggle?.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [skipToMainContent]);

  return (
    <AccessibilityContext.Provider
      value={{ focusTrap, announceToScreenReader, skipToMainContent }}
    >
      {children}
      {/* Live region for screen reader announcements */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50"
        onClick={(e) => {
          e.preventDefault();
          skipToMainContent();
        }}
      >
        Skip to main content
      </a>
    </AccessibilityContext.Provider>
  );
};
