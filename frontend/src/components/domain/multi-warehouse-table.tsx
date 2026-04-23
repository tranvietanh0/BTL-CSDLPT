import { sitelabels } from '../../lib/constants'
import { formatnumber } from '../../lib/format'
import type { MultiWarehouseOrderRow } from '../../types/api'

export function MultiWarehouseTable({ items }: { items: MultiWarehouseOrderRow[] }) {
  return (
    <div className="card table-wrap">
      <p className="card-title">Đơn hàng multi-warehouse</p>
      <p className="card-subtitle">Các đơn cần lấy hàng từ nhiều kho khác nhau</p>
      <table className="table">
        <thead>
          <tr>
            <th>Order Code</th>
            <th>Primary Site</th>
            <th>Số kho</th>
            <th>Tổng allocated</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.order_code}>
              <td>{item.order_code}</td>
              <td>{sitelabels[item.primary_site_code]}</td>
              <td>{formatnumber(item.distinct_warehouses)}</td>
              <td>{formatnumber(item.total_allocated_qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
