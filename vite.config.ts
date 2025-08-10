import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning limit and enable compression
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and loading
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["react-router-dom"],

          // Feature chunks - split by functionality
          "search-core": [
            "./src/components/features/search/AdvancedSearchDashboard.tsx",
          ],
          "search-results": [
            "./src/components/features/search/SearchResults.tsx",
          ],
          "search-filters": [
            "./src/components/features/search/AdvancedFilterPanel.tsx",
          ],
          "charts-core": [
            "./src/components/features/charts/ChartsDashboard.tsx",
          ],
          "charts-pie": [
            "./src/components/features/charts/CategoryPieChart.tsx",
          ],
          "charts-status": [
            "./src/components/features/charts/PropheticStatusChart.tsx",
          ],
          "charts-map": [
            "./src/components/features/charts/SpatialProphecyMap.tsx",
          ],
          "auth-login": ["./src/components/features/auth/Login.tsx"],
          "auth-signup": ["./src/components/features/auth/Signup.tsx"],

          // Data chunks - split by source with size optimization
          "data-islamic": ["./src/data/islamic_data.json"],
          "hooks-islamic": ["./src/hooks/useIslamicData.ts"],
          "hooks-quran": ["./src/hooks/useQuranData.ts"],
          "hooks-hadith": ["./src/hooks/useHadithData.ts"],

          // Large vendor chunks
          "pdf-vendor": ["jspdf", "html2canvas"],
          "ui-vendor": [
            "@nivo/core",
            "@nivo/pie",
            "@nivo/bar",
            "@nivo/line",
            "@nivo/geo",
          ],
          "utils-vendor": ["lodash", "date-fns"],
        },
        // Optimize chunk naming
        chunkFileNames: () => `js/[name]-[hash].js`,
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") || [];
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name || "")) {
            return `css/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: false,
    // Minify options
    minify: "esbuild",
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@nivo/core",
      "@nivo/pie",
      "@nivo/bar",
      "@nivo/line",
    ],
  },
  // Server options for development
  server: {
    port: 3000,
    open: true,
    headers: {
      // Prevent caching of service worker and manifest
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  },
  // Preview server options (for npm run preview)
  preview: {
    port: 4173,
    headers: {
      // Prevent caching of service worker and manifest in preview
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  },
});
