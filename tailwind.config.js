/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        okx: {
          black: '#000000',
          dark: '#0a0a0a',
          card: '#111111',
          border: '#1e1e1e',
          hover: '#1a1a1a',
          orange: '#FF6B00',
          'orange-dim': '#FF6B0020',
          blue: '#2962FF',
          cyan: '#00D4FF',
          green: '#00C076',
          red: '#F84960',
          gray: '#6b6b6b',
          'gray-light': '#999999',
          white: '#FFFFFF',
        }
      },
      backgroundImage: {
        'okx-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FF9A00 100%)',
        'okx-gradient-blue': 'linear-gradient(135deg, #2962FF 0%, #00D4FF 100%)',
        'okx-gradient-dark': 'linear-gradient(180deg, #111111 0%, #000000 100%)',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
      }
    },
  },
  plugins: [],
};
