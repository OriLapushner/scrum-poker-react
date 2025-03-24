import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
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
					foreground: 'hsl(var(--primary-foreground))',

					//  Cyan color shades
					'50': '#ecfeff',
					'100': '#cffafe',
					'200': '#a5f3fc',
					'300': '#67e8f9',
					'400': '#22d3ee',
					'500': '#06b6d4',
					'600': '#0891b2',
					'700': '#0e7490',
					'800': '#155e75',
					'900': '#164e63',
					'950': '#083344'

				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',

					//  Cyan color shades
					'50': '#ecfeff',
					'100': '#cffafe',
					'200': '#a5f3fc',
					'300': '#67e8f9',
					'400': '#22d3ee',
					'500': '#06b6d4',
					'600': '#0891b2',
					'700': '#0e7490',
					'800': '#155e75',
					'900': '#164e63',
					'950': '#083344'

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
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			animation: {
				pulse: 'pulse var(--duration) ease-out infinite'
			},
			keyframes: {
				pulse: {
					'0%, 100%': {
						boxShadow: '0 0 0 0 var(--pulse-color)'
					},
					'50%': {
						boxShadow: '0 0 0 8px var(--pulse-color)'
					}
				}
			}
		}
	},
	plugins: [tailwindAnimate],
} satisfies Config;
