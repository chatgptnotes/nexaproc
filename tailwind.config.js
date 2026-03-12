/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nexaproc: {
          bg: '#081f10',
          amber: '#fbbf24',
          orange: '#f97316',
          green: '#4ade80',
          forest: '#16a34a',
          gold: '#fde68a',
          teal: '#0d9488',
          lime: '#a3e635',
        },
        scada: {
          dark: '#0a1a10',
          panel: '#0d2416',
          sidebar: '#071a0d',
          border: 'rgba(74,222,128,0.18)',
          'border-hover': 'rgba(251,191,36,0.45)',
        },
        alarm: {
          critical: '#ef4444',
          high: '#f97316',
          medium: '#fbbf24',
          low: '#3b82f6',
          info: '#6b7280',
        },
        status: {
          running: '#4ade80',
          stopped: '#6b7280',
          fault: '#ef4444',
          warning: '#fbbf24',
          maintenance: '#3b82f6',
        },
      },
      animation: {
        'alarm-flash': 'alarm-flash 1s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'flow': 'flow 2s linear infinite',
      },
      keyframes: {
        'alarm-flash': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(74,222,128,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(74,222,128,0.6)' },
        },
        'flow': {
          '0%': { strokeDashoffset: '20' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
