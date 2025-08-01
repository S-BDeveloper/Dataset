import { useState, useEffect } from "react";
import type { IslamicData } from "../types/Types";
import IslamicDataCards from "../data/islamic_data.json";

// useMiracles custom hook centralizes data fetching logic, loading, error, and refetch
export function useIslamicData(loadingDelay = 1000) {
  const [islamicData, setIslamicData] = useState<IslamicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIslamicData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load from local JSON file
      const loadedIslamicData: IslamicData[] =
        IslamicDataCards as IslamicData[];
      setIslamicData(loadedIslamicData);
    } catch {
      setError("Failed to load Islamic data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Simulate loading delay for UX
    setLoading(true);
    setTimeout(() => {
      fetchIslamicData();
    }, loadingDelay);
  }, [loadingDelay]);

  // Refetch handler (re-runs the effect)
  const refetch = () => {
    fetchIslamicData();
  };

  return { islamicData, loading, error, refetch };
}

// Legacy hook for backward compatibility
export function useFacts(loadingDelay = 1000) {
  return useIslamicData(loadingDelay);
}
