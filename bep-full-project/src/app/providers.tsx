import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AuthStateListener } from '@/features/auth/components/AuthStateListener'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min
      gcTime: 1000 * 60 * 10,      // 10 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthStateListener />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#111d35',
            color: '#e2e8f0',
            border: '1px solid #1e2d4a',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: '"Hind Siliguri", sans-serif',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#111d35' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#111d35' } },
        }}
      />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
