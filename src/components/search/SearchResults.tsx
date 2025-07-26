import React from "react";

import type { QuranicMiracle } from "../../types/Types";

interface SearchResultsProps {
  results: QuranicMiracle[];
  searchQuery: string;
  totalResults: number;
  onFavorite: (miracle: QuranicMiracle) => void;
  isFavorite: (miracle: QuranicMiracle) => boolean;
  isLoading?: boolean;
}

// SearchResults displays filtered results with search highlighting and analytics
export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchQuery,
  totalResults,
  onFavorite,
  isFavorite,
  isLoading = false,
}) => {
  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim() || !text) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark
            key={index}
            className="bg-yellow-200 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-200 px-1 rounded"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  // Get search analytics
  const getSearchAnalytics = () => {
    if (!searchQuery.trim()) return null;

    const typeBreakdown = results.reduce((acc, miracle) => {
      const type = miracle.type || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTypes = Object.entries(typeBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    return { typeBreakdown, topTypes };
  };

  const analytics = getSearchAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-stone-600 dark:text-stone-400">Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400">
              Search Results
            </h2>
            {searchQuery.trim() && (
              <p className="text-stone-600 dark:text-stone-400 mt-1">
                Found{" "}
                <span className="font-semibold text-green-700 dark:text-green-400">
                  {totalResults}
                </span>{" "}
                results for "
                <span className="font-semibold">{searchQuery}</span>"
              </p>
            )}
          </div>

          {/* Search Analytics */}
          {analytics && analytics.topTypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-stone-500 dark:text-stone-400">
                Top types:
              </span>
              {analytics.topTypes.map(([type, count]) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs rounded-full"
                >
                  {type} ({count})
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow p-8 text-center flex flex-col items-center gap-4 border-2 border-dashed border-stone-200 dark:border-stone-600">
          <svg
            className="w-16 h-16 text-stone-400 dark:text-stone-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-2">
              No results found
            </h3>
            <p className="text-stone-500 dark:text-stone-400">
              {searchQuery.trim()
                ? `No signs or guidance found for "${searchQuery}". Try different keywords or check your spelling.`
                : "Start typing to search for signs and guidance."}
            </p>
          </div>
          <div className="text-sm text-stone-400 dark:text-stone-500">
            <p>Try searching for:</p>
            <ul className="mt-1 space-y-1">
              <li>• Specific types like "prophecy" or "numerical"</li>
              <li>• Keywords from titles or descriptions</li>
              <li>• Broader terms to find more results</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((miracle) => (
            <div
              key={miracle.title}
              className="bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Enhanced Miracle Card with Search Highlighting */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">
                      {highlightText(miracle.title, searchQuery)}
                    </h3>
                    {miracle.type && (
                      <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium rounded-full mb-3">
                        {miracle.type}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onFavorite(miracle)}
                    className={`ml-2 p-2 rounded-lg transition-colors ${
                      isFavorite(miracle)
                        ? "text-red-500 hover:text-red-600"
                        : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                    }`}
                    aria-label={
                      isFavorite(miracle)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <svg
                      className="h-5 w-5"
                      fill={isFavorite(miracle) ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>

                {miracle.description && (
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-4">
                    {highlightText(miracle.description, searchQuery)}
                  </p>
                )}

                {/* Search Match Indicators */}
                {searchQuery.trim() && (
                  <div className="mb-4 p-3 bg-stone-50 dark:bg-stone-700 rounded-lg">
                    <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
                      Search Matches
                    </h4>
                    <div className="space-y-1 text-xs">
                      {miracle.title
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-stone-600 dark:text-stone-400">
                            Title
                          </span>
                        </div>
                      )}
                      {miracle.description
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-stone-600 dark:text-stone-400">
                            Description
                          </span>
                        </div>
                      )}
                      {miracle.type
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span className="text-stone-600 dark:text-stone-400">
                            Type
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>Type: {miracle.type || "Unknown"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Tips */}
      {searchQuery.trim() && results.length > 0 && (
        <div className="bg-stone-50 dark:bg-stone-700 rounded-xl p-4 border border-stone-200 dark:border-stone-600">
          <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-2">
            Search Tips
          </h4>
          <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-1">
            <li>• Use quotes for exact phrase matching</li>
            <li>• Try different keywords to find more results</li>
            <li>• Use the advanced filters to narrow down results</li>
            <li>• Save your search as a preset for quick access</li>
          </ul>
        </div>
      )}
    </div>
  );
};
