/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Coors Light colors
        primary: {
          DEFAULT: '#0071CE', // Coors Light blue
          50: '#E5F4FF',
          100: '#CCE9FF',
          200: '#99D3FF',
          300: '#66BDFF',
          400: '#33A7FF',
          500: '#0071CE', // Main blue
          600: '#005BA9',
          700: '#004584',
          800: '#00305F',
          900: '#001B3A',
        },
        secondary: {
          DEFAULT: '#C6C9CA', // Coors Light silver/gray
          50: '#FFFFFF',
          100: '#F7F7F8',
          200: '#EEEFF0',
          300: '#E5E7E8',
          400: '#D5D8D9',
          500: '#C6C9CA', // Main silver
          600: '#B6BABB',
          700: '#979C9E',
          800: '#787D80',
          900: '#595E61',
        },
        accent: {
          DEFAULT: '#BF0D3E', // Coors Light red
          50: '#FFE5EC',
          100: '#FFCCD9',
          200: '#FF99B3',
          300: '#FF668C',
          400: '#FF3366',
          500: '#BF0D3E', // Main red
          600: '#A20B35',
          700: '#85092C',
          800: '#680723',
          900: '#4B051A',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 