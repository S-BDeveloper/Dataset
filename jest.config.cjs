module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost",
    customExportConditions: ["node", "node-addons"],
    pretendToBeVisual: true,
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Handle static assets
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__mocks__/fileMock.js",
    // Handle JSON imports
    "\\.json$": "<rootDir>/src/__mocks__/jsonMock.js",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{ts,tsx}",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/**/__tests__/**",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.spec.{ts,tsx}",
    "!src/setupTests.ts",
    "!src/**/index.ts",
    "!src/**/types/**",
    "!src/**/mocks/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Specific thresholds for critical files
    "./src/hooks/": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    "./src/utils/": {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    "./src/contexts/": {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        // Enable source maps for better debugging
        diagnostics: {
          ignoreCodes: [1343], // Ignore dynamic imports
        },
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/cypress/"],
  // Performance optimizations
  maxWorkers: "50%",
  workerIdleMemoryLimit: "512MB",
  // Timeout settings
  testTimeout: 10000,
  // Coverage reporting
  coverageReporters: [
    "text",
    "text-summary",
    "lcov",
    "html",
    "json",
    "json-summary",
  ],
  // Coverage directory
  coverageDirectory: "coverage",
  // Collect coverage from specific directories
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/**/__tests__/**",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.spec.{ts,tsx}",
    "!src/setupTests.ts",
    "!src/**/index.ts",
    "!src/**/types/**",
    "!src/**/mocks/**",
  ],

  // Clear mocks between tests
  clearMocks: true,
  // Restore mocks between tests
  restoreMocks: true,
  // Reset modules between tests
  resetModules: true,
};
