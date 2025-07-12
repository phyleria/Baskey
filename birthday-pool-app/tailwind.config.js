module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}', // Add this if you're using /src
  ],
  theme: {
    extend: {
      colors: {
        birthday: {
          yellow: '#E5C51A',
          'yellow-dark': '#D4B519',
          green: '#A0E51A',
          'green-dark': '#8FD019',
          orange: '#E55F1A',
          'orange-dark': '#D44E19',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
