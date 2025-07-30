// Web Worker for handling heavy search operations
// This runs in a separate thread to prevent UI blocking

interface SearchMessage {
  data: any[];
  searchTerm: string;
  searchFields: string[];
}

interface SearchResult {
  data: any[];
  totalFound: number;
  searchTime: number;
}

self.onmessage = (event: MessageEvent<SearchMessage>) => {
  const { data, searchTerm, searchFields } = event.data;
  const startTime = performance.now();

  try {
    const results = performSearch(data, searchTerm, searchFields);
    const searchTime = performance.now() - startTime;

    const result: SearchResult = {
      data: results,
      totalFound: results.length,
      searchTime,
    };

    self.postMessage(result);
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : "Search failed",
      data: [],
      totalFound: 0,
      searchTime: 0,
    });
  }
};

function performSearch(
  data: any[],
  searchTerm: string,
  searchFields: string[]
): any[] {
  if (!searchTerm.trim()) return data;

  const term = searchTerm.toLowerCase();

  return data.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      if (!value) return false;

      const stringValue = String(value).toLowerCase();
      return stringValue.includes(term);
    })
  );
}

// Advanced search with fuzzy matching (available for future use)
// function fuzzySearch(
//   data: any[],
//   searchTerm: string,
//   searchFields: string[]
// ): any[] {
//   const term = searchTerm.toLowerCase();

//   return data.filter((item) => {
//     return searchFields.some((field) => {
//       const value = item[field];
//       if (!value) return false;

//       const stringValue = String(value).toLowerCase();

//       // Exact match gets highest priority
//       if (stringValue.includes(term)) return true;

//       // Fuzzy matching for typos
//       const words = term.split(" ");
//       return words.every(
//         (word) =>
//           stringValue.includes(word) ||
//           calculateSimilarity(stringValue, word) > 0.7
//       );
//     });
//   });
// }

// Simple similarity calculation (available for future use)
// function calculateSimilarity(str1: string, str2: string): number {
//   const longer = str1.length > str2.length ? str1 : str2;
//   const shorter = str1.length > str2.length ? str2 : str1;

//   if (longer.length === 0) return 1.0;

//   const editDistance = levenshteinDistance(longer, shorter);
//   return (longer.length - editDistance) / longer.length;
// }

// Levenshtein distance for fuzzy matching (available for future use)
// function levenshteinDistance(str1: string, str2: string): number {
//   const matrix = Array(str2.length + 1)
//     .fill(null)
//     .map(() => Array(str1.length + 1).fill(null));

//   for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
//   for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

//   for (let j = 1; j <= str2.length; j++) {
//     for (let i = 1; i <= str1.length; i++) {
//       const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
//       matrix[j][i] = Math.min(
//         matrix[j][i - 1] + 1, // deletion
//         matrix[j - 1][i] + 1, // insertion
//         matrix[j - 1][i - 1] + indicator // substitution
//       );
//     }
//   }

//   return matrix[str2.length][str1.length];
// }

export {};
