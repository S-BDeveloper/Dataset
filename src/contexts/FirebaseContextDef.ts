import { createContext } from "react";
import type {
  User,
  IslamicData,
  QuranAyah,
  HadithEntry,
  UnifiedSearchResult,
  FilterState,
} from "../types/Types";

// Firebase context interface
export interface FirebaseContextType {
  // Firebase availability
  isFirebaseAvailable: boolean;
  isLoading: boolean;
  error: string | null;

  // Authentication
  currentUser: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
  updateUserPreferences: (preferences: User["preferences"]) => Promise<void>;
  isEmailVerified: boolean;

  // Data management
  islamicData: IslamicData[];
  quranData: QuranAyah[];
  hadithData: HadithEntry[];
  loadIslamicData: (filters?: Partial<FilterState>) => Promise<void>;
  loadQuranData: (filters?: Partial<FilterState>) => Promise<void>;
  loadHadithData: (filters?: Partial<FilterState>) => Promise<void>;

  // Search functionality
  searchResults: UnifiedSearchResult[];
  searchQuery: string;
  performSearch: (query: string, filters: FilterState) => Promise<void>;
  getSearchSuggestions: (query: string) => Promise<string[]>;
  getPopularSearches: () => Promise<Array<{ query: string; count: number }>>;
  clearSearchResults: () => void;

  // Favorites
  favorites: Array<{ itemId: string; itemType: string }>;
  addToFavorites: (itemId: string, itemType: string) => Promise<void>;
  removeFromFavorites: (itemId: string) => Promise<void>;
  isFavorited: (itemId: string) => boolean;

  // Data migration
  migrationStatus: {
    islamicDataCount: number;
    quranDataCount: number;
    hadithDataCount: number;
    needsMigration: boolean;
  };
  performMigration: (
    islamicData: IslamicData[],
    quranData: QuranAyah[],
    hadithData: HadithEntry[],
    onProgress?: (progress: {
      step: string;
      current: number;
      total: number;
      percentage: number;
    }) => void
  ) => Promise<{
    success: boolean;
    totalMigrated: number;
    totalErrors: number;
  }>;

  // Real-time listeners
  startRealtimeListeners: () => void;
  stopRealtimeListeners: () => void;
}

// Create context
export const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);
