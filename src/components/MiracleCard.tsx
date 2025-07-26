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
      className="w-full max-w-full min-w-0 sm:max-w-xs overflow-x-auto break-words bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 p-6 flex flex-col gap-4 transition-all duration-200 hover:shadow-2xl focus-within:ring-2 focus-within:ring-green-500"
      data-cy="miracle-card"
      tabIndex={0}
      aria-label={`Miracle: ${miracle.title}`}
    >
      {/* Miracle title */}
      <div className="font-extrabold text-green-800 dark:text-green-300 text-lg sm:text-xl mb-1 break-words leading-snug">
        {miracle.title || "N/A"}
      </div>

      {/* Type */}
      <div className="flex flex-wrap gap-3 items-center text-sm text-stone-700 dark:text-stone-300">
        <span className="font-semibold text-stone-500 dark:text-stone-400">
          Type:
        </span>
        <span className="text-green-700 dark:text-green-400 font-medium capitalize">
          {miracle.type || "N/A"}
        </span>
      </div>

      {/* Word Pair Display */}
      {miracle.type === "pair" && miracle.pair && (
        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-700">
          <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
            Word Pair:
          </h4>
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium text-green-700 dark:text-green-400">
              {miracle.pair[0]}
            </span>
            <span className="text-stone-400 dark:text-stone-500 text-sm">
              vs
            </span>
            <span className="text-lg font-medium text-green-700 dark:text-green-400">
              {miracle.pair[1]}
            </span>
          </div>
          {miracle.lifeCount && miracle.deathCount && (
            <div className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              Count: {miracle.lifeCount} each
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {miracle.description && (
        <div className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
          {miracle.description}
        </div>
      )}

      {/* Notes */}
      <div className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
        {miracle.notes}
      </div>

      {/* Sources */}
      {miracle.sources && (
        <div className="bg-stone-50 dark:bg-stone-700 rounded-lg p-3 border border-stone-200 dark:border-stone-600">
          <h4 className="font-semibold text-stone-800 dark:text-stone-200 mb-2 text-sm">
            Sources & References:
          </h4>
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Primary:
              </span>
              <span className="text-stone-600 dark:text-stone-400 ml-1">
                {miracle.sources.primary}
              </span>
            </div>
            <div>
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Methodology:
              </span>
              <span className="text-stone-600 dark:text-stone-400 ml-1">
                {miracle.sources.methodology}
              </span>
            </div>
            <div>
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Academic:
              </span>
              <span className="text-stone-600 dark:text-stone-400 ml-1">
                {miracle.sources.academic}
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
      <div className="flex justify-end mt-2">
        <button
          className={`text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-2xl focus:outline-none focus:ring-2 focus:ring-green-400 rounded-full transition-all duration-150 shadow-sm border border-green-100 dark:border-green-700 bg-green-50/50 dark:bg-green-900/30 hover:bg-green-100/80 dark:hover:bg-green-900/50 px-2 py-1 ${
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
