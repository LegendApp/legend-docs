const colors = require("tailwindcss/colors");
const starlightPlugin = require("@astrojs/starlight-tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,md,mdx,ts,tsx}",
    "../shared/src/**/*.{astro,html,md,mdx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      gray: {
        50: "#fafafa",
        100: "#f4f4f5",
        200: "#e4e4e7",
        300: "#d4d4d8",
        350: "#cececf",
        400: "#a1a1a4",
        500: "#71717a",
        600: "#52525b",
        700: "#3f3f46",
        750: "#2D2E2F",
        800: "#27272a",
        850: "#1F2025",
        900: "#18181b",
        950: "#131317",
      },
      // coolgray: colors.coolGray,
      black: colors.black,
      white: colors.white,
      red: colors.red,
      blue: colors.sky,
      violet: colors.violet,
      "blue-accent": "#25A2E8",
    },
  },
  plugins: [starlightPlugin()],
};
