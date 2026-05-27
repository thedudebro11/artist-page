/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c97a',
          dark: '#8a6020',
          dim: 'rgba(201,168,76,0.15)',
        },
        phone: {
          bg: '#050505',
          deep: '#0d0d0d',
          surface: '#1a1a1a',
          surface2: '#222222',
          border: 'rgba(255,255,255,0.08)',
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        mono: ['"DM Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'grain': 'grain 0.5s steps(1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(3%, 2%)' },
          '30%': { transform: 'translate(-1%, 4%)' },
          '40%': { transform: 'translate(2%, -1%)' },
          '50%': { transform: 'translate(-3%, 1%)' },
          '60%': { transform: 'translate(1%, -2%)' },
          '70%': { transform: 'translate(-2%, 3%)' },
          '80%': { transform: 'translate(3%, -2%)' },
          '90%': { transform: 'translate(-1%, 2%)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'phone': '0 0 0 1px rgba(255,255,255,0.12), 0 0 0 11px #1c1c1e, 0 0 0 12px rgba(255,255,255,0.06), 0 80px 160px rgba(0,0,0,0.95), 0 0 80px rgba(201,168,76,0.06)',
        'gold-glow': '0 0 30px rgba(201,168,76,0.4), 0 0 60px rgba(201,168,76,0.15)',
        'island': '0 8px 32px rgba(0,0,0,0.8)',
        'app-icon': '0 4px 20px rgba(0,0,0,0.4)',
      }
    },
  },
  plugins: [],
}
