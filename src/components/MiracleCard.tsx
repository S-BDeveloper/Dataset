import React from "react";
import type { QuranicMiracle } from "../types/Types";

interface MiracleCardProps {
  miracle: QuranicMiracle;
  onFavorite?: (miracle: QuranicMiracle) => void;
  isFavorite?: boolean;
}

// MiracleCard displays a single miracle with all details, favorite button, and accessibility features
export const MiracleCard: React.FC<MiracleCardProps> = ({
  miracle,
  onFavorite,
  isFavorite,
}) => {
  return (
    <div
      className="w-full h-full bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 transition-all duration-200 hover:shadow-2xl focus-within:ring-2 focus-within:ring-green-500"
      data-cy="miracle-card"
      tabIndex={0}
      aria-label={`Miracle: ${miracle.title}`}
    >
      {/* Miracle title */}
      <div className="font-bold text-green-800 dark:text-green-300 text-lg sm:text-xl break-words leading-tight">
        {miracle.title || "N/A"}
      </div>

      {/* Type */}
      <div className="flex flex-wrap gap-2 sm:gap-3 items-center text-sm sm:text-base text-stone-700 dark:text-stone-300">
        <span className="font-semibold text-stone-500 dark:text-stone-400">
          Type:
        </span>
        <span className="text-green-700 dark:text-green-400 font-medium capitalize">
          {miracle.type || "N/A"}
        </span>
      </div>

      {/* Description */}
      {miracle.description && (
        <div className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
          {miracle.description}
        </div>
      )}

      {/* Notes */}
      <div className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed flex-1">
        {miracle.notes}
      </div>

      {/* Sources */}
      {miracle.sources && (
        <div className="bg-stone-50 dark:bg-stone-700 rounded-lg p-3 sm:p-4 border border-stone-200 dark:border-stone-600">
          <h4 className="font-semibold text-stone-800 dark:text-stone-200 mb-2 text-base sm:text-lg">
            Sources & References:
          </h4>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Primary:
              </span>
              <span className="text-stone-600 dark:text-stone-400">
                {miracle.sources.primary}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Methodology:
              </span>
              <span className="text-stone-600 dark:text-stone-400">
                {miracle.sources.methodology}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Source:
              </span>
              <span className="text-stone-600 dark:text-stone-400">
                {miracle.sources.source}
              </span>
            </div>
            {miracle.sources.references &&
              miracle.sources.references.length > 0 && (
                <div>
                  <span className="font-medium text-stone-700 dark:text-stone-300">
                    References:
                  </span>
                  <div className="mt-1 space-y-1">
                    {miracle.sources.references.map((ref, index) => (
                      <a
                        key={index}
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline text-xs break-all"
                      >
                        {ref}
                      </a>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Favorite button */}
      <div className="flex justify-end mt-auto">
        <button
          className={`text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-xl sm:text-2xl focus:outline-none focus:ring-2 focus:ring-green-400 rounded-full transition-all duration-150 shadow-sm border border-green-100 dark:border-green-700 bg-green-50/50 dark:bg-green-900/30 hover:bg-green-100/80 dark:hover:bg-green-900/50 px-2 py-1 ${
            isFavorite
              ? "font-bold bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600 text-yellow-600 dark:text-yellow-400"
              : ""
          }`}
          data-cy="favorite-btn"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={() => onFavorite && onFavorite(miracle)}
        >
          {isFavorite ? "\u2605" : "\u2606"}
        </button>
      </div>
    </div>
  );
};
