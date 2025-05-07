/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // 👈 Add this line for class-based dark mode
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // 👈 src folder තුළ තියෙන හැම file එකක්ම Tailwind වලින් අරගන්න
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  