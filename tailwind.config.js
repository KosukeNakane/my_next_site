// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        bentonModernDisplay: ['benton-modern-display', 'sans-serif'],
        akzidenzGroteskNextPro: ['akzidenz-grotesk-next-pro', 'sans-serif'],
        fotTsukuaoldminPr6n: ['fot-tsukuaoldmin-pr6n', 'sans-serif'],
        notoSansJp: ['Noto Sans JP', 'sans-serif'],
        sourceHanSerif: ['source-han-serif-hong-kong', 'sans-serif'],
        futuraPt: ["futura-pt", 'sans-serif'],
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.8s ease-out forwards',
      },
      writingMode: {
        'vertical-rl': 'vertical-rl',
      },
      textOrientation: {
        upright: 'upright',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
