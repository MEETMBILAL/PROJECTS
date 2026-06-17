import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2C4A3E",
          light: "#3D6B5C",
          dark: "#1A2E25",
        },
        secondary: {
          DEFAULT: "#C4933F",
          light: "#DFB466",
        },
        accent: "#E8F0EE",
        surface: {
          DEFAULT: "#FAFAF8",
          alt: "#F3F1EC",
        },
        bsborder: "#E2DDD5",
        text: {
          primary: "#1C1C1A",
          secondary: "#6B6560",
          muted: "#9B9690",
        },
        success: "#4A7C59",
        warning: "#C4933F",
        error: "#C0392B",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
      },
      borderRadius: {
        xl: "0.875rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(28, 28, 26, 0.06), 0 1px 2px rgba(28, 28, 26, 0.04)",
        "card-hover": "0 8px 24px rgba(28, 28, 26, 0.10)",
      },
      aspectRatio: {
        cover: "2 / 3",
      },
    },
  },
  plugins: [],
};

export default config;
