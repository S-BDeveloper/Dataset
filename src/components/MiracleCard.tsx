import React, { memo } from "react";
import type { QuranicMiracle } from "../types/Types";

interface MiracleCardProps {
  miracle: QuranicMiracle;
  onFavorite: (miracle: QuranicMiracle) => void;
  isFavorite: boolean;
}

// Memoized MiracleCard component for better performance
export const MiracleCard: React.FC<MiracleCardProps> = memo(
  ({ miracle, onFavorite, isFavorite }) => {
    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onFavorite(miracle);
    };

    return (
      <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Header with type badge and favorite button */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between">
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 text-xs font-medium rounded-full">
              {miracle.type}
            </span>
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full transition-all duration-200 ${
                isFavorite
                  ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-600 hover:text-yellow-700"
                  : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
              }`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <svg
                className="h-5 w-5"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-3">
            {miracle.title}
          </h3>

          {/* Description */}
          {miracle.description && (
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-4">
              {miracle.description}
            </p>
          )}

          {/* Notes */}
          {miracle.notes && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
              <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wide">
                Notes
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {miracle.notes}
              </p>
            </div>
          )}

          {/* Prophetic Information */}
          {miracle.fulfillmentStatus && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-4">
              <h4 className="text-xs font-semibold text-orange-700 dark:text-orange-300 mb-2 uppercase tracking-wide">
                Prophetic Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-orange-600 dark:text-orange-400">
                    Status:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      miracle.fulfillmentStatus === "fulfilled"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        : miracle.fulfillmentStatus === "in-progress"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                        : miracle.fulfillmentStatus === "pending"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {miracle.fulfillmentStatus}
                  </span>
                </div>
                {miracle.yearRevealed && (
                  <div className="text-orange-600 dark:text-orange-400">
                    Revealed: {miracle.yearRevealed}
                  </div>
                )}
                {miracle.yearFulfilled && (
                  <div className="text-orange-600 dark:text-orange-400">
                    Fulfilled: {miracle.yearFulfilled}
                  </div>
                )}
                {miracle.prophecyCategory && (
                  <div className="text-orange-600 dark:text-orange-400">
                    Category: {miracle.prophecyCategory}
                  </div>
                )}
                {miracle.fulfillmentEvidence && (
                  <div className="text-xs text-orange-700 dark:text-orange-300 mt-2">
                    <strong>Evidence:</strong> {miracle.fulfillmentEvidence}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sources Information */}
          {miracle.sources && (
            <div className="p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
              <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
                Sources
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-stone-600 dark:text-stone-400">
                    Primary:
                  </span>
                  <span className="text-stone-800 dark:text-stone-200 ml-1">
                    {miracle.sources.primary}
                  </span>
                </div>
                <div>
                  <span className="text-stone-600 dark:text-stone-400">
                    Methodology:
                  </span>
                  <span className="text-stone-800 dark:text-stone-200 ml-1">
                    {miracle.sources.methodology}
                  </span>
                </div>
                {miracle.sources.references &&
                  miracle.sources.references.length > 0 && (
                    <div>
                      <span className="text-stone-600 dark:text-stone-400">
                        References:
                      </span>
                      <div className="mt-1 space-y-1">
                        {miracle.sources.references
                          .slice(0, 2)
                          .map((ref, index) => (
                            <div
                              key={index}
                              className="text-stone-800 dark:text-stone-200 truncate"
                            >
                              {ref}
                            </div>
                          ))}
                        {miracle.sources.references.length > 2 && (
                          <div className="text-stone-500 dark:text-stone-400">
                            +{miracle.sources.references.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

MiracleCard.displayName = "MiracleCard";
