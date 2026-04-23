import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { httpclient } from '../lib/http'
import type { ConcurrencyDemoRequest, ConcurrencyDemoResponse, OrderCreateRequest, OrderCreateResponse, OrderDetailResponse } from '../types/api'

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: OrderCreateRequest) => {
      const response = await httpclient.post<OrderCreateResponse>('/orders', payload)
      return response.data
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['revenue-by-site'] }),
        queryClient.invalidateQueries({ queryKey: ['top-products'] }),
        queryClient.invalidateQueries({ queryKey: ['multi-warehouse-orders'] }),
        queryClient.invalidateQueries({ queryKey: ['low-stock'] }),
      ])
    },
  })
}

export function useOrderDetail(orderCode: string) {
  return useQuery({
    queryKey: ['order-detail', orderCode],
    queryFn: async () => {
      const response = await httpclient.get<OrderDetailResponse>(`/orders/${orderCode}`)
      return response.data
    },
    enabled: Boolean(orderCode),
  })
}

export function useConcurrencyDemo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ConcurrencyDemoRequest) => {
      const response = await httpclient.post<ConcurrencyDemoResponse>('/orders/demo-concurrency', payload)
      return response.data
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['revenue-by-site'] }),
        queryClient.invalidateQueries({ queryKey: ['top-products'] }),
        queryClient.invalidateQueries({ queryKey: ['multi-warehouse-orders'] }),
        queryClient.invalidateQueries({ queryKey: ['low-stock'] }),
      ])
    },
  })
}
