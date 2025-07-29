import { useState, useEffect, useMemo } from "react";
import type { HadithEntry, HadithFilters } from "../types/Types";
// Import JSON data directly for better performance
import hadithDataJSON from "../data/Sahih Bukhari.json";

export function useHadithData() {
  const [hadithData, setHadithData] = useState<HadithEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HadithFilters>({
    searchTerm: "",
    sortBy: "index",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Load Hadith data from JSON directly
  useEffect(() => {
    const loadHadithData = async () => {
      try {
        setLoading(true);
        // Load from JSON directly - much faster than fetch
        // Transform the data to match HadithEntry interface
        const data = Object.entries(hadithDataJSON).map(([key, value]) => ({
          id: key,
          number: key,
          book: "Sahih Bukhari",
          chapter: "Unknown",
          narrator: "Unknown",
          text: typeof value === "string" ? value : JSON.stringify(value),
          arabic: typeof value === "string" ? value : "",
          translation: "",
          grade: "Sahih",
          reference: key,
        })) as HadithEntry[];
        setHadithData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load Hadith data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadHadithData();
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...hadithData];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((hadith) => {
        // Search through all values in the hadith object
        return Object.values(hadith).some((value) =>
          value.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "index":
        // Keep original order
        break;
      case "length":
        // Sort by content length (longest first)
        filtered.sort((a, b) => {
          const aLength = Object.values(a).join("").length;
          const bLength = Object.values(b).join("").length;
          return bLength - aLength;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [hadithData, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // Get statistics
  const stats = useMemo(() => {
    const totalHadiths = hadithData.length;
    const totalWords = hadithData.reduce((total, hadith) => {
      return total + Object.values(hadith).join(" ").split(/\s+/).length;
    }, 0);
    const averageLength =
      totalHadiths > 0 ? Math.round(totalWords / totalHadiths) : 0;

    return {
      totalHadiths,
      totalWords,
      averageLength,
    };
  }, [hadithData]);

  return {
    hadithData,
    filteredData,
    paginatedData,
    loading,
    error,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    stats,
    itemsPerPage,
  };
}
