import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryclient = new QueryClient()

export function AppProviders({ children }: PropsWithChildren) {
  return <QueryClientProvider client={queryclient}>{children}</QueryClientProvider>
}
