import { formatcurrency } from '../../lib/format'
import type { ProductSummary } from '../../types/api'

export function ProductTable({ items, onSelect }: { items: ProductSummary[]; onSelect?: (sku: string) => void }) {
  return (
    <div className="card table-wrap">
      <div className="button-row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <p className="card-title">Danh sách sản phẩm</p>
          <p className="card-subtitle">Dữ liệu dùng chung được nhân bản tại mọi site</p>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Tên</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.sku}>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>{item.category_name}</td>
              <td>{formatcurrency(item.price)}</td>
              <td>
                <button className="button-secondary" onClick={() => onSelect?.(item.sku)}>
                  Chọn SKU
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
