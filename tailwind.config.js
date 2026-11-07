/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ocean-deep': '#0F2A3D',
        ocean: '#1F4E6B',
        teal: '#3E7C86',
        fog: '#C9D3D6',
        paper: '#F1E6CF',
        'paper-dark': '#E2D1AE',
        ink: '#1E1B18',
        rust: '#8A4B2A',
        stamp: '#B5352B',
        brass: '#C29A4B',
        moss: '#5E7A4A',
        tropic: '#D9A441',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        type: ['"Special Elite"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
}
