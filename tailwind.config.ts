import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeInUp 0.6s ease-out',
        'slide': 'slideIn 0.4s ease-out',
        'flip': 'flip 0.6s ease-in-out',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideIn: {
          'from': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        flip: {
          'from': {
            transform: 'rotateY(0deg)',
          },
          'to': {
            transform: 'rotateY(180deg)',
          },
        },
        shake: {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '25%': {
            transform: 'translateX(-8px)',
          },
          '75%': {
            transform: 'translateX(8px)',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
