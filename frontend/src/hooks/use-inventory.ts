import { useMutation, useQuery } from '@tanstack/react-query'

import { httpclient } from '../lib/http'
import type { FulfillmentQuoteRequest, FulfillmentQuoteResponse, InventoryLookupResponse } from '../types/api'

export function useGlobalInventory(sku: string) {
  return useQuery({
    queryKey: ['inventory-global', sku],
    queryFn: async () => {
      const response = await httpclient.get<InventoryLookupResponse>(`/inventory/${sku}/global`)
      return response.data
    },
    enabled: Boolean(sku),
  })
}

export function useLowStock() {
  return useQuery({
    queryKey: ['low-stock'],
    queryFn: async () => {
      const response = await httpclient.get('/inventory/low-stock')
      return response.data as Array<Record<string, unknown>>
    },
  })
}

export function useQuoteFulfillment() {
  return useMutation({
    mutationFn: async (payload: FulfillmentQuoteRequest) => {
      const response = await httpclient.post<FulfillmentQuoteResponse>('/inventory/quote-fulfillment', payload)
      return response.data
    },
  })
}
