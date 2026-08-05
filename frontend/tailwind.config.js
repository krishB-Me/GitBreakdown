/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- BACKGROUNDS (Cursor Matte Style) ---
        'dev-bg-darkest': '#090A0C', // Root app background
        'dev-bg-base': '#0E1013',    // Primary editor / pane background
        'dev-bg-surface': '#121418', // Floating cards, dialogs, AI panel
        'dev-bg-hover': '#1F242A',   // Active file row, hover states

        // --- BORDERS & ACCENTS ---
        'dev-border': '#22272E',     // Subtle 1px pane dividers
        'dev-border-active': '#383F47',

        // --- TYPOGRAPHY (Clean IDE Readability) ---
        'dev-text-primary': '#EEEEEE',   // Primary headers, editor code
        'dev-text-secondary': '#9DA7B3', // Muted file paths, metadata
        'dev-text-dim': '#57606A',       // Line numbers, placeholder text

        // --- BRAND / BUTTON ACCENTS (Futuristic Orange) ---
        'dev-orange': {
          DEFAULT: '#FF6B00', // Vibrant developer accent
          hover: '#FF7D1A',
          glow: 'rgba(255, 107, 0, 0.25)',
          muted: 'rgba(255, 107, 0, 0.12)',
        },

        // --- STATUS INDICATORS ---
        'dev-emerald': '#10B981', // Git additions, online status
        'dev-cyan': '#06B6D4',    // AI badges, search highlights
      },
      fontFamily: {
        // --- 1. MAIN UI & TEXT (Modern, clean, sans-serif) ---
        sans: [
          'Inter',
          'Geist',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],

        // --- 2. CODE & TERMINAL (Sleek IDE monospace stack) ---
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Cascadia Code',
          'Source Code Pro',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}