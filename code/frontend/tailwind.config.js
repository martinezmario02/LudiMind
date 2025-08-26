/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        background: "#f9fafb",
        foreground: "#111827",
        header: "#102655ff",
        accent: "#9899f8ff",
        card: "#ffffff",
      },
    },
  },
  plugins: [],
};