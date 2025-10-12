/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff9900ff",
        background: "#FFF3E0",
        foreground: "#b6580bff",
        foreground2: "#723707ff",
        header: "#102655ff",
        accent: "#ffdfacff",
        card: "#ffffff",
      },
    },
  },
  plugins: [],
};