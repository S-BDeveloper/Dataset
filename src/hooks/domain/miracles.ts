// Domain-specific hooks for miracles
import { useState, useEffect, useCallback } from "react";
import type { QuranicMiracle } from "../../types/Types";
import quranicMiraclesData from "../../data/quranic_miracles.json";

// Cache for loaded miracles
let miraclesCache: QuranicMiracle[] | null = null;

// useMiracles custom hook centralizes data fetching logic, loading, error, and refetch
export function useMiracles(loadingDelay = 1000) {
  const [miracles, setMiracles] = useState<QuranicMiracle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMiracles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      if (miraclesCache) {
        setMiracles(miraclesCache);
        setLoading(false);
        return;
      }

      // Load from local JSON file
      const loadedMiracles: QuranicMiracle[] =
        quranicMiraclesData as QuranicMiracle[];

      // Cache the data
      miraclesCache = loadedMiracles;
      setMiracles(loadedMiracles);
    } catch (err) {
      setError("Failed to load Quranic miracles data");
      console.error("Error loading miracles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Simulate loading delay for UX
    setLoading(true);
    const timer = setTimeout(() => {
      fetchMiracles();
    }, loadingDelay);

    return () => clearTimeout(timer);
  }, [loadingDelay, fetchMiracles]);

  // Refetch handler (re-runs the effect)
  const refetch = useCallback(() => {
    miraclesCache = null; // Clear cache
    fetchMiracles();
  }, [fetchMiracles]);

  return { miracles, loading, error, refetch };
}

// Legacy hook for backward compatibility
export function useFacts(loadingDelay = 1000) {
  return useMiracles(loadingDelay);
}
