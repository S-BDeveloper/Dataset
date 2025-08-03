// Domain-specific hooks for miracles
import { useState, useEffect, useCallback } from "react";
import islamicData from "../../data/islamic_data.json";
import type { IslamicData as IslamicDataType } from "../../types/Types";

// Cache for loaded miracles
let IslamicDataCache: IslamicDataType[] | null = null;

// useMiracles custom hook centralizes data fetching logic, loading, error, and refetch
export function useIslamicData(loadingDelay = 1000) {
  const [IslamicData, setIslamicData] = useState<IslamicDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIslamicData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      if (IslamicDataCache) {
        setIslamicData(IslamicDataCache);
        setLoading(false);
        return;
      }

      // Load from local JSON file and add missing properties
      const loadedIslamicData: IslamicDataType[] = (
        islamicData as unknown as Record<string, unknown>[]
      ).map(
        (item, index) =>
          ({
            ...item,
            id: (item.id as string) || `islamic-${index}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as IslamicDataType)
      );

      // Cache the data
      IslamicDataCache = loadedIslamicData;
      setIslamicData(loadedIslamicData);
    } catch (err) {
      setError("Failed to load Islamic data");
      console.error("Error loading Islamic data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Simulate loading delay for UX
    setLoading(true);
    const timer = setTimeout(() => {
      fetchIslamicData();
    }, loadingDelay);

    return () => clearTimeout(timer);
  }, [loadingDelay, fetchIslamicData]);

  // Refetch handler (re-runs the effect)
  const refetch = useCallback(() => {
    IslamicDataCache = null; // Clear cache
    fetchIslamicData();
  }, [fetchIslamicData]);

  return { IslamicData, loading, error, refetch };
}

// Legacy hook for backward compatibility
export function useFacts(loadingDelay = 1000) {
  return useIslamicData(loadingDelay);
}
