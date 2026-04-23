import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { formatcurrency, formatnumber } from '../../lib/format'
import type { RevenueRow } from '../../types/api'

export function RevenueChart({ items }: { items: RevenueRow[] }) {
  const filtered = items.filter((item) => item.site_code !== 'all')

  return (
    <div className="card">
      <p className="card-title">Doanh thu theo site</p>
      <p className="card-subtitle">Tổng hợp từ 3 site cục bộ qua middleware</p>
      <div style={{ width: '100%', height: 280, marginTop: '1rem' }}>
        <ResponsiveContainer>
          <BarChart data={filtered}>
            <XAxis dataKey="site_code" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" tickFormatter={(value) => formatnumber(value)} />
            <Tooltip formatter={(value) => formatcurrency(value as number)} />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
