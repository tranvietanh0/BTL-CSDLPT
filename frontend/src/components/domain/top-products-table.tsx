import { formatcurrency, formatnumber } from '../../lib/format'
import type { TopProductRow } from '../../types/api'
import { Trophy } from 'lucide-react'

export function TopProductsTable({ items }: { items: TopProductRow[] }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <Trophy size={20} style={{ color: '#fbbf24' }} />
        <div>
          <p className="card-title">Sản phẩm tiêu biểu</p>
          <p className="card-subtitle">Xếp hạng theo doanh số toàn hệ thống</p>
        </div>
      </div>
      
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th style={{ textAlign: 'right' }}>Đã bán</th>
              <th style={{ textAlign: 'right' }}>Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.sku}>
                <td>
                  <div style={{ fontWeight: 600 }}>{item.sku}</div>
                  <div className="muted" style={{ fontSize: '0.8rem' }}>{item.product_name}</div>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>{formatnumber(item.total_sold_qty)}</td>
                <td style={{ textAlign: 'right', fontWeight: 600, color: '#34d399' }}>{formatcurrency(item.total_revenue)}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }} className="muted">
                  Chưa có dữ liệu bán hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
