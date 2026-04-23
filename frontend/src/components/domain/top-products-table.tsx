import { formatcurrency, formatnumber } from '../../lib/format'
import type { TopProductRow } from '../../types/api'

export function TopProductsTable({ items }: { items: TopProductRow[] }) {
  return (
    <div className="card table-wrap">
      <p className="card-title">Top sản phẩm bán chạy</p>
      <p className="card-subtitle">Top 5 trên toàn hệ thống</p>
      <table className="table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Sản phẩm</th>
            <th>Đã bán</th>
            <th>Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.sku}>
              <td>{item.sku}</td>
              <td>{item.product_name}</td>
              <td>{formatnumber(item.total_sold_qty)}</td>
              <td>{formatcurrency(item.total_revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
