import { sitelabels, siteregioncolors } from '../../lib/constants'
import { formatnumber } from '../../lib/format'
import type { MultiWarehouseOrderRow, SiteCode } from '../../types/api'
import { Split } from 'lucide-react'

export function MultiWarehouseTable({ items }: { items: MultiWarehouseOrderRow[] }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <Split size={20} className="text-central" />
        <div>
          <p className="card-title">Đơn hàng Split-Warehouse</p>
          <p className="card-subtitle">Chứng minh việc phân tán hàng hóa và cấp phát từ nhiều kho</p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Site gốc</th>
              <th style={{ textAlign: 'center' }}>Số kho cấp phát</th>
              <th style={{ textAlign: 'right' }}>Tổng số lượng</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.order_code}>
                <td style={{ fontWeight: 700, color: '#60a5fa' }}>{item.order_code}</td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: siteregioncolors[item.primary_site_code as SiteCode] }} />
                      {sitelabels[item.primary_site_code as SiteCode]}
                   </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="badge info" style={{ padding: '0.2rem 0.6rem' }}>{item.distinct_warehouses} kho</span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatnumber(item.total_allocated_qty)}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }} className="muted">
                  Không tìm thấy đơn hàng multi-warehouse nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
