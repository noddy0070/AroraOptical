/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dyeLine: ['DyeLine', 'sans-serif'],
        roboto:['Roboto','sans-serif']
      },
      colors:{
        darkslategrey:"#1d3240",
      }
    },
  },
  plugins: [],
}

