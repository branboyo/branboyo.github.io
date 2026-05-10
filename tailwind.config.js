/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ui:      ['Syne', 'sans-serif'],
        dialogue:['Cormorant Garamond', 'serif'],
        details: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
