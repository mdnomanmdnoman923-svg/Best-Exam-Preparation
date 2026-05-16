import { useEffect, useState } from 'react'

const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 }

interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  width: number
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => ({
    isMobile: window.innerWidth < BREAKPOINTS.md,
    isTablet: window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg,
    isDesktop: window.innerWidth >= BREAKPOINTS.lg,
    width: window.innerWidth,
  }))

  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth
      setState({
        isMobile: w < BREAKPOINTS.md,
        isTablet: w >= BREAKPOINTS.md && w < BREAKPOINTS.lg,
        isDesktop: w >= BREAKPOINTS.lg,
        width: w,
      })
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return state
}
