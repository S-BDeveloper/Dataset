import { useState, useMemo } from "react";
import type { IslamicData } from "../types/Types";

export interface IslamicDataFilters {
  searchTerm: string;
  type: string;
  sortBy: string;
}

// useMiracleFilters custom hook encapsulates all client-side filtering, sorting, and pagination logic
export function useIslamicDataFilters(
  islamicData: IslamicData[],
  initialFilters: IslamicDataFilters,
  pageSize: number
) {
  const [filters, setFilters] = useState<IslamicDataFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");

  // Get unique types
  const types = useMemo(
    () =>
      Array.from(new Set(islamicData.map((m) => m.type || ""))).filter(Boolean),
    [islamicData]
  );

  // Filter and sort miracles
  const sortedIslamicData = useMemo(() => {
    let filtered = islamicData.filter(
      (m) =>
        (!filters.searchTerm ||
          (m.title || "")
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          (m.notes || "")
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase())) &&
        (!filters.type || m.type === filters.type)
    );
    if (filters.sortBy === "type") {
      filtered = filtered
        .slice()
        .sort((a, b) => (a.type || "").localeCompare(b.type || ""));
    } else {
      filtered = filtered
        .slice()
        .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    return filtered;
  }, [islamicData, filters]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedIslamicData.length / pageSize));
  const paginatedIslamicData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedIslamicData.slice(start, start + pageSize);
  }, [sortedIslamicData, currentPage, pageSize]);

  // Go to page handler
  const handleGoToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      return true;
    }
    return false;
  };

  return {
    filters,
    setFilters,
    types,
    paginatedIslamicData,
    sortedIslamicData,
    currentPage,
    setCurrentPage,
    totalPages,
    goToPage,
    setGoToPage,
    handleGoToPage,
  };
}

// Legacy interfaces and functions for backward compatibility
export interface FactFilters {
  searchTerm: string;
  category: string;
  status: string;
  sortBy: string;
}

export function useFactFilters(
  facts: unknown[],
  initialFilters: FactFilters,
  pageSize: number
) {
  // Convert FactFilters to MiracleFilters
  const convertedFilters: IslamicDataFilters = {
    searchTerm: initialFilters.searchTerm,
    type: initialFilters.category, // Map category to type
    sortBy: initialFilters.sortBy,
  };

  return useIslamicDataFilters(
    facts as IslamicData[],
    convertedFilters,
    pageSize
  );
}
