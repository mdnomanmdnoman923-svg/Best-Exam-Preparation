// BEP is always dark — this hook is a future extension point
export function useTheme() {
  return { theme: 'dark' as const }
}
