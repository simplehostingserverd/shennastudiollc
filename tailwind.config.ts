import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
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
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #115e59 100%)',
        'coral-gradient': 'linear-gradient(135deg, #f59542 0%, #f2761e 50%, #e35d14 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #e87474 0%, #dc4545 50%, #c92a2a 100%)',
        'seafoam-gradient': 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
        'ocean-waves': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2399f6e4\" fill-opacity=\"0.1\"%3E%3Cpath d=\"m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
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