/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Cairo', 'Segoe UI', 'Tahoma', 'sans-serif'],
      },
      colors: {
        navy:   { DEFAULT: '#1e3a5f', dark: '#0a1628' },
        accent: { DEFAULT: '#2563eb', dark: '#1d4ed8' },
        brand:  { red: '#e11d48', 'red-dark': '#be123c' },
      },
      animation: {
        'pulse-warn': 'pulseWarn 0.8s ease infinite alternate',
        'modal-in':   'modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        'fade-slide': 'fadeSlide 0.2s ease',
      },
      keyframes: {
        pulseWarn: {
          from: { boxShadow: '0 0 0 6px rgba(225,29,72,0.08)' },
          to:   { boxShadow: '0 0 0 12px rgba(225,29,72,0.14)' },
        },
        modalIn: {
          from: { opacity: '0', transform: 'scale(0.85) translateY(24px)' },
          to:   { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        fadeSlide: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

