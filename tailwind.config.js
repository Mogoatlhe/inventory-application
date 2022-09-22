/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./views/*.pug"],
  theme: {
    fontFamily: {
      lato: ["Lato", "sans-serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      smd: "824px",
      mmd: "840px",
      ...defaultTheme.screens,
    },
    extend: {
      spacing: {
        33: "33.3333vw",
      },
    },
  },
  plugins: [],
  separator: "_",
};
