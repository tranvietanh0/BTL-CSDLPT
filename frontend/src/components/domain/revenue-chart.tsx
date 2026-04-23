import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, CartesianGrid } from 'recharts'
import { formatcurrency, formatnumber } from '../../lib/format'
import { siteregioncolors, sitelabels } from '../../lib/constants'
import type { RevenueRow, SiteCode } from '../../types/api'

export function RevenueChart({ items }: { items: RevenueRow[] }) {
  const filtered = items.filter((item) => item.site_code !== 'all')

  return (
    <div className="card">
      <p className="card-title">Doanh thu hệ thống</p>
      <p className="card-subtitle">Dữ liệu tổng hợp từ các site cục bộ</p>
      
      <div style={{ width: '100%', height: 300, marginTop: '1.5rem' }}>
        <ResponsiveContainer>
          <BarChart data={filtered} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="site_code" 
              stroke="#94a3b8" 
              fontSize={12}
              tickFormatter={(val) => sitelabels[val as SiteCode]}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={10} 
              tickFormatter={(value) => formatnumber(value)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ 
                background: '#0f172a', 
                border: '1px solid rgba(148,163,184,0.2)', 
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
              }}
              formatter={(value) => [formatcurrency(value as number), 'Doanh thu']}
              labelFormatter={(label) => sitelabels[label as SiteCode]}
            />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
              {filtered.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={siteregioncolors[entry.site_code as SiteCode]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
