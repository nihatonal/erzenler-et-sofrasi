import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./constants/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#A5161A",
          redLight: "#C91F24",
          redDark: "#7F1115",

          green: "#173B28",
          greenLight: "#2F5D42",
          greenDark: "#0E2418",

          cream: "#FBF7EF",
          creamDark: "#EFE7DA",
          ivory: "#FFFDF8",

          sand: "#E7DED3",
          muted: "#7A7268",
        },

        dark: {
          bg: "#0E2418",
          surface: "#173B28",
          card: "#1F3F2D",
          border: "#2F5D42",
          muted: "#A8B5AA",
        },

        admin: {
          sidebar: "#0E2418",
          sidebarHover: "#173B28",
          sidebarActive: "#A5161A",
          content: "#FBF7EF",
          card: "#FFFDF8",
          border: "#E7DED3",
        },

        status: {
          active: "#22C55E",
          inactive: "#EF4444",
          warning: "#F59E0B",
          info: "#3B82F6",
        },

        chart: {
          soups: "#D97706",
          kebabs: "#A5161A",
          grills: "#7F1115",
          pide: "#C2410C",
          salads: "#2F5D42",
          desserts: "#B45309",
          drinks: "#2563EB",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(30, 26, 18, 0.08)",
        cardHover: "0 8px 32px 0 rgba(30, 26, 18, 0.14)",
        red: "0 4px 20px 0 rgba(165, 22, 26, 0.28)",
        admin: "0 1px 4px 0 rgba(0,0,0,0.10)",
      },
      spacing: {
        13: "3.25rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease forwards",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
