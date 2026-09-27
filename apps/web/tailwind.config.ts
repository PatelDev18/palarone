import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Token Mappings
        background: 'var(--color-bg-app)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-card-custom': 'var(--color-bg-card)',
        'bg-card-elevated': 'var(--color-bg-card-elevated)',
        'border-theme': 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        'text-theme': 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-disabled': 'var(--color-text-disabled)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          foreground: 'var(--color-primary-fg)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary-btn)',
          hover: 'var(--color-secondary-btn-hover)',
          foreground: 'var(--color-secondary-btn-text)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: '#ffffff',
        },
        warning: 'var(--status-warning)',
        critical: 'var(--status-danger)',
        success: 'var(--status-success)',
        info: 'var(--status-info)',
      },
    },
  },
  plugins: [],
}
export default config
