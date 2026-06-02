/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: '#0D0D11',
        cardDark: 'rgba(255, 255, 255, 0.03)',
        borderDark: 'rgba(255, 255, 255, 0.08)',
        primary: '#C8A252',
        primaryHover: '#D4B36D',
        accent: '#10b981',
        accentHover: '#059669'
      }
    },
  },
  plugins: [],
}
