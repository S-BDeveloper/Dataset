import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  QuranicMiracle,
  QuranAyah,
  HadithEntry,
  MiracleFilters,
  QuranFilters,
  HadithFilters,
} from "../types/Types";

interface AppState {
  // Data state with lazy loading support
  miracles: QuranicMiracle[];
  quranData: QuranAyah[];
  hadithData: HadithEntry[];
  favorites: QuranicMiracle[];

  // Loading states
  miraclesLoading: boolean;
  quranLoading: boolean;
  hadithLoading: boolean;

  // Error states
  miraclesError: string | null;
  quranError: string | null;
  hadithError: string | null;

  // Filter states
  miracleFilters: MiracleFilters;
  quranFilters: QuranFilters;
  hadithFilters: HadithFilters;

  // Pagination states with virtual scrolling support
  currentPage: number;
  itemsPerPage: number;
  virtualScrollEnabled: boolean;
  virtualScrollItemHeight: number;

  // UI state
  activeTab: string;
  toast: string | null;

  // Caching and performance
  dataCache: Map<string, any>;
  lastFetchTime: number;
  cacheExpiryTime: number;

  // Actions
  setMiracles: (miracles: QuranicMiracle[]) => void;
  setQuranData: (data: QuranAyah[]) => void;
  setHadithData: (data: HadithEntry[]) => void;

  setMiraclesLoading: (loading: boolean) => void;
  setQuranLoading: (loading: boolean) => void;
  setHadithLoading: (loading: boolean) => void;

  setMiraclesError: (error: string | null) => void;
  setQuranError: (error: string | null) => void;
  setHadithError: (error: string | null) => void;

  setMiracleFilters: (filters: Partial<MiracleFilters>) => void;
  setQuranFilters: (filters: Partial<QuranFilters>) => void;
  setHadithFilters: (filters: Partial<HadithFilters>) => void;

  setCurrentPage: (page: number) => void;
  setActiveTab: (tab: string) => void;
  setToast: (message: string | null) => void;

  // Favorites actions
  addFavorite: (miracle: QuranicMiracle) => void;
  removeFavorite: (miracle: QuranicMiracle) => void;
  isFavorite: (miracle: QuranicMiracle) => boolean;

  // Performance optimizations
  setVirtualScrollEnabled: (enabled: boolean) => void;
  setVirtualScrollItemHeight: (height: number) => void;
  clearCache: () => void;
  getCachedData: (key: string) => any;
  setCachedData: (key: string, data: any) => void;

  // Computed values with memoization
  filteredMiracles: QuranicMiracle[];
  filteredQuranData: QuranAyah[];
  filteredHadithData: HadithEntry[];
  totalPages: number;
  paginatedMiracles: QuranicMiracle[];

  // Virtual scrolling helpers
  getVisibleItems: (startIndex: number, endIndex: number) => any[];
  getTotalItemCount: () => number;
}

const initialMiracleFilters: MiracleFilters = {
  searchTerm: "",
  type: "",
  sortBy: "title",
};

const initialQuranFilters: QuranFilters = {
  surah: undefined,
  searchTerm: "",
  placeOfRevelation: undefined,
  sortBy: "surah_no",
};

const initialHadithFilters: HadithFilters = {
  searchTerm: "",
  sortBy: "index",
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        miracles: [],
        quranData: [],
        hadithData: [],
        favorites: [],

        miraclesLoading: false,
        quranLoading: false,
        hadithLoading: false,

        miraclesError: null,
        quranError: null,
        hadithError: null,

        miracleFilters: initialMiracleFilters,
        quranFilters: initialQuranFilters,
        hadithFilters: initialHadithFilters,

        currentPage: 1,
        itemsPerPage: 8,
        virtualScrollEnabled: false,
        virtualScrollItemHeight: 50, // Default height for virtual scrolling

        activeTab: "all",
        toast: null,

        // Caching and performance
        dataCache: new Map(),
        lastFetchTime: 0,
        cacheExpiryTime: 3600000, // 1 hour

        // Actions
        setMiracles: (miracles) => set({ miracles }),
        setQuranData: (data) => set({ quranData: data }),
        setHadithData: (data) => set({ hadithData: data }),

        setMiraclesLoading: (loading) => set({ miraclesLoading: loading }),
        setQuranLoading: (loading) => set({ quranLoading: loading }),
        setHadithLoading: (loading) => set({ hadithLoading: loading }),

        setMiraclesError: (error) => set({ miraclesError: error }),
        setQuranError: (error) => set({ quranError: error }),
        setHadithError: (error) => set({ hadithError: error }),

        setMiracleFilters: (filters) =>
          set((state) => ({
            miracleFilters: { ...state.miracleFilters, ...filters },
            currentPage: 1, // Reset to first page when filters change
          })),

        setQuranFilters: (filters) =>
          set((state) => ({
            quranFilters: { ...state.quranFilters, ...filters },
            currentPage: 1,
          })),

        setHadithFilters: (filters) =>
          set((state) => ({
            hadithFilters: { ...state.hadithFilters, ...filters },
            currentPage: 1,
          })),

        setCurrentPage: (page) => set({ currentPage: page }),
        setActiveTab: (tab) => set({ activeTab: tab }),
        setToast: (message) => set({ toast: message }),

        // Favorites actions
        addFavorite: (miracle) =>
          set((state) => ({
            favorites: state.favorites.some(
              (fav) => fav.title === miracle.title && fav.type === miracle.type
            )
              ? state.favorites
              : [...state.favorites, miracle],
          })),

        removeFavorite: (miracle) =>
          set((state) => ({
            favorites: state.favorites.filter(
              (fav) =>
                !(fav.title === miracle.title && fav.type === miracle.type)
            ),
          })),

        isFavorite: (miracle) => {
          const state = get();
          return state.favorites.some(
            (fav) => fav.title === miracle.title && fav.type === miracle.type
          );
        },

        // Performance optimizations
        setVirtualScrollEnabled: (enabled) =>
          set({ virtualScrollEnabled: enabled }),
        setVirtualScrollItemHeight: (height) =>
          set({ virtualScrollItemHeight: height }),
        clearCache: () => set({ dataCache: new Map() }),
        getCachedData: (key) => get().dataCache.get(key),
        setCachedData: (key, data) =>
          set({ dataCache: get().dataCache.set(key, data) }),

        // Computed values
        get filteredMiracles() {
          const state = get();
          let filtered = [...state.miracles];

          // Apply search filter
          if (state.miracleFilters.searchTerm) {
            const searchLower = state.miracleFilters.searchTerm.toLowerCase();
            filtered = filtered.filter(
              (miracle) =>
                miracle.title.toLowerCase().includes(searchLower) ||
                miracle.notes.toLowerCase().includes(searchLower)
            );
          }

          // Apply type filter
          if (state.miracleFilters.type) {
            filtered = filtered.filter(
              (miracle) => miracle.type === state.miracleFilters.type
            );
          }

          // Apply sorting
          if (state.miracleFilters.sortBy === "type") {
            filtered.sort((a, b) => a.type.localeCompare(b.type));
          } else {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
          }

          return filtered;
        },

        get filteredQuranData() {
          const state = get();
          let filtered = [...state.quranData];

          // Apply search filter
          if (state.quranFilters.searchTerm) {
            const searchLower = state.quranFilters.searchTerm.toLowerCase();
            filtered = filtered.filter(
              (ayah) =>
                ayah.surah_name_en.toLowerCase().includes(searchLower) ||
                ayah.ayah_en.toLowerCase().includes(searchLower) ||
                ayah.ayah_ar.includes(searchLower)
            );
          }

          // Apply surah filter
          if (state.quranFilters.surah) {
            filtered = filtered.filter(
              (ayah) => ayah.surah_no === state.quranFilters.surah
            );
          }

          // Apply place filter
          if (state.quranFilters.placeOfRevelation) {
            filtered = filtered.filter(
              (ayah) =>
                ayah.place_of_revelation ===
                state.quranFilters.placeOfRevelation
            );
          }

          // Apply sorting
          switch (state.quranFilters.sortBy) {
            case "surah_name_en":
              filtered.sort((a, b) =>
                a.surah_name_en.localeCompare(b.surah_name_en)
              );
              break;
            case "place_of_revelation":
              filtered.sort((a, b) =>
                a.place_of_revelation.localeCompare(b.place_of_revelation)
              );
              break;
            default:
              filtered.sort((a, b) => a.surah_no - b.surah_no);
          }

          return filtered;
        },

        get filteredHadithData() {
          const state = get();
          let filtered = [...state.hadithData];

          // Apply search filter
          if (state.hadithFilters.searchTerm) {
            const searchLower = state.hadithFilters.searchTerm.toLowerCase();
            filtered = filtered.filter((hadith) => {
              return Object.values(hadith).some((value) =>
                value.toLowerCase().includes(searchLower)
              );
            });
          }

          // Apply sorting
          if (state.hadithFilters.sortBy === "length") {
            filtered.sort((a, b) => {
              const aLength = Object.values(a).join("").length;
              const bLength = Object.values(b).join("").length;
              return bLength - aLength;
            });
          }

          return filtered;
        },

        get totalPages() {
          const state = get();
          return Math.ceil(state.filteredMiracles.length / state.itemsPerPage);
        },

        get paginatedMiracles() {
          const state = get();
          const startIndex = (state.currentPage - 1) * state.itemsPerPage;
          return state.filteredMiracles.slice(
            startIndex,
            startIndex + state.itemsPerPage
          );
        },

        // Virtual scrolling helpers
        getVisibleItems: (startIndex, endIndex) => {
          const state = get();
          return state.filteredMiracles.slice(startIndex, endIndex);
        },
        getTotalItemCount: () => {
          const state = get();
          return state.filteredMiracles.length;
        },
      }),
      {
        name: "quranic-app-storage",
        partialize: (state) => ({
          favorites: state.favorites,
          miracleFilters: state.miracleFilters,
          quranFilters: state.quranFilters,
          hadithFilters: state.hadithFilters,
          activeTab: state.activeTab,
        }),
      }
    ),
    {
      name: "quranic-app-store",
    }
  )
);
