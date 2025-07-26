import React from "react";
import type { IslamicFact } from "../types/Types";

interface FactCardProps {
  fact: IslamicFact;
  onFavorite?: (fact: IslamicFact) => void;
  isFavorite?: boolean;
}

// FactCard displays a single fact with all details, favorite button, and accessibility features
export const FactCard: React.FC<FactCardProps> = ({
  fact,
  onFavorite,
  isFavorite,
}) => {
  return (
    <div
      className="w-full max-w-full min-w-0 sm:max-w-xs overflow-x-auto break-words bg-white rounded-2xl shadow-xl border border-stone-200 p-6 flex flex-col gap-4 transition-all duration-200 hover:shadow-2xl focus-within:ring-2 focus-within:ring-green-500"
      data-cy="fact-card"
      tabIndex={0}
      aria-label={`Fact: ${fact.Fact}`}
    >
      {/* Fact text */}
      <div className="font-extrabold text-green-800 text-lg sm:text-xl mb-1 break-words leading-snug">
        {fact.Fact || "N/A"}
      </div>
      {/* Source and Category */}
      <div className="flex flex-wrap gap-3 items-center text-sm text-stone-700">
        <span className="font-semibold text-stone-500">Source:</span>
        <span className="text-green-700 font-medium">
          {fact.Source || "N/A"}
        </span>
        <span className="font-semibold text-stone-500 ml-4">Category:</span>
        <span className="text-orange-700 font-medium">
          {fact.Category || "N/A"}
        </span>
      </div>
      {/* Tags */}
      {fact.Tags && Array.isArray(fact.Tags) && fact.Tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {fact.Tags.map((tag) => (
            <span
              key={tag}
              className="bg-stone-100 rounded-full px-3 py-0.5 text-xs font-semibold text-stone-600 shadow-sm border border-stone-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {/* Favorite button */}
      <div className="flex justify-end mt-2">
        <button
          className={`text-green-700 hover:text-green-900 text-2xl focus:outline-none focus:ring-2 focus:ring-green-400 rounded-full transition-all duration-150 shadow-sm border border-green-100 bg-green-50/50 hover:bg-green-100/80 px-2 py-1 ${
            isFavorite
              ? "font-bold bg-yellow-100 border-yellow-300 text-yellow-600"
              : ""
          }`}
          data-cy="favorite-btn"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={() => onFavorite && onFavorite(fact)}
        >
          {isFavorite ? "\u2605" : "\u2606"}
        </button>
      </div>
    </div>
  );
};
