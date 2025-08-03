import { useRef, useState } from "react";
import { useFacts } from "../hooks/useFacts";
import { useIslamicFilters } from "../hooks/domain/filters";
import HomePage from "./HomePage";
import type { IslamicDataFilters } from "../types/Types";

export default function HomePageWrapper() {
  // Use the facts hook to get Islamic data
  const { islamicData, loading, error, refetch } = useFacts();

  // Initialize filters
  const initialFilters: IslamicDataFilters = {
    searchTerm: "",
    type: "",
    sortBy: "title",
  };

  // Use Islamic filters hook
  const {
    filters,
    setFilters,
    types,
    paginatedIslamicData,
    currentPage,
    setCurrentPage,
    totalPages,
    goToPage,
    setGoToPage,
    handleGoToPage,
  } = useIslamicFilters(islamicData, initialFilters, 8);

  // Create refs and state
  const cardsListRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Export handlers
  const handleExportCSV = () => {
    // CSV export functionality
    console.log("Export CSV");
  };

  const handleExportJSON = () => {
    // JSON export functionality
    console.log("Export JSON");
  };

  const setToast = (message: string) => {
    // Toast notification functionality
    console.log("Toast:", message);
  };

  // Provide all required props to HomePage
  const homePageProps = {
    cards: islamicData,
    paginatedCards: paginatedIslamicData,
    filters,
    setFilters,
    types,
    currentPage,
    setCurrentPage,
    totalPages,
    goToPage,
    setGoToPage,
    handleGoToPage: () => handleGoToPage(Number(goToPage)),
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
