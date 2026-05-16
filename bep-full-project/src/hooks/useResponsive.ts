// bep-full-project/src/hooks/useResponsive.ts

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface BreakpointMap {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

export interface ResponsiveState {
  width: number;
  height: number;

  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;

  activeBreakpoint:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl';

  orientation:
    | 'portrait'
    | 'landscape';
}

export interface UseResponsiveOptions {
  breakpoints?: Partial<BreakpointMap>;
}

const DEFAULT_BREAKPOINTS: BreakpointMap =
  {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

function getWindowSize() {
  if (
    typeof window ===
    'undefined'
  ) {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width:
      window.innerWidth,
    height:
      window.innerHeight,
  };
}

function getActiveBreakpoint(
  width: number,
  breakpoints: BreakpointMap,
): ResponsiveState['activeBreakpoint'] {
  if (
    width >=
    breakpoints['2xl']
  ) {
    return '2xl';
  }

  if (
    width >= breakpoints.xl
  ) {
    return 'xl';
  }

  if (
    width >= breakpoints.lg
  ) {
    return 'lg';
  }

  if (
    width >= breakpoints.md
  ) {
    return 'md';
  }

  if (
    width >= breakpoints.sm
  ) {
    return 'sm';
  }

  return 'xs';
}

export default function useResponsive(
  options: UseResponsiveOptions = {},
): ResponsiveState {
  const breakpoints =
    useMemo(
      () => ({
        ...DEFAULT_BREAKPOINTS,
        ...options.breakpoints,
      }),
      [
        options.breakpoints,
      ],
    );

  const [size, setSize] =
    useState(
      getWindowSize(),
    );

  useEffect(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return;
    }

    let frameId = 0;

    const handleResize = () => {
      cancelAnimationFrame(
        frameId,
      );

      frameId =
        requestAnimationFrame(
          () => {
            setSize(
              getWindowSize(),
            );
          },
        );
    };

    window.addEventListener(
      'resize',
      handleResize,
    );

    window.addEventListener(
      'orientationchange',
      handleResize,
    );

    return () => {
      cancelAnimationFrame(
        frameId,
      );

      window.removeEventListener(
        'resize',
        handleResize,
      );

      window.removeEventListener(
        'orientationchange',
        handleResize,
      );
    };
  }, []);

  return useMemo(() => {
    const {
      width,
      height,
    } = size;

    const activeBreakpoint =
      getActiveBreakpoint(
        width,
        breakpoints,
      );

    const isXs =
      width <
      breakpoints.sm;

    const isSm =
      width >=
        breakpoints.sm &&
      width <
        breakpoints.md;

    const isMd =
      width >=
        breakpoints.md &&
      width <
        breakpoints.lg;

    const isLg =
      width >=
        breakpoints.lg &&
      width <
        breakpoints.xl;

    const isXl =
      width >=
        breakpoints.xl &&
      width <
        breakpoints['2xl'];

    const is2xl =
      width >=
      breakpoints['2xl'];

    return {
      width,
      height,

      isMobile:
        width <
        breakpoints.md,

      isTablet:
        width >=
          breakpoints.md &&
        width <
          breakpoints.lg,

      isDesktop:
        width >=
        breakpoints.lg,

      isXs,
      isSm,
      isMd,
      isLg,
      isXl,
      is2xl,

      activeBreakpoint,

      orientation:
        width >= height
          ? 'landscape'
          : 'portrait',
    };
  }, [
    breakpoints,
    size,
  ]);
}
