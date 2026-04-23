import { formatnumber } from '../../lib/format'
import type { InventoryLookupResponse } from '../../types/api'

export function InventorySummaryCard({ inventory }: { inventory: InventoryLookupResponse }) {
  return (
    <div className="card">
      <p className="card-title">{inventory.product_name}</p>
      <p className="card-subtitle">SKU: {inventory.sku}</p>
      <div className="grid two" style={{ marginTop: '1rem' }}>
        <div>
          <div className="muted">Tổng available</div>
          <div className="kpi-value">{formatnumber(inventory.total_available_qty)}</div>
        </div>
        <div>
          <div className="muted">Tổng reserved</div>
          <div className="kpi-value">{formatnumber(inventory.total_reserved_qty)}</div>
        </div>
      </div>
    </div>
  )
}
