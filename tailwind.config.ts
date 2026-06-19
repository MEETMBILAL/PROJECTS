import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        brand: {
          primary: '#913FE2',
          dark: '#0F0F0F',
          card: '#1A1A1A',
          cardHover: '#222222',
          surface: '#2A2A2A',
          nav: '#111111',
          text: '#FFFFFF',
          secondary: '#A0A0A0',
          muted: '#666666',
          accent: '#B06EF5',
          rating: '#FFD700',
          new: '#22C55E',
          hot: '#EF4444',
          completed: '#3B82F6',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        purple: '0 0 0 2px #913FE2',
        'purple-glow': '0 0 22px rgba(145, 63, 226, 0.35)',
      },
      backgroundImage: {
        'hero-fade': 'linear-gradient(90deg, rgba(15,15,15,0.98) 0%, rgba(15,15,15,0.72) 42%, rgba(15,15,15,0.15) 100%)',
        'card-purple': 'linear-gradient(180deg, rgba(145,63,226,0) 20%, rgba(145,63,226,0.88) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
