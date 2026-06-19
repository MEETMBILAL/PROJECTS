import type { Config } from "tailwindcss";

/**
 * Tailwind theme for the Asura Scans clone.
 *
 * The exact site color system is exposed under the `brand` key so it can be
 * referenced as e.g. `bg-brand-bg`, `text-brand-purple`, `border-brand-border`.
 * shadcn/ui semantic tokens are also mapped to these values via CSS variables.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        brand: {
          purple: "#913FE2",
          "purple-light": "#B06EF5",
          bg: "#0F0F0F",
          card: "#1A1A1A",
          "card-hover": "#222222",
          surface: "#2A2A2A",
          border: "#2A2A2A",
          nav: "#111111",
          text: "#FFFFFF",
          "text-secondary": "#A0A0A0",
          "text-muted": "#666666",
          gold: "#FFD700",
          new: "#22C55E",
          hot: "#EF4444",
          completed: "#3B82F6",
        },
        // shadcn/ui semantic tokens (mapped to brand palette via CSS vars)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      boxShadow: {
        "purple-glow": "0 0 0 2px #913FE2",
        "purple-soft": "0 0 20px -4px rgba(145, 63, 226, 0.55)",
        nav: "0 4px 20px rgba(0, 0, 0, 0.5)",
      },
      aspectRatio: {
        cover: "3 / 4",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-in-out",
        "slide-in": "slide-in 0.25s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
