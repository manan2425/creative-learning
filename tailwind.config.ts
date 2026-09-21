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
        background: "#F8FAFC",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#EFF6FF",
        },
        cyan: {
          DEFAULT: "#06B6D4",
          hover: "#0891B2",
          light: "#ECFEFF",
        },
        navy: {
          DEFAULT: "#0F172A",
          light: "#1E293B",
          dark: "#020617",
        },
        secondary: "#475569",
        border: "#E2E8F0",
        success: "#16A34A",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 4s ease-in-out infinite",
        "robot-glow": "robotGlow 2.5s ease-in-out infinite alternate",
        "scanline": "scanline 6s linear infinite",
        "grid-move": "gridMove 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        robotGlow: {
          "0%": { boxShadow: "0 0 10px rgba(6, 182, 212, 0.25)" },
          "100%": { boxShadow: "0 0 25px rgba(37, 99, 235, 0.5)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(800%)" },
        },
        gridMove: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "40px 40px" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
