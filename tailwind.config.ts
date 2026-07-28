import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#000000',
        surface: '#0d0d0d',
        elevated: '#141414',
        hairline: '#2b2b2b',
        hairbright: '#3c3c3c',
        ink: '#ffffff',
        muted: '#9ca3af',
        'm-blue-dark': '#0066b1',
        'm-blue': '#1c69d4',
        'm-red': '#e22718',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        caption: ['12px', { lineHeight: '1.4', letterSpacing: '0.5px', fontWeight: '400' }],
        label: ['14px', { letterSpacing: '1.5px' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '300' }],
        'body-md': ['16px', { lineHeight: '1.6' }],
        'title-lg': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'display-sm': ['32px', { lineHeight: '1.15', fontWeight: '700' }],
        'display-lg': ['clamp(44px, 8vw, 104px)', { lineHeight: '0.92', letterSpacing: '-0.03em', fontWeight: '800' }],
      },
      maxWidth: { content: '1360px' },
    },
  },
  plugins: [],
};
export default config;
