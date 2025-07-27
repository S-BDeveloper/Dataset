/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Custom colors that work with both light and dark modes
        stone: {
          50: "var(--stone-50, #fafaf9)",
          100: "var(--stone-100, #f5f5f4)",
          200: "var(--stone-200, #e7e5e4)",
          300: "var(--stone-300, #d6d3d1)",
          400: "var(--stone-400, #a8a29e)",
          500: "var(--stone-500, #78716c)",
          600: "var(--stone-600, #57534e)",
          700: "var(--stone-700, #44403c)",
          800: "var(--stone-800, #292524)",
          900: "var(--stone-900, #1c1917)",
        },
        green: {
          50: "var(--green-50, #f0fdf4)",
          100: "var(--green-100, #dcfce7)",
          500: "var(--green-500, #22c55e)",
          600: "var(--green-600, #16a34a)",
          700: "var(--green-700, #15803d)",
          800: "var(--green-800, #166534)",
        },
      },
    },
  },
  plugins: [],
};
