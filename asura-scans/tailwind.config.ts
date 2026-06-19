import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#913FE2",
          "purple-light": "#B06EF5",
          dark: "#0F0F0F",
          card: "#1A1A1A",
          "card-hover": "#222222",
          surface: "#2A2A2A",
          nav: "#111111",
          "text-primary": "#FFFFFF",
          "text-secondary": "#A0A0A0",
          muted: "#666666",
          gold: "#FFD700",
          "badge-new": "#22C55E",
          "badge-hot": "#EF4444",
          "badge-completed": "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        cover: "8px",
        modal: "12px",
      },
      boxShadow: {
        "purple-glow": "0 0 0 2px #913FE2",
        nav: "0 4px 20px rgba(0, 0, 0, 0.5)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease-in-out",
      },
      aspectRatio: {
        cover: "3 / 4",
      },
    },
  },
  plugins: [],
};

export default config;
