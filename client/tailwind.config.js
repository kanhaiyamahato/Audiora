/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'audiora-bg': '#0f0c29',
        'audiora-mid': '#302b63',
        'audiora-dark': '#24243e',
        'audiora-purple': '#9333ea',
        'audiora-pink': '#ec4899',
        'audiora-glass': 'rgba(255, 255, 255, 0.05)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
