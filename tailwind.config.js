//** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#daeefe",
          200: "#b6dcfd",
          300: "#89c2fa",
          400: "#5aa7f6",
          500: "#2d8bf0",
          600: "#1c6fd4",
          700: "#1657a8",
          800: "#144a89",
          900: "#123e72",
        },
      },
    },
  },
  plugins: [],
};
