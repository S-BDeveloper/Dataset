import React, { useState } from "react";
import { HadithCard } from "./HadithCard";
import PaginationButton from "./PaginationButton";
import { useHadithData } from "../hooks/useHadithData";
import { scrollToTop } from "../utils/scrollUtils";
import Masonry from "react-masonry-css";

export function HadithDashboard() {
  const {
    paginatedData,
    loading,
    error,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    stats,
  } = useHadithData();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, searchTerm });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, sortBy: e.target.value });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mb-4"></div>
        <p className="text-stone-600 dark:text-stone-400">
          Loading Hadith data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-stone-700 dark:text-purple-400 mb-2">
          Sahih Bukhari Hadith Collection
        </h2>
        <p className="text-lg text-stone-600 dark:text-stone-400">
          Explore the authentic sayings and actions of Prophet Muhammad (ﷺ)
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white dark:bg-stone-800 rounded-xl p-3 sm:p-4 shadow-lg border border-stone-200 dark:border-stone-700">
          <div className="text-xl sm:text-2xl font-bold text-stone-700 dark:text-purple-400">
            {stats.totalHadiths.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">
            Total Hadiths
          </div>
        </div>
        <div className="bg-white dark:bg-stone-800 rounded-xl p-3 sm:p-4 shadow-lg border border-stone-200 dark:border-stone-700">
          <div className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400">
            {stats.totalWords.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">
            Total Words
          </div>
        </div>
        <div className="bg-white dark:bg-stone-800 rounded-xl p-3 sm:p-4 shadow-lg border border-stone-200 dark:border-stone-700">
          <div className="text-xl sm:text-2xl font-bold text-orange-700 dark:text-orange-400">
            {stats.averageLength}
          </div>
          <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">
            Avg. Words per Hadith
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-lg border border-stone-200 dark:border-stone-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="sm:col-span-2 lg:col-span-2">
            <div className="flex">
              <input
                type="text"
                id="hadith-search"
                name="hadith-search"
                placeholder="Search through hadith content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-l-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-3 sm:px-4 py-2 bg-stone-600 text-white rounded-r-lg hover:bg-stone-700 transition-colors text-sm sm:text-base"
              >
                Search
              </button>
            </div>
          </form>

          {/* Sort Options */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Sort by:
            </span>
            <select
              id="hadith-sort"
              name="hadith-sort"
              value={filters.sortBy}
              onChange={handleSortChange}
              className="flex-1 px-3 sm:px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="index">Original Order</option>
              <option value="length">Length (Longest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-stone-600 dark:text-stone-400">
          Showing {paginatedData.length} hadiths (Page {currentPage} of{" "}
          {totalPages})
        </p>
      </div>

      {/* Hadith Cards Grid */}
      <div className="w-full overflow-hidden">
        <Masonry
          breakpointCols={{
            default: 3,
            1200: 2,
            768: 1,
          }}
          className="flex w-full"
          columnClassName="bg-clip-padding pr-2 sm:pr-4"
        >
          {paginatedData.map((hadith, index) => (
            <div key={index} className="mb-4">
              <HadithCard
                hadith={hadith}
                index={(currentPage - 1) * 20 + index}
              />
            </div>
          ))}
        </Masonry>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <ul className="flex items-center space-x-1 flex-wrap justify-center">
              <li>
                <PaginationButton
                  onClick={() => {
                    setCurrentPage(1);
                    scrollToTop();
                  }}
                  disabled={currentPage === 1}
                  ariaLabel="First page"
                >
                  First
                </PaginationButton>
              </li>
              <li>
                <PaginationButton
                  onClick={() => {
                    setCurrentPage(Math.max(1, currentPage - 1));
                    scrollToTop();
                  }}
                  disabled={currentPage === 1}
                  ariaLabel="Previous page"
                >
                  Previous
                </PaginationButton>
              </li>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const page =
                  Math.max(1, Math.min(totalPages - 2, currentPage - 1)) + i;
                return (
                  <li key={page}>
                    <PaginationButton
                      onClick={() => {
                        setCurrentPage(page);
                        scrollToTop();
                      }}
                      isActive={page === currentPage}
                      ariaLabel={`Go to page ${page}`}
                    >
                      {page}
                    </PaginationButton>
                  </li>
                );
              })}
              <li>
                <PaginationButton
                  onClick={() => {
                    setCurrentPage(Math.min(totalPages, currentPage + 1));
                    scrollToTop();
                  }}
                  disabled={currentPage === totalPages}
                  ariaLabel="Next page"
                >
                  Next
                </PaginationButton>
              </li>
              <li>
                <PaginationButton
                  onClick={() => {
                    setCurrentPage(totalPages);
                    scrollToTop();
                  }}
                  disabled={currentPage === totalPages}
                  ariaLabel="Last page"
                >
                  Last
                </PaginationButton>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
