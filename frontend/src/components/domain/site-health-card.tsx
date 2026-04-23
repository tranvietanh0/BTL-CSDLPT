import { CheckCircle2, XCircle, Database, Clock } from 'lucide-react'
import { sitelabels, siteregioncolors } from '../../lib/constants'
import type { SiteHealth } from '../../types/api'

export function SiteHealthCard({ item }: { item: SiteHealth }) {
  const isError = !item.is_healthy
  
  return (
    <div className={`card ${isError ? 'border-error' : ''}`} style={{ borderTop: `4px solid ${siteregioncolors[item.site_code]}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p className="card-title" style={{ fontSize: '1.25rem' }}>{sitelabels[item.site_code]}</p>
          <p className="card-subtitle">{item.site_name}</p>
        </div>
        {item.is_healthy ? (
          <CheckCircle2 size={24} className="text-south" />
        ) : (
          <XCircle size={24} className="text-error" style={{ color: '#f87171' }} />
        )}
      </div>

      <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
        <div className="muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Database size={14} /> {item.database_name ?? 'Unknown'}
        </div>
        <div className="muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Clock size={14} /> {item.checked_at ? new Date(item.checked_at).toLocaleTimeString() : 'N/A'}
        </div>
        
        {item.error && (
          <div className="error-state" style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.75rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)' }}>
            {item.error}
          </div>
        )}
      </div>
    </div>
  )
}
