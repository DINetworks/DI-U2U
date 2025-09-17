import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      dark: {
        colors: {
          background: {
            DEFAULT: "#0a0a0a",
            50: "#1a1a1a",
            100: "#2a2a2a",
            200: "#3a3a3a",
            300: "#4a4a4a",
            400: "#5a5a5a",
            500: "#6a6a6a",
            600: "#7a7a7a",
            700: "#8a8a8a",
            800: "#9a9a9a",
            900: "#aaaaaa",
          },
          foreground: {
            DEFAULT: "#ffffff",
            50: "#f8f8f8",
            100: "#f0f0f0",
            200: "#e0e0e0",
            300: "#d0d0d0",
            400: "#c0c0c0",
            500: "#b0b0b0",
            600: "#a0a0a0",
            700: "#909090",
            800: "#808080",
            900: "#707070",
          },
          default: {
            50: "#0f0f0f",
            100: "#1f1f1f",
            200: "#2f2f2f",
            300: "#3f3f3f",
            400: "#4f4f4f",
            500: "#5f5f5f",
            600: "#6f6f6f",
            700: "#7f7f7f",
            800: "#8f8f8f",
            900: "#9f9f9f",
            DEFAULT: "#2f2f2fcc",
            foreground: "#ffffff",
          }
        },
      },
    },
  })],
}

export default config;