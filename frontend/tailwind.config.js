/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#08090b',
          900: '#0d0e10',
          850: '#0f0f11',
          800: '#17181b',
          700: '#222328',
          600: '#303135',
        },
        brand: {
          red: '#ca3538',
          'red-hover': '#b22e30',
          accent: '#e04445',
          crimson: '#E50914',
        },
        typography: {
          light: '#f5f2ed',
          muted: '#9d9ea5',
          dim: '#74767e',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

