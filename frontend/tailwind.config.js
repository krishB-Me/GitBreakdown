/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vintage-cream': '#F4E4BC',
        'vintage-parchment': '#EAD6A4',
        'vintage-yellow': '#FFCB05',
        'vintage-amber': '#FF9E1B',
        'vintage-charcoal': '#1C1917',
        'vintage-darkcode': '#25221E',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}