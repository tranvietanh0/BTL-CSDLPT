import { useQuery } from '@tanstack/react-query'

import { httpclient } from '../lib/http'
import type { ProductSummary } from '../types/api'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await httpclient.get<ProductSummary[]>('/catalog/products')
      return response.data
    },
  })
}

export function useProduct(sku: string) {
  return useQuery({
    queryKey: ['product', sku],
    queryFn: async () => {
      const response = await httpclient.get<ProductSummary>(`/catalog/products/${sku}`)
      return response.data
    },
    enabled: Boolean(sku),
  })
}
