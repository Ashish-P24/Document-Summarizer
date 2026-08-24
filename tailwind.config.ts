import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F6F7FB",
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F8FAFC",
          tertiary: "#EEF2FF",
        },
        border: {
          DEFAULT: "#E2E8F0",
          subtle: "#CBD5E1",
          active: "#94A3B8",
        },
        accent: {
          DEFAULT: "#4F46E5",
          light: "#6366F1",
          dark: "#4338CA",
          muted: "rgba(79, 70, 229, 0.12)",
        },
        text: {
          primary: "#0F172A",
          secondary: "#334155",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.04)" },
        },
      },
      boxShadow: {
        card: "0 18px 42px -28px rgba(15, 23, 42, 0.28)",
        "card-soft": "0 10px 24px -18px rgba(15, 23, 42, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
