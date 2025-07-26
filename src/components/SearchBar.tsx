import React from "react";
import type { MiracleFilters } from "../hooks/useFactFilters";

interface SearchBarProps {
  filters: MiracleFilters;
  onFiltersChange: (filters: MiracleFilters) => void;
  types: string[];
}

// SearchBar provides search, filter, and sort controls for signs and guidance
export const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  onFiltersChange,
  types,
}) => {
  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onFiltersChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <form
      className="flex flex-wrap gap-4 items-center bg-gradient-to-br from-white to-stone-50 rounded-2xl shadow-lg border border-stone-200 p-6"
      aria-label="Search and filter signs and guidance"
    >
      {/* Search Input */}
      <div className="flex-1 min-w-[200px]">
        <label
          htmlFor="search-input"
          className="block text-sm font-semibold text-green-700 mb-2"
        >
          Search Signs & Guidance
        </label>
        <input
          id="search-input"
          name="searchTerm"
          value={filters.searchTerm}
          onChange={handleChange}
          placeholder="Enter keywords to search signs and guidance..."
          className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all duration-200 text-sm text-stone-800 bg-white shadow-sm hover:shadow-md"
          data-cy="search-input"
          aria-label="Search signs and guidance"
        />
      </div>

      {/* Type Filter */}
      <div className="min-w-[180px]">
        <label
          htmlFor="type-select"
          className="block text-sm font-semibold text-green-700 mb-2"
        >
          Type
        </label>
        <select
          id="type-select"
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all duration-200 text-sm text-stone-800 bg-white shadow-sm hover:shadow-md"
          data-cy="type-select"
          aria-label="Filter by type"
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Options */}
      <div className="min-w-[160px]">
        <label
          htmlFor="sort-select"
          className="block text-sm font-semibold text-green-700 mb-2"
        >
          Sort By
        </label>
        <select
          id="sort-select"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
          className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all duration-200 text-sm text-stone-800 bg-white shadow-sm hover:shadow-md"
          aria-label="Sort signs and guidance"
        >
          <option value="title">Title</option>
          <option value="type">Type</option>
        </select>
      </div>
    </form>
  );
};
