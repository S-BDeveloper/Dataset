// Domain-specific hooks for miracles
import { useState, useEffect } from "react";
import type { QuranicMiracle } from "../../types/Types";
import quranicMiraclesData from "../../data/quranic_miracles.json";

// useMiracles custom hook centralizes data fetching logic, loading, error, and refetch
export function useMiracles(loadingDelay = 1000) {
  const [miracles, setMiracles] = useState<QuranicMiracle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMiracles = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load from local JSON file
      const loadedMiracles: QuranicMiracle[] =
        quranicMiraclesData as QuranicMiracle[];
      setMiracles(loadedMiracles);
    } catch {
      setError("Failed to load Quranic miracles data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Simulate loading delay for UX
    setLoading(true);
    setTimeout(() => {
      fetchMiracles();
    }, loadingDelay);
  }, [loadingDelay]);

  // Refetch handler (re-runs the effect)
  const refetch = () => {
    fetchMiracles();
  };

  return { miracles, loading, error, refetch };
}

// Legacy hook for backward compatibility
export function useFacts(loadingDelay = 1000) {
  return useMiracles(loadingDelay);
}
