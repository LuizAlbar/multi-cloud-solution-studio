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
        studio: {
          bg: '#F8FAFC',
          canvas: '#FFFFFF',
          surface: '#FFFFFF',
          text: '#0F172A',
          secondary: '#64748B',
          border: '#E2E8F0',
          accent: '#6366F1', // Indigo / Roxo da nova marca
          'accent-hover': '#4F46E5',
          highlight: '#EEF2FF',
          grid: '#E2E8F0',
        },
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
    },
  },
  plugins: [],
};

export default config;
