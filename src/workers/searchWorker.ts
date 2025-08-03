// Web Worker for handling heavy search operations
// This runs in a separate thread to prevent UI blocking

interface SearchMessage {
  data: unknown[];
  searchTerm: string;
  searchFields: string[];
}

interface SearchResult {
  data: unknown[];
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
  data: unknown[],
  searchTerm: string,
  searchFields: string[]
): unknown[] {
  if (!searchTerm.trim()) return data;

  const term = searchTerm.toLowerCase();

  return data.filter((item) =>
    searchFields.some((field) => {
      const value = (item as Record<string, unknown>)[field];
      if (!value) return false;

      const stringValue = String(value).toLowerCase();
      return stringValue.includes(term);
    })
  );
}