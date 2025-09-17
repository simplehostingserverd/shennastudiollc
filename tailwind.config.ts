import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        coral: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fbd7ac',
          300: '#f8bb78',
          400: '#f59542',
          500: '#f2761e',
          600: '#e35d14',
          700: '#bc4713',
          800: '#963918',
          900: '#7a3117',
          950: '#42170a',
        },
        maroon: {
          50: '#fdf2f2',
          100: '#fce7e7',
          200: '#f8d1d1',
          300: '#f1a8a8',
          400: '#e87474',
          500: '#dc4545',
          600: '#c92a2a',
          700: '#a91d1d',
          800: '#8b1b1b',
          900: '#721c1c',
          950: '#3e0a0a',
        },
        seafoam: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a4bbfc',
          400: '#8da2fb',
          500: '#5d79f7',
          600: '#4c63d2',
          700: '#3b4caa',
          800: '#101A8C',
          900: '#0D1670',
          950: '#091154',
        },
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #6cdae7 0%, #3cc5d4 50%, #2ba5b3 100%)',
        'coral-gradient': 'linear-gradient(135deg, #f59542 0%, #f2761e 50%, #e35d14 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #e87474 0%, #dc4545 50%, #c92a2a 100%)',
        'seafoam-gradient': 'linear-gradient(135deg, #101A8C 0%, #0D1670 50%, #091154 100%)',
        'ocean-waves': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%236cdae7\" fill-opacity=\"0.15\"%3E%3Cpath d=\"m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(10deg)' },
          '75%': { transform: 'rotate(-10deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config