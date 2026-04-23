import type { FormEvent } from 'react'
import { useState } from 'react'

import { AllocationPlanCard } from '../components/domain/allocation-plan-card'
import { ApiStatePanel } from '../components/domain/api-state-panel'
import { useQuoteFulfillment } from '../hooks/use-inventory'
import { demopresets } from '../lib/constants'
import type { SiteCode } from '../types/api'

export function FulfillmentQuotePage() {
  const [sku, setSku] = useState<string>(demopresets.sku)
  const [quantity, setQuantity] = useState<number>(demopresets.quantity)
  const [region, setRegion] = useState<SiteCode>(demopresets.region)
  const quote = useQuoteFulfillment()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    quote.mutate({
      sku,
      quantity: Number(quantity),
      customer_region: region,
    })
  }

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Fulfillment Quote</h1>
          <p className="page-description">Kiểm tra kho gần khách trước, sau đó tính kế hoạch phân bổ sang các site khác khi thiếu hàng.</p>
        </div>
      </header>

      <div className="grid two">
        <form className="card" onSubmit={handleSubmit}>
          <p className="card-title">Input quote</p>
          <p className="card-subtitle">Preset gợi ý để demo split order: LAP-01 · 10 · north</p>
          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <div className="form-field">
              <label>SKU</label>
              <input value={sku} onChange={(event) => setSku(event.target.value)} />
            </div>
            <div className="form-field">
              <label>Số lượng</label>
              <input type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
            </div>
            <div className="form-field">
              <label>Region</label>
              <select value={region} onChange={(event) => setRegion(event.target.value as SiteCode)}>
                <option value="north">north</option>
                <option value="central">central</option>
                <option value="south">south</option>
              </select>
            </div>
          </div>
          <div className="button-row" style={{ marginTop: '1rem' }}>
            <button className="button-primary" type="submit" disabled={quote.isPending}>
              {quote.isPending ? 'Đang tính...' : 'Tạo quote'}
            </button>
          </div>
        </form>

        <ApiStatePanel isLoading={quote.isPending} errorMessage={quote.error instanceof Error ? quote.error.message : null} hasData={Boolean(quote.data)} emptyMessage="Chưa có quote. Hãy submit form bên trái.">
          {quote.data ? (
            <div className="card">
              <p className="card-title">Kết quả quote</p>
              <div className="button-row" style={{ marginTop: '1rem' }}>
                <span className={`badge ${quote.data.is_fulfillable ? 'healthy' : 'error'}`}>
                  {quote.data.is_fulfillable ? 'Có thể đáp ứng' : 'Thiếu hàng'}
                </span>
                <span className="badge info">Shortfall: {quote.data.shortfall_qty}</span>
              </div>
              <div style={{ marginTop: '1rem' }} className="muted">
                SKU {quote.data.sku} · Requested {quote.data.requested_qty} · Region {quote.data.customer_region}
              </div>
            </div>
          ) : null}
        </ApiStatePanel>
      </div>

      {quote.data ? <AllocationPlanCard allocations={quote.data.allocations} /> : null}
    </div>
  )
}
