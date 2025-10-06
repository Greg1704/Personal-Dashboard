/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        flipIn: {
          from: {
            opacity: '0',
            transform: 'rotateY(90deg)',
          },
          to: {
            opacity: '1',
            transform: 'rotateY(0deg)',
          },
        },
        flipOut: {
          to: {
            opacity: '0',
            transform: 'rotateY(90deg)',
          },
        },
      },
      animation: {
        flipIn: 'flipIn 0.6s ease-out',
        flipOut: 'flipOut 0.5s ease-in forwards',
      },
    },
  },
  plugins: [],
}