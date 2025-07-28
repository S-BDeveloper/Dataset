import React, { memo, useCallback } from "react";
import type { QuranicMiracle } from "../types/Types";
import { AccessibleButton } from "./ui/AccessibleButton";

interface MiracleCardProps {
  miracle: QuranicMiracle;
  onFavorite: (miracle: QuranicMiracle) => void;
  isFavorite: boolean;
}

const getTypeColor = (type: string) => {
  const colors = {
    prophecy:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
    scientific:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    numerical:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    linguistic:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    structure:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200",
    middle:
      "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-200",
  };
  return colors[type as keyof typeof colors] || colors.middle;
};

const getStatusColor = (status?: string) => {
  const colors = {
    fulfilled:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    "in-progress":
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    proven:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    "yet-to-happen":
      "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-200",
  };
  return colors[status as keyof typeof colors] || colors.pending;
};

export const MiracleCard = memo<MiracleCardProps>(
  ({ miracle, onFavorite, isFavorite }) => {
    const handleFavoriteClick = useCallback(() => {
      onFavorite(miracle);
    }, [miracle, onFavorite]);

    const handleCardClick = useCallback(() => {
      // Could implement card expansion or modal opening here
      console.log("Card clicked:", miracle.title);
    }, [miracle.title]);

    return (
      <div
        className="bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 hover:shadow-xl transition-shadow cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`View details for ${miracle.title}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
              {miracle.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                  miracle.type
                )}`}
              >
                {miracle.type.charAt(0).toUpperCase() + miracle.type.slice(1)}
              </span>
              {miracle.status && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    miracle.status
                  )}`}
                >
                  {miracle.status.charAt(0).toUpperCase() +
                    miracle.status.slice(1)}
                </span>
              )}
            </div>
          </div>

          <AccessibleButton
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite
                ? `Remove ${miracle.title} from favorites`
                : `Add ${miracle.title} to favorites`
            }
            aria-pressed={isFavorite}
            className="flex-shrink-0"
          >
            <svg
              className={`w-5 h-5 ${
                isFavorite ? "text-red-500 fill-current" : "text-stone-400"
              }`}
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </AccessibleButton>
        </div>

        <div className="space-y-3">
          {miracle.description && (
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              {miracle.description}
            </p>
          )}

          <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
            {miracle.notes}
          </p>

          {miracle.source && (
            <div className="text-xs text-stone-500 dark:text-stone-500">
              <span className="font-medium">Source:</span> {miracle.source}
            </div>
          )}

          {miracle.fulfillmentStatus && (
            <div className="text-xs text-stone-500 dark:text-stone-500">
              <span className="font-medium">Fulfillment:</span>{" "}
              {miracle.fulfillmentStatus}
            </div>
          )}

          {miracle.fulfillmentEvidence && (
            <details className="mt-3">
              <summary className="text-xs font-medium text-stone-600 dark:text-stone-400 cursor-pointer hover:text-stone-800 dark:hover:text-stone-200">
                View Evidence
              </summary>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                {miracle.fulfillmentEvidence}
              </p>
            </details>
          )}

          {miracle.sources && (
            <details className="mt-3">
              <summary className="text-xs font-medium text-stone-600 dark:text-stone-400 cursor-pointer hover:text-stone-800 dark:hover:text-stone-200">
                View Sources
              </summary>
              <div className="text-xs text-stone-600 dark:text-stone-400 mt-2 space-y-1">
                <div>
                  <span className="font-medium">Primary:</span>{" "}
                  {miracle.sources.primary}
                </div>
                <div>
                  <span className="font-medium">Methodology:</span>{" "}
                  {miracle.sources.methodology}
                </div>
                {miracle.sources.references &&
                  miracle.sources.references.length > 0 && (
                    <div>
                      <span className="font-medium">References:</span>
                      <ul className="list-disc list-inside mt-1">
                        {miracle.sources.references.map((ref, index) => (
                          <li key={index}>
                            <a
                              href={ref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 dark:text-green-400 hover:underline"
                            >
                              {ref}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }
);

MiracleCard.displayName = "MiracleCard";
