import { sitelabels, siteregioncolors } from '../../lib/constants'
import { formatnumber } from '../../lib/format'
import type { FulfillmentAllocation, SiteCode } from '../../types/api'
import { MapPin, PackageCheck } from 'lucide-react'

export function AllocationPlanCard({ allocations, title = 'Kế hoạch phân bổ' }: { allocations: FulfillmentAllocation[]; title?: string }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <PackageCheck size={22} className="text-south" />
        <div>
          <p className="card-title">{title}</p>
          <p className="card-subtitle">Chi tiết nguồn hàng được cấp phát từ các site</p>
        </div>
      </div>

      <div className="timeline" style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
        {allocations.map((item) => (
          <div 
            className="timeline-item" 
            key={`${item.site_code}-${item.warehouse_code}`}
            style={{ borderLeft: `4px solid ${siteregioncolors[item.site_code as SiteCode]}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: siteregioncolors[item.site_code as SiteCode] }} />
                <span style={{ fontWeight: 700 }}>{sitelabels[item.site_code as SiteCode]}</span>
                <span className="muted">·</span>
                <span>{item.warehouse_name}</span>
              </div>
              <div style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', fontWeight: 700 }}>
                +{formatnumber(item.allocated_qty)}
              </div>
            </div>
            <div className="muted" style={{ marginTop: '0.6rem', fontSize: '0.85rem' }}>
              Mã kho: <code style={{ background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{item.warehouse_code}</code> 
              <span style={{ margin: '0 0.5rem' }}>|</span> 
              Tồn khả dụng: {formatnumber(item.available_before)}
            </div>
          </div>
        ))}
        {allocations.length === 0 && (
          <div className="empty-state">Không có kế hoạch phân bổ nào được tạo ra.</div>
        )}
      </div>
    </div>
  )
}
