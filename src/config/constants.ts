// Application constants and configuration
export const APP_CONFIG = {
  name: "Authentic Islamic Knowledge",
  version: "1.0.0",
  description:
    "Discover the miraculous signs of Allah through Quranic verses, Sahih Bukhari's hadith collection, and scientific discoveries. Explore cross-references between different Islamic sources to deepen your understanding",
} as const;

export const PAGINATION = {
  defaultPageSize: 8,
  maxPageSize: 50,
  maxVisiblePages: 5,
} as const;

export const SEARCH = {
  debounceDelay: 300,
  maxQueryLength: 500,
  maxSuggestions: 8,
} as const;

export const PERFORMANCE = {
  loadingDelay: 1000,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  maxRetries: 3,
} as const;

export const SECURITY = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: [
    "text/plain",
    "text/csv",
    "application/json",
    "application/pdf",
  ],
  rateLimit: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
} as const;

export const LANGUAGES = {
  supported: ["en", "ar", "ur", "tr", "fr", "es", "de"] as const,
  default: "en" as const,
} as const;

export const THEMES = {
  light: "light",
  dark: "dark",
} as const;

export const ROUTES = {
  home: "/",
  favorites: "/favorites",
  submit: "/submit-discovery",
  admin: "/admin",
  login: "/login",
  signup: "/signup",
  profile: "/profile",
} as const;

export const API_ENDPOINTS = {
  IslamicData: "/api/islamicData",
  quran: "/api/quran",
  hadith: "/api/hadith",
  favorites: "/api/favorites",
} as const;
