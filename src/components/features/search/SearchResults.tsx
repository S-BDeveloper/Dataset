import React from "react";
import type { IslamicData, QuranAyah, HadithEntry } from "../../../types/Types";

// Import the canonical UnifiedSearchResult type
import type { UnifiedSearchResult } from "../../../types/Types";
import type { FavoriteItem } from "../../../hooks/useFavorites";

interface SearchResultsProps {
  results: UnifiedSearchResult[];
  searchQuery: string;
  totalResults: number;
  onFavorite: (item: FavoriteItem) => void;
  isFavorite: (item: FavoriteItem) => boolean;
  isLoading?: boolean;
}

// Highlight search terms in text - moved outside component for reuse
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

// SearchResults displays filtered results with search highlighting and analytics
export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchQuery,
  totalResults,
  onFavorite,
  isFavorite,
  isLoading = false,
}) => {
  // Get search analytics
  const getSearchAnalytics = () => {
    if (!searchQuery.trim()) return null;

    const typeBreakdown = results.reduce((acc, result) => {
      const type = result.type;
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
          <p className="text-stone-600 dark:text-stone-400">
            Searching across all available Islamic sources...
          </p>
          <p className="text-sm text-stone-500 dark:text-stone-500 mt-2">
            This may take a moment for large datasets
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-screen overflow-y-auto">
      {/* Search Results Header */}
      <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400">
              Cross-Reference Search Results
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
                Top sources:
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
                ? `No Islamic knowledge found for "${searchQuery}". Try different keywords or check your spelling.`
                : "Start typing to search across Quran, Hadith, and miracles."}
            </p>
          </div>
          <div className="text-sm text-stone-400 dark:text-stone-500">
            <p>Try searching for:</p>
            <ul className="mt-1 space-y-1">
              <li>• Quran verses by content or surah name</li>
              <li>• Hadith narrations by keywords</li>
              <li>
                • Prophecies/ Prophetic Medicines types like "prophecy" or
                "medicine"
              </li>
              <li>• Source information like "Sahih Bukhari"</li>
              <li>• Broader terms to find more results</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Source Type Badge */}
              <div className="px-6 pt-6 pb-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      result.type === "islamic data"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        : result.type === "quran"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                    }`}
                  >
                    {result.type === "islamic data"
                      ? "Miracle"
                      : result.type === "quran"
                      ? "Quran Verse"
                      : "Hadith"}
                  </span>
                  {/* Favorite Button - Show for all types */}
                  <button
                    onClick={() => onFavorite(result.data as FavoriteItem)}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorite(result.data as FavoriteItem)
                        ? "text-red-500 hover:text-red-600"
                        : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                    }`}
                    aria-label={
                      isFavorite(result.data as FavoriteItem)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <svg
                      className="h-5 w-5"
                      fill={
                        isFavorite(result.data as FavoriteItem)
                          ? "currentColor"
                          : "none"
                      }
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
              <div className="px-6 pb-6">
                <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-3">
                  {highlightText(result.title, searchQuery)}
                </h3>

                {/* Source Information */}
                <div className="mb-4">
                  <span className="text-sm text-stone-600 dark:text-stone-400">
                    Source: {highlightText(result.source, searchQuery)}
                  </span>
                </div>

                {/* Content Display */}
                <div className="mb-4">
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                    {highlightText(
                      result.content.substring(0, 200),
                      searchQuery
                    )}
                    {result.content.length > 200 && "..."}
                  </p>
                </div>

                {/* Type-specific additional information */}
                {result.type === "islamic data" && (
                  <CardDetails
                    card={result.data as IslamicData}
                    searchQuery={searchQuery}
                  />
                )}
                {result.type === "quran" && (
                  <QuranDetails
                    ayah={result.data as QuranAyah}
                    searchQuery={searchQuery}
                  />
                )}
                {result.type === "hadith" && (
                  <HadithDetails
                    hadith={result.data as HadithEntry}
                    searchQuery={searchQuery}
                  />
                )}

                {/* Search Match Indicators */}
                {searchQuery.trim() && (
                  <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-700 rounded-lg">
                    <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
                      Search Matches
                    </h4>
                    <div className="space-y-1 text-xs">
                      {result.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-stone-600 dark:text-stone-400">
                            Title
                          </span>
                        </div>
                      )}
                      {result.content
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-stone-600 dark:text-stone-400">
                            Content
                          </span>
                        </div>
                      )}
                      {result.source
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span className="text-stone-600 dark:text-stone-400">
                            Source
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Search Tips */}
      {searchQuery.trim() && results.length > 0 && (
        <div className="bg-stone-50 dark:bg-stone-700 rounded-xl p-4 border border-stone-200 dark:border-stone-600">
          <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-2">
            Cross-Reference Search Tips
          </h4>
          <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-1">
            <li>
              • Search across all available Islamic sources simultaneously
            </li>
            <li>• Find Quran verses that mention specific topics</li>
            <li>• Discover Hadiths related to your search terms</li>
            <li>
              • Cross-reference Prophecies/ Prophetic Medicines with Quran and
              Hadith
            </li>
            <li>• Use quotes for exact phrase matching</li>
            <li>• Try different keywords to find more connections</li>
            <li>• Use the advanced filters to focus on specific sources</li>
          </ul>
        </div>
      )}
    </div>
  );
};

// Component for displaying miracle-specific details
const CardDetails: React.FC<{
  card: IslamicData;
  searchQuery: string;
}> = ({ card, searchQuery }) => (
  <div className="space-y-3">
    {/* Type Badge */}
    {card.type && (
      <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
        {card.type}
      </span>
    )}

    {/* Description */}
    {card.description && (
      <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
        {highlightText(card.description, searchQuery)}
      </p>
    )}

    {/* Notes */}
    {card.notes && (
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wide">
          Notes
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {highlightText(card.notes, searchQuery)}
        </p>
      </div>
    )}

    {/* Prophetic Information */}
    {card.fulfillmentStatus && (
      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
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
                card.fulfillmentStatus === "fulfilled"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                  : card.fulfillmentStatus === "in-progress"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                  : card.fulfillmentStatus === "pending"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {card.fulfillmentStatus}
            </span>
          </div>
          {card.yearRevealed && (
            <div className="text-orange-600 dark:text-orange-400">
              Revealed: {card.yearRevealed}
            </div>
          )}
          {card.yearFulfilled && (
            <div className="text-orange-600 dark:text-orange-400">
              Fulfilled: {card.yearFulfilled}
            </div>
          )}
          {card.prophecyCategory && (
            <div className="text-orange-600 dark:text-orange-400">
              Category: {card.prophecyCategory}
            </div>
          )}
          {card.fulfillmentEvidence && (
            <div className="text-xs text-orange-700 dark:text-orange-300 mt-2">
              <strong>Evidence:</strong>{" "}
              {highlightText(card.fulfillmentEvidence, searchQuery)}
            </div>
          )}
        </div>
      </div>
    )}

    {/* Sources Information */}
    {card.sources && (
      <div className="p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
        <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
          Sources
        </h4>
        <div className="space-y-2 text-xs">
          <div>
            <span className="text-stone-600 dark:text-stone-400">Primary:</span>
            <span className="text-stone-800 dark:text-stone-200 ml-1">
              {highlightText(card.sources.primary, searchQuery)}
            </span>
          </div>
          <div>
            <span className="text-stone-600 dark:text-stone-400">
              Methodology:
            </span>
            <span className="text-stone-800 dark:text-stone-200 ml-1">
              {highlightText(card.sources.methodology, searchQuery)}
            </span>
          </div>
          {card.sources.references && card.sources.references.length > 0 && (
            <div>
              <span className="text-stone-600 dark:text-stone-400">
                References:
              </span>
              <div className="mt-1 space-y-1">
                {card.sources.references.slice(0, 2).map((ref, index) => (
                  <div
                    key={index}
                    className="text-stone-800 dark:text-stone-200 truncate"
                  >
                    {highlightText(ref, searchQuery)}
                  </div>
                ))}
                {card.sources.references.length > 2 && (
                  <div className="text-stone-500 dark:text-stone-400">
                    +{card.sources.references.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

// Component for displaying Quran-specific details
const QuranDetails: React.FC<{ ayah: QuranAyah; searchQuery: string }> = ({
  ayah,
  searchQuery,
}) => (
  <div className="space-y-3">
    {/* Arabic Text */}
    {ayah.ayah_ar && (
      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h4 className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2 uppercase tracking-wide">
          Arabic Text
        </h4>
        <p
          className="text-sm text-green-800 dark:text-green-200 text-right leading-relaxed font-arabic"
          dir="rtl"
        >
          {highlightText(ayah.ayah_ar, searchQuery)}
        </p>
      </div>
    )}

    {/* English Translation */}
    {ayah.ayah_en && (
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wide">
          English Translation
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
          {highlightText(ayah.ayah_en, searchQuery)}
        </p>
      </div>
    )}

    {/* Additional Information */}
    <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
      <div>
        <span className="font-medium">Surah:</span> {ayah.surah_name_en}
      </div>
      <div>
        <span className="font-medium">Verse:</span> {ayah.ayah_no_surah}
      </div>
      <div>
        <span className="font-medium">Place:</span> {ayah.place_of_revelation}
      </div>
      <div>
        <span className="font-medium">Words:</span> {ayah.no_of_word_ayah}
      </div>
    </div>
  </div>
);

// Component for displaying Hadith-specific details
const HadithDetails: React.FC<{ hadith: HadithEntry; searchQuery: string }> = ({
  hadith,
  searchQuery,
}) => {
  // Helper function to check if a field has meaningful content
  const hasContent = (value: string | undefined): boolean => {
    if (!value) return false;
    const trimmed = value.trim();
    return (
      trimmed.length > 0 &&
      trimmed !== "Unknown" &&
      trimmed !== "Sahih Bukhari" &&
      trimmed !== "Sahih" &&
      !trimmed.includes("placeholder") &&
      !trimmed.includes("not available")
    );
  };

  // Helper function to check if text contains Arabic characters
  const isArabicText = (text: string): boolean => {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
      text
    );
  };

  // Get fields that actually have content
  const contentFields = Object.entries(hadith).filter(([key, value]) => {
    if (key === "id") return false; // Skip id field
    return hasContent(value);
  });

  return (
    <div className="space-y-3">
      {/* Hadith Content */}
      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2 uppercase tracking-wide">
          Hadith Content
        </h4>
        <div className="space-y-2 text-sm">
          {contentFields.map(([key, value]) => {
            const isArabic = isArabicText(value);
            return (
              <div key={key}>
                <span className="text-purple-600 dark:text-purple-400 font-medium">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </span>
                <span
                  className={`text-purple-800 dark:text-purple-200 ml-1 ${
                    isArabic ? "font-arabic" : ""
                  }`}
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  {highlightText(value, searchQuery)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
