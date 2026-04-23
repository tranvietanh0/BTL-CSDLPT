import { Database, Truck, AlertTriangle, RefreshCw, Zap } from 'lucide-react'
import { ApiStatePanel } from '../components/domain/api-state-panel'
import { ConcurrencyDemoPanel } from '../components/domain/concurrency-demo-panel'
import { RevenueChart } from '../components/domain/revenue-chart'
import { SiteHealthCard } from '../components/domain/site-health-card'
import { TopProductsTable } from '../components/domain/top-products-table'
import { useHealth, useSeed } from '../hooks/use-health'
import { useLowStock } from '../hooks/use-inventory'
import { useMultiWarehouseOrders, useRevenueBySite, useTopProducts } from '../hooks/use-reports'
import { formatnumber } from '../lib/format'

export function DashboardPage() {
  const health = useHealth()
  const seed = useSeed()
  const revenue = useRevenueBySite()
  const topProducts = useTopProducts()
  const multiWarehouse = useMultiWarehouseOrders()
  const lowStock = useLowStock()

  return (
    <div className="grid" style={{ gap: '2rem' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Hệ thống Phân tán</h1>
          <p className="page-description">
            Giám sát trạng thái 3 site PostgreSQL và hiệu suất vận hành toàn hệ thống.
          </p>
        </div>
        <button 
          className="button-primary" 
          onClick={() => seed.mutate()} 
          disabled={seed.isPending}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Zap size={18} fill={seed.isPending ? 'currentColor' : 'white'} />
          {seed.isPending ? 'Đang khởi tạo...' : 'Seed Data'}
        </button>
      </header>

      <div className="grid three">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>
            <Database size={32} />
          </div>
          <div>
            <p className="card-subtitle">Nodes hoạt động</p>
            <div className="kpi-value" style={{ marginTop: '0.25rem' }}>3 / 3</div>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
            <Truck size={32} />
          </div>
          <div>
            <p className="card-subtitle">Đơn liên kho</p>
            <div className="kpi-value" style={{ marginTop: '0.25rem' }}>{formatnumber(multiWarehouse.data?.length ?? 0)}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
            <AlertTriangle size={32} />
          </div>
          <div>
            <p className="card-subtitle">Cảnh báo tồn</p>
            <div className="kpi-value" style={{ marginTop: '0.25rem' }}>{formatnumber(lowStock.data?.length ?? 0)}</div>
          </div>
        </div>
      </div>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <RefreshCw size={20} className="muted" />
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Trạng thái kết nối Site</h2>
        </div>
        <ApiStatePanel isLoading={health.isLoading} errorMessage={health.error instanceof Error ? health.error.message : null} hasData={Boolean(health.data?.length)} emptyMessage="Chưa có dữ liệu health.">
          <div className="grid three">
            {health.data?.map((item) => <SiteHealthCard key={item.site_code} item={item} />)}
          </div>
        </ApiStatePanel>
      </section>

      <div className="grid two">
        <ApiStatePanel isLoading={revenue.isLoading} errorMessage={revenue.error instanceof Error ? revenue.error.message : null}>
          <RevenueChart items={revenue.data ?? []} />
        </ApiStatePanel>
        <ApiStatePanel isLoading={topProducts.isLoading} errorMessage={topProducts.error instanceof Error ? topProducts.error.message : null}>
          <TopProductsTable items={topProducts.data ?? []} />
        </ApiStatePanel>
      </div>

      <ConcurrencyDemoPanel />
    </div>
  )
}
