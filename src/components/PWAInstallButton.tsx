import React, { useState, useEffect } from "react";
import { useLanguage } from "../hooks/useContext";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallButtonProps {
  className?: string;
  variant?: "button" | "icon";
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = "",
  variant = "button",
}) => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // Check if already installed
    if (!checkIfInstalled()) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsLoading(true);
      try {
        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          console.log("User accepted the install prompt");
          setIsInstalled(true);
        } else {
          console.log("User dismissed the install prompt");
        }
      } catch (error) {
        console.error("Error showing install prompt:", error);
      } finally {
        setIsLoading(false);
      }

      setDeferredPrompt(null);
    } else {
      // Manual install instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);

      let message = t("pwa.installMessage");
      if (isIOS) {
        message += t("pwa.iosInstructions");
      } else if (isAndroid) {
        message += t("pwa.androidInstructions");
      } else {
        message += t("pwa.desktopInstructions");
      }

      alert(message);
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Show helpful message if no install prompt available (likely missing icons)
  if (!deferredPrompt) {
    return (
      <button
        onClick={() => {
          alert(
            "PWA installation requires proper icons. Please generate the required PNG icons from the SVG template in public/icons/icon.svg"
          );
        }}
        className={`p-2 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-200 ${className}`}
        title="PWA setup incomplete - missing icons"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleInstallClick}
        disabled={isLoading}
        className={`p-2 text-stone-600 dark:text-stone-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 ${className}`}
        title={t("pwa.installApp")}
      >
        {isLoading ? (
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleInstallClick}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200 ${className}`}
    >
      {isLoading ? (
        <svg
          className="w-4 h-4 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      )}
      {t("pwa.installApp")}
    </button>
  );
};
