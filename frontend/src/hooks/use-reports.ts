import { useQuery } from '@tanstack/react-query'

import { httpclient } from '../lib/http'
import type { MultiWarehouseOrderRow, RevenueRow, TopProductRow } from '../types/api'

export function useRevenueBySite() {
  return useQuery({
    queryKey: ['revenue-by-site'],
    queryFn: async () => {
      const response = await httpclient.get<RevenueRow[]>('/reports/revenue-by-site')
      return response.data
    },
  })
}

export function useTopProducts() {
  return useQuery({
    queryKey: ['top-products'],
    queryFn: async () => {
      const response = await httpclient.get<TopProductRow[]>('/reports/top-products')
      return response.data
    },
  })
}

export function useMultiWarehouseOrders() {
  return useQuery({
    queryKey: ['multi-warehouse-orders'],
    queryFn: async () => {
      const response = await httpclient.get<MultiWarehouseOrderRow[]>('/reports/multi-warehouse-orders')
      return response.data
    },
  })
}
