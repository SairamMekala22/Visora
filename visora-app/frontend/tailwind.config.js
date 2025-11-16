/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        gray: {
          light: '#f5f5f5',
          DEFAULT: '#eaeaea'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Manrope', 'sans-serif']
      }
    },
  },
  plugins: [],
}
