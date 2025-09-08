import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2F5D45", 600: "#1F3F2F" },
        accent: { DEFAULT: "#E3A857", 600: "#C9882F" },
        oat: "#FAFAF8",
        surface: "#FFFFFF",
        border: "#E5E7EB",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
