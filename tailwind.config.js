/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#030712",
        surface: "#0d1117",
        border: "#1f2937",
        accent: "#00ff87",
        accent2: "#7c3aed",
        text: "#f1f5f9",
        muted: "#64748b",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        body: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
