import { useState, useEffect, useCallback, useMemo } from "react";
import { dataService } from "../services/dataService";
import type { IslamicData } from "../types/Types";
// import { useAppStore } from "../store/useAppStore";

interface UseOptimizedDataOptions {
  chunkSize?: number;
  enableVirtualScroll?: boolean;
  enableCaching?: boolean;
  debounceDelay?: number;
}

export function useOptimizedData<T extends object>(
  data: T[],
  options: UseOptimizedDataOptions = {}
) {
  const {
    chunkSize = 1000,
    enableVirtualScroll = false,
    enableCaching = true,
    debounceDelay = 300,
  } = options;

  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);

  // const store = useAppStore(); // Unused for now, but available for future use

  // Memoized filtered data
  const memoizedFilteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((item: unknown) => {
      // Search in common fields
      const searchableFields = ["title", "content", "description", "text"];
      return searchableFields.some((field) => {
        const value = (item as Record<string, unknown>)[field];
        return (
          value &&
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    });
  }, [data, searchTerm]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilteredData(memoizedFilteredData);
    }, debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [memoizedFilteredData, debounceDelay]);

  // Progressive loading
  const loadProgressively = useCallback(async () => {
    setIsLoading(true);
    setProgress({ loaded: 0, total: data.length });

    try {
      const loadedData = await dataService.loadProgressively(
        data,
        (loaded, total) => setProgress({ loaded, total })
      );

      setVisibleItems(loadedData);
    } catch (error) {
      console.error("Error loading data progressively:", error);
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  // Virtual scrolling
  const updateVisibleItems = useCallback(
    (scrollTop: number, containerHeight: number, itemHeight: number) => {
      if (!enableVirtualScroll) return;

      const visible = dataService.getVisibleItems(
        filteredData,
        scrollTop,
        containerHeight,
        itemHeight
      );
      setVisibleItems(visible);
    },
    [filteredData, enableVirtualScroll]
  );

  // Caching
  const getCachedData = useCallback(
    (key: string) => {
      if (!enableCaching) return null;
      return dataService.getCache(key);
    },
    [enableCaching]
  );

  const setCachedData = useCallback(
    (key: string, data: T[]) => {
      if (!enableCaching) return;
      dataService.setCache(key, data);
    },
    [enableCaching]
  );

  // Search with optimization
  const performSearch = useCallback(
    async (term: string, searchFields: (keyof T)[]) => {
      setSearchTerm(term);

      if (data.length > 10000) {
        // Use Web Worker for large datasets
        return await dataService.searchWithIndex(data, term, searchFields);
      }

      return filteredData;
    },
    [data, filteredData]
  );

  // Memory optimization
  const optimizedData = useMemo(() => {
    return dataService.optimizeMemoryUsage(filteredData);
  }, [filteredData]);

  // Auto-load on mount
  useEffect(() => {
    if (data.length > chunkSize) {
      loadProgressively();
    } else {
      setVisibleItems(data);
    }
  }, [data, chunkSize, loadProgressively]);

  return {
    // Data
    visibleItems: enableVirtualScroll ? visibleItems : filteredData,
    optimizedData,
    filteredData,

    // State
    isLoading,
    progress,
    searchTerm,

    // Actions
    setSearchTerm,
    performSearch,
    updateVisibleItems,
    loadProgressively,

    // Caching
    getCachedData,
    setCachedData,

    // Utilities
    totalCount: data.length,
    filteredCount: filteredData.length,
    visibleCount: visibleItems.length,
  };
}

// Specialized hooks for different data types
export function useQuranData(quranData: IslamicData[]) {
  return useOptimizedData(quranData, {
    chunkSize: 500, // Smaller chunks for Quran data
    enableVirtualScroll: true,
    debounceDelay: 200,
  });
}

export function useHadithData(hadithData: IslamicData[]) {
  return useOptimizedData(hadithData, {
    chunkSize: 200, // Even smaller chunks for Hadith data
    enableVirtualScroll: true,
    debounceDelay: 400, // Longer debounce for complex Hadith text
  });
}

export function useMiraclesData(miraclesData: IslamicData[]) {
  return useOptimizedData(miraclesData, {
    chunkSize: 100, // Small chunks for miracles
    enableVirtualScroll: false, // Usually not needed for miracles
    debounceDelay: 300,
  });
}
