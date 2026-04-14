import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: "#a78bfa", // violet-400
          glow: "#7c3aed",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 24px rgba(167, 139, 250, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
