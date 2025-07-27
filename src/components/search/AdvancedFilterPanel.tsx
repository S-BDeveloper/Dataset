import React, { useState } from "react";
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

interface AdvancedFilterPanelProps {
  data: QuranicMiracle[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

// AdvancedFilterPanel provides comprehensive filtering options
export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  data,
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedPresets, setSavedPresets] = useState<
    Array<{ name: string; filters: FilterState }>
  >([]);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetName, setPresetName] = useState("");

  // Extract unique values from data
  const uniqueTypes = Array.from(
    new Set(data.map((item) => item.type).filter(Boolean))
  );
  const uniqueCategories = Array.from(
    new Set(data.map((item) => item.category).filter(Boolean))
  ) as string[];

  // NEW: Extract unique fulfillment statuses
  const uniqueFulfillmentStatuses = Array.from(
    new Set(data.map((item) => item.fulfillmentStatus).filter(Boolean))
  ) as string[];

  // NEW: Extract unique prophecy categories
  const uniqueProphecyCategories = Array.from(
    new Set(data.map((item) => item.prophecyCategory).filter(Boolean))
  ) as string[];

  // Enhanced search field options
  const searchFieldOptions = [
    { value: "title", label: "Title" },
    { value: "description", label: "Description" },
    { value: "type", label: "Type" },
    { value: "category", label: "Category" },
    { value: "content", label: "Full Content" },
    { value: "notes", label: "Notes" },
    { value: "sources", label: "Sources" },
    { value: "pairs", label: "Word Pairs" },
    { value: "prophecy", label: "Prophecy Info" },
  ];

  // Enhanced sort options
  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "type", label: "Type" },
    { value: "category", label: "Category" },
    { value: "yearRevealed", label: "Year Revealed" },
    { value: "yearFulfilled", label: "Year Fulfilled" },
    { value: "fulfillmentStatus", label: "Fulfillment Status" },
    { value: "relevance", label: "Relevance" },
  ];

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  // Handle multi-select toggle
  const handleMultiSelectToggle = (
    filterType: keyof FilterState,
    value: string
  ) => {
    const currentValues = filters[filterType] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    handleFilterChange(filterType, newValues);
  };

  // Save current filters as preset
  const handleSavePreset = () => {
    if (!presetName.trim()) return;

    const newPreset = { name: presetName.trim(), filters: { ...filters } };
    setSavedPresets((prev) => [...prev, newPreset]);
    setPresetName("");
    setShowPresetModal(false);
  };

  // Load a saved preset
  const handleLoadPreset = (preset: { name: string; filters: FilterState }) => {
    onFiltersChange(preset.filters);
  };

  // Delete a saved preset
  const handleDeletePreset = (presetName: string) => {
    setSavedPresets((prev) =>
      prev.filter((preset) => preset.name !== presetName)
    );
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    return (
      filters.types.length +
      filters.categories.length +
      filters.searchFields.length +
      filters.fulfillmentStatus.length +
      filters.prophecyCategories.length +
      (filters.sortBy !== "title" ? 1 : 0) +
      (filters.yearRange.min > 0 || filters.yearRange.max < 2024 ? 1 : 0)
    );
  };

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700">
      {/* Filter Header */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold hover:text-green-800 dark:hover:text-green-300 transition-colors"
            >
              <svg
                className={`h-5 w-5 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Advanced Filters
            </button>
            {getActiveFilterCount() > 0 && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-1 rounded-full">
                {getActiveFilterCount()} active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPresetModal(true)}
              className="px-3 py-1 text-sm bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
            >
              Save Preset
            </button>
            <button
              onClick={onClearFilters}
              className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Type Filter */}
          <div>
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-3">
              Filter by Type
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {uniqueTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type)}
                    onChange={() => handleMultiSelectToggle("types", type)}
                    className="rounded border-stone-300 dark:border-stone-600 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-stone-700 dark:text-stone-300 capitalize">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          {uniqueCategories.length > 0 && (
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Filter by Category
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {uniqueCategories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() =>
                        handleMultiSelectToggle("categories", category)
                      }
                      className="rounded border-stone-300 dark:border-stone-600 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-stone-700 dark:text-stone-300 capitalize">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* NEW: Fulfillment Status Filter */}
          {uniqueFulfillmentStatuses.length > 0 && (
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Filter by Fulfillment Status
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {uniqueFulfillmentStatuses.map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.fulfillmentStatus.includes(status)}
                      onChange={() =>
                        handleMultiSelectToggle("fulfillmentStatus", status)
                      }
                      className="rounded border-stone-300 dark:border-stone-600 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-stone-700 dark:text-stone-300 capitalize">
                      {status.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* NEW: Prophecy Category Filter */}
          {uniqueProphecyCategories.length > 0 && (
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Filter by Prophecy Category
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {uniqueProphecyCategories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.prophecyCategories.includes(category)}
                      onChange={() =>
                        handleMultiSelectToggle("prophecyCategories", category)
                      }
                      className="rounded border-stone-300 dark:border-stone-600 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-stone-700 dark:text-stone-300 capitalize">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* NEW: Year Range Filter */}
          <div>
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-3">
              Filter by Year Range
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-stone-700 dark:text-stone-300 mb-1">
                  Min Year
                </label>
                <input
                  type="number"
                  min="0"
                  max="2024"
                  value={filters.yearRange.min}
                  onChange={(e) =>
                    handleFilterChange("yearRange", {
                      ...filters.yearRange,
                      min: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-700 dark:text-stone-300 mb-1">
                  Max Year
                </label>
                <input
                  type="number"
                  min="0"
                  max="2024"
                  value={filters.yearRange.max}
                  onChange={(e) =>
                    handleFilterChange("yearRange", {
                      ...filters.yearRange,
                      max: parseInt(e.target.value) || 2024,
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="2024"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Search Fields Filter */}
          <div>
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-3">
              Search in Fields
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {searchFieldOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.searchFields.includes(option.value)}
                    onChange={() =>
                      handleMultiSelectToggle("searchFields", option.value)
                    }
                    className="rounded border-stone-300 dark:border-stone-600 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-stone-700 dark:text-stone-300">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Enhanced Sort Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Sort Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange(
                    "sortOrder",
                    e.target.value as "asc" | "desc"
                  )
                }
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="asc">Ascending (A-Z)</option>
                <option value="desc">Descending (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Saved Presets */}
          {savedPresets.length > 0 && (
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Saved Presets
              </h4>
              <div className="flex flex-wrap gap-2">
                {savedPresets.map((preset) => (
                  <div
                    key={preset.name}
                    className="flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-stone-700 rounded-lg"
                  >
                    <button
                      onClick={() => handleLoadPreset(preset)}
                      className="text-sm text-stone-700 dark:text-stone-300 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                    >
                      {preset.name}
                    </button>
                    <button
                      onClick={() => handleDeletePreset(preset.name)}
                      className="text-stone-400 hover:text-red-500 transition-colors"
                      aria-label={`Delete preset ${preset.name}`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save Preset Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-stone-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Save Filter Preset
            </h3>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Enter preset name..."
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowPresetModal(false)}
                className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
