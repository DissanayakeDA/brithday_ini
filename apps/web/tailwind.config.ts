import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0b0a10",
          800: "#141320",
          700: "#1c1a2b",
          600: "#272438",
        },
        cream: "#f6f1e7",
        gold: {
          DEFAULT: "#c8a24c",
          light: "#e7cd86",
          dark: "#9c7a2f",
        },
        rose: "#e0739a",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 20px 60px -20px rgba(0,0,0,0.6)",
        glow: "0 0 40px -10px rgba(200,162,76,0.45)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(120deg,#e7cd86 0%,#c8a24c 45%,#9c7a2f 100%)",
        "ink-radial":
          "radial-gradient(1200px 600px at 50% -10%, rgba(200,162,76,0.18), transparent 60%), radial-gradient(900px 500px at 90% 110%, rgba(224,115,154,0.12), transparent 55%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
