import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--surface-muted)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          secondary: 'var(--foreground-secondary)',
          muted: 'var(--foreground-muted)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          soft: 'var(--primary-soft)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          hover: 'var(--destructive-hover)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        studio: {
          bg: 'var(--studio-bg)',
          canvas: 'var(--studio-canvas)',
          surface: 'var(--studio-surface)',
          'surface-muted': 'var(--studio-surface-muted)',
          text: 'var(--studio-text)',
          secondary: 'var(--studio-secondary)',
          border: 'var(--studio-border)',
          accent: 'var(--studio-accent)',
          'accent-hover': 'var(--studio-accent-hover)',
          highlight: 'var(--studio-highlight)',
          grid: 'var(--studio-grid)',
        },
      },
      borderRadius: {
        card: 'var(--radius)',
        btn: 'var(--radius-control)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        surface: 'var(--shadow-surface)',
        raised: 'var(--shadow-raised)',
        '2xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        xs: '0 1px 3px rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        standard: 'var(--motion-standard)',
        slow: 'var(--motion-slow)',
      },
      transitionTimingFunction: {
        'ease-out-editorial': 'var(--motion-ease-out)',
      },
    },
  },
  plugins: [],
};

export default config;
