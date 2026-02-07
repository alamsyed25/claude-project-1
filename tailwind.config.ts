import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'diff-added': {
          bg: '#dcfce7',
          text: '#166534',
          border: '#bbf7d0',
          highlight: '#bbf7d0',
        },
        'diff-removed': {
          bg: '#fef2f2',
          text: '#991b1b',
          border: '#fecaca',
          highlight: '#fecaca',
        },
        'diff-modified': {
          bg: '#fffbeb',
          text: '#92400e',
          border: '#fde68a',
          highlight: '#fde68a',
        },
      },
    },
  },
  plugins: [],
}

export default config
