/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        galaxy: {
          bg: '#0B0F19',
          card: '#131B2A',
          cardHover: '#182235',
          border: '#222E42',
          input: '#151D2E',
          red: '#FF3358',
          redHover: '#E61E43',
          muted: '#94A3B8',
          subtext: '#64748B',
          accent: '#FF4D6D',
          badgeP: '#10B981',
          badgeT13: '#F59E0B',
          badgeT16: '#F97316',
          badgeT18: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card-glow': '0 4px 20px -2px rgba(255, 51, 88, 0.15)',
        'search-bar': '0 4px 25px rgba(0, 0, 0, 0.45)',
      }
    },
  },
  plugins: [],
};

