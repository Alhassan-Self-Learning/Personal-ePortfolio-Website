import type { Config } from 'tailwindcss';

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;
const categories = ['courses', 'certifications', 'projects', 'experience', 'competitions', 'workshops', 'programs', 'books', 'volunteering', 'events', 'labs'];

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: categories.flatMap((c) => [`text-cat-${c}`, `bg-cat-${c}/10`, `bg-cat-${c}`, `border-cat-${c}/40`, `fill-cat-${c}`]),
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
        cat: Object.fromEntries(categories.map((c) => [c, v(`c-${c}`)])),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Modular scale (~1.25) anchored at 17px body.
        'display-xl': ['clamp(2.6rem, 6.2vw, 4.75rem)', { lineHeight: '0.98', letterSpacing: '-0.035em', fontWeight: '650' }],
        'display-lg': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '620' }],
        'display-md': ['clamp(1.5rem, 2.6vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      maxWidth: { '8xl': '88rem' },
    },
  },
  plugins: [],
} satisfies Config;
