import { useRef, useEffect } from "react";
import { useIslamicData } from "../hooks/useIslamicData";
import { useOptimizedDataWithWorkers } from "../hooks/useOptimizedDataWithWorkers";
import { useAppStore } from "../store/useAppStore";
import HomePage from "./HomePage";

export default function HomePageWrapper() {
  // Use Zustand store for state management
  const {
    setCards,
    setCardsLoading,
    setCardsError,
    cardsFilters,
    setCardsFilters,
    currentPage,
    setCurrentPage,
    activeTab,
    setActiveTab,
    setToast,
  } = useAppStore();

  // Use the Islamic data hook to get Islamic data
  const { islamicData, loading, error, refetch } = useIslamicData();

  // Use optimized data processing with Web Workers
  const optimizedData = useOptimizedDataWithWorkers(islamicData, {
    enableWorkers: true,
    enableProgressiveLoading: true,
    enableSearchIndex: true,
  });

  // Sync data with Zustand store
  useEffect(() => {
    if (optimizedData.data.length > 0) {
      console.log(
        "HomePageWrapper - Loading Islamic data:",
        optimizedData.data.length,
        "items (optimized)"
      );
      setCards(optimizedData.data);
      setCardsLoading(false);
      setCardsError(null);
    }
  }, [optimizedData.data, setCards, setCardsLoading, setCardsError]);

  useEffect(() => {
    setCardsLoading(loading || optimizedData.isLoading);
  }, [loading, optimizedData.isLoading, setCardsLoading]);

  useEffect(() => {
    setCardsError(error || optimizedData.error);
  }, [error, optimizedData.error, setCardsError]);

  // Create refs
  const cardsListRef = useRef<HTMLDivElement>(null);

  // Export handlers
  const handleExportCSV = () => {
    // CSV export functionality
    console.log("Export CSV");
    setToast("CSV exported successfully!");
  };

  const handleExportJSON = () => {
    // JSON export functionality
    console.log("Export JSON");
    setToast("JSON exported successfully!");
  };

  // Get unique types for filters
  const types = [...new Set(optimizedData.data.map((card) => card.type))];
  console.log("HomePageWrapper - Islamic data:", optimizedData.data.length);
  console.log("HomePageWrapper - Types:", types);
  console.log("HomePageWrapper - Progress:", optimizedData.progress + "%");
  console.log(
    "HomePageWrapper - Worker supported:",
    optimizedData.workerSupported
  );

  // Calculate paginated cards based on current page
  const itemsPerPage = 9;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const dataToPaginate =
    optimizedData.filteredData.length > 0
      ? optimizedData.filteredData
      : optimizedData.data;

  const paginatedCards = dataToPaginate.slice(startIndex, endIndex);

  // Provide all required props to HomePage
  const homePageProps = {
    cards: optimizedData.data, // Use optimized data
    paginatedCards,
    filters: cardsFilters,
    setFilters: (filters: unknown) => {
      const typedFilters = filters as Partial<{
        searchTerm: string;
        type: string;
        sortBy: string;
      }>;
      setCardsFilters(typedFilters);
      // Apply filters to optimized data
      optimizedData.applyFilters(typedFilters);
    },
    types,
    currentPage,
    setCurrentPage,
    totalPages: Math.ceil(dataToPaginate.length / itemsPerPage),
    goToPage: currentPage.toString(),
    setGoToPage: (page: string) => setCurrentPage(parseInt(page) || 1),
    handleGoToPage: () => {}, // Handled by Zustand
    handleExportCSV,
    handleExportJSON,
    setToast,
    cardsListRef,
    activeTab,
    setActiveTab,
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 dark:text-red-400">
          Error: {error}
          <button
            onClick={refetch}
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <HomePage {...homePageProps} />;
}
