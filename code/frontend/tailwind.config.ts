import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        accent: '#10B981',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
};

export default config;
