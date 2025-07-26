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
    searchFields: ["title", "description", "type"],
    sortBy: "title",
    sortOrder: "asc",
  });
  const [filteredResults, setFilteredResults] = useState<QuranicMiracle[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Advanced search function with multiple criteria
  const performSearch = useCallback(
    (query: string, filterState: FilterState) => {
      setIsSearching(true);

      // Simulate search delay for better UX
      setTimeout(() => {
        let results = [...data];

        // Apply search query
        if (query.trim()) {
          const searchTerms = query
            .toLowerCase()
            .split(" ")
            .filter((term) => term.length > 0);

          results = results.filter((miracle) => {
            const searchableFields = [];

            // Add fields based on searchFields filter
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

        // Apply sorting
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
                    false ||
                    a.description?.toLowerCase().includes(term) ||
                    false
                ).length;
                bValue = searchTerms.filter(
                  (term) =>
                    b.title?.toLowerCase().includes(term) ||
                    false ||
                    b.description?.toLowerCase().includes(term) ||
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
      searchFields: ["title", "description", "type"],
      sortBy: "title",
      sortOrder: "asc",
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
          Search through all Quranic signs and guidance with powerful filtering
          options. Use auto-complete suggestions, save search presets, and
          explore patterns in the data.
        </p>
      </div>

      {/* Smart Search Bar */}
      <div className="space-y-4">
        <SmartSearchBar
          data={data}
          onSearch={handleSearch}
          placeholder="Search for prophecies, numerical patterns, linguistic miracles..."
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

      {/* Search Statistics */}
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
                {filters.types.length + filters.categories.length}
              </div>
              <div className="text-stone-600 dark:text-stone-400">
                Active Filters
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="bg-stone-50 dark:bg-stone-700 rounded-xl p-4 border border-stone-200 dark:border-stone-600">
        <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-3">
          Keyboard Shortcuts
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-stone-200 dark:bg-stone-600 rounded text-xs">
                Ctrl + K
              </kbd>
              <span className="text-stone-600 dark:text-stone-400">
                Focus search bar
              </span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-stone-200 dark:bg-stone-600 rounded text-xs">
                ↑↓
              </kbd>
              <span className="text-stone-600 dark:text-stone-400">
                Navigate suggestions
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-stone-200 dark:bg-stone-600 rounded text-xs">
                Enter
              </kbd>
              <span className="text-stone-600 dark:text-stone-400">
                Select suggestion
              </span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-stone-200 dark:bg-stone-600 rounded text-xs">
                Esc
              </kbd>
              <span className="text-stone-600 dark:text-stone-400">
                Close suggestions
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
