import React, { useEffect } from "react";
import { AdvancedSearchDashboard } from "./search/AdvancedSearchDashboard";
import { ChartsDashboard } from "./charts/ChartsDashboard";
import { Stats } from "./Stats";
import { MiracleCard } from "./MiracleCard";
import PaginationButton from "./PaginationButton";
import { useFavorites } from "../hooks/useFavorites";
import type { QuranicMiracle, MiracleFilters } from "../types/Types";
import type { Dispatch, SetStateAction } from "react";

interface HomePageProps {
  miracles: QuranicMiracle[];
  sortedMiracles: QuranicMiracle[];
  paginatedMiracles: QuranicMiracle[];
  filters: MiracleFilters;
  setFilters: Dispatch<SetStateAction<MiracleFilters>>;
  types: string[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  goToPage: string;
  setGoToPage: (page: string) => void;
  handleGoToPage: () => void;
  handleExportCSV: () => void;
  handleExportJSON: () => void;
  setToast: (message: string) => void;
  miraclesListRef: React.RefObject<HTMLDivElement | null>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
  // Use the proper favorites hook instead of local state
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // Handle favorite toggle using the proper favorites system
  const handleFavorite = async (miracle: QuranicMiracle) => {
    const isCurrentlyFavorite = favorites.some(
      (fav) => fav.title === miracle.title && fav.type === miracle.type
    );

    if (isCurrentlyFavorite) {
      await removeFavorite(miracle);
      setToast("Removed from favorites");
    } else {
      await addFavorite(miracle);
      setToast("Added to favorites");
    }
  };

  // Check if a miracle is favorited using the favorites from the hook
  const isFavorite = (miracle: QuranicMiracle) => {
    return favorites.some(
      (fav) => fav.title === miracle.title && fav.type === miracle.type
    );
  };

  // Scroll to top of miracles list when currentPage changes
  useEffect(() => {
    if (miraclesListRef.current) {
      miraclesListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage, miraclesListRef]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 dark:text-green-400 mb-4">
            Islamic Signs and Guidance
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">
            Discover the miraculous signs of Allah through Quranic revelations,
            prophetic guidance, and divine wisdom. Explore mathematical
            patterns, linguistic miracles, and fulfilled prophecies that
            demonstrate the truth of Islam.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {miracles.length}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Total Signs
            </div>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {types.length}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Categories
            </div>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {favorites.length}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Saved
            </div>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              {
                miracles.filter((m) => m.fulfillmentStatus === "fulfilled")
                  .length
              }
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Fulfilled
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 mb-8">
          <div className="flex flex-wrap border-b border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "text-green-700 dark:text-green-400 border-b-2 border-green-700 dark:border-green-400"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              All Signs
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "search"
                  ? "text-green-700 dark:text-green-400 border-b-2 border-green-700 dark:border-green-400"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              Advanced Search
            </button>
            <button
              onClick={() => setActiveTab("charts")}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "charts"
                  ? "text-green-700 dark:text-green-400 border-b-2 border-green-700 dark:border-green-400"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              Charts & Graphs
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "stats"
                  ? "text-green-700 dark:text-green-400 border-b-2 border-green-700 dark:border-green-400"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              Statistics
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* All Signs Tab */}
            {activeTab === "all" && (
              <>
                {/* Filters and Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={filters.type || ""}
                      onChange={(e) =>
                        setFilters({ ...filters, type: e.target.value })
                      }
                      className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      {types.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                    <select
                      value={filters.status || ""}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Status</option>
                      <option value="fulfilled">Fulfilled</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={handleExportJSON}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Export JSON
                    </button>
                  </div>
                </div>

                {/* Miracles List */}
                <div ref={miraclesListRef}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedMiracles.map((miracle) => (
                      <MiracleCard
                        key={miracle.title}
                        miracle={miracle}
                        isFavorite={isFavorite(miracle)}
                        onFavorite={handleFavorite}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <>
                      <div className="mt-8 flex items-center justify-center">
                        <nav className="flex items-center space-x-2">
                          <ul className="flex items-center space-x-1">
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
                                Previous
                              </PaginationButton>
                            </li>
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <li key={page}>
                                <PaginationButton
                                  onClick={() => setCurrentPage(page)}
                                  isActive={page === currentPage}
                                  ariaLabel={`Go to page ${page}${
                                    page === currentPage
                                      ? " (current page)"
                                      : ""
                                  }`}
                                >
                                  {page}
                                </PaginationButton>
                              </li>
                            ))}
                            <li>
                              <PaginationButton
                                onClick={() =>
                                  setCurrentPage(
                                    Math.min(totalPages, currentPage + 1)
                                  )
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
                      </div>

                      {/* Go to Page Input */}
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <span className="text-sm text-stone-600 dark:text-stone-400">
                          Go to page:
                        </span>
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={goToPage}
                          onChange={(e) => setGoToPage(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleGoToPage()
                          }
                          className="w-16 px-2 py-1 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 text-sm"
                        />
                        <button
                          onClick={handleGoToPage}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                        >
                          Go
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Advanced Search Tab */}
            {activeTab === "search" && (
              <>
                <section className="mb-6 sm:mb-12 p-3 sm:p-6 bg-white dark:bg-stone-800 rounded-2xl shadow">
                  <AdvancedSearchDashboard
                    data={miracles}
                    onFavorite={handleFavorite}
                    isFavorite={isFavorite}
                  />
                </section>
              </>
            )}

            {/* Visualizations Tab */}
            {activeTab === "charts" && (
              <>
                <section className="mb-6 sm:mb-12 p-3 sm:p-6 bg-white dark:bg-stone-800 rounded-2xl shadow">
                  <ChartsDashboard data={miracles} />
                </section>
              </>
            )}

            {/* Statistics Tab */}
            {activeTab === "stats" && (
              <>
                <section className="mb-6 sm:mb-12 p-3 sm:p-6 bg-white dark:bg-stone-800 rounded-2xl shadow">
                  <Stats
                    miracles={miracles}
                    filteredCount={sortedMiracles.length}
                  />
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
