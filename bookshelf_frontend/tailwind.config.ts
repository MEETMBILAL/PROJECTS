import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
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
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(28, 28, 26, 0.06), 0 1px 2px rgba(28, 28, 26, 0.04)",
        "card-hover": "0 10px 30px rgba(28, 28, 26, 0.10)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
