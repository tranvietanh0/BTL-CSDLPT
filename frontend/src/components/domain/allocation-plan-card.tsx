import { sitelabels } from '../../lib/constants'
import { formatnumber } from '../../lib/format'
import type { FulfillmentAllocation } from '../../types/api'

export function AllocationPlanCard({ allocations, title = 'Kế hoạch phân bổ' }: { allocations: FulfillmentAllocation[]; title?: string }) {
  return (
    <div className="card">
      <p className="card-title">{title}</p>
      <p className="card-subtitle">Ưu tiên site gần khách hàng trước, bổ sung từ site khác khi thiếu hàng</p>
      <div className="timeline" style={{ marginTop: '1rem' }}>
        {allocations.map((item) => (
          <div className="timeline-item" key={`${item.site_code}-${item.warehouse_code}`}>
            <div className="button-row" style={{ justifyContent: 'space-between' }}>
              <strong>{sitelabels[item.site_code]} · {item.warehouse_name}</strong>
              <span className="badge info">Allocate {formatnumber(item.allocated_qty)}</span>
            </div>
            <div className="muted" style={{ marginTop: '0.45rem' }}>
              Kho: {item.warehouse_code} · Available trước phân bổ: {formatnumber(item.available_before)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
