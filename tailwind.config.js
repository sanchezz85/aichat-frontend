/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors (indigo-based)
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Accent colors
        accent: {
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
        // Custom grays for dark theme
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Background colors
        bg: {
          DEFAULT: '#0b0f14',
          'elev-1': '#111827',
          'elev-2': '#0f172a',
          inverse: '#ffffff',
        },
        // Text colors
        text: {
          primary: '#e5e7eb',
          secondary: '#9ca3af',
          tertiary: '#6b7280',
          inverse: '#0b0f14',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'Inter', 'SF Pro Text', 'Roboto', 'Helvetica Neue', 'Arial', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      fontSize: {
        xxs: '.75rem',
        xs: '.8125rem',
        sm: '.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      spacing: {
        0: '.25rem',
        1: '.5rem',
        2: '.75rem',
        3: '1rem',
        4: '1.5rem',
        5: '2rem',
        6: '3rem',
        7: '4rem',
        8: '6rem',
      },
      borderRadius: {
        sm: '.5rem',
        md: '.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        1: '0 1px 2px rgba(0,0,0,.1), 0 1px 1px rgba(0,0,0,.06)',
        2: '0 6px 18px rgba(0,0,0,.25)',
        3: '0 10px 28px rgba(0,0,0,.35)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in',
        'slide-up': 'slideUp 200ms ease-out',
        'pulse-subtle': 'pulseSubtle 1200ms ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}

