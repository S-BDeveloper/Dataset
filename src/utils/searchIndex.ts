// Enhanced search indexing with proper TypeScript types
import type { QuranicMiracle, QuranAyah, HadithEntry } from "../types/Types";

// Search index interface
interface SearchIndex {
  [key: string]: {
    type: "miracle" | "quran" | "hadith";
    id: string;
    title: string;
    content: string;
    score: number;
    highlights: string[];
  }[];
}

// Search result interface
interface SearchResult {
  type: "miracle" | "quran" | "hadith";
  id: string;
  title: string;
  content: string;
  score: number;
  highlights: string[];
  data: QuranicMiracle | QuranAyah | HadithEntry;
}

// Debounced function type
type DebouncedFunction<T extends (...args: unknown[]) => unknown> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

// Global search index
let searchIndex: SearchIndex = {};

// Enhanced tokenization with Arabic support
function tokenizeText(text: string): string[] {
  if (!text) return [];

  // Remove diacritics and normalize Arabic text
  const normalizedText = text
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, "") // Remove Arabic diacritics
    .replace(/[^\w\s\u0600-\u06FF]/g, " "); // Keep Arabic characters

  // Split by word boundaries, supporting Arabic and English
  return normalizedText
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .map((token) => token.trim());
}

// Create search index for Quran verses with Arabic support
function indexQuranData(quranData: QuranAyah[]): void {
  quranData.forEach((ayah) => {
    const tokens = [
      ...tokenizeText(ayah.surah_name_en),
      ...tokenizeText(ayah.surah_name_roman),
      ...tokenizeText(ayah.ayah_ar),
      ...tokenizeText(ayah.ayah_en),
      ...tokenizeText(ayah.place_of_revelation),
    ];

    tokens.forEach((token) => {
      if (!searchIndex[token]) {
        searchIndex[token] = [];
      }

      searchIndex[token].push({
        type: "quran",
        id: `${ayah.surah_no}:${ayah.ayah_no_surah}`,
        title: `${ayah.surah_name_en} ${ayah.ayah_no_surah}`,
        content: ayah.ayah_en,
        score: 1,
        highlights: [],
      });
    });
  });
}

// Create search index for Hadith data
function indexHadithData(hadithData: HadithEntry[]): void {
  hadithData.forEach((hadith) => {
    const tokens = [
      ...tokenizeText(hadith.text),
      ...tokenizeText(hadith.arabic || ""),
      ...tokenizeText(hadith.translation || ""),
      ...tokenizeText(hadith.book),
      ...tokenizeText(hadith.chapter),
      ...tokenizeText(hadith.narrator),
    ];

    tokens.forEach((token) => {
      if (!searchIndex[token]) {
        searchIndex[token] = [];
      }

      searchIndex[token].push({
        type: "hadith",
        id: hadith.id,
        title: `Hadith ${hadith.number}`,
        content: hadith.text,
        score: 1,
        highlights: [],
      });
    });
  });
}

// Create search index for Miracle data
function indexMiracleData(miracleData: QuranicMiracle[]): void {
  miracleData.forEach((miracle) => {
    const tokens = [
      ...tokenizeText(miracle.title),
      ...tokenizeText(miracle.notes),
      ...tokenizeText(miracle.description || ""),
      ...tokenizeText(miracle.type),
      ...tokenizeText(miracle.fulfillmentStatus || ""),
      ...tokenizeText(miracle.prophecyCategory || ""),
    ];

    tokens.forEach((token) => {
      if (!searchIndex[token]) {
        searchIndex[token] = [];
      }

      searchIndex[token].push({
        type: "miracle",
        id: `${miracle.type}-${miracle.title}`,
        title: miracle.title,
        content: miracle.notes,
        score: 1,
        highlights: [],
      });
    });
  });
}

// Enhanced text tokenization with Arabic support
function tokenizeSearchQuery(query: string): string[] {
  if (!query) return [];

  // Remove diacritics and normalize Arabic text
  const normalizedQuery = query
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, "") // Remove Arabic diacritics
    .replace(/[^\w\s\u0600-\u06FF]/g, " "); // Keep Arabic characters

  // Split by word boundaries, supporting Arabic and English
  return normalizedQuery
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .map((token) => token.trim());
}

// Find highlights in text
function findHighlights(queryTokens: string[], text: string): string[] {
  if (!text) return [];

  const highlights: string[] = [];
  const normalizedText = text.toLowerCase();

  queryTokens.forEach((token) => {
    const index = normalizedText.indexOf(token.toLowerCase());
    if (index !== -1) {
      const start = Math.max(0, index - 20);
      const end = Math.min(text.length, index + token.length + 20);
      const highlight = text.substring(start, end);
      if (!highlights.includes(highlight)) {
        highlights.push(highlight);
      }
    }
  });

  return highlights.slice(0, 3); // Limit to 3 highlights
}

// Debounce function with proper types
export function debounceSearch<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): DebouncedFunction<T> {
  let timeoutId: NodeJS.Timeout;

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced as DebouncedFunction<T>;
}

// Unified search function
export function unifiedSearch(
  query: string,
  miracleData: QuranicMiracle[],
  quranData: QuranAyah[],
  hadithData: HadithEntry[]
): SearchResult[] {
  if (!query.trim()) return [];

  // Build search index if not already built
  if (Object.keys(searchIndex).length === 0) {
    indexMiracleData(miracleData);
    indexQuranData(quranData);
    indexHadithData(hadithData);
  }

  const queryTokens = tokenizeSearchQuery(query);
  const results: SearchResult[] = [];

  // Search through index
  queryTokens.forEach((token) => {
    const matches = searchIndex[token] || [];
    matches.forEach((match) => {
      const existingResult = results.find((r) => r.id === match.id);
      if (existingResult) {
        existingResult.score += match.score;
      } else {
        // Find the actual data object
        let data: QuranicMiracle | QuranAyah | HadithEntry;
        let content = "";

        switch (match.type) {
          case "miracle": {
            data = miracleData.find(
              (m) => `${m.type}-${m.title}` === match.id
            ) as QuranicMiracle;
            content = data?.notes || "";
            break;
          }
          case "quran": {
            const [surah, ayah] = match.id.split(":");
            data = quranData.find(
              (q) =>
                q.surah_no === parseInt(surah) &&
                q.ayah_no_surah === parseInt(ayah)
            ) as QuranAyah;
            content = data?.ayah_en || "";
            break;
          }
          case "hadith": {
            data = hadithData.find((h) => h.id === match.id) as HadithEntry;
            content = data?.text || "";
            break;
          }
        }

        if (data) {
          results.push({
            ...match,
            content,
            data,
            highlights: findHighlights(queryTokens, content),
          });
        }
      }
    });
  });

  // Sort by relevance score
  return results.sort((a, b) => b.score - a.score).slice(0, 50); // Limit results
}

// Clear search index
export function clearSearchIndex(): void {
  searchIndex = {};
}

// Get search index size
export function getSearchIndexSize(): number {
  return Object.keys(searchIndex).length;
}
