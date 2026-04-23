import { formatcurrency } from '../../lib/format'
import type { ProductSummary } from '../../types/api'
import { Search, ChevronRight } from 'lucide-react'

export function ProductTable({ items, onSelect }: { items: ProductSummary[]; onSelect?: (sku: string) => void }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <Search size={20} className="muted" />
        <div>
          <p className="card-title">Danh mục sản phẩm</p>
          <p className="card-subtitle">Dữ liệu Global được nhân bản tại mọi Site</p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Danh mục</th>
              <th style={{ textAlign: 'right' }}>Giá bán</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.sku} style={{ cursor: 'pointer' }} onClick={() => onSelect?.(item.sku)}>
                <td>
                  <div style={{ fontWeight: 700 }}>{item.sku}</div>
                  <div className="muted" style={{ fontSize: '0.8rem' }}>{item.name}</div>
                </td>
                <td>
                   <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', textTransform: 'none', fontWeight: 500 }}>
                    {item.category_name}
                   </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatcurrency(item.price)}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="button-secondary" style={{ padding: '0.4rem' }}>
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
