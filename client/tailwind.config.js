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
      fontSize: {
        'testimonial':'clamp(42px,5.5vw,90px)',
        'h1Text':'clamp(32px,3.5vw,72px)',
        'h2Text':'clamp(28px,3vw,56px)',
        'h3Text':'clamp(24px,2.5vw,52px)',
        'h4Text':'clamp(20px,2vw,48px)',
        'h5Text':'clamp(16px,1.5vw,44px)',
        'h6Text':'clamp(14px,1.25vw,24px)',
        'mediumText': 'clamp(12px, 1.2vw, 24px)',
        'regularText': 'clamp(12px, 1vw, 18px)',
        'smallText': 'clamp(10px, .875vw, 16px)',
      },
      colors:{
        darkslategrey:"#1d3240",
        btngrery:"rgba(29, 50, 64, 0.5)",
        btnHoverColour:"#f3e9d2",
        ligtgrey:"#f2f2f2",
      }
    },
  },
  plugins: [],
}

