/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#080808',
          900: '#0D0D0D',
          850: '#111111',
          800: '#151515',
          700: '#191919',
          600: '#242424',
          500: '#333333',
        },
        beige: {
          50: '#FAF6EE',
          100: '#F3E7CE',
          200: '#E8D3A8',
          300: '#D4BE8D',
          400: '#C8A96B',
          500: '#BBAF98',
          600: '#988C75',
          700: '#6B6252',
          800: '#3F392F',
          900: '#1C1813',
        },
        surface: {
          DEFAULT: 'rgba(20, 20, 20, 0.65)',
          card: '#141414',
          light: 'rgba(25, 25, 25, 0.75)',
          border: 'rgba(232, 211, 168, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'float': 'float 7s ease-in-out infinite',
        'pulse-slow': 'pulse 5s ease-in-out infinite',
        'spin-slow': 'spin 60s linear infinite',
        'spin-reverse': 'spin 45s linear infinite reverse',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { opacity: '0.3' },
          '100%': { opacity: '0.7' },
        },
      },
      backdropBlur: {
        xs: '2px',
        glass: '24px',
      },
    },
  },
  plugins: [],
};
