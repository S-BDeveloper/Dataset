import { useState, useEffect } from "react";
import { MiracleCard } from "./MiracleCard";
import { Stats } from "./Stats";
import { DatasetOverview } from "./DatasetOverview";
import { DataPreview } from "./DataPreview";
import { SearchBar } from "./SearchBar";
import Masonry from "react-masonry-css";
import PaginationButton from "./PaginationButton";
import SectionTabs from "./SectionTabs";
import Tooltip from "./Tooltip";
import type { QuranicMiracle } from "../types/Types";
import type { MiracleFilters } from "../hooks/useFactFilters";

interface HomePageProps {
  miracles: QuranicMiracle[];
  sortedMiracles: QuranicMiracle[];
  paginatedMiracles: QuranicMiracle[];
  filters: MiracleFilters;
  setFilters: (filters: MiracleFilters) => void;
  types: string[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  goToPage: string;
  setGoToPage: (page: string) => void;
  handleGoToPage: (pageNum: number) => boolean;
  handleExportCSV: () => void;
  handleExportJSON: () => void;
  setToast: (toast: string | null) => void;
  miraclesListRef: React.RefObject<HTMLDivElement | null>;
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export default function HomePage({
  miracles,
  sortedMiracles,
  paginatedMiracles,
  filters,
  setFilters,
  types,
  currentPage,
  setCurrentPage,
  totalPages,
  goToPage,
  setGoToPage,
  handleGoToPage,
  handleExportCSV,
  handleExportJSON,
  setToast,
  miraclesListRef,
  activeTab,
  setActiveTab,
}: HomePageProps) {
  const [favorites, setFavorites] = useState<QuranicMiracle[]>([]);

  // Handle favorite toggle
  const handleFavorite = (miracle: QuranicMiracle) => {
    setFavorites((prev) => {
      const isFavorite = prev.some((fav) => fav.title === miracle.title);
      if (isFavorite) {
        return prev.filter((fav) => fav.title !== miracle.title);
      } else {
        return [...prev, miracle];
      }
    });
  };

  // Check if a miracle is favorited
  const isFavorite = (miracle: QuranicMiracle) => {
    return favorites.some((fav) => fav.title === miracle.title);
  };

  // Scroll to top of miracles list when currentPage changes
  useEffect(() => {
    if (miraclesListRef.current) {
      miraclesListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage, miraclesListRef]);

  return (
    <main className="w-full max-w-full sm:max-w-6xl px-2 sm:px-4 py-6 sm:py-12 mx-auto bg-stone-50 dark:bg-stone-800 rounded-2xl shadow-lg mt-4 sm:mt-8 mb-8 sm:mb-12 transition-colors duration-300">
      {/* Export buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-end">
        <Tooltip content="Download the filtered signs and guidance as a CSV file (for Excel, Google Sheets, etc.)">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded bg-green-700 text-white font-semibold border border-green-700 transition-colors duration-150 hover:bg-green-800 focus:ring-2 focus:ring-green-500"
            aria-label="Export filtered signs and guidance as CSV"
          >
            Export CSV
          </button>
        </Tooltip>
        <Tooltip content="Download the filtered signs and guidance as a JSON file (for developers, data analysis, etc.)">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-semibold border border-green-700 dark:border-green-600 transition-colors duration-150 hover:bg-green-100 dark:hover:bg-green-900/50 focus:ring-2 focus:ring-green-500"
            aria-label="Export filtered signs and guidance as JSON"
          >
            Export JSON
          </button>
        </Tooltip>
      </div>

      <SectionTabs
        tabs={[
          "Dataset Overview",
          "Data Preview",
          "Statistics",
          "Search & Filter",
          "Charts & Graphs",
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {/* Overview Tab */}
        <>
          <section className="mb-6 sm:mb-12 p-3 sm:p-6 bg-white dark:bg-stone-800 rounded-2xl shadow">
            <h2 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400 mb-2 text-left tracking-tight flex items-center gap-2">
              Dataset Summary
              <Tooltip content="Summary of the entire dataset, including total signs and guidance and last updated date.">
                <svg
                  className="w-5 h-5 text-green-500 dark:text-green-400 cursor-help"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-label="Help"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-4m0-4h.01"
                  />
                </svg>
              </Tooltip>
            </h2>
            <div className="w-16 mb-6 border-b-2 border-green-200 dark:border-green-700 rounded-full" />
            <DatasetOverview
              data={miracles}
              description="A comprehensive collection of signs and guidance from the Holy Quran, including fulfilled prophecies, mathematical patterns, and divine guidance for humanity."
              lastUpdated="2025-07-25"
            />
          </section>
        </>

        {/* Preview Tab */}
        <>
          <div className="overflow-x-auto">
            <DataPreview data={miracles} maxRows={10} />
          </div>
        </>

        {/* Statistics Tab */}
        <>
          <section className="mb-6 sm:mb-12 p-3 sm:p-6 bg-white dark:bg-stone-800 rounded-2xl shadow">
            <h2 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400 mb-2 text-left tracking-tight flex items-center gap-2">
              Statistics
              <Tooltip content="Key statistics about the dataset, such as total miracles, filtered count, and more.">
                <svg
                  className="w-5 h-5 text-green-500 dark:text-green-400 cursor-help"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-label="Help"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-4m0-4h.01"
                  />
                </svg>
              </Tooltip>
            </h2>
            <div className="w-16 mb-6 border-b-2 border-green-200 dark:border-green-700 rounded-full" />
            <Stats miracles={miracles} filteredCount={sortedMiracles.length} />
          </section>
        </>

        {/* Search/Filter Tab */}
        <>
          <section className="mb-6 sm:mb-12 p-3 sm:p-6 bg-white dark:bg-stone-800 rounded-2xl shadow">
            <h2 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400 mb-2 text-left tracking-tight flex items-center gap-2">
              Search & Filter
              <Tooltip content="Search signs and guidance by keyword, filter by type, and sort the results.">
                <svg
                  className="w-5 h-5 text-green-500 dark:text-green-400 cursor-help"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-label="Help"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-4m0-4h.01"
                  />
                </svg>
              </Tooltip>
            </h2>
            <div className="w-16 mb-6 border-b-2 border-green-200 dark:border-green-700 rounded-full" />
            <SearchBar
              filters={filters}
              onFiltersChange={setFilters}
              types={types}
            />
          </section>

          {/* Show message if no results */}
          {sortedMiracles.length === 0 ? (
            <div
              className="bg-white dark:bg-stone-800 rounded-xl shadow p-8 text-center flex flex-col items-center gap-2 border-2 border-dashed border-green-200 dark:border-green-700"
              aria-live="polite"
              role="status"
            >
              <svg
                className="w-10 h-10 text-green-400 dark:text-green-500 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M7 17v-2a6 6 0 016-6h2a6 6 0 016 6v2M3 17v-2a8 8 0 018-8h2a8 8 0 018 8v2"
                />
              </svg>
              <div className="text-lg font-bold text-green-700 dark:text-green-400">
                No signs found
              </div>
              <div className="text-green-600 dark:text-green-300 text-sm">
                Try adjusting your search, filters, or sorting options.
              </div>
            </div>
          ) : (
            <>
              {/* Miracles list with ref for scrolling */}
              <section
                ref={miraclesListRef}
                className="mb-6 bg-stone-50 dark:bg-stone-800 rounded-2xl shadow"
              >
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2 text-left tracking-tight flex items-center gap-2">
                  Browse All Signs & Guidance
                  <Tooltip content="Browse all signs and guidance that match your current filters and search.">
                    <svg
                      className="w-5 h-5 text-green-500 dark:text-green-400 cursor-help"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-label="Help"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16v-4m0-4h.01"
                      />
                    </svg>
                  </Tooltip>
                </h2>
                <div className="w-16 mb-6 border-b-2 border-green-200 dark:border-green-700 rounded-full" />
                <Masonry
                  breakpointCols={{
                    default: 4,
                    1280: 4,
                    1024: 3,
                    640: 2,
                    0: 1,
                  }}
                  className="flex w-auto gap-8"
                  columnClassName="masonry-column"
                >
                  {paginatedMiracles.map((miracle) => (
                    <div
                      key={miracle.title}
                      className="transition-shadow hover:shadow-lg rounded-xl mb-6"
                    >
                      <MiracleCard
                        miracle={miracle}
                        onFavorite={handleFavorite}
                        isFavorite={isFavorite(miracle)}
                      />
                    </div>
                  ))}
                </Masonry>
              </section>

              {/* Pagination Controls */}
              <nav
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-6 gap-2 sm:gap-0"
                aria-label="Pagination Navigation"
              >
                {/* Go to page input (left-aligned) */}
                <form
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const pageNum = Number(goToPage);
                    if (!handleGoToPage(pageNum)) {
                      setToast(`Page must be between 1 and ${totalPages}`);
                    }
                  }}
                  aria-label="Go to page form"
                >
                  <label
                    htmlFor="goToPage"
                    className="text-green-800 dark:text-green-300 font-semibold text-sm sm:text-base flex items-center gap-1"
                  >
                    Go to page:
                    <Tooltip content="Enter a page number to jump directly to that page of results.">
                      <svg
                        className="w-4 h-4 text-green-500 dark:text-green-400 cursor-help"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-label="Help"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16v-4m0-4h.01"
                        />
                      </svg>
                    </Tooltip>
                  </label>
                  <input
                    id="goToPage"
                    type="number"
                    min={1}
                    max={totalPages}
                    value={goToPage}
                    onChange={(e) => setGoToPage(e.target.value)}
                    className={`w-16 sm:w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 ${
                      goToPage &&
                      (Number(goToPage) < 1 || Number(goToPage) > totalPages)
                        ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30"
                        : "border-green-700 dark:border-green-600"
                    }`}
                    placeholder="#"
                    aria-label="Page number to go to"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-3 py-1 rounded bg-green-700 text-white font-semibold border border-green-700 transition-colors duration-150 hover:bg-green-800 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    disabled={
                      !goToPage ||
                      Number(goToPage) < 1 ||
                      Number(goToPage) > totalPages
                    }
                    aria-label="Go to entered page number"
                  >
                    Go
                  </button>
                </form>

                {/* Right-aligned pagination buttons as a list for better semantics */}
                <ul
                  className="flex flex-wrap items-center gap-1 sm:gap-2 justify-end w-full sm:w-auto"
                  role="list"
                  aria-label="Pagination"
                >
                  <li>
                    <PaginationButton
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      ariaLabel="First page"
                    >
                      First
                    </PaginationButton>
                  </li>
                  <li>
                    <PaginationButton
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      ariaLabel="Previous page"
                    >
                      Prev
                    </PaginationButton>
                  </li>
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <li key={page}>
                        <PaginationButton
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                          ariaLabel={`Go to page ${page}${
                            page === currentPage ? " (current page)" : ""
                          }`}
                        >
                          {page}
                        </PaginationButton>
                      </li>
                    )
                  )}
                  <li>
                    <PaginationButton
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      ariaLabel="Next page"
                    >
                      Next
                    </PaginationButton>
                  </li>
                  <li>
                    <PaginationButton
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      ariaLabel="Last page"
                    >
                      Last
                    </PaginationButton>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </>

        {/* Visualizations Tab */}
        <>
          <section className="mb-6 sm:mb-12 p-3 sm:p-6 bg-white dark:bg-stone-800 rounded-2xl shadow">
            <h2 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400 mb-2 text-left tracking-tight flex items-center gap-2">
              Charts & Graphs
              <Tooltip content="Interactive charts and graphs showing patterns in Quranic signs and guidance.">
                <svg
                  className="w-5 h-5 text-green-500 dark:text-green-400 cursor-help"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-label="Help"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-4m0-4h.01"
                  />
                </svg>
              </Tooltip>
            </h2>
            <div className="w-16 mb-6 border-b-2 border-green-200 dark:border-green-700 rounded-full" />
            <div className="text-center py-12 text-stone-500 dark:text-stone-400">
              <p className="text-lg">Visualizations coming soon...</p>
              <p className="text-sm mt-2">
                Charts and graphs will be added here to show patterns in Quranic
                signs.
              </p>
            </div>
          </section>
        </>
      </SectionTabs>
    </main>
  );
}
