import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { QueryClientProvider as QDevtools } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#111d35',
            color: '#e2e8f0',
            border: '1px solid #1e2d4a',
            borderRadius: '12px',
            fontFamily: '"Hind Siliguri", sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#111d35' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#111d35' },
          },
        }}
      />
    </QueryClientProvider>
  )
}
