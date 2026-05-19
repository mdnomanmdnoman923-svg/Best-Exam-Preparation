// bep-full-project/tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],

  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.25rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },

      screens: {
        '2xl': '1440px',
      },
    },

    extend: {
      /* ------------------------------------------------------------------ */
      /* Colors                                                             */
      /* ------------------------------------------------------------------ */

      colors: {
        background: {
          DEFAULT: 'var(--color-background)',
          secondary: 'var(--color-background-secondary)',
          tertiary: 'var(--color-background-tertiary)',
          elevated: 'var(--color-background-elevated)',
        },

        foreground: {
          DEFAULT: 'var(--color-foreground)',
          muted: 'var(--color-foreground-muted)',
          soft: 'var(--color-foreground-soft)',
          disabled: 'var(--color-foreground-disabled)',
        },

        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
          focus: 'var(--color-border-focus)',
        },

        card: {
          DEFAULT: 'var(--color-card)',
          hover: 'var(--color-card-hover)',
          solid: 'var(--color-card-solid)',
        },

        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          soft: 'var(--color-primary-soft)',
          glow: 'var(--color-primary-glow)',
        },

        secondary: {
          DEFAULT: 'var(--color-secondary)',
          dark: 'var(--color-secondary-dark)',
          soft: 'var(--color-secondary-soft)',
        },

        success: {
          DEFAULT: 'var(--color-success)',
          soft: 'var(--color-success-soft)',
        },

        warning: {
          DEFAULT: 'var(--color-warning)',
          soft: 'var(--color-warning-soft)',
        },

        danger: {
          DEFAULT: 'var(--color-danger)',
          soft: 'var(--color-danger-soft)',
        },

        info: {
          DEFAULT: 'var(--color-info)',
          soft: 'var(--color-info-soft)',
        },
      },

      /* ------------------------------------------------------------------ */
      /* Typography                                                         */
      /* ------------------------------------------------------------------ */

      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
        mono: ['var(--font-mono)'],
      },

      fontSize: {
        xs: ['var(--text-xs)', { lineHeight: '1rem' }],
        sm: ['var(--text-sm)', { lineHeight: '1.25rem' }],
        base: ['var(--text-base)', { lineHeight: '1.5rem' }],
        lg: ['var(--text-lg)', { lineHeight: '1.75rem' }],
        xl: ['var(--text-xl)', { lineHeight: '1.75rem' }],
        '2xl': ['var(--text-2xl)', { lineHeight: '2rem' }],
        '3xl': ['var(--text-3xl)', { lineHeight: '2.25rem' }],
        '4xl': ['var(--text-4xl)', { lineHeight: '2.5rem' }],
        '5xl': ['var(--text-5xl)', { lineHeight: '1' }],
        '6xl': ['var(--text-6xl)', { lineHeight: '1' }],
      },

      /* ------------------------------------------------------------------ */
      /* Border Radius                                                      */
      /* ------------------------------------------------------------------ */

      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },

      /* ------------------------------------------------------------------ */
      /* Box Shadows                                                        */
      /* ------------------------------------------------------------------ */

      boxShadow: {
        soft: 'var(--shadow-soft)',
        medium: 'var(--shadow-medium)',
        heavy: 'var(--shadow-heavy)',
        glow: 'var(--shadow-glow)',
        'glow-strong': 'var(--shadow-glow-strong)',
      },

      /* ------------------------------------------------------------------ */
      /* Backdrop Blur                                                      */
      /* ------------------------------------------------------------------ */

      backdropBlur: {
        xs: '4px',
        sm: 'var(--blur-sm)',
        md: 'var(--blur-md)',
        lg: 'var(--blur-lg)',
        xl: 'var(--blur-xl)',
      },

      /* ------------------------------------------------------------------ */
      /* Background Images                                                  */
      /* ------------------------------------------------------------------ */

      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-mixed': 'var(--gradient-mixed)',
        'gradient-background': 'var(--gradient-background)',

        grid:
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },

      backgroundSize: {
        grid: '40px 40px',
      },

      /* ------------------------------------------------------------------ */
      /* Width / Height                                                     */
      /* ------------------------------------------------------------------ */

      width: {
        sidebar: 'var(--sidebar-width)',
        'sidebar-collapsed': 'var(--sidebar-width-collapsed)',
      },

      minHeight: {
        screen: '100vh',
      },

      height: {
        header: 'var(--header-height)',
        'mobile-header': 'var(--mobile-header-height)',
      },

      /* ------------------------------------------------------------------ */
      /* Transition                                                         */
      /* ------------------------------------------------------------------ */

      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      /* ------------------------------------------------------------------ */
      /* Keyframes                                                          */
      /* ------------------------------------------------------------------ */

      keyframes: {
        fadeIn: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },

        fadeUp: {
          from: {
            opacity: '0',
            transform: 'translateY(16px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-8px)',
          },
        },

        glow: {
          '0%, 100%': {
            boxShadow: '0 0 0 rgba(34,211,238,0)',
          },
          '50%': {
            boxShadow:
              '0 0 30px rgba(34,211,238,0.25)',
          },
        },

        shimmer: {
          '0%': {
            backgroundPosition: '200% 0',
          },
          '100%': {
            backgroundPosition: '-200% 0',
          },
        },

        pulseSoft: {
          '0%, 100%': {
            opacity: '0.7',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.03)',
          },
        },

        slideUp: {
          from: {
            transform: 'translateY(100%)',
          },
          to: {
            transform: 'translateY(0)',
          },
        },
      },

      /* ------------------------------------------------------------------ */
      /* Animations                                                         */
      /* ------------------------------------------------------------------ */

      animation: {
        fade: 'fadeIn 0.4s ease forwards',
        'fade-up': 'fadeUp 0.45s ease forwards',

        float: 'float 4s ease-in-out infinite',

        glow: 'glow 2.8s ease-in-out infinite',

        shimmer: 'shimmer 1.5s linear infinite',

        pulseSoft: 'pulseSoft 2.2s ease-in-out infinite',

        'slide-up': 'slideUp 0.35s ease forwards',
      },

      /* ------------------------------------------------------------------ */
      /* Z Index                                                            */
      /* ------------------------------------------------------------------ */

      zIndex: {
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
        tooltip: 'var(--z-tooltip)',
      },

      /* ------------------------------------------------------------------ */
      /* Screens                                                            */
      /* ------------------------------------------------------------------ */

      screens: {
        xs: '480px',
      },
    },
  },

  plugins: [],
};

export default config;
