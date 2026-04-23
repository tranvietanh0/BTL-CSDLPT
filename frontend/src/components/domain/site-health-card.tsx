import { sitelabels, siteregioncolors } from '../../lib/constants'
import type { SiteHealth } from '../../types/api'

export function SiteHealthCard({ item }: { item: SiteHealth }) {
  return (
    <div className="card">
      <div className="button-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="card-title">{sitelabels[item.site_code]}</p>
          <p className="card-subtitle">{item.site_name}</p>
        </div>
        <span className={`badge ${item.is_healthy ? 'healthy' : 'error'}`}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: siteregioncolors[item.site_code] }} />
          {item.is_healthy ? 'Healthy' : 'Error'}
        </span>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <div className="muted">Database: {item.database_name ?? 'N/A'}</div>
        <div className="muted">Checked: {item.checked_at ?? 'N/A'}</div>
        {item.error ? <div className="error-state" style={{ marginTop: '0.75rem' }}>{item.error}</div> : null}
      </div>
    </div>
  )
}
