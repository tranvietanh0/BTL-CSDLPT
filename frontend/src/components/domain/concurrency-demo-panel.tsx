import { demopresets } from '../../lib/constants'
import { formatnumber } from '../../lib/format'
import { useConcurrencyDemo } from '../../hooks/use-orders'
import type { SiteCode } from '../../types/api'

export function ConcurrencyDemoPanel() {
  const mutation = useConcurrencyDemo()

  const handleRun = () => {
    mutation.mutate({
      sku: demopresets.concurrencySku,
      quantity_per_order: demopresets.concurrencyQuantity,
      customer_region: demopresets.region as SiteCode,
      customer_codes: [...demopresets.concurrencyCustomers],
    })
  }

  return (
    <div className="card">
      <div className="button-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="card-title">Concurrency demo</p>
          <p className="card-subtitle">Mô phỏng 2 request cùng mua một SKU để chứng minh không âm kho</p>
        </div>
        <button className="button-primary" onClick={handleRun} disabled={mutation.isPending}>
          {mutation.isPending ? 'Đang chạy...' : 'Chạy demo'}
        </button>
      </div>
      {mutation.data ? (
        <div className="grid two" style={{ marginTop: '1rem' }}>
          <div className="card" style={{ background: 'rgba(30, 41, 59, 0.45)' }}>
            <p className="card-title">Kết quả 2 request</p>
            <div className="timeline" style={{ marginTop: '1rem' }}>
              {mutation.data.results.map((item) => (
                <div className="timeline-item" key={item.customer_code}>
                  <div className="button-row" style={{ justifyContent: 'space-between' }}>
                    <strong>{item.customer_code}</strong>
                    <span className={`badge ${item.is_success ? 'healthy' : 'error'}`}>
                      {item.is_success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <div className="muted" style={{ marginTop: '0.4rem' }}>
                    {item.order_code ? `Order: ${item.order_code}` : item.error}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ background: 'rgba(30, 41, 59, 0.45)' }}>
            <p className="card-title">Inventory after</p>
            <div className="muted">SKU: {mutation.data.inventory_after.sku}</div>
            <div className="kpi-value">{formatnumber(mutation.data.inventory_after.total_available_qty)}</div>
            <div className="muted">Tổng available sau khi chạy demo</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
