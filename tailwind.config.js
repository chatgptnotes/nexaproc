export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#0A0F1E', 900: '#0D1526', 800: '#111E35' },
        electric: { 500: '#0066FF', 400: '#3385FF' },
        amber: { 500: '#F59E0B', 400: '#FBBF24' }
      }
    }
  },
  plugins: []
}
