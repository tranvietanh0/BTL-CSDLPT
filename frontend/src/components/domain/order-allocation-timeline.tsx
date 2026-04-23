import { sitelabels } from '../../lib/constants'
import { formatdatetime, formatnumber } from '../../lib/format'
import type { OrderAllocationRow } from '../../types/api'

export function OrderAllocationTimeline({ items }: { items: OrderAllocationRow[] }) {
  return (
    <div className="card">
      <p className="card-title">Allocation timeline</p>
      <p className="card-subtitle">Theo dõi các bước commit phân bổ đơn hàng giữa các site</p>
      <div className="timeline" style={{ marginTop: '1rem' }}>
        {items.map((item) => (
          <div className="timeline-item" key={`${item.order_code}-${item.warehouse_code}-${item.created_at}`}>
            <div className="button-row" style={{ justifyContent: 'space-between' }}>
              <strong>{sitelabels[item.site_code]} · {item.warehouse_code}</strong>
              <span className="badge healthy">{item.action}</span>
            </div>
            <div className="muted" style={{ marginTop: '0.4rem' }}>
              SKU {item.sku} · Số lượng {formatnumber(item.allocated_qty)} · {formatdatetime(item.created_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
