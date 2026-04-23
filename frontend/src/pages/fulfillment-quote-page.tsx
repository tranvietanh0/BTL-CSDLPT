import type { FormEvent } from 'react'
import { useState } from 'react'
import { Calculator, ClipboardList, CheckCircle2, AlertCircle } from 'lucide-react'

import { AllocationPlanCard } from '../components/domain/allocation-plan-card'
import { ApiStatePanel } from '../components/domain/api-state-panel'
import { useQuoteFulfillment } from '../hooks/use-inventory'
import { demopresets, sitelabels } from '../lib/constants'
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
    <div className="grid" style={{ gap: '2rem' }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Fulfillment Calculator</h1>
          <p className="page-description">
            Thuật toán phân bổ: Ưu tiên kho tại vùng khách hàng, sau đó quét các site khác theo thứ tự tối ưu.
          </p>
        </div>
      </header>

      <div className="grid two">
        <form className="card" onSubmit={handleSubmit} style={{ alignSelf: 'start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Calculator size={22} className="text-north" />
            <p className="card-title">Yêu cầu báo giá</p>
          </div>
          
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <div className="form-field">
              <label>Mã sản phẩm (SKU)</label>
              <input value={sku} onChange={(event) => setSku(event.target.value)} placeholder="VD: LAP-01" />
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label>Số lượng</label>
                <input type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
              </div>
              <div className="form-field">
                <label>Vùng khách hàng</label>
                <select value={region} onChange={(event) => setRegion(event.target.value as SiteCode)}>
                  <option value="north">Miền Bắc</option>
                  <option value="central">Miền Trung</option>
                  <option value="south">Miền Nam</option>
                </select>
              </div>
            </div>
            
            <div className="button-row" style={{ marginTop: '0.5rem' }}>
              <button className="button-primary" type="submit" disabled={quote.isPending} style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '0.5rem' }}>
                {quote.isPending ? 'Đang tính toán...' : 'Tính kế hoạch phân bổ'}
              </button>
            </div>
          </div>
        </form>

        <ApiStatePanel isLoading={quote.isPending} errorMessage={quote.error instanceof Error ? quote.error.message : null} hasData={Boolean(quote.data)} emptyMessage="Nhập thông tin bên trái để xem kế hoạch phân bổ dự kiến.">
          {quote.data ? (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <ClipboardList size={22} className="text-central" />
                <p className="card-title">Kết quả kiểm tra</p>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                   <div style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: quote.data.is_fulfillable ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', textAlign: 'center' }}>
                      {quote.data.is_fulfillable ? <CheckCircle2 size={24} className="text-south" style={{ margin: '0 auto 0.5rem' }} /> : <AlertCircle size={24} style={{ color: '#f87171', margin: '0 auto 0.5rem' }} />}
                      <div style={{ fontWeight: 700, color: quote.data.is_fulfillable ? '#34d399' : '#f87171' }}>
                        {quote.data.is_fulfillable ? 'Đủ hàng cung ứng' : 'Không đủ hàng'}
                      </div>
                   </div>
                   <div style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', textAlign: 'center' }}>
                      <div className="muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Thiếu hụt (Shortfall)</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa' }}>{quote.data.shortfall_qty}</div>
                   </div>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="muted">Sản phẩm:</span>
                    <span style={{ fontWeight: 600 }}>{quote.data.sku}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="muted">Yêu cầu:</span>
                    <span style={{ fontWeight: 600 }}>{quote.data.requested_qty} đơn vị</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="muted">Vùng đích:</span>
                    <span style={{ fontWeight: 600 }}>{sitelabels[quote.data.customer_region as SiteCode]}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </ApiStatePanel>
      </div>

      {quote.data ? <AllocationPlanCard allocations={quote.data.allocations} /> : null}
    </div>
  )
}
