// Advanced data service for handling large Quran and Hadith datasets
// import type { QuranAyah, HadithEntry, IslamicData } from "../types/Types";

interface DataChunk<T> {
  data: T[];
  startIndex: number;
  endIndex: number;
  totalCount: number;
}

interface CacheEntry<T> {
  data: T[];
  timestamp: number;
  expiresAt: number;
}

export class DataService {
  private static instance: DataService;
  private cache = new Map<string, CacheEntry<unknown>>();
  private chunkSize = 1000; // Process data in chunks
  private cacheExpiry = 30 * 60 * 1000; // 30 minutes

  private constructor() {}

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Lazy loading with chunking for large datasets
  async loadDataInChunks<T>(
    data: T[],
    startIndex: number = 0,
    endIndex?: number
  ): Promise<DataChunk<T>> {
    const actualEndIndex =
      endIndex || Math.min(startIndex + this.chunkSize, data.length);

    return {
      data: data.slice(startIndex, actualEndIndex),
      startIndex,
      endIndex: actualEndIndex,
      totalCount: data.length,
    };
  }

  // Efficient filtering with debouncing
  debounceFilter<T>(
    data: T[],
    filterFn: (item: T) => boolean,
    delay: number = 300
  ): Promise<T[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = data.filter(filterFn);
        resolve(filtered);
      }, delay);
    });
  }

  // Virtual scrolling support
  getVisibleItems<T>(
    data: T[],
    scrollTop: number,
    containerHeight: number,
    itemHeight: number
  ): T[] {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      data.length
    );

    return data.slice(startIndex, endIndex);
  }

  // Caching with expiration
  setCache<T>(key: string, data: T[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.cacheExpiry,
    });
  }

  getCache<T>(key: string): T[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T[];
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Search optimization for large datasets
  async searchWithIndex<T>(
    data: T[],
    searchTerm: string,
    searchFields: (keyof T)[]
  ): Promise<T[]> {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();

    // Use Web Workers for heavy search operations
    if (data.length > 10000) {
      return this.searchWithWorker(data, term, searchFields);
    }

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(term);
      })
    );
  }

  private async searchWithWorker<T>(
    data: T[],
    searchTerm: string,
    searchFields: (keyof T)[]
  ): Promise<T[]> {
    // Implementation for Web Worker search
    // This would move heavy search to a background thread
    return new Promise((resolve) => {
      const worker = new Worker(
        new URL("../workers/searchWorker.ts", import.meta.url)
      );

      worker.postMessage({
        data,
        searchTerm,
        searchFields,
      });

      worker.onmessage = (event) => {
        resolve(event.data);
        worker.terminate();
      };
    });
  }

  // Memory management for large datasets
  optimizeMemoryUsage<T extends object>(data: T[]): T[] {
    // Remove unnecessary properties for display
    return data.map((item) => {
      const optimized = { ...item };

      // Keep only essential properties for rendering
      if ("content" in optimized && typeof optimized.content === "string") {
        optimized.content = optimized.content.substring(0, 500) + "...";
      }

      return optimized;
    });
  }

  // Progressive loading for better UX
  async loadProgressively<T>(
    data: T[],
    onProgress: (loaded: number, total: number) => void
  ): Promise<T[]> {
    const chunks = [];
    const total = data.length;

    for (let i = 0; i < total; i += this.chunkSize) {
      const chunk = data.slice(i, i + this.chunkSize);
      chunks.push(chunk);

      onProgress(Math.min(i + this.chunkSize, total), total);

      // Yield control to prevent blocking UI
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    return chunks.flat();
  }
}

// Export singleton instance
export const dataService = DataService.getInstance();
