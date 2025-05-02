import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0071CE",
          light: "#33A7FF",
          dark: "#005BA9",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        secondary: {
          DEFAULT: "#C6C9CA",
          light: "#E5E7E8",
          dark: "#979C9E",
          50: "#FFFFFF",
          100: "#F7F7F8",
          200: "#EEEFF0",
          300: "#E5E7E8",
          400: "#D5D8D9",
          500: "#C6C9CA",
          600: "#B6BABB",
          700: "#979C9E",
          800: "#787D80",
          900: "#595E61",
        },
        accent: {
          DEFAULT: "#BF0D3E",
          light: "#FF3366",
          dark: "#85092C",
          50: "#FFE5EC",
          100: "#FFCCD9",
          200: "#FF99B3",
          300: "#FF668C",
          400: "#FF3366",
          500: "#BF0D3E",
          600: "#A20B35",
          700: "#85092C",
          800: "#680723",
          900: "#4B051A",
        },
        silver: "#C0C0C0",
        "coors-red": "#EC1C24",
        "coors-blue": "#0033A0",
        "mountain-blue": "#E5F4FF",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config; 