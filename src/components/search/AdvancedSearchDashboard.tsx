import React, { useState, useEffect, useCallback } from "react";
import { SmartSearchBar } from "./SmartSearchBar";
import { AdvancedFilterPanel } from "./AdvancedFilterPanel";
import { SearchResults } from "./SearchResults";
import type { QuranicMiracle } from "../../types/Types";

interface FilterState {
  types: string[];
  categories: string[];
  searchFields: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  fulfillmentStatus: string[];
  prophecyCategories: string[];
  yearRange: { min: number; max: number };
}

interface AdvancedSearchDashboardProps {
  data: QuranicMiracle[];
  onFavorite: (miracle: QuranicMiracle) => void;
  isFavorite: (miracle: QuranicMiracle) => boolean;
}

// AdvancedSearchDashboard provides a comprehensive search experience
export const AdvancedSearchDashboard: React.FC<
  AdvancedSearchDashboardProps
> = ({ data, onFavorite, isFavorite }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    categories: [],
    searchFields: ["title", "description", "type", "notes", "sources"], // Enhanced search fields
    sortBy: "title",
    sortOrder: "asc",
    fulfillmentStatus: [],
    prophecyCategories: [],
    yearRange: { min: 0, max: 2024 },
  });
  const [filteredResults, setFilteredResults] = useState<QuranicMiracle[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Enhanced search function with comprehensive criteria
  const performSearch = useCallback(
    (query: string, filterState: FilterState) => {
      setIsSearching(true);

      // Simulate search delay for better UX
      setTimeout(() => {
        let results = [...data];

        // Apply search query with enhanced field coverage
        if (query.trim()) {
          const searchTerms = query
            .toLowerCase()
            .split(" ")
            .filter((term) => term.length > 0);

          results = results.filter((miracle) => {
            const searchableFields = [];

            // Enhanced searchable fields
            if (filterState.searchFields.includes("title") && miracle.title) {
              searchableFields.push(miracle.title.toLowerCase());
            }
            if (
              filterState.searchFields.includes("description") &&
              miracle.description
            ) {
              searchableFields.push(miracle.description.toLowerCase());
            }
            if (filterState.searchFields.includes("type") && miracle.type) {
              searchableFields.push(miracle.type.toLowerCase());
            }
            if (
              filterState.searchFields.includes("category") &&
              miracle.category
            ) {
              searchableFields.push((miracle.category as string).toLowerCase());
            }
            if (
              filterState.searchFields.includes("content") &&
              miracle.content
            ) {
              searchableFields.push((miracle.content as string).toLowerCase());
            }
            // NEW: Include notes field
            if (filterState.searchFields.includes("notes") && miracle.notes) {
              searchableFields.push(miracle.notes.toLowerCase());
            }
            // NEW: Include sources information
            if (
              filterState.searchFields.includes("sources") &&
              miracle.sources
            ) {
              searchableFields.push(miracle.sources.primary.toLowerCase());
              searchableFields.push(miracle.sources.verification.toLowerCase());
              searchableFields.push(miracle.sources.methodology.toLowerCase());
              searchableFields.push(miracle.sources.academic.toLowerCase());
              miracle.sources.references.forEach((ref) => {
                searchableFields.push(ref.toLowerCase());
              });
            }
            // NEW: Include pair information
            if (filterState.searchFields.includes("pairs") && miracle.pair) {
              miracle.pair.forEach((pairItem) => {
                searchableFields.push(pairItem.toLowerCase());
              });
            }
            // NEW: Include prophetic fulfillment information
            if (
              filterState.searchFields.includes("prophecy") &&
              miracle.fulfillmentEvidence
            ) {
              searchableFields.push(miracle.fulfillmentEvidence.toLowerCase());
            }
            if (
              filterState.searchFields.includes("prophecy") &&
              miracle.prophecyCategory
            ) {
              searchableFields.push(miracle.prophecyCategory.toLowerCase());
            }

            const searchableText = searchableFields.join(" ");

            // Check if all search terms are found
            return searchTerms.every((term) => searchableText.includes(term));
          });
        }

        // Apply type filters
        if (filterState.types.length > 0) {
          results = results.filter(
            (miracle) =>
              miracle.type && filterState.types.includes(miracle.type)
          );
        }

        // Apply category filters
        if (filterState.categories.length > 0) {
          results = results.filter(
            (miracle) =>
              miracle.category &&
              filterState.categories.includes(miracle.category as string)
          );
        }

        // NEW: Apply fulfillment status filters
        if (filterState.fulfillmentStatus.length > 0) {
          results = results.filter(
            (miracle) =>
              miracle.fulfillmentStatus &&
              filterState.fulfillmentStatus.includes(miracle.fulfillmentStatus)
          );
        }

        // NEW: Apply prophecy category filters
        if (filterState.prophecyCategories.length > 0) {
          results = results.filter(
            (miracle) =>
              miracle.prophecyCategory &&
              filterState.prophecyCategories.includes(miracle.prophecyCategory)
          );
        }

        // NEW: Apply year range filters
        if (filterState.yearRange.min > 0 || filterState.yearRange.max < 2024) {
          results = results.filter((miracle) => {
            const yearRevealed = miracle.yearRevealed || 0;
            const yearFulfilled = miracle.yearFulfilled || 0;

            return (
              (yearRevealed >= filterState.yearRange.min &&
                yearRevealed <= filterState.yearRange.max) ||
              (yearFulfilled >= filterState.yearRange.min &&
                yearFulfilled <= filterState.yearRange.max)
            );
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
            case "category":
              aValue = (a.category as string) || "";
              bValue = (b.category as string) || "";
              break;
            case "yearRevealed":
              aValue = a.yearRevealed || 0;
              bValue = b.yearRevealed || 0;
              break;
            case "yearFulfilled":
              aValue = a.yearFulfilled || 0;
              bValue = b.yearFulfilled || 0;
              break;
            case "fulfillmentStatus":
              aValue = a.fulfillmentStatus || "";
              bValue = b.fulfillmentStatus || "";
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
                    a.description?.toLowerCase().includes(term) ||
                    a.notes?.toLowerCase().includes(term) ||
                    false
                ).length;
                bValue = searchTerms.filter(
                  (term) =>
                    b.title?.toLowerCase().includes(term) ||
                    b.description?.toLowerCase().includes(term) ||
                    b.notes?.toLowerCase().includes(term) ||
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
            return filterState.sortOrder === "asc" ? comparison : -comparison;
          } else {
            const comparison = (aValue as number) - (bValue as number);
            return filterState.sortOrder === "asc" ? comparison : -comparison;
          }
        });

        setFilteredResults(results);
        setIsSearching(false);
      }, 300);
    },
    [data]
  );

  // Handle search query changes
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      performSearch(query, filters);
    },
    [filters, performSearch]
  );

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      performSearch(searchQuery, newFilters);
    },
    [searchQuery, performSearch]
  );

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    const defaultFilters: FilterState = {
      types: [],
      categories: [],
      searchFields: ["title", "description", "type", "notes", "sources"], // Enhanced default
      sortBy: "title",
      sortOrder: "asc",
      fulfillmentStatus: [],
      prophecyCategories: [],
      yearRange: { min: 0, max: 2024 },
    };
    setFilters(defaultFilters);
    performSearch(searchQuery, defaultFilters);
  }, [searchQuery, performSearch]);

  // Initialize with all data
  useEffect(() => {
    setFilteredResults(data);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
          Advanced Search
        </h2>
        <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
          Search through all Islamic signs and guidance with powerful filtering
          options. Use auto-complete suggestions, save search presets, and
          explore patterns in the data. Now with enhanced search capabilities
          including notes, sources, and prophetic information.
        </p>
      </div>

      {/* Smart Search Bar */}
      <div className="space-y-4">
        <SmartSearchBar
          data={data}
          onSearch={handleSearch}
          placeholder="Search for prophecies, numerical patterns, linguistic miracles, notes, sources..."
        />
      </div>

      {/* Advanced Filter Panel */}
      <AdvancedFilterPanel
        data={data}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Search Results */}
      <SearchResults
        results={filteredResults}
        searchQuery={searchQuery}
        totalResults={filteredResults.length}
        onFavorite={onFavorite}
        isFavorite={isFavorite}
        isLoading={isSearching}
      />

      {/* Enhanced Search Statistics */}
      {filteredResults.length > 0 && (
        <div className="bg-stone-50 dark:bg-stone-700 rounded-xl p-4 border border-stone-200 dark:border-stone-600">
          <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-3">
            Search Statistics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {filteredResults.length}
              </div>
              <div className="text-stone-600 dark:text-stone-400">
                Results Found
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {((filteredResults.length / data.length) * 100).toFixed(1)}%
              </div>
              <div className="text-stone-600 dark:text-stone-400">
                Of Total Data
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {Array.from(new Set(filteredResults.map((r) => r.type))).length}
              </div>
              <div className="text-stone-600 dark:text-stone-400">
                Types Found
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                {filters.types.length +
                  filters.categories.length +
                  filters.fulfillmentStatus.length +
                  filters.prophecyCategories.length}
              </div>
              <div className="text-stone-600 dark:text-stone-400">
                Active Filters
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Keyboard Shortcuts Help */}
      <div className="bg-stone-50 dark:bg-stone-700 rounded-xl p-4 border border-stone-200 dark:border-stone-600">
        <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-3">
          Enhanced Search Features
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <h5 className="font-medium text-stone-700 dark:text-stone-300">
              Search Fields
            </h5>
            <ul className="space-y-1 text-stone-600 dark:text-stone-400">
              <li>
                • <strong>Title:</strong> Miracle titles and names
              </li>
              <li>
                • <strong>Description:</strong> Detailed explanations
              </li>
              <li>
                • <strong>Notes:</strong> Additional insights and context
              </li>
              <li>
                • <strong>Sources:</strong> Academic references and methodology
              </li>
              <li>
                • <strong>Pairs:</strong> Word pair relationships
              </li>
              <li>
                • <strong>Prophecy:</strong> Fulfillment evidence and categories
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="font-medium text-stone-700 dark:text-stone-300">
              Advanced Filters
            </h5>
            <ul className="space-y-1 text-stone-600 dark:text-stone-400">
              <li>
                • <strong>Type:</strong> Pair, numerical, linguistic, etc.
              </li>
              <li>
                • <strong>Fulfillment Status:</strong> Fulfilled, pending,
                in-progress
              </li>
              <li>
                • <strong>Prophecy Category:</strong> Historical, scientific,
                social
              </li>
              <li>
                • <strong>Year Range:</strong> Filter by revelation or
                fulfillment years
              </li>
              <li>
                • <strong>Sort Options:</strong> By relevance, year, type, or
                title
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
