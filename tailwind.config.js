/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-900': 'var(--color-navy-900)',
        'navy-800': 'var(--color-navy-800)',
        'primary-blue': 'var(--color-primary-blue)',
        'domino-red': 'var(--color-domino-red)',
        'success-green': 'var(--color-success-green)',
        'warning-amber': 'var(--color-warning-amber)',
        'purple': 'var(--color-purple)',
        'bg-app': 'var(--color-bg-app)',
        'surface-card': 'var(--color-surface-card)',
        'border': 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
