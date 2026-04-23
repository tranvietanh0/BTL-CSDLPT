export const sitelabels = {
  north: 'Miền Bắc',
  central: 'Miền Trung',
  south: 'Miền Nam',
} as const

export const siteregioncolors = {
  north: '#3b82f6',
  central: '#f59e0b',
  south: '#22c55e',
} as const

export const demopresets = {
  sku: 'LAP-01',
  customerCode: 'CUS-N-01',
  region: 'north',
  quantity: 10,
  concurrencySku: 'PHN-01',
  concurrencyQuantity: 6,
  concurrencyCustomers: ['CUS-N-02', 'CUS-N-03'],
} as const
