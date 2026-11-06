import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            DEFAULT: '#0F2537',
            light: '#1B3B56',
            dark: '#081520',
          },
          beige: {
            DEFAULT: '#F5EFE6',
            warm: '#E8DFCA',
            soft: '#FAF7F2',
          },
          accent: {
            DEFAULT: '#D97706',
            hover: '#B45309',
            teal: '#0D9488',
          },
          neutral: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            600: '#475569',
            800: '#1E293B',
            900: '#0F172A',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 10px 30px -10px rgba(15, 37, 55, 0.08)',
        'premium-lg': '0 20px 40px -15px rgba(15, 37, 55, 0.14)',
      },
    },
  },
  plugins: [],
};

export default config;

