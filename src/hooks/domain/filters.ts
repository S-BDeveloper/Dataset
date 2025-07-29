// Domain-specific hooks for filtering and pagination
import { useState, useMemo } from "react";
import type { QuranicMiracle } from "../../types/Types";

export interface MiracleFilters {
  searchTerm: string;
  type: string;
  sortBy: string;
}

// useMiracleFilters custom hook encapsulates all client-side filtering, sorting, and pagination logic
export function useMiracleFilters(
  miracles: QuranicMiracle[],
  initialFilters: MiracleFilters,
  pageSize: number
) {
  const [filters, setFilters] = useState<MiracleFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");

  // Get unique types
  const types = useMemo(
    () =>
      Array.from(new Set(miracles.map((m) => m.type || ""))).filter(Boolean),
    [miracles]
  );

  // Filter and sort miracles
  const sortedMiracles = useMemo(() => {
    let filtered = miracles.filter(
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
  }, [miracles, filters]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedMiracles.length / pageSize));
  const paginatedMiracles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedMiracles.slice(start, start + pageSize);
  }, [sortedMiracles, currentPage, pageSize]);

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
    paginatedMiracles,
    sortedMiracles,
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
  const convertedFilters: MiracleFilters = {
    searchTerm: initialFilters.searchTerm,
    type: initialFilters.category, // Map category to type
    sortBy: initialFilters.sortBy,
  };

  return useMiracleFilters(
    facts as QuranicMiracle[],
    convertedFilters,
    pageSize
  );
}
