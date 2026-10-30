import type { Config } from 'tailwindcss';

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;
const categories = ['courses', 'certifications', 'projects', 'experience', 'competitions', 'workshops', 'programs', 'books', 'volunteering', 'events', 'labs'];

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: categories.flatMap((c) => [`text-cat-${c}`, `bg-cat-${c}`, `bg-cat-${c}/10`]),
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        sunken: v('sunken'),
        ink: v('ink'),
        muted: v('muted'),
        line: v('line'),
        accent: { DEFAULT: v('accent'), ink: v('accent-ink'), soft: v('accent-soft') },
        field: { DEFAULT: v('field'), ink: v('field-ink') },
        cat: Object.fromEntries(categories.map((c) => [c, v(`c-${c}`)])),
      },
      fontFamily: {
        sans: ['"Jost Variable"', 'Jost', 'system-ui', 'sans-serif'],
        display: ['"Jost Variable"', 'Jost', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Five steps: small, body, lead, heading, display.
        xs: ['0.8125rem', { lineHeight: '1.45' }],
        sm: ['0.9375rem', { lineHeight: '1.5' }],
        base: ['1.0625rem', { lineHeight: '1.55' }],
        lg: ['1.0625rem', { lineHeight: '1.55' }],
        xl: ['1.375rem', { lineHeight: '1.35' }],
        '2xl': ['1.375rem', { lineHeight: '1.3' }],
        'display-md': ['clamp(1.75rem, 1.2rem + 1.6vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '500' }],
        'display-lg': ['clamp(2.25rem, 1.4rem + 3.4vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.025em', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
