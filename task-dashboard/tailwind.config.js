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
        slideDown: {
          from: {
            height: '0',
            opacity: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
            opacity: '1',
          },
        },
        slideUp: {
          from: {
            height: 'var(--radix-accordion-content-height)',
            opacity: '1',
          },
          to: {
            height: '0',
            opacity: '0',
          },
        },
      },
      animation: {
        flipIn: 'flipIn 0.6s ease-out',
        flipOut: 'flipOut 0.5s ease-in forwards',
        slideDown: 'slideDown 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
}