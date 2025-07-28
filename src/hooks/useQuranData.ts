import { useState, useEffect, useMemo, useCallback } from "react";
import type { QuranAyah, QuranFilters } from "../types/Types";
// Import data directly to avoid fetch issues
import quranDataCSV from "../data/The Quran Dataset.csv?raw";
import quranDataJSON from "../data/The Quran Dataset.json";

// Enhanced error types for better error handling
interface DataLoadError {
  message: string;
  code: "NETWORK_ERROR" | "PARSE_ERROR" | "NOT_FOUND" | "UNKNOWN";
  retryable: boolean;
}

// Cache for parsed data to avoid re-parsing
const dataCache = new Map<string, QuranAyah[]>();

export function useQuranData() {
  const [data, setData] = useState<QuranAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DataLoadError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [filters, setFilters] = useState<QuranFilters>({
    surah: undefined,
    searchTerm: "",
    placeOfRevelation: undefined,
    sortBy: "surah_no",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Parse CSV line handling quoted values with better error handling
  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  };

  // Parse CSV data with validation
  const parseCSV = useCallback((csvText: string): QuranAyah[] => {
    try {
      const lines = csvText.split("\n");
      if (lines.length < 2) {
        throw new Error("Invalid CSV format: insufficient data");
      }

      const headers = lines[0].split(",").map((h) => h.trim());
      const requiredHeaders = ["surah_no", "surah_name_en", "ayah_ar"];
      const missingHeaders = requiredHeaders.filter(
        (h) => !headers.includes(h)
      );

      if (missingHeaders.length > 0) {
        throw new Error(
          `Missing required headers: ${missingHeaders.join(", ")}`
        );
      }

      return lines
        .slice(1)
        .map((line, index) => {
          try {
            const values = parseCSVLine(line);
            const row: Record<string, string> = {};

            headers.forEach((header, i) => {
              row[header] = values[i] || "";
            });

            return {
              surah_no: parseInt(row.surah_no) || 0,
              surah_name_en: row.surah_name_en || "",
              surah_name_ar: row.surah_name_ar || "",
              surah_name_roman: row.surah_name_roman || "",
              ayah_no_surah: parseInt(row.ayah_no_surah) || 0,
              ayah_no_quran: parseInt(row.ayah_no_quran) || 0,
              ayah_ar: row.ayah_ar || "",
              ayah_en: row.ayah_en || "",
              hizb_quarter: parseInt(row.hizb_quarter) || 0,
              total_ayah_surah: parseInt(row.total_ayah_surah) || 0,
              total_ayah_quran: parseInt(row.total_ayah_quran) || 0,
              place_of_revelation: row.place_of_revelation || "",
              sajah_ayah: row.sajah_ayah === "TRUE",
              sajdah_no: row.sajdah_no || "",
              no_of_word_ayah: parseInt(row.no_of_word_ayah) || 0,
            };
          } catch (lineError) {
            console.warn(`Error parsing line ${index + 1}:`, lineError);
            return null;
          }
        })
        .filter(
          (ayah): ayah is QuranAyah => ayah !== null && ayah.surah_no > 0
        );
    } catch (parseError) {
      throw new Error(
        `CSV parsing failed: ${
          parseError instanceof Error ? parseError.message : "Unknown error"
        }`
      );
    }
  }, []);

  // Enhanced data loading with retry mechanism
  const loadData = useCallback(
    async (retryAttempt = 0): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        const cacheKey = "quran-data-csv";
        const cachedData = dataCache.get(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // Try to load from CSV first (has translations)
        try {
          const parsedData = parseCSV(quranDataCSV);

          // Cache the parsed data
          dataCache.set(cacheKey, parsedData);
          setData(parsedData);
          return;
        } catch (csvError) {
          console.warn("CSV parsing failed, trying JSON:", csvError);
        }

        // Fallback to JSON if CSV fails
        try {
          // Add empty translation field for JSON data
          const dataWithTranslations = (quranDataJSON as QuranAyah[]).map(
            (ayah: QuranAyah) => ({
              ...ayah,
              ayah_en: ayah.ayah_en || "", // Preserve existing translation or add empty
            })
          );

          // Cache the parsed data
          dataCache.set(cacheKey, dataWithTranslations);
          setData(dataWithTranslations);
        } catch {
          throw new Error(
            "Failed to load Quran data from both CSV and JSON sources"
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load data";
        const isRetryable =
          retryAttempt < 3 && errorMessage.includes("Failed to load");

        setError({
          message: errorMessage,
          code: isRetryable ? "NETWORK_ERROR" : "UNKNOWN",
          retryable: isRetryable,
        });

        if (isRetryable) {
          // Retry after exponential backoff
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            loadData(retryAttempt + 1);
          }, Math.pow(2, retryAttempt) * 1000);
        }
      } finally {
        setLoading(false);
      }
    },
    [parseCSV]
  );

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Retry function for user-initiated retries
  const retry = useCallback(() => {
    setRetryCount(0);
    loadData();
  }, [loadData]);

  // Filter and sort data with performance optimization
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ayah) =>
          ayah.surah_name_en.toLowerCase().includes(searchLower) ||
          ayah.surah_name_roman.toLowerCase().includes(searchLower) ||
          ayah.ayah_ar.includes(searchLower) ||
          ayah.ayah_en.toLowerCase().includes(searchLower)
      );
    }

    // Apply surah filter
    if (filters.surah) {
      filtered = filtered.filter((ayah) => ayah.surah_no === filters.surah);
    }

    // Apply place of revelation filter
    if (filters.placeOfRevelation) {
      filtered = filtered.filter(
        (ayah) => ayah.place_of_revelation === filters.placeOfRevelation
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "surah_name_en":
          return a.surah_name_en.localeCompare(b.surah_name_en);
        case "place_of_revelation":
          return a.place_of_revelation.localeCompare(b.place_of_revelation);
        case "surah_no":
        default:
          return a.surah_no - b.surah_no;
      }
    });

    return filtered;
  }, [data, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset current page if it's invalid after filtering
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // Get unique surahs for filter dropdown
  const uniqueSurahs = useMemo(() => {
    const surahs = [...new Set(data.map((ayah) => ayah.surah_no))].sort(
      (a, b) => a - b
    );
    return surahs.map((surahNo) => {
      const ayah = data.find((a) => a.surah_no === surahNo);
      return {
        number: surahNo,
        name: ayah?.surah_name_en || "",
        roman: ayah?.surah_name_roman || "",
      };
    });
  }, [data]);

  // Get unique places of revelation for filter dropdown
  const uniquePlaces = useMemo(() => {
    return [...new Set(data.map((ayah) => ayah.place_of_revelation))].sort();
  }, [data]);

  return {
    data: paginatedData,
    allData: data,
    loading,
    error,
    retry,
    retryCount,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    uniqueSurahs,
    uniquePlaces,
    totalAyahs: data.length,
    filteredCount: filteredData.length,
  };
}
