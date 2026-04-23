import type { FormEvent } from 'react'
import { useState } from 'react'

import { AllocationPlanCard } from '../components/domain/allocation-plan-card'
import { ApiStatePanel } from '../components/domain/api-state-panel'
import { OrderAllocationTimeline } from '../components/domain/order-allocation-timeline'
import { useCreateOrder, useOrderDetail } from '../hooks/use-orders'
import { demopresets } from '../lib/constants'
import { formatcurrency } from '../lib/format'
import type { SiteCode } from '../types/api'

export function OrderExecutionPage() {
  const [customerCode, setCustomerCode] = useState<string>(demopresets.customerCode)
  const [sku, setSku] = useState<string>(demopresets.sku)
  const [quantity, setQuantity] = useState<number>(demopresets.quantity)
  const [region, setRegion] = useState<SiteCode>(demopresets.region)
  const [detailCode, setDetailCode] = useState('')
  const createOrder = useCreateOrder()
  const orderDetail = useOrderDetail(detailCode)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    createOrder.mutate(
      {
        customer_code: customerCode,
        sku,
        quantity: Number(quantity),
        customer_region: region,
      },
      {
        onSuccess: (data) => {
          setDetailCode(data.order_code)
        },
      },
    )
  }

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Order Execution</h1>
          <p className="page-description">Tạo đơn hàng thật và xem timeline allocation để chứng minh split order đa kho.</p>
        </div>
      </header>

      <div className="grid two">
        <form className="card" onSubmit={handleSubmit}>
          <p className="card-title">Tạo đơn hàng</p>
          <p className="card-subtitle">Preset gợi ý: CUS-N-01 · LAP-01 · 10 · north</p>
          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <div className="form-field">
              <label>Customer code</label>
              <input value={customerCode} onChange={(event) => setCustomerCode(event.target.value)} />
            </div>
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
            <button className="button-primary" type="submit" disabled={createOrder.isPending}>
              {createOrder.isPending ? 'Đang tạo...' : 'Tạo order'}
            </button>
          </div>
        </form>

        <ApiStatePanel isLoading={createOrder.isPending} errorMessage={createOrder.error instanceof Error ? createOrder.error.message : null} hasData={Boolean(createOrder.data)} emptyMessage="Chưa có order mới.">
          {createOrder.data ? (
            <div className="card">
              <p className="card-title">Order result</p>
              <div className="kpi-value">{createOrder.data.order_code}</div>
              <p className="card-subtitle">Primary site: {createOrder.data.primary_site_code}</p>
              <div style={{ marginTop: '1rem' }}>
                <span className="badge healthy">{createOrder.data.status}</span>
              </div>
              <div style={{ marginTop: '1rem' }} className="muted">
                Total amount: {formatcurrency(createOrder.data.total_amount)}
              </div>
            </div>
          ) : null}
        </ApiStatePanel>
      </div>

      {createOrder.data ? <AllocationPlanCard allocations={createOrder.data.allocations} title="Phân bổ của order vừa tạo" /> : null}

      <div className="card">
        <div className="button-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="card-title">Chi tiết order</p>
            <p className="card-subtitle">Lấy lại chi tiết từ backend theo order_code</p>
          </div>
          <div className="button-row">
            <input value={detailCode} onChange={(event) => setDetailCode(event.target.value)} placeholder="Nhập order code" />
            <button className="button-secondary" onClick={() => orderDetail.refetch()}>
              Xem detail
            </button>
          </div>
        </div>
      </div>

      <ApiStatePanel isLoading={orderDetail.isLoading} errorMessage={orderDetail.error instanceof Error ? orderDetail.error.message : null} hasData={Boolean(orderDetail.data)} emptyMessage="Chưa có order detail.">
        {orderDetail.data ? <OrderAllocationTimeline items={orderDetail.data.allocations} /> : null}
      </ApiStatePanel>
    </div>
  )
}
