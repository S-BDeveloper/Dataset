import { useState, useEffect, useMemo, useCallback } from "react";
import type { QuranAyah, QuranFilters } from "../types/Types";

export function useQuranData() {
  const [data, setData] = useState<QuranAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QuranFilters>({
    surah: undefined,
    searchTerm: "",
    placeOfRevelation: undefined,
    sortBy: "surah_no",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Parse CSV line handling quoted values
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

  // Parse CSV data
  const parseCSV = useCallback((csvText: string): QuranAyah[] => {
    const lines = csvText.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    return lines
      .slice(1)
      .map((line) => {
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
      })
      .filter((ayah) => ayah.surah_no > 0); // Filter out invalid entries
  }, []);

  // Load data from CSV file
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to load from CSV first (has translations)
        const csvResponse = await fetch("/src/data/The Quran Dataset.csv");
        if (csvResponse.ok) {
          const csvText = await csvResponse.text();
          const parsedData = parseCSV(csvText);
          setData(parsedData);
          return;
        }

        // Fallback to JSON if CSV fails
        const jsonResponse = await fetch("/src/data/The Quran Dataset.json");
        if (jsonResponse.ok) {
          const jsonData = await jsonResponse.json();
          // Add empty translation field for JSON data
          const dataWithTranslations = jsonData.map(
            (ayah: Record<string, unknown>) => ({
              ...ayah,
              ayah_en: "", // No translation available in JSON
            })
          );
          setData(dataWithTranslations);
        } else {
          throw new Error("Failed to load Quran data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [parseCSV]);

  // Filter and sort data
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
  }, [totalPages, currentPage, setCurrentPage]);

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
