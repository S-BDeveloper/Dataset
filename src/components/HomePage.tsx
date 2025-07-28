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
import { HomePageStats } from "./home/HomePageStats";
import { HomePageTabs } from "./home/HomePageTabs";
import { HomePageHeader } from "./home/HomePageHeader";

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
  miraclesListRef: React.RefObject<HTMLDivElement>;
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
        <HomePageHeader />

        {/* Quick Stats */}
        <HomePageStats
          miracles={miracles}
          quranData={quranData}
          hadithData={hadithData}
          favorites={favorites}
        />

        {/* Main Content */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700">
          {/* Tab Navigation */}
          <HomePageTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === "all" && (
              <div ref={miraclesListRef}>
                {/* Filters and Export */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Search miracles..."
                      value={filters.searchTerm}
                      onChange={(e) =>
                        setFilters({ ...filters, searchTerm: e.target.value })
                      }
                      className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <select
                      value={filters.type}
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
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={handleExportJSON}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Export JSON
                    </button>
                  </div>
                </div>

                {/* Miracles Grid */}
                <Masonry
                  breakpointCols={breakpointColumns}
                  className="flex w-full"
                  columnClassName="bg-clip-padding pr-2 sm:pr-4"
                >
                  {paginatedMiracles.map((miracle) => (
                    <div
                      key={`${miracle.type}-${miracle.title}`}
                      className="mb-4"
                    >
                      <MiracleCard
                        miracle={miracle}
                        onFavorite={handleFavorite}
                        isFavorite={isFavorite(miracle)}
                      />
                    </div>
                  ))}
                </Masonry>

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
                          const maxVisiblePages = 5;

                          if (totalPages <= maxVisiblePages) {
                            for (let i = 1; i <= totalPages; i++) {
                              pages.push(i);
                            }
                          } else {
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
                                    page === currentPage
                                      ? " (current page)"
                                      : ""
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
                )}
              </div>
            )}

            {activeTab === "search" && (
              <AdvancedSearchDashboard
                data={miracles}
                quranData={quranData}
                hadithData={hadithData}
                onFavorite={handleFavorite}
                isFavorite={isFavorite}
              />
            )}

            {activeTab === "charts" && <ChartsDashboard data={miracles} />}

            {activeTab === "quran" && <QuranDashboard />}

            {activeTab === "hadith" && <HadithDashboard />}
          </div>
        </div>
      </div>
    </div>
  );
}
