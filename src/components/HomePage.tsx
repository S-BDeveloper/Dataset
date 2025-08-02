import React, { useEffect, useState } from "react";
import { AdvancedSearchDashboard } from "./features/search/AdvancedSearchDashboard";
import { ChartsDashboard } from "./features/charts/ChartsDashboard";
import { DataCard } from "./features/datacard/DataCard";
import PaginationButton from "./common/PaginationButton";
import { useFavorites } from "../hooks/useFavorites";
import { useQuranData } from "../hooks/useQuranData";
import { useHadithData } from "../hooks/useHadithData";
import type { IslamicData, IslamicDataFilters } from "../types/Types";
import type { FavoriteItem } from "../hooks/useFavorites";
import type { Dispatch, SetStateAction } from "react";
import Masonry from "react-masonry-css";
import { QuranDashboard } from "./features/quran/QuranDashboard";
import { HadithDashboard } from "./features/hadith/HadithDashboard";
import { scrollToTop } from "../utils/scrollUtils";
import { HomePageStats } from "./home/HomePageStats";
import { HomePageTabs } from "./home/HomePageTabs";
import { HomePageHeader } from "./home/HomePageHeader";
import { DataLoadingState } from "./common/LoadingState";

interface HomePageProps {
  cards: IslamicData[];
  paginatedCards: IslamicData[];
  filters: IslamicDataFilters;
  setFilters: Dispatch<SetStateAction<IslamicDataFilters>>;
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
  cardsListRef: React.RefObject<HTMLDivElement>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function HomePage({
  cards,
  paginatedCards,
  filters,
  setFilters,
  types,
  currentPage,
  setCurrentPage,
  totalPages,
  handleExportCSV,
  handleExportJSON,
  setToast,
  cardsListRef,
  activeTab,
  setActiveTab,
}: HomePageProps) {
  // Use the proper favorites hook instead of local state
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // Use Quran and Hadith data hooks for unified search
  const { allData: quranData } = useQuranData(); // Use allData for full Quran dataset
  const { hadithData } = useHadithData();

  // Add loading state tracking
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Check if data is still loading
  useEffect(() => {
    const hasData =
      cards.length > 0 || quranData.length > 0 || hadithData.length > 0;
    setIsDataLoading(!hasData);
  }, [cards, quranData, hadithData]);

  // Scroll to top of cards list when currentPage changes
  useEffect(() => {
    if (cardsListRef.current) {
      cardsListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage, cardsListRef]);

  // Handle favorite toggle using the proper favorites system
  const handleFavorite = async (item: FavoriteItem) => {
    const isCurrentlyFavorite = favorites.some(
      (fav) =>
        fav === item ||
        ("title" in fav &&
          "title" in item &&
          fav.title === item.title &&
          "type" in fav &&
          "type" in item &&
          fav.type === item.type) ||
        ("surah_no" in fav &&
          "surah_no" in item &&
          fav.surah_no === item.surah_no &&
          "ayah_no_surah" in fav &&
          "ayah_no_surah" in item &&
          fav.ayah_no_surah === item.ayah_no_surah) ||
        ("number" in fav && "number" in item && fav.number === item.number)
    );

    if (isCurrentlyFavorite) {
      await removeFavorite(item);
      setToast("Removed from favorites");
    } else {
      await addFavorite(item);
      setToast("Added to favorites");
    }
  };

  // Check if an item is favorited using the favorites from the hook
  const isFavorite = (item: FavoriteItem) => {
    const isFav = favorites.some(
      (fav) =>
        fav === item ||
        ("title" in fav &&
          "title" in item &&
          fav.title === item.title &&
          "type" in fav &&
          "type" in item &&
          fav.type === item.type) ||
        ("surah_no" in fav &&
          "surah_no" in item &&
          fav.surah_no === item.surah_no &&
          "ayah_no_surah" in fav &&
          "ayah_no_surah" in item &&
          fav.ayah_no_surah === item.ayah_no_surah) ||
        ("number" in fav && "number" in item && fav.number === item.number)
    );

    return isFav;
  };

  // Masonry breakpoints
  const breakpointColumns = {
    default: 3,
    1200: 2,
    768: 1,
  };

  // Show loading state if no data is available yet
  if (isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in-up">
        <DataLoadingState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-2 sm:px-4 py-8 w-full overflow-hidden">
        {/* Header */}
        <HomePageHeader />

        {/* Quick Stats */}
        <HomePageStats
          cards={cards}
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
              <div ref={cardsListRef}>
                {/* Filters and Export */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Search data..."
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

                {/* Cards Grid */}
                <Masonry
                  breakpointCols={breakpointColumns}
                  className="flex w-full"
                  columnClassName="bg-clip-padding pr-2 sm:pr-4"
                >
                  {paginatedCards.map((card) => (
                    <div key={`${card.type}-${card.title}`} className="mb-4">
                      <DataCard
                        card={card}
                        onFavorite={handleFavorite}
                        isFavorite={isFavorite(card)}
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
                data={cards}
                quranData={quranData}
                hadithData={hadithData}
                onFavorite={handleFavorite}
                isFavorite={isFavorite}
              />
            )}

            {activeTab === "charts" && <ChartsDashboard data={cards} />}

            {activeTab === "quran" && (
              <QuranDashboard
                onFavorite={handleFavorite}
                isFavorite={isFavorite}
              />
            )}

            {activeTab === "hadith" && (
              <HadithDashboard
                onFavorite={handleFavorite}
                isFavorite={isFavorite}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
