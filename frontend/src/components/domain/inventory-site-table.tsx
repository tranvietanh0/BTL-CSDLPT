import { sitelabels } from '../../lib/constants'
import { formatnumber } from '../../lib/format'
import type { InventoryItem } from '../../types/api'

export function InventorySiteTable({ items }: { items: InventoryItem[] }) {
  return (
    <div className="card table-wrap">
      <p className="card-title">Tồn kho theo site / kho</p>
      <p className="card-subtitle">Luồng tra cứu tồn kho toàn hệ thống</p>
      <table className="table">
        <thead>
          <tr>
            <th>Site</th>
            <th>Kho</th>
            <th>Thành phố</th>
            <th>Available</th>
            <th>Reserved</th>
            <th>Reorder</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${item.warehouse_code}-${item.site_code}`}>
              <td>{sitelabels[item.site_code]}</td>
              <td>{item.warehouse_name}</td>
              <td>{item.city}</td>
              <td>{formatnumber(item.available_qty)}</td>
              <td>{formatnumber(item.reserved_qty)}</td>
              <td>{formatnumber(item.reorder_level)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
