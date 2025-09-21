/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        // Define a custom keyframe named 'fadeIn'
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        // Map the 'fadeIn' keyframe to an animation utility class
        fadeIn: 'fadeIn 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};