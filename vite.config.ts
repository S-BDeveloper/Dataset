import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Virtual module for lodash compatibility
const lodashVirtualModule = () => ({
  name: "lodash-virtual-module",
  resolveId(id: string) {
    if (id === "lodash/merge") {
      return "lodash.merge";
    }
    return null;
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), lodashVirtualModule()],
  resolve: {
    alias: {
      // Handle lodash import issues
      "lodash/merge": "lodash.merge",
      lodash: "lodash-es",
    },
    dedupe: ["lodash", "lodash-es"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          vendor: ["react", "react-dom", "react-router-dom"],
          // Separate chart libraries
          charts: [
            "@nivo/bar",
            "@nivo/core",
            "@nivo/geo",
            "@nivo/heatmap",
            "@nivo/line",
            "@nivo/pie",
            "@nivo/scatterplot",
          ],
          // Separate utility libraries
          utils: [
            "d3-cloud",
            "d3-scale",
            "d3-color",
            "d3-delaunay",
            "d3-interpolate",
            "d3-path",
            "d3-scale-chromatic",
            "d3-time",
            "d3-time-format",
          ],
        },
        // Optimize chunk sizes
        // chunkSizeWarningLimit: 1000, // Increase warning limit
      },
    },
    // Enable source maps for debugging
    sourcemap: true,
    // Optimize for production
    minify: "esbuild",
    // terserOptions: {
    //   compress: {
    //     drop_console: true, // Remove console.log in production
    //     drop_debugger: true,
    //   },
    // },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    exclude: ["@nivo/bar", "@nivo/core", "@nivo/geo"], // Exclude large chart libraries from pre-bundling
    esbuildOptions: {
      // Handle lodash import issues
      define: {
        global: "globalThis",
      },
    },
  },
});
