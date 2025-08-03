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
          // Separate utility libraries
          utils: ["lodash", "lodash-es"],
        },
      },
    },
    sourcemap: true,
    minify: "esbuild",
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
