export type SiteCode = 'north' | 'central' | 'south'

export type SiteHealth = {
  site_code: SiteCode
  site_name: string
  is_healthy: boolean
  database_name?: string | null
  checked_at?: string | null
  error?: string | null
}

export type ProductSummary = {
  sku: string
  name: string
  category_code: string
  category_name: string
  price: number
}

export type InventoryItem = {
  site_code: SiteCode
  warehouse_code: string
  warehouse_name: string
  city: string
  available_qty: number
  reserved_qty: number
  reorder_level: number
}

export type InventoryLookupResponse = {
  sku: string
  product_name: string
  total_available_qty: number
  total_reserved_qty: number
  items: InventoryItem[]
}

export type FulfillmentAllocation = {
  site_code: SiteCode
  warehouse_code: string
  warehouse_name: string
  allocated_qty: number
  available_before: number
}

export type FulfillmentQuoteRequest = {
  sku: string
  quantity: number
  customer_region: SiteCode
}

export type FulfillmentQuoteResponse = {
  sku: string
  requested_qty: number
  customer_region: SiteCode
  is_fulfillable: boolean
  shortfall_qty: number
  allocations: FulfillmentAllocation[]
}

export type OrderCreateRequest = {
  customer_code: string
  sku: string
  quantity: number
  customer_region: SiteCode
}

export type OrderCreateResponse = {
  order_code: string
  status: string
  primary_site_code: SiteCode
  total_amount: number
  allocations: FulfillmentAllocation[]
}

export type OrderAllocationRow = {
  order_code: string
  sku: string
  site_code: SiteCode
  warehouse_code: string
  allocated_qty: number
  action: string
  created_at: string
}

export type OrderDetailResponse = {
  order_code: string
  customer_code: string
  primary_site_code: SiteCode
  primary_warehouse_code: string
  status: string
  total_amount: number
  created_at: string
  allocations: OrderAllocationRow[]
}

export type RevenueRow = {
  site_code: SiteCode | 'all'
  order_count: number
  revenue: number
}

export type TopProductRow = {
  sku: string
  product_name: string
  total_sold_qty: number
  total_revenue: number
}

export type MultiWarehouseOrderRow = {
  order_code: string
  primary_site_code: SiteCode
  distinct_warehouses: number
  total_allocated_qty: number
}

export type ConcurrencyDemoRequest = {
  sku: string
  quantity_per_order: number
  customer_region: SiteCode
  customer_codes: string[]
}

export type ConcurrencyAttemptResult = {
  customer_code: string
  is_success: boolean
  order_code?: string | null
  error?: string | null
}

export type ConcurrencyDemoResponse = {
  sku: string
  quantity_per_order: number
  results: ConcurrencyAttemptResult[]
  inventory_after: InventoryLookupResponse
}
