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
          text: '#111827',
          secondary: '#64748B',
          border: '#E5E7EB',
          accent: '#2563EB',
          'accent-hover': '#1D4ED8',
          highlight: '#EFF6FF',
          grid: '#E9EDF3',
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
