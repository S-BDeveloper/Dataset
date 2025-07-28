import React, { useEffect } from "react";
import { AdvancedSearchDashboard } from "./search/AdvancedSearchDashboard";
import { ChartsDashboard } from "./charts/ChartsDashboard";
import { MiracleCard } from "./MiracleCard";
import PaginationButton from "./PaginationButton";
import { useFavorites } from "../hooks/useFavorites";
import { useQuranData } from "../hooks/useQuranData";
import { useHadithData } from "../hooks/useHadithData";
import type { QuranicMiracle, MiracleFilters } from "../types/Types";
import type { Dispatch, SetStateAction } from "react";
import Masonry from "react-masonry-css";
import { QuranDashboard } from "./QuranDashboard";
import { HadithDashboard } from "./HadithDashboard";
import { scrollToTop } from "../utils/scrollUtils";

interface HomePageProps {
  miracles: QuranicMiracle[];
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

  // Use Quran and Hadith data hooks for unified search
  const { data: quranData } = useQuranData();
  const { hadithData } = useHadithData();

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

  // Masonry breakpoints
  const breakpointColumns = {
    default: 3,
    1200: 2,
    768: 1,
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-2 sm:px-4 py-8 w-full overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400 mb-4">
            Authentic Islamic Knowledge
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
            Discover the miraculous signs of Allah through authentic Quranic
            verses, Sahih Bukhari hadiths, and scientific discoveries. Explore
            cross-references between different Islamic sources to deepen your
            understanding.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {miracles.length}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Authentic Signs
            </div>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {quranData.length}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Quran Verses
            </div>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {hadithData.length}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Hadiths
            </div>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              {favorites.length}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Favorites
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700">
          {/* Tab Navigation */}
          <div className="border-b border-stone-200 dark:border-stone-700">
            <div className="flex flex-wrap gap-1 p-4">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                }`}
              >
                All Signs
              </button>
              <button
                onClick={() => setActiveTab("search")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "search"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                }`}
              >
                Cross-Reference Search
              </button>
              <button
                onClick={() => setActiveTab("charts")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "charts"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                }`}
              >
                Charts & Graphs
              </button>
              <button
                onClick={() => setActiveTab("quran")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "quran"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                }`}
              >
                Quran
              </button>
              <button
                onClick={() => setActiveTab("hadith")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "hadith"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                }`}
              >
                Hadith
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* All Signs Tab */}
            {activeTab === "all" && (
              <>
                {/* Filters and Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={filters.type || ""}
                      onChange={(e) =>
                        setFilters({ ...filters, type: e.target.value })
                      }
                      className="px-3 sm:px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
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
                      className="px-3 sm:px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
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
                      className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={handleExportJSON}
                      className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                    >
                      Export JSON
                    </button>
                  </div>
                </div>

                {/* Miracles List */}
                <div ref={miraclesListRef} className="w-full overflow-hidden">
                  <Masonry
                    breakpointCols={breakpointColumns}
                    className="flex w-full"
                    columnClassName="bg-clip-padding pr-2 sm:pr-4"
                  >
                    {paginatedMiracles.map((miracle) => (
                      <div key={miracle.title} className="mb-4">
                        <MiracleCard
                          miracle={miracle}
                          isFavorite={isFavorite(miracle)}
                          onFavorite={handleFavorite}
                        />
                      </div>
                    ))}
                  </Masonry>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <>
                      <div className="mt-8 flex items-center justify-center">
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
                            <li>
                              <PaginationButton
                                onClick={() => {
                                  setCurrentPage(
                                    Math.min(totalPages, currentPage + 1)
                                  );
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

                      {/* Go to Page Input */}
                      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                        <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                          Go to page:
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={goToPage}
                            onChange={(e) => setGoToPage(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleGoToPage()
                            }
                            className="w-16 px-2 py-1 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs sm:text-sm"
                          />
                          <button
                            onClick={() => {
                              handleGoToPage();
                              scrollToTop();
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs sm:text-sm"
                          >
                            Go
                          </button>
                        </div>
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
                    quranData={quranData}
                    hadithData={hadithData}
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

            {/* Quran Tab */}
            {activeTab === "quran" && (
              <>
                <section className="mb-6 sm:mb-12 p-3 sm:p-6 bg-white dark:bg-stone-800 rounded-2xl shadow">
                  <QuranDashboard />
                </section>
              </>
            )}

            {/* Hadith Tab */}
            {activeTab === "hadith" && (
              <>
                <section className="mb-6 sm:mb-12 p-3 sm:p-6 bg-white dark:bg-stone-800 rounded-2xl shadow">
                  <HadithDashboard />
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
