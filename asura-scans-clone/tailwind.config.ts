import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#913FE2",
          background: "#0F0F0F",
          card: "#1A1A1A",
          cardHover: "#222222",
          surface: "#2A2A2A",
          nav: "#111111",
          text: "#FFFFFF",
          textSecondary: "#A0A0A0",
          textMuted: "#666666",
          accent: "#B06EF5",
          rating: "#FFD700",
          new: "#22C55E",
          hot: "#EF4444",
          completed: "#3B82F6"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        purple: "0 0 0 2px #913FE2",
        "purple-glow": "0 0 24px rgba(145, 63, 226, 0.35)"
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(90deg, rgba(15,15,15,0.96) 0%, rgba(15,15,15,0.74) 38%, rgba(15,15,15,0.25) 100%)",
        "card-purple": "linear-gradient(180deg, rgba(145,63,226,0) 0%, rgba(145,63,226,0.68) 100%)"
      },
      transitionTimingFunction: {
        "site": "ease-in-out"
      }
    }
  },
  plugins: [animate]
};

export default config;
