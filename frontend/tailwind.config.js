/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#E8F1FB',
          100: '#D6E4F0',
          500: '#2E75B6',
          700: '#1F4E79',
          900: '#0F2847',
        },
        success: '#27AE60',
        warning: '#F5A623',
        danger:  '#E74C3C',
      },
    },
  },
  plugins: [],
}
