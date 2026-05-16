// bep-full-project/src/hooks/useTheme.ts

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ThemeMode =
  | 'light'
  | 'dark'
  | 'system';

export type ResolvedTheme =
  | 'light'
  | 'dark';

export interface ThemePalette {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  muted: string;
  border: string;
  card: string;
}

export interface UseThemeReturn {
  theme: ThemeMode;

  resolvedTheme: ResolvedTheme;

  isDark: boolean;

  isLight: boolean;

  mounted: boolean;

  palette: ThemePalette;

  setTheme: (
    theme: ThemeMode,
  ) => void;

  toggleTheme: () => void;

  syncWithSystem: () => void;
}

const STORAGE_KEY =
  'bep-theme';

const DARK_CLASS =
  'dark';

function getSystemTheme(): ResolvedTheme {
  if (
    typeof window ===
    'undefined'
  ) {
    return 'dark';
  }

  return window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches
    ? 'dark'
    : 'light';
}

function getStoredTheme(): ThemeMode {
  if (
    typeof window ===
    'undefined'
  ) {
    return 'system';
  }

  const storedTheme =
    localStorage.getItem(
      STORAGE_KEY,
    );

  if (
    storedTheme === 'light' ||
    storedTheme === 'dark' ||
    storedTheme === 'system'
  ) {
    return storedTheme;
  }

  return 'system';
}

function resolveTheme(
  theme: ThemeMode,
): ResolvedTheme {
  if (
    theme === 'system'
  ) {
    return getSystemTheme();
  }

  return theme;
}

function applyThemeClass(
  resolvedTheme: ResolvedTheme,
) {
  if (
    typeof document ===
    'undefined'
  ) {
    return;
  }

  const root =
    document.documentElement;

  root.classList.remove(
    'light',
    'dark',
  );

  root.classList.add(
    resolvedTheme,
  );

  if (
    resolvedTheme === 'dark'
  ) {
    root.classList.add(
      DARK_CLASS,
    );
  } else {
    root.classList.remove(
      DARK_CLASS,
    );
  }

  root.setAttribute(
    'data-theme',
    resolvedTheme,
  );

  root.style.colorScheme =
    resolvedTheme;
}

function buildPalette(
  theme: ResolvedTheme,
): ThemePalette {
  if (theme === 'dark') {
    return {
      background:
        '#050816',
      foreground:
        '#F8FAFC',
      primary:
        '#22D3EE',
      secondary:
        '#A855F7',
      muted:
        '#94A3B8',
      border:
        'rgba(255,255,255,0.10)',
      card:
        'rgba(255,255,255,0.04)',
    };
  }

  return {
    background:
      '#F8FAFC',
    foreground:
      '#0F172A',
    primary:
      '#0891B2',
    secondary:
      '#9333EA',
    muted:
      '#475569',
    border:
      'rgba(15,23,42,0.08)',
    card:
      '#FFFFFF',
  };
}

export default function useTheme(): UseThemeReturn {
  const [mounted, setMounted] =
    useState(false);

  const [theme, setThemeState] =
    useState<ThemeMode>(
      getStoredTheme(),
    );

  const [resolvedTheme, setResolvedTheme] =
    useState<ResolvedTheme>(
      resolveTheme(
        getStoredTheme(),
      ),
    );

  const applyTheme =
    useCallback(
      (
        nextTheme: ThemeMode,
      ) => {
        const resolved =
          resolveTheme(
            nextTheme,
          );

        setThemeState(
          nextTheme,
        );

        setResolvedTheme(
          resolved,
        );

        applyThemeClass(
          resolved,
        );

        if (
          typeof window !==
          'undefined'
        ) {
          localStorage.setItem(
            STORAGE_KEY,
            nextTheme,
          );
        }
      },
      [],
    );

  useEffect(() => {
    setMounted(true);

    const initialTheme =
      getStoredTheme();

    applyTheme(
      initialTheme,
    );
  }, [applyTheme]);

  useEffect(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return;
    }

    const mediaQuery =
      window.matchMedia(
        '(prefers-color-scheme: dark)',
      );

    const handleChange =
      () => {
        const currentTheme =
          getStoredTheme();

        if (
          currentTheme ===
          'system'
        ) {
          applyTheme(
            'system',
          );
        }
      };

    if (
      typeof mediaQuery
        .addEventListener ===
      'function'
    ) {
      mediaQuery.addEventListener(
        'change',
        handleChange,
      );
    } else {
      mediaQuery.addListener(
        handleChange,
      );
    }

    return () => {
      if (
        typeof mediaQuery.removeEventListener ===
        'function'
      ) {
        mediaQuery.removeEventListener(
          'change',
          handleChange,
        );
      } else {
        mediaQuery.removeListener(
          handleChange,
        );
      }
    };
  }, [applyTheme]);

  const setTheme =
    useCallback(
      (
        nextTheme: ThemeMode,
      ) => {
        applyTheme(
          nextTheme,
        );
      },
      [applyTheme],
    );

  const toggleTheme =
    useCallback(() => {
      const nextTheme =
        resolvedTheme ===
        'dark'
          ? 'light'
          : 'dark';

      applyTheme(
        nextTheme,
      );
    }, [
      applyTheme,
      resolvedTheme,
    ]);

  const syncWithSystem =
    useCallback(() => {
      applyTheme(
        'system',
      );
    }, [applyTheme]);

  const palette =
    useMemo(
      () =>
        buildPalette(
          resolvedTheme,
        ),
      [resolvedTheme],
    );

  return {
    theme,

    resolvedTheme,

    isDark:
      resolvedTheme ===
      'dark',

    isLight:
      resolvedTheme ===
      'light',

    mounted,

    palette,

    setTheme,

    toggleTheme,

    syncWithSystem,
  };
}
