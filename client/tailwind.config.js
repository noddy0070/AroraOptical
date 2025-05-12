/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
		animation: {
			'fade-in': 'fadeIn 0.5s ease-in forwards',
		  },
		  keyframes: {
			fadeIn: {
			  '0%': { opacity: 0 },
			  '100%': { opacity: 1 },
			},
		  },
  		fontFamily: {
  			dyeLine: [
  				'DyeLine',
  				'sans-serif'
  			],
  			roboto: [
  				'Roboto',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			testimonial: 'clamp(42px,5.5vw,90px)',
  			h1Text: 'clamp(32px,3.5vw,72px)',
  			h2Text: 'clamp(28px,3vw,56px)',
  			h3Text: 'clamp(24px,2.5vw,52px)',
  			h4Text: 'clamp(20px,2vw,48px)',
  			h5Text: 'clamp(16px,1.5vw,44px)',
  			h6Text: 'clamp(14px,1.25vw,24px)',
  			mediumText: 'clamp(12px, 1.2vw, 24px)',
  			regularText: 'clamp(12px, 1vw, 18px)',
  			smallText: 'clamp(10px, .875vw, 16px)',
			tinyText: 'clamp(8px, .75vw, 14px)',
			h0TextPhone: 'clamp(36px,16vw,80px)',
			h1TextPhone: 'clamp(32px,14vw,72px)',
			h2TextPhone: 'clamp(28px,12vw,56px)',
			h3TextPhone: 'clamp(24px,10vw,52px)',
			h4TextPhone: 'clamp(20px,8vw,48px)',
			h5TextPhone: 'clamp(16px,6vw,44px)',
			h6TextPhone: 'clamp(14px,5vw,24px)',
			mediumTextPhone: 'clamp(12px, 4.25vw, 24px)',
			regularTextPhone: 'clamp(12px, 4vw, 18px)',
			smallTextPhone: 'clamp(10px, 3.5vw, 16px)',
			tinyTextPhone: 'clamp(8px, 3vw, 14px)',
  		},
  		colors: {
  			darkslategrey: '#1d3240',
  			btngrery: 'rgba(29, 50, 64, 0.5)',
  			btnHoverColour: '#f3e9d2',
  			ligtgrey: '#f2f2f2',
  			menu_color: '#ffb056',
			bgCreamWhite:'#f8f8f8',
			adminFontColor1:"#555F7E",
			adminInputBoxColor:"#F0F0F0",
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
		boxShadow:{
			adminShadow: '0px 0.55vw 2.2vw rgba(51, 38, 174, 0.1)',
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

