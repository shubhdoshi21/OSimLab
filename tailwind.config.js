/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
    screens: {
      md: { max: "990px" },     
      sm: { max: "668px" },     
      xs: { max: "400px" },     
    },
  },
  plugins: [],
}