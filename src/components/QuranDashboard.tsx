import React, { useState } from "react";
import { QuranCard } from "./QuranCard";
import PaginationButton from "./PaginationButton";
import { useQuranData } from "../hooks/useQuranData";
import { scrollToTop } from "../utils/scrollUtils";
import Masonry from "react-masonry-css";

export function QuranDashboard() {
  const {
    data: paginatedData,
    loading,
    error,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    uniqueSurahs,
    uniquePlaces,
  } = useQuranData();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, searchTerm });
  };

  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const surahNo = e.target.value ? parseInt(e.target.value) : undefined;
    setFilters({ ...filters, surah: surahNo });
    setCurrentPage(1);
  };

  const handlePlaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const place = e.target.value || undefined;
    setFilters({ ...filters, placeOfRevelation: place });
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, sortBy: e.target.value });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
        <p className="text-stone-600 dark:text-stone-400">
          Loading Quran data...
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
        <h2 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
          The Holy Quran
        </h2>
        <p className="text-lg text-stone-600 dark:text-stone-400">
          Explore the divine revelations with {paginatedData.length} ayahs from{" "}
          {uniqueSurahs.length} surahs
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-lg border border-stone-200 dark:border-stone-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="sm:col-span-2 lg:col-span-2">
            <div className="flex">
              <input
                type="text"
                placeholder="Search by surah name or Arabic text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-l-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                Search
              </button>
            </div>
          </form>

          {/* Surah Filter */}
          <select
            value={filters.surah || ""}
            onChange={handleSurahChange}
            className="px-3 sm:px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="">All Surahs</option>
            {uniqueSurahs.map((surah) => (
              <option key={surah.number} value={surah.number}>
                {surah.number}. {surah.name}
              </option>
            ))}
          </select>

          {/* Place of Revelation Filter */}
          <select
            value={filters.placeOfRevelation || ""}
            onChange={handlePlaceChange}
            className="px-3 sm:px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="">All Places</option>
            {uniquePlaces.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="mt-4 flex items-center space-x-4">
          <span className="text-sm text-stone-600 dark:text-stone-400">
            Sort by:
          </span>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option value="surah_no">Surah Number</option>
            <option value="surah_name_en">Surah Name</option>
            <option value="place_of_revelation">Place of Revelation</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-stone-600 dark:text-stone-400">
          Showing {paginatedData.length} ayahs
        </p>
      </div>

      {/* Quran Cards Grid */}
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
          {paginatedData.map((ayah) => (
            <div
              key={`${ayah.surah_no}-${ayah.ayah_no_surah}`}
              className="mb-4"
            >
              <QuranCard ayah={ayah} />
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

              {/* Page numbers with smart display */}
              {(() => {
                const pages = [];
                const maxVisiblePages = 5; // Reduced for better mobile experience

                if (totalPages <= maxVisiblePages) {
                  // Show all pages if total is small
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Smart pagination for large numbers
                  const start = Math.max(1, currentPage - 2);
                  const end = Math.min(totalPages, currentPage + 2);

                  if (start > 1) {
                    pages.push(1);
                    if (start > 2) pages.push("...");
                  }

                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }

                  if (end < totalPages) {
                    if (end < totalPages - 1) pages.push("...");
                    pages.push(totalPages);
                  }
                }

                return pages.map((page, index) => (
                  <li key={index}>
                    {page === "..." ? (
                      <span className="px-2 sm:px-3 py-1 text-stone-500 text-xs sm:text-sm">
                        ...
                      </span>
                    ) : (
                      <PaginationButton
                        onClick={() => {
                          setCurrentPage(page as number);
                          scrollToTop();
                        }}
                        isActive={page === currentPage}
                        ariaLabel={`Go to page ${page}${
                          page === currentPage ? " (current page)" : ""
                        }`}
                      >
                        {page}
                      </PaginationButton>
                    )}
                  </li>
                ));
              })()}

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
