import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { httpclient } from '../lib/http'
import type { SiteHealth } from '../types/api'

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await httpclient.get<SiteHealth[]>('/demo/health/distributed')
      return response.data
    },
  })
}

export function useSeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const response = await httpclient.post('/demo/seed')
      return response.data
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['health'] }),
        queryClient.invalidateQueries({ queryKey: ['revenue-by-site'] }),
        queryClient.invalidateQueries({ queryKey: ['top-products'] }),
        queryClient.invalidateQueries({ queryKey: ['multi-warehouse-orders'] }),
        queryClient.invalidateQueries({ queryKey: ['low-stock'] }),
      ])
    },
  })
}
