import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Salesfire brand colors
        'sf-dark': '#2D1B4E',
        'sf-good': '#5EECD4',
        'sf-focus': '#FFB8C0',
        'sf-alert': '#E57373',
        'sf-card': '#F8F4FC',
        'sf-card-alt': '#FFF5DC',
        'sf-body': '#1A1A2E',
        'sf-secondary': '#6B7280',
        'sf-border': '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;
