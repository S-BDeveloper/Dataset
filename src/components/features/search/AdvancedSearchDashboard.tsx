import React, { useState, useCallback, useMemo } from "react";
import { SmartSearchBar } from "./SmartSearchBar";
import { AdvancedFilterPanel } from "./AdvancedFilterPanel";
import { SearchResults } from "./SearchResults";
import type {
  IslamicData,
  QuranAyah,
  HadithEntry,
  UnifiedSearchResult,
  FilterState,
} from "../../../types/Types";
import type { FavoriteItem } from "../../../hooks/useFavorites";

interface AdvancedSearchDashboardProps {
  data: IslamicData[];
  quranData?: QuranAyah[];
  hadithData?: HadithEntry[];
  onFavorite: (item: FavoriteItem) => void;
  isFavorite: (item: FavoriteItem) => boolean;
}

// AdvancedSearchDashboard provides a comprehensive search experience across all Islamic data
export const AdvancedSearchDashboard: React.FC<AdvancedSearchDashboardProps> =
  React.memo(
    ({ data, quranData = [], hadithData = [], onFavorite, isFavorite }) => {
      const [searchQuery, setSearchQuery] = useState("");
      const [filters, setFilters] = useState<FilterState>({
        types: [],
        categories: [],
        searchFields: [], // Default to no search fields selected - user has full control
        sortBy: "title",
        sortOrder: "asc",
        fulfillmentStatus: [],
        prophecyCategories: [],
        yearRange: { min: 0, max: 2024 },
        dataSources: ["islamic data", "quran", "hadith"], // Default to all sources selected
        // Initialize new Quran filters with proper defaults
        quranSurahs: [],
        quranVerseRange: { min: 1, max: 6236 }, // Use actual Quran verse range based on loaded data
        quranPlaceOfRevelation: [],
        // Initialize new Hadith filters with proper defaults
        hadithNumberRange: { min: 1, max: 13143 }, // Use actual Hadith range
        hadithCategories: [],
      });
      const [filteredResults, setFilteredResults] = useState<
        UnifiedSearchResult[]
      >([]);
      const [isSearching, setIsSearching] = useState(false);
      const [hasSearched, setHasSearched] = useState(false);
      const [actualResultsCount, setActualResultsCount] = useState(0);

      // Memoized processed data to prevent recalculation on every render
      const processedIslamicData = useMemo(() => {
        return data.map((item) => ({
          id: `islamic-${item.title}`,
          type: "islamic data" as const,
          title: item.title,
          content: [
            item.description || "",
            item.notes || "",
            item.sources?.primary || "",
            item.sources?.verification || "",
            item.sources?.methodology || "",
            item.sources?.source || "",
            item.fulfillmentEvidence || "",
            item.prophecyCategory || "",
          ].join(" "),
          source: item.sources?.source || "Islamic Data",
          data: item,
        }));
      }, [data]);

      const processedQuranData = useMemo(() => {
        return quranData.map((ayah) => ({
          id: `quran-${ayah.surah_no}-${ayah.ayah_no_surah}`,
          type: "quran" as const,
          title: `${ayah.surah_name_en} ${ayah.ayah_no_surah}`,
          content: [
            ayah.ayah_en,
            ayah.ayah_ar,
            ayah.surah_name_en,
            ayah.surah_name_ar,
            ayah.place_of_revelation,
          ].join(" "),
          source: `Quran - ${ayah.surah_name_en} ${ayah.ayah_no_surah}`,
          data: ayah,
        }));
      }, [quranData]);

      const processedHadithData = useMemo(() => {
        // Sort hadith data by number first to ensure proper ordering
        const sortedHadithData = [...hadithData].sort((a, b) => {
          const aNumber = parseInt(a.number);
          const bNumber = parseInt(b.number);
          return aNumber - bNumber;
        });

        return sortedHadithData.map((hadith, index) => ({
          id: `hadith-${hadith.number}-${index}`,
          type: "hadith" as const,
          title: `Hadith ${hadith.number}`,
          content: Object.values(hadith).join(" "),
          source: "Sahih Bukhari",
          data: hadith,
        }));
      }, [hadithData]);

      // Enhanced search function with comprehensive criteria across all data types
      const performSearch = useCallback(
        (query: string, filterState: FilterState) => {
          setIsSearching(true);
          setHasSearched(true);

          // Simulate search delay for better UX
          setTimeout(() => {
            // Scroll to top after search starts
            window.scrollTo({ top: 0, behavior: "smooth" });
            let results: UnifiedSearchResult[] = [];

            // Process Islamic data
            if (filterState.dataSources.includes("islamic data")) {
              results.push(...processedIslamicData);
            }

            // Process Quran data with enhanced filtering
            if (filterState.dataSources.includes("quran")) {
              let quranResults = processedQuranData;

              // Apply Quran-specific filters
              if (filterState.quranSurahs.length > 0) {
                quranResults = quranResults.filter((result) => {
                  const ayah = result.data as QuranAyah;
                  return filterState.quranSurahs.includes(
                    ayah.surah_no.toString()
                  );
                });
              }

              if (
                filterState.quranVerseRange.min !== 1 ||
                filterState.quranVerseRange.max !== 6236
              ) {
                quranResults = quranResults.filter((result) => {
                  const ayah = result.data as QuranAyah;
                  const verseNumber = parseInt(ayah.ayah_no_surah.toString());
                  return (
                    verseNumber >= filterState.quranVerseRange.min &&
                    verseNumber <= filterState.quranVerseRange.max
                  );
                });
              }

              if (filterState.quranPlaceOfRevelation.length > 0) {
                quranResults = quranResults.filter((result) => {
                  const ayah = result.data as QuranAyah;
                  return filterState.quranPlaceOfRevelation.includes(
                    ayah.place_of_revelation
                  );
                });
              }

              results.push(...quranResults);
            }

            // Process Hadith data with enhanced filtering
            if (filterState.dataSources.includes("hadith")) {
              let hadithResults = processedHadithData;

              // Apply Hadith-specific filters
              if (
                filterState.hadithNumberRange.min !== 1 ||
                filterState.hadithNumberRange.max !== hadithData.length
              ) {
                hadithResults = hadithResults.filter((result) => {
                  const hadithNumber = parseInt(result.data.number);
                  return (
                    hadithNumber >= filterState.hadithNumberRange.min &&
                    hadithNumber <= filterState.hadithNumberRange.max
                  );
                });
              }

              results.push(...hadithResults);
            }

            // Apply search query with enhanced field coverage
            if (query.trim()) {
              const searchTerms = query
                .toLowerCase()
                .split(" ")
                .filter((term) => term.length > 0);

              results = results.filter((result) => {
                const searchableText = [
                  result.title.toLowerCase(),
                  result.content.toLowerCase(),
                  result.source.toLowerCase(),
                ].join(" ");

                // Check if all search terms are found
                return searchTerms.every((term) =>
                  searchableText.includes(term)
                );
              });
            }

            // Apply type filters (for Islamic data only)
            if (filterState.types.length > 0) {
              results = results.filter((result) => {
                if (result.type === "islamic data") {
                  const islamicData = result.data as IslamicData;
                  return (
                    islamicData.type &&
                    filterState.types.includes(islamicData.type)
                  );
                }
                return true; // Keep non-Islamic data results
              });
            }

            // Apply category filters (for miracles only) - Removed since QuranicMiracle doesn't have category property
            // if (filterState.categories.length > 0) {
            //   results = results.filter((result) => {
            //     if (result.type === "miracle") {
            //       const miracle = result.data as QuranicMiracle;
            //       return (
            //         miracle.category &&
            //         filterState.categories.includes(miracle.category as string)
            //       );
            //     }
            //     return true; // Keep non-miracle results
            //   });
            // }

            // Apply fulfillment status filters (for Islamic data only)
            if (filterState.fulfillmentStatus.length > 0) {
              results = results.filter((result) => {
                if (result.type === "islamic data") {
                  const islamicData = result.data as IslamicData;
                  return (
                    islamicData.fulfillmentStatus &&
                    filterState.fulfillmentStatus.includes(
                      islamicData.fulfillmentStatus
                    )
                  );
                }
                return true; // Keep non-Islamic data results
              });
            }

            // Apply prophecy category filters (for Islamic data only)
            if (filterState.prophecyCategories.length > 0) {
              results = results.filter((result) => {
                if (result.type === "islamic data") {
                  const islamicData = result.data as IslamicData;
                  return (
                    islamicData.prophecyCategory &&
                    filterState.prophecyCategories.includes(
                      islamicData.prophecyCategory
                    )
                  );
                }
                return true; // Keep non-Islamic data results
              });
            }

            // Apply year range filters (for Islamic data only)
            if (
              filterState.yearRange.min > 0 ||
              filterState.yearRange.max < 2024
            ) {
              results = results.filter((result) => {
                if (result.type === "islamic data") {
                  const islamicData = result.data as IslamicData;
                  const yearRevealed = islamicData.yearRevealed || 0;
                  const yearFulfilled = islamicData.yearFulfilled || 0;

                  return (
                    (yearRevealed >= filterState.yearRange.min &&
                      yearRevealed <= filterState.yearRange.max) ||
                    (yearFulfilled >= filterState.yearRange.min &&
                      yearFulfilled <= filterState.yearRange.max)
                  );
                }
                return true; // Keep non-Islamic data results
              });
            }

            // Enhanced sorting options
            results.sort((a, b) => {
              let aValue: string | number = "";
              let bValue: string | number = "";

              switch (filterState.sortBy) {
                case "title":
                  aValue = a.title || "";
                  bValue = b.title || "";
                  break;
                case "type":
                  aValue = a.type || "";
                  bValue = b.type || "";
                  break;
                case "source": // New sort option
                  aValue = a.source || "";
                  bValue = b.source || "";
                  break;
                case "hadithNumber":
                  // Special sorting for hadith numbers
                  if (a.type === "hadith" && b.type === "hadith") {
                    const aHadith = a.data as HadithEntry;
                    const bHadith = b.data as HadithEntry;
                    const aNumber = parseInt(aHadith.number);
                    const bNumber = parseInt(bHadith.number);
                    aValue = aNumber;
                    bValue = bNumber;
                  } else {
                    aValue = a.title || "";
                    bValue = b.title || "";
                  }
                  break;
                case "relevance":
                  // For relevance, we'll use the number of search term matches
                  if (query.trim()) {
                    const searchTerms = query
                      .toLowerCase()
                      .split(" ")
                      .filter((term) => term.length > 0);
                    aValue = searchTerms.filter(
                      (term) =>
                        a.title?.toLowerCase().includes(term) ||
                        a.content?.toLowerCase().includes(term) ||
                        false
                    ).length;
                    bValue = searchTerms.filter(
                      (term) =>
                        b.title?.toLowerCase().includes(term) ||
                        b.content?.toLowerCase().includes(term) ||
                        false
                    ).length;
                  } else {
                    aValue = 0;
                    bValue = 0;
                  }
                  break;
                default:
                  aValue = a.title || "";
                  bValue = b.title || "";
              }

              if (typeof aValue === "string" && typeof bValue === "string") {
                const comparison = aValue.localeCompare(bValue);
                return filterState.sortOrder === "asc"
                  ? comparison
                  : -comparison;
              } else {
                const comparison = (aValue as number) - (bValue as number);
                return filterState.sortOrder === "asc"
                  ? comparison
                  : -comparison;
              }
            });

            // Limit results for performance
            const MAX_RESULTS = 1000;
            const actualResultsCount = results.length;
            results = results.slice(0, MAX_RESULTS);

            console.log("Search results before limiting:", {
              actualResultsCount,
              limitedResultsCount: results.length,
              totalDataCount,
              actualPercentage:
                ((actualResultsCount / totalDataCount) * 100).toFixed(1) + "%",
              limitedPercentage:
                ((results.length / totalDataCount) * 100).toFixed(1) + "%",
            });

            setFilteredResults(results);
            setActualResultsCount(actualResultsCount); // Set actual results count
            setIsSearching(false);
          }, 100);
        },
        [processedIslamicData, processedQuranData, processedHadithData]
      );

      // Handle search query changes - only update state, don't trigger search
      const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
      }, []);

      // Handle filter changes - only update state, don't trigger search
      const handleFiltersChange = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
      }, []);

      // Handle clear filters - only update state, don't trigger search
      const handleClearFilters = useCallback(() => {
        const defaultFilters: FilterState = {
          types: [],
          categories: [],
          searchFields: [], // Default to no search fields selected - user has full control
          sortBy: "title",
          sortOrder: "asc",
          fulfillmentStatus: [],
          prophecyCategories: [],
          yearRange: { min: 0, max: 2024 },
          dataSources: ["islamic data", "quran", "hadith"], // Default to all sources selected
          // Initialize new Quran filters with proper defaults
          quranSurahs: [],
          quranVerseRange: { min: 1, max: 6236 }, // Use actual Quran verse range based on loaded data
          quranPlaceOfRevelation: [],
          // Initialize new Hadith filters with proper defaults
          hadithNumberRange: { min: 1, max: 13143 }, // Use actual Hadith range
          hadithCategories: [],
        };
        setFilters(defaultFilters);
      }, []);

      // Remove automatic filtering - only filter when user clicks "Confirm Search"
      // useEffect(() => {
      //   // Only load data if dataSources are selected
      //   if (filters.dataSources.length === 0) {
      //     setFilteredResults([]);
      //     return;
      //   }
      //   // ... rest of automatic filtering logic removed
      // }, [data, quranData, hadithData, filters.dataSources]);

      // Memoized statistics calculations
      const totalDataCount = useMemo(
        () => data.length + quranData.length + hadithData.length,
        [data.length, quranData.length, hadithData.length]
      );

      const islamicDataCount = useMemo(
        () => filteredResults.filter((r) => r.type === "islamic data").length,
        [filteredResults]
      );

      const quranCount = useMemo(
        () => filteredResults.filter((r) => r.type === "quran").length,
        [filteredResults]
      );

      const hadithCount = useMemo(
        () => filteredResults.filter((r) => r.type === "hadith").length,
        [filteredResults]
      );

      // Memoized percentage calculation - only calculate when we have data
      const percentageOfTotal = useMemo(() => {
        // Only calculate if we have actual data loaded
        if (totalDataCount === 0) {
          console.log("No data loaded yet, totalDataCount:", totalDataCount);
          return "0.0";
        }

        if (filteredResults.length === 0) {
          console.log(
            "No search results, filteredResults.length:",
            filteredResults.length
          );
          return "0.0";
        }

        // Use the actual results count for percentage calculation
        const resultsCountForPercentage =
          actualResultsCount > 0 ? actualResultsCount : filteredResults.length;
        const percentage = (resultsCountForPercentage / totalDataCount) * 100;

        console.log("Debug percentage calculation:", {
          filteredResultsLength: filteredResults.length,
          actualResultsCount: actualResultsCount,
          resultsCountForPercentage,
          totalDataCount,
          calculatedPercentage: percentage,
          dataLength: data.length,
          quranDataLength: quranData.length,
          hadithDataLength: hadithData.length,
        });

        return percentage.toFixed(1);
      }, [
        filteredResults.length,
        totalDataCount,
        data.length,
        quranData.length,
        hadithData.length,
        actualResultsCount,
      ]);

      return (
        <div className="space-y-6">
          {/* Search Header with Inline Search Bar */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                  Advanced Search
                </h2>
                <p className="text-stone-600 dark:text-stone-400 max-w-2xl">
                  Search across all available Islamic knowledge including
                  Prophecies, Prophetic Medicines, Quran verses, and Sahih
                  Bukhari hadiths.
                </p>
              </div>
              <div className="lg:w-96">
                <SmartSearchBar
                  data={data} // Still passes miracle data for auto-complete, might need adjustment later
                  onSearch={handleSearch}
                  placeholder="Search across Quran and Hadith..."
                />
              </div>
            </div>
          </div>

          {/* Advanced Filter Panel */}
          <AdvancedFilterPanel
            data={data}
            quranData={quranData}
            hadithData={hadithData}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Confirm Search Button */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => performSearch(searchQuery, filters)}
              disabled={isSearching || filters.dataSources.length === 0}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-stone-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Confirm Search
                </>
              )}
            </button>

            {hasSearched && (
              <button
                onClick={() => {
                  setHasSearched(false);
                  setFilteredResults([]);
                  setSearchQuery("");
                  setFilters({
                    types: [],
                    categories: [],
                    searchFields: [],
                    sortBy: "title",
                    sortOrder: "asc",
                    fulfillmentStatus: [],
                    prophecyCategories: [],
                    yearRange: { min: 0, max: 2024 },
                    dataSources: ["islamic data", "quran", "hadith"], // Default to all sources selected
                    quranSurahs: [],
                    quranVerseRange: { min: 1, max: 6236 },
                    quranPlaceOfRevelation: [],
                    hadithNumberRange: { min: 1, max: 13143 },
                    hadithCategories: [],
                  });
                }}
                className="px-6 py-3 bg-stone-500 hover:bg-stone-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                New Search
              </button>
            )}
          </div>

          {/* Search Results - Only show if user has searched */}
          {!hasSearched ? (
            <div className="text-center py-12 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-16 h-16 text-stone-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  Ready to Search
                </h3>
                <p className="text-stone-600 dark:text-stone-400 mb-4">
                  Configure your search filters above and click "Confirm Search"
                  to begin exploring Islamic knowledge across Quran, Hadith, and
                  Prophecies/Prophetic Medicines.
                </p>
                <div className="text-sm text-stone-500 dark:text-stone-500">
                  <p>
                    • Select data sources (Quran, Hadith, Prophecies/Prophetic
                    Medicines)
                  </p>
                  <p>• Choose specific filters for each source</p>
                  <p>• Enter search terms (optional)</p>
                  <p>• Click "Confirm Search" when ready</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <SearchResults
                results={filteredResults}
                searchQuery={searchQuery}
                totalResults={filteredResults.length}
                onFavorite={onFavorite}
                isFavorite={isFavorite}
                isLoading={isSearching}
              />

              {/* Enhanced Search Features */}
              <div className="bg-stone-50 dark:bg-stone-700 rounded-xl p-4 border border-stone-200 dark:border-stone-600">
                <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-3">
                  Cross-Reference Search Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <h5 className="font-medium text-stone-700 dark:text-stone-300">
                      Data Sources
                    </h5>
                    <ul className="space-y-1 text-stone-600 dark:text-stone-400">
                      <li>
                        • <strong>Prophecies/Prophetic Medicines:</strong>{" "}
                        Status of fulfillment
                      </li>
                      <li>
                        • <strong>Quran Verses:</strong> Complete Quran with
                        English translations
                      </li>
                      <li>
                        • <strong>Hadiths:</strong> Sahih Bukhari authentic
                        narrations
                      </li>
                      <li>
                        • <strong>Cross-Reference:</strong> Find connections
                        between sources{" "}
                        <span className="text-red-500 dark:text-red-400">
                          (always consult Scholars for complex topics)
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-medium text-stone-700 dark:text-stone-300">
                      Advanced Filtering
                    </h5>
                    <ul className="space-y-1 text-stone-600 dark:text-stone-400">
                      <li>
                        • <strong>Quran Filters:</strong> By Surah, verse
                        number, place of revelation
                      </li>
                      <li>
                        • <strong>Hadith Filters:</strong> By hadith number
                        range
                      </li>
                      <li>
                        •{" "}
                        <strong>Prophecies/Prophetic Medicines Filters:</strong>{" "}
                        By type, category, fulfillment status
                      </li>
                      <li>
                        • <strong>Unified Search:</strong> Search across all
                        available Islamic sources
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Enhanced Search Tips */}
              {searchQuery.trim() && filteredResults.length > 0 && (
                <div className="bg-stone-50 dark:bg-stone-700 rounded-xl p-4 border border-stone-200 dark:border-stone-600">
                  <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-2">
                    Cross-Reference Search Tips
                  </h4>
                  <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-1">
                    <li>
                      • Search across all available Islamic sources
                      simultaneously
                    </li>
                    <li>• Find Quran verses that mention specific topics</li>
                    <li>• Discover Hadiths related to your search terms</li>
                    <li>
                      • Cross-reference Prophecies/ Prophetic Medicines with
                      Quran and Hadith
                    </li>
                    <li>• Use quotes for exact phrase matching</li>
                    <li>• Try different keywords to find more connections</li>
                    <li>
                      • Use the advanced filters to focus on specific sources
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Enhanced Search Statistics */}
          {hasSearched && filteredResults.length > 0 && totalDataCount > 0 && (
            <div className="bg-stone-50 dark:bg-stone-700 rounded-xl p-4 border border-stone-200 dark:border-stone-600">
              <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-3">
                Cross-Reference Search Statistics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {filteredResults.length}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    Total Results
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {islamicDataCount}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    Islamic Data
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                    {quranCount}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    Quran Verses
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                    {hadithCount}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    Hadiths
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-stone-700 dark:text-stone-300">
                    {percentageOfTotal}%
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    Of Total Data
                  </div>
                </div>
              </div>
              {filteredResults.length === 1000 && (
                <div className="mt-3 text-xs text-stone-500 dark:text-stone-400 text-center">
                  * Showing actual percentage. Results limited to 1,000 for
                  performance.
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  );
