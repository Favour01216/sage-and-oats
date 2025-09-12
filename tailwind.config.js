/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: {
          DEFAULT: "#2F5D45",
          dark: "#3E8E41",
        },
        accent: {
          DEFAULT: "#E3A857",
          dark: "#F1B563",
        },
        text: {
          DEFAULT: "#1F2937",
          dark: "#F3F4F6",
        },
        muted: {
          DEFAULT: "#6B7280",
          dark: "#9CA3AF",
        },
        background: {
          DEFAULT: "#FAFAF8",
          dark: "#0F172A",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#111827",
        },
        border: {
          DEFAULT: "#E5E7EB",
          dark: "#374151",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Newsreader", "Lora", "serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1400px",
        },
      },
    },
  },
  plugins: [],
};
