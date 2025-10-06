module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#293919',
          light: '#3d5226',
          dark: '#1a2410',
        },
        accent: '#f59e0b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          600: '#4b5563',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        heading: ['Libre Baskerville', 'Georgia', 'serif'],
        body: ['Source Sans Pro', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 4px 12px rgba(41, 57, 25, 0.15)',
        elevated: '0 8px 24px rgba(41, 57, 25, 0.2)',
      },
      spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
      },
    },
  },
  plugins: [],
}
