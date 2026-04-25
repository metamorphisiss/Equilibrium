import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        cream: "#FFFBF0",
        ink: "#111111",
        "mood-happy": "#FFE566",
        "mood-calm": "#A8E6CF",
        "mood-anxious": "#C9B8FF",
        "mood-frustrated": "#FF8C69",
        "mood-lonely": "#B8D4FF",
        "mood-tired": "#D4D4D4",
        "mood-grateful": "#FFB8D4",
      },
      borderRadius: {
        card: "16px",
        button: "10px",
      },
      boxShadow: {
        neo: "4px 4px 0px #111111",
        "neo-sm": "2px 2px 0px #111111",
      },
    },
  },
  plugins: [],
} satisfies Config;
