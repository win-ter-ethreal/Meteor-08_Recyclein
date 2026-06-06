/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16A34A',
        secondary: '#22C55E',
        accent: '#FACC15',
        bg: '#F0FDF4',
      }
    },
  },
  plugins: [],
}