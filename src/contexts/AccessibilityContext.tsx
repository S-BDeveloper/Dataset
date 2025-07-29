import React, { useState, useEffect, useCallback, useRef } from "react";
import { AccessibilityContext } from "../types/ContextTypes";

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState<
    Map<string, () => void>
  >(new Map());

  const focusTrapRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap implementation
  const focusTrap = useCallback((element: HTMLElement) => {
    focusTrapRef.current = element;
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Find all focusable elements within the trap
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    // Focus the first element
    firstElement.focus();

    // Handle tab key to cycle through elements
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          // Shift + Tab: move backwards
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: move forwards
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      } else if (e.key === "Escape") {
        // Escape: exit focus trap
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      }
    };

    element.addEventListener("keydown", handleKeyDown);

    // Return cleanup function
    return () => {
      element.removeEventListener("keydown", handleKeyDown);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Screen reader announcements
  const announceToScreenReader = useCallback((message: string) => {
    // Create a live region for announcements
    let liveRegion = document.getElementById("screen-reader-announcements");
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.id = "screen-reader-announcements";
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.style.position = "absolute";
      liveRegion.style.left = "-10000px";
      liveRegion.style.width = "1px";
      liveRegion.style.height = "1px";
      liveRegion.style.overflow = "hidden";
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = message;

    // Clear the message after a short delay
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = "";
      }
    }, 1000);
  }, []);

  // Skip to main content
  const skipToMainContent = useCallback(() => {
    const mainContent =
      document.querySelector("main") || document.querySelector("#main-content");
    if (mainContent) {
      (mainContent as HTMLElement).focus();
      announceToScreenReader("Navigated to main content");
    }
  }, [announceToScreenReader]);

  // Toggle high contrast
  const toggleHighContrast = useCallback(() => {
    setIsHighContrast((prev) => {
      const newValue = !prev;
      document.documentElement.classList.toggle("high-contrast", newValue);
      announceToScreenReader(
        `High contrast ${newValue ? "enabled" : "disabled"}`
      );
      return newValue;
    });
  }, [announceToScreenReader]);

  // Toggle reduced motion
  const toggleReducedMotion = useCallback(() => {
    setIsReducedMotion((prev) => {
      const newValue = !prev;
      document.documentElement.classList.toggle("reduced-motion", newValue);
      announceToScreenReader(
        `Reduced motion ${newValue ? "enabled" : "disabled"}`
      );
      return newValue;
    });
  }, [announceToScreenReader]);

  // Set font size
  const setFontSizeHandler = useCallback(
    (size: "small" | "medium" | "large") => {
      setFontSize(size);
      document.documentElement.setAttribute("data-font-size", size);
      announceToScreenReader(`Font size set to ${size}`);
    },
    [announceToScreenReader]
  );

  // Register keyboard shortcut
  const registerKeyboardShortcut = useCallback(
    (key: string, callback: () => void) => {
      setKeyboardShortcuts((prev) => new Map(prev).set(key, callback));
    },
    []
  );

  // Unregister keyboard shortcut
  const unregisterKeyboardShortcut = useCallback((key: string) => {
    setKeyboardShortcuts((prev) => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  // Global keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const modifier = e.ctrlKey
        ? "ctrl+"
        : e.altKey
        ? "alt+"
        : e.shiftKey
        ? "shift+"
        : "";
      const shortcutKey = `${modifier}${key}`;

      const callback = keyboardShortcuts.get(shortcutKey);
      if (callback) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [keyboardShortcuts]);

  // Initialize accessibility features
  useEffect(() => {
    // Check for user preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setIsReducedMotion(prefersReducedMotion);

    if (prefersReducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    }

    // Register default keyboard shortcuts
    registerKeyboardShortcut("h", () => {
      announceToScreenReader("Navigating to home page");
      // Navigate to home page
    });

    registerKeyboardShortcut("s", () => {
      announceToScreenReader("Opening search");
      // Open search
    });

    registerKeyboardShortcut("n", () => {
      announceToScreenReader("Navigating to next item");
      // Navigate to next item
    });

    registerKeyboardShortcut("p", () => {
      announceToScreenReader("Navigating to previous item");
      // Navigate to previous item
    });

    return () => {
      // Cleanup default shortcuts
      unregisterKeyboardShortcut("h");
      unregisterKeyboardShortcut("s");
      unregisterKeyboardShortcut("n");
      unregisterKeyboardShortcut("p");
    };
  }, [
    registerKeyboardShortcut,
    unregisterKeyboardShortcut,
    announceToScreenReader,
  ]);

  return (
    <AccessibilityContext.Provider
      value={{
        focusTrap,
        announceToScreenReader,
        skipToMainContent,
        isHighContrast,
        toggleHighContrast,
        isReducedMotion,
        toggleReducedMotion,
        fontSize,
        setFontSize: setFontSizeHandler,
        isKeyboardNavigation,
        setIsKeyboardNavigation,
        registerKeyboardShortcut,
        unregisterKeyboardShortcut,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export { AccessibilityContext };
