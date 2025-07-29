import React, { useState } from "react";
import type {
  QuranicMiracle,
  QuranAyah,
  HadithEntry,
} from "../../../types/Types";

interface FilterState {
  types: string[];
  categories: string[];
  searchFields: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  fulfillmentStatus: string[];
  prophecyCategories: string[];
  yearRange: { min: number; max: number };
  dataSources: ("miracle" | "quran" | "hadith")[];
  // New Quran-specific filters
  quranSurahs: string[];
  quranVerseRange: { min: number; max: number };
  quranPlaceOfRevelation: string[];
  // New Hadith-specific filters
  hadithNumberRange: { min: number; max: number };
  hadithCategories: string[];
}

interface AdvancedFilterPanelProps {
  data: QuranicMiracle[];
  quranData?: QuranAyah[];
  hadithData?: HadithEntry[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  data,
  quranData = [],
  hadithData = [],
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // Changed to true to show advanced filters by default
  const [savedPresets, setSavedPresets] = useState<
    Array<{ name: string; filters: FilterState }>
  >([]);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetName, setPresetName] = useState("");

  // Get unique values for filters
  const uniqueTypes = [...new Set(data.map((miracle) => miracle.type))];
  // Remove category filter since QuranicMiracle doesn't have a category property
  // const uniqueCategories = [
  //   ...new Set(data.map((miracle) => miracle.category).filter(Boolean)),
  // ];
  const uniqueFulfillmentStatuses = [
    ...new Set(
      data.map((miracle) => miracle.fulfillmentStatus).filter(Boolean)
    ),
  ];
  const uniqueProphecyCategories = [
    ...new Set(data.map((miracle) => miracle.prophecyCategory).filter(Boolean)),
  ];

  // Quran-specific unique values
  const uniqueQuranSurahs = [
    ...new Set(quranData.map((ayah) => ayah.surah_name_en)),
  ];
  const uniqueQuranPlaces = [
    ...new Set(quranData.map((ayah) => ayah.place_of_revelation)),
  ];
  const quranVerseNumbers = quranData
    .map((ayah) => parseInt(ayah.ayah_no_surah.toString()))
    .filter(Boolean);
  const quranMinVerse =
    quranVerseNumbers.length > 0 ? Math.min(...quranVerseNumbers) : 1;
  const quranMaxVerse =
    quranVerseNumbers.length > 0 ? Math.max(...quranVerseNumbers) : 6236;

  // Hadith-specific unique values
  const hadithNumbers = hadithData.map((_, index) => index + 1);
  const hadithMinNumber =
    hadithNumbers.length > 0 ? Math.min(...hadithNumbers) : 1;
  const hadithMaxNumber =
    hadithNumbers.length > 0 ? Math.max(...hadithNumbers) : 1000;

  // Enhanced search field options
  const searchFieldOptions = [
    { value: "title", label: "Title" },
    { value: "description", label: "Description" },
    { value: "type", label: "Type" },
    { value: "category", label: "Category" },
    { value: "content", label: "Full Content" },
    { value: "notes", label: "Notes" },
    { value: "sources", label: "Sources" },
    { value: "prophecy", label: "Prophecy Info" },
  ];

  // Data source options
  const dataSourceOptions = [
    { value: "miracle", label: "Miracles" },
    { value: "quran", label: "Quran Verses" },
    { value: "hadith", label: "Hadiths" },
  ];

  // Enhanced sort options
  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "type", label: "Type" },
    { value: "source", label: "Source" },
    { value: "category", label: "Category" },
    { value: "yearRevealed", label: "Year Revealed" },
    { value: "yearFulfilled", label: "Year Fulfilled" },
    { value: "fulfillmentStatus", label: "Fulfillment Status" },
    { value: "relevance", label: "Relevance" },
  ];

  // Handle filter changes
  const handleFilterChange = (
    key: keyof FilterState,
    value: FilterState[keyof FilterState]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Handle multi-select toggles
  const handleMultiSelectToggle = (key: keyof FilterState, value: string) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    handleFilterChange(key, newValues);
  };

  // Handle range changes
  const handleRangeChange = (
    key: keyof FilterState,
    field: "min" | "max",
    value: number
  ) => {
    const currentRange = filters[key] as { min: number; max: number };
    const newRange = { ...currentRange, [field]: value };
    handleFilterChange(key, newRange);
  };

  // Save current filters as preset
  const handleSavePreset = () => {
    if (!presetName.trim()) return;

    const newPreset = {
      name: presetName.trim(),
      filters: { ...filters },
    };

    setSavedPresets([...savedPresets, newPreset]);
    setPresetName("");
    setShowPresetModal(false);

    // Save to localStorage
    localStorage.setItem(
      "searchPresets",
      JSON.stringify([...savedPresets, newPreset])
    );
  };

  // Load preset
  const handleLoadPreset = (preset: { name: string; filters: FilterState }) => {
    onFiltersChange(preset.filters);
  };

  // Delete preset
  const handleDeletePreset = (presetName: string) => {
    const updatedPresets = savedPresets.filter((p) => p.name !== presetName);
    setSavedPresets(updatedPresets);

    // Update localStorage
    localStorage.setItem("searchPresets", JSON.stringify(updatedPresets));
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;

    if (filters.types.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.searchFields.length > 0) count++;
    if (filters.fulfillmentStatus.length > 0) count++;
    if (filters.prophecyCategories.length > 0) count++;
    if (filters.dataSources.length > 0 && filters.dataSources.length < 3)
      count++; // Only count if some but not all sources selected (not when all are selected by default)
    if (filters.yearRange.min > 0 || filters.yearRange.max < 2024) count++;
    // New filter counts
    if (filters.quranSurahs.length > 0) count++;
    if (
      filters.quranVerseRange.min > quranMinVerse ||
      filters.quranVerseRange.max < quranMaxVerse
    )
      count++;
    if (filters.quranPlaceOfRevelation.length > 0) count++;
    if (
      filters.hadithNumberRange.min > hadithMinNumber ||
      filters.hadithNumberRange.max < hadithMaxNumber
    )
      count++;
    if (filters.hadithCategories.length > 0) count++;

    return count;
  };

  return (
    <>
      {/* Only render the panel if there are active filters or if expanded */}
      {getActiveFilterCount() > 0 || isExpanded ? (
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
          {/* Filter Header */}
          <div className="p-4 border-b border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300">
                  Advanced Filters
                </h3>
                {getActiveFilterCount() > 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 text-xs font-medium rounded-full">
                    {getActiveFilterCount()} active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                >
                  {isExpanded ? (
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
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={onClearFilters}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Filter Content (conditionally rendered) */}
          {isExpanded && (
            <div className="p-4 space-y-6">
              {/* Data Sources Filter */}
              <div>
                <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
                  Data Sources
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {dataSourceOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.dataSources.includes(
                          option.value as "miracle" | "quran" | "hadith"
                        )}
                        onChange={() =>
                          handleMultiSelectToggle("dataSources", option.value)
                        }
                        className="rounded border-stone-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-stone-600 dark:text-stone-400">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quran-Specific Filters */}
              {filters.dataSources.includes("quran") && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Quran Filters
                  </h4>

                  {/* Surah Filter */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs text-stone-600 dark:text-stone-400">
                        Surah Selection
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newFilters = { ...filters };
                          if (
                            filters.quranSurahs.length ===
                            uniqueQuranSurahs.length
                          ) {
                            // If all are selected, clear selection
                            newFilters.quranSurahs = [];
                          } else {
                            // Select all surahs
                            newFilters.quranSurahs = uniqueQuranSurahs;
                          }
                          onFiltersChange(newFilters);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        {filters.quranSurahs.length === uniqueQuranSurahs.length
                          ? "Clear All"
                          : "Select All"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                      {uniqueQuranSurahs.map((surah) => (
                        <label
                          key={surah}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.quranSurahs.includes(surah)}
                            onChange={() =>
                              handleMultiSelectToggle("quranSurahs", surah)
                            }
                            className="rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs text-stone-600 dark:text-stone-400">
                            {surah}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Verse Number Range */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs text-stone-600 dark:text-stone-400">
                        Verse Number Range
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newFilters = { ...filters };
                          newFilters.quranVerseRange = {
                            min: quranMinVerse,
                            max: quranMaxVerse,
                          };
                          onFiltersChange(newFilters);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        Full Range
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={quranMinVerse}
                        max={quranMaxVerse}
                        value={filters.quranVerseRange.min}
                        onChange={(e) =>
                          handleRangeChange(
                            "quranVerseRange",
                            "min",
                            parseInt(e.target.value) || quranMinVerse
                          )
                        }
                        className="flex-1 px-2 py-1 border border-stone-300 dark:border-stone-600 rounded text-xs bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                        placeholder="Min"
                      />
                      <span className="text-xs text-stone-500 self-center">
                        to
                      </span>
                      <input
                        type="number"
                        min={quranMinVerse}
                        max={quranMaxVerse}
                        value={filters.quranVerseRange.max}
                        onChange={(e) =>
                          handleRangeChange(
                            "quranVerseRange",
                            "max",
                            parseInt(e.target.value) || quranMaxVerse
                          )
                        }
                        className="flex-1 px-2 py-1 border border-stone-300 dark:border-stone-600 rounded text-xs bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  {/* Place of Revelation */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs text-stone-600 dark:text-stone-400">
                        Place of Revelation
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newFilters = { ...filters };
                          if (
                            filters.quranPlaceOfRevelation.length ===
                            uniqueQuranPlaces.length
                          ) {
                            // If all are selected, clear selection
                            newFilters.quranPlaceOfRevelation = [];
                          } else {
                            // Select all places
                            newFilters.quranPlaceOfRevelation =
                              uniqueQuranPlaces;
                          }
                          onFiltersChange(newFilters);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        {filters.quranPlaceOfRevelation.length ===
                        uniqueQuranPlaces.length
                          ? "Clear All"
                          : "Select All"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {uniqueQuranPlaces.map((place) => (
                        <label
                          key={place}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.quranPlaceOfRevelation.includes(
                              place
                            )}
                            onChange={() =>
                              handleMultiSelectToggle(
                                "quranPlaceOfRevelation",
                                place
                              )
                            }
                            className="rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs text-stone-600 dark:text-stone-400">
                            {place}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Hadith-Specific Filters */}
              {filters.dataSources.includes("hadith") && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Hadith Filters
                  </h4>

                  {/* Hadith Number Range */}
                  <div>
                    <label className="block text-xs text-stone-600 dark:text-stone-400 mb-2">
                      Hadith Number Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={hadithMinNumber}
                        max={hadithMaxNumber}
                        value={filters.hadithNumberRange.min}
                        onChange={(e) =>
                          handleRangeChange(
                            "hadithNumberRange",
                            "min",
                            parseInt(e.target.value) || hadithMinNumber
                          )
                        }
                        className="flex-1 px-2 py-1 border border-stone-300 dark:border-stone-600 rounded text-xs bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                        placeholder="Min"
                      />
                      <span className="text-xs text-stone-500 self-center">
                        to
                      </span>
                      <input
                        type="number"
                        min={hadithMinNumber}
                        max={hadithMaxNumber}
                        value={filters.hadithNumberRange.max}
                        onChange={(e) =>
                          handleRangeChange(
                            "hadithNumberRange",
                            "max",
                            parseInt(e.target.value) || hadithMaxNumber
                          )
                        }
                        className="flex-1 px-2 py-1 border border-stone-300 dark:border-stone-600 rounded text-xs bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Miracle-Specific Filters */}
              {filters.dataSources.includes("miracle") && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Miracle Filters
                  </h4>

                  {/* Type Filter */}
                  {uniqueTypes.length > 0 && (
                    <div>
                      <label className="block text-xs text-stone-600 dark:text-stone-400 mb-2">
                        Miracle Types
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {uniqueTypes.map((type) => (
                          <label
                            key={type}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filters.types.includes(type)}
                              onChange={() =>
                                handleMultiSelectToggle("types", type)
                              }
                              className="rounded border-stone-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-xs text-stone-600 dark:text-stone-400 capitalize">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Filter - Removed since QuranicMiracle doesn't have category property */}
                  {/* {uniqueCategories.length > 0 && (
                    <div>
                      <label className="block text-xs text-stone-600 dark:text-stone-400 mb-2">
                        Categories
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {uniqueCategories.map((category) => (
                          <label
                            key={category}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(category)}
                              onChange={() =>
                                handleMultiSelectToggle("categories", category)
                              }
                              className="rounded border-stone-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-xs text-stone-600 dark:text-stone-400">
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )} */}

                  {/* Fulfillment Status Filter */}
                  {uniqueFulfillmentStatuses.length > 0 && (
                    <div>
                      <label className="block text-xs text-stone-600 dark:text-stone-400 mb-2">
                        Fulfillment Status
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {uniqueFulfillmentStatuses.map((status) => (
                          <label
                            key={status}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filters.fulfillmentStatus.includes(
                                status || ""
                              )}
                              onChange={() =>
                                handleMultiSelectToggle(
                                  "fulfillmentStatus",
                                  status || ""
                                )
                              }
                              className="rounded border-stone-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-xs text-stone-600 dark:text-stone-400">
                              {status}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prophecy Category Filter */}
                  {uniqueProphecyCategories.length > 0 && (
                    <div>
                      <label className="block text-xs text-stone-600 dark:text-stone-400 mb-2">
                        Prophecy Categories
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {uniqueProphecyCategories.map((category) => (
                          <label
                            key={category}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filters.prophecyCategories.includes(
                                category || ""
                              )}
                              onChange={() =>
                                handleMultiSelectToggle(
                                  "prophecyCategories",
                                  category || ""
                                )
                              }
                              className="rounded border-stone-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-xs text-stone-600 dark:text-stone-400">
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Year Range Filter */}
                  <div>
                    <label className="block text-xs text-stone-600 dark:text-stone-400 mb-2">
                      Year Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        max="2024"
                        value={filters.yearRange.min}
                        onChange={(e) =>
                          handleRangeChange(
                            "yearRange",
                            "min",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="flex-1 px-2 py-1 border border-stone-300 dark:border-stone-600 rounded text-xs bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                        placeholder="Min Year"
                      />
                      <span className="text-xs text-stone-500 self-center">
                        to
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="2024"
                        value={filters.yearRange.max}
                        onChange={(e) =>
                          handleRangeChange(
                            "yearRange",
                            "max",
                            parseInt(e.target.value) || 2024
                          )
                        }
                        className="flex-1 px-2 py-1 border border-stone-300 dark:border-stone-600 rounded text-xs bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                        placeholder="Max Year"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sort Options */}
              <div>
                <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
                  Sort By
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-600 dark:text-stone-400 mb-1">
                      Sort Field
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg text-sm bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-stone-600 dark:text-stone-400 mb-1">
                      Sort Order
                    </label>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) =>
                        handleFilterChange("sortOrder", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg text-sm bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Fields */}
              <div>
                <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
                  Search Fields
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {searchFieldOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.searchFields.includes(option.value)}
                        onChange={() =>
                          handleMultiSelectToggle("searchFields", option.value)
                        }
                        className="rounded border-stone-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-stone-600 dark:text-stone-400">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preset Management */}
              <div className="border-t border-stone-200 dark:border-stone-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Search Presets
                  </h4>
                  <button
                    onClick={() => setShowPresetModal(true)}
                    className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Save Current
                  </button>
                </div>
                {savedPresets.length > 0 && (
                  <div className="space-y-2">
                    {savedPresets.map((preset) => (
                      <div
                        key={preset.name}
                        className="flex items-center justify-between p-2 bg-stone-50 dark:bg-stone-700 rounded-lg"
                      >
                        <button
                          onClick={() => handleLoadPreset(preset)}
                          className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                        >
                          {preset.name}
                        </button>
                        <button
                          onClick={() => handleDeletePreset(preset.name)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Hide the panel if no filters are active and not expanded
        <div className="hidden" />
      )}

      {/* Preset Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-stone-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-4">
              Save Search Preset
            </h3>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Enter preset name"
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg text-sm bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSavePreset}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowPresetModal(false)}
                className="flex-1 bg-stone-300 dark:bg-stone-600 text-stone-700 dark:text-stone-300 px-4 py-2 rounded-lg hover:bg-stone-400 dark:hover:bg-stone-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
