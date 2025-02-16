import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			Jaro: ["Jaro", "sans-serif"],
  			Righteous: ["Righteous", "sans-serif"],
  			Oswald: ["Oswald", "sans-serif"],
  			Roboto: ["Roboto", "sans-serif"],
  			Poppins: ["Poppins", "sans-serif"],
  			Lato: ["Lato", "sans-serif"]
  		},
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			'rgb-menu': 'rgba(149, 139, 139, 0.21)',
  			'bg-body': '#000000e0',
  			'rbg-bg-section-card-music': 'rgba(255, 0, 0, 0.58)',
			'bg-section-card-playlist': 'rgba(149, 139, 139, 0.21)',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
