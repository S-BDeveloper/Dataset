import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Security plugin for development
const securityHeaders = () => {
  return {
    name: "security-headers",
    configureServer(server: any) {
      server.middlewares.use((_req: any, res: any, next: any) => {
        // Security headers for development
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "SAMEORIGIN");
        res.setHeader("X-XSS-Protection", "1; mode=block");
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        res.setHeader(
          "Permissions-Policy",
          "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), autoplay=(), encrypted-media=(), fullscreen=(self), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), web-share=(), xr-spatial-tracking=()"
        );
        res.setHeader(
          "Strict-Transport-Security",
          "max-age=31536000; includeSubDomains; preload"
        );
        res.setHeader("X-Download-Options", "noopen");
        res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

        // Content Security Policy
        const csp = [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com blob:",
          "worker-src 'self' blob:",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https: blob:",
          "connect-src 'self' https://api.github.com https://www.google-analytics.com https://fonts.googleapis.com https://fonts.gstatic.com",
          "frame-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'self'",
          "upgrade-insecure-requests",
        ].join("; ");

        res.setHeader("Content-Security-Policy", csp);

        next();
      });
    },
  };
};

export default defineConfig({
  plugins: [react(), securityHeaders()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    // https: false, // Set to true for HTTPS in development
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Disable source maps for security
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          charts: [
            "@nivo/bar",
            "@nivo/core",
            "@nivo/geo",
            "@nivo/line",
            "@nivo/pie",
          ],
        },
      },
    },
    // Security optimizations
    minify: "terser",
  },
  // Security optimizations
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
  },
});
