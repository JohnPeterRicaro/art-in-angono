/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "input-shadow": "0 0 4px 0 rgba(0,0,0,0.25);",
      },
      colors: {
        "dd-violet": "#51459f",
        "dd-blue": "#84e9f4",
        "dd-dark-blue": "#86BFFC",
        "dd-dark-green": "#90D34C",
        "dd-light-yellow": "#FFF1C9",
        "dd-dark-yellow": "#FED537",
        "dd-light-pink": "#FFE2DD",
        "dd-dark-orange": "#FDA45A",
        "dd-red": "#E4533D",
        "dd-dark-red": "#DB4431",
        "dd-light-green": "#CFDC77",
      },
    },
  },
  plugins: [],
};
