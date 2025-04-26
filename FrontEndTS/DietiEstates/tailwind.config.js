/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light theme base colors
        'primary': '#EBF2FA',    // Light blue - backgrounds
        'secondary': '#c1deff',  // Medium blue - accents
        'tertiary': '#1e3a8a',   // Dark blue - text
        
        // Dark theme base colors
        'darkPrimary': '#050A16',    // Dark blue - backgrounds
        'darkSecondary': '#0b2138',  // Medium blue - accents
        'darkTertiary': '#D0E1F9',   // Light blue - text
      },
    },
  },
  plugins: [],
}
