// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',        // Violet
        secondary: '#4F46E5',      // Indigo
        background: '#F3F4F6',     // Gray-100
        card: '#FFFFFF',           // White
        textPrimary: '#111827',    // Gray-900
        textSecondary: '#6B7280',  // Gray-500
        success: '#16A34A',        // Green-600
        error: '#DC2626',          // Red-600
        warning: '#FBBF24',        // Yellow-400
      },
    },
  },
  plugins: [],
}
