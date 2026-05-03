/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF5",
        paper: "#F5F5F0",
        charcoal: "#2C2C28",
        pencil: "#6B6B5F",
        sage: "#8B9B7A",
        border: "#D4D2C8",
        crimson: "#C44536",
      },
      fontFamily: {
        handwritten: ["System"], 
        typewriter: ["Courier"],
      },
    },
  },
  plugins: [],
};
