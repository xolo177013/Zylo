/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Zylo brand palette — electric violet (primary) + sunset coral (accent)
        brand: {
          50: '#f4f2ff',
          100: '#ebe7ff',
          200: '#d9d2ff',
          300: '#bcadff',
          400: '#9b7fff',
          500: '#7c4dff',
          600: '#6d28e0',
          700: '#5b1fc2',
          800: '#4a1c9c',
          900: '#3d1a7d'
        },
        accent: {
          50: '#fff3f0',
          100: '#ffe4dd',
          200: '#ffc9ba',
          300: '#ffa48b',
          400: '#ff7a5c',
          500: '#ff5a3c',
          600: '#f13d1f',
          700: '#c92e15',
          800: '#a52816',
          900: '#872617'
        },
        ink: {
          50: '#f7f7f9',
          100: '#eeeef2',
          200: '#d9d9e2',
          300: '#b6b6c4',
          400: '#8b8ba1',
          500: '#6b6b83',
          600: '#54546a',
          700: '#434357',
          800: '#2b2b3a',
          900: '#17171f'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(23, 23, 31, 0.06), 0 1px 3px -1px rgba(23, 23, 31, 0.04)',
        card: '0 4px 20px -4px rgba(23, 23, 31, 0.08)',
        lift: '0 16px 40px -12px rgba(109, 40, 224, 0.25)',
        glow: '0 0 0 3px rgba(124, 77, 255, 0.15)'
      },
      borderRadius: {
        xl2: '1.25rem'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' }
        },
        pop: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.18)' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        gradientPan: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out both',
        fadeInUp: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        scaleIn: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 1.6s infinite linear',
        pop: 'pop 0.35s ease-in-out',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        gradientPan: 'gradientPan 8s ease infinite'
      }
    }
  },
  plugins: []
};
