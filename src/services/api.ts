// API service for external data fetching
const API_BASE = "https://api.alquran.cloud/v1";
const HADITH_API = "https://hadithapi.com/api";

// Cache for API responses
const apiCache = new Map<string, Record<string, unknown>>();

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 5000,
};

// Enhanced API fetch with retry logic
const apiFetch = async <T>(
  url: string,
  cacheKey?: string,
  retryCount = 0
): Promise<T> => {
  const cacheKeyToUse = cacheKey || url;

  console.log(`🌐 API Request (attempt ${retryCount + 1}):`, url);

  // Check cache first
  if (apiCache.has(cacheKeyToUse)) {
    console.log(`✅ Using cached response for:`, url);
    return apiCache.get(cacheKeyToUse) as T;
  }

  try {
    console.log(`📡 Fetching from API:`, url);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    console.log(`📊 Response status:`, response.status, response.statusText);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`✅ API Response received:`, data);

    // Cache the response
    apiCache.set(cacheKeyToUse, data);

    return data;
  } catch (error) {
    console.error(`❌ API fetch error (attempt ${retryCount + 1}):`, error);

    // Retry logic
    if (retryCount < RETRY_CONFIG.maxRetries) {
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(2, retryCount),
        RETRY_CONFIG.maxDelay
      );

      console.log(`🔄 Retrying in ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiFetch<T>(url, cacheKey, retryCount + 1);
    }

    // If all retries failed, throw the error
    throw error;
  }
};

// Check if we're online
const isOnline = () => {
  return navigator.onLine;
};

// Quran API functions
export const quranApi = {
  // Get specific verse
  getVerse: async (surah: number, ayah: number) => {
    if (!isOnline()) {
      throw new Error("No internet connection. Please check your network.");
    }
    return apiFetch(`${API_BASE}/ayah/${surah}:${ayah}`);
  },

  // Get entire surah
  getSurah: async (surah: number) => {
    if (!isOnline()) {
      throw new Error("No internet connection. Please check your network.");
    }
    return apiFetch(`${API_BASE}/surah/${surah}`);
  },

  // Get surah with English translation
  getSurahWithTranslation: async (surah: number) => {
    if (!isOnline()) {
      throw new Error("No internet connection. Please check your network.");
    }
    return apiFetch(`${API_BASE}/surah/${surah}/en.sahih`);
  },

  // Search Quran
  search: async (query: string, surah?: number) => {
    if (!isOnline()) {
      throw new Error("No internet connection. Please check your network.");
    }
    const params = new URLSearchParams({ q: query });
    if (surah) params.append("surah", surah.toString());
    return apiFetch(`${API_BASE}/search/quran/${query}?${params}`);
  },

  // Get Juz (Part)
  getJuz: async (juz: number) => {
    if (!isOnline()) {
      throw new Error("No internet connection. Please check your network.");
    }
    return apiFetch(`${API_BASE}/juz/${juz}`);
  },

  // Get all surahs
  getSurahs: async () => {
    if (!isOnline()) {
      throw new Error("No internet connection. Please check your network.");
    }
    return apiFetch(`${API_BASE}/surah`);
  },

  // Clear cache
  clearCache: () => {
    const keysToDelete = Array.from(apiCache.keys()).filter((key) =>
      key.includes(API_BASE)
    );
    keysToDelete.forEach((key) => apiCache.delete(key));
  },
};

// Hadith API functions
export const hadithApi = {
  // Get specific hadith
  getHadith: async (collection: string, number: number) => {
    if (!isOnline()) {
      throw new Error("No internet connection. Please check your network.");
    }
    return apiFetch(`${HADITH_API}/hadiths/${collection}/${number}`);
  },

  // Search hadiths
  search: async (query: string, collection?: string) => {
    if (!isOnline()) {
      throw new Error("No internet connection. Please check your network.");
    }
    const params = new URLSearchParams({ q: query });
    if (collection) params.append("collection", collection);
    return apiFetch(`${HADITH_API}/hadiths/search?${params}`);
  },

  // Get hadiths by narrator
  getByNarrator: async (narrator: string) => {
    if (!isOnline()) {
      throw new Error("No internet connection. Please check your network.");
    }
    return apiFetch(`${HADITH_API}/hadiths/narrator/${narrator}`);
  },

  // Clear cache
  clearCache: () => {
    const keysToDelete = Array.from(apiCache.keys()).filter((key) =>
      key.includes(HADITH_API)
    );
    keysToDelete.forEach((key) => apiCache.delete(key));
  },
};

// Local miracles data (keep this since it's small)
export const miraclesApi = {
  getMiracles: async () => {
    // For now, keep local data since it's small
    const { default: data } = await import("../data/islamic_data.json");
    return { data };
  },
};

// Combined search function
export const searchApi = {
  searchAll: async (
    query: string,
    filters: { includeQuran?: boolean; includeHadith?: boolean }
  ) => {
    const results: Array<Record<string, unknown>> = [];

    // Search Quran
    if (filters.includeQuran) {
      try {
        const quranResults = (await quranApi.search(query)) as {
          data: Array<Record<string, unknown>>;
        };
        results.push(
          ...quranResults.data.map((item: Record<string, unknown>) => ({
            ...item,
            type: "quran",
          }))
        );
      } catch (error) {
        console.error("Quran search failed:", error);
      }
    }

    // Search Hadith
    if (filters.includeHadith) {
      try {
        const hadithResults = (await hadithApi.search(query)) as {
          data: Array<Record<string, unknown>>;
        };
        results.push(
          ...hadithResults.data.map((item: Record<string, unknown>) => ({
            ...item,
            type: "hadith",
          }))
        );
      } catch (error) {
        console.error("Hadith search failed:", error);
      }
    }

    return results;
  },

  // Clear all caches
  clearAllCaches: () => {
    quranApi.clearCache();
    hadithApi.clearCache();
  },
};
