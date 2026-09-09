/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        stone: {
          950: '#0b0d0e',
          900: '#101214',
          850: '#15181a',
          800: '#1b1f22',
          700: '#262b30',
          600: '#3c434b',
          400: '#8a94a0',
          200: '#d1d7de',
          100: '#e9ecef',
        },
        sage: {
          500: '#346e59',
          400: '#43876e',
          300: '#5ca389',
        },
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
