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
    <div className="grid" style={{ gap: '1.5rem' }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard demo đa kho</h1>
          <p className="page-description">
            Seed dữ liệu, kiểm tra health 3 site, theo dõi KPI toàn hệ thống và chuẩn bị luồng demo cho đồ án.
          </p>
        </div>
        <div className="button-row">
          <button className="button-primary" onClick={() => seed.mutate()} disabled={seed.isPending}>
            {seed.isPending ? 'Đang seed...' : 'Seed dữ liệu demo'}
          </button>
        </div>
      </header>

      <div className="grid three">
        <div className="card">
          <p className="card-title">3 site PostgreSQL</p>
          <div className="kpi-value">3</div>
          <p className="card-subtitle">Bắc · Trung · Nam</p>
        </div>
        <div className="card">
          <p className="card-title">Đơn multi-warehouse</p>
          <div className="kpi-value">{formatnumber(multiWarehouse.data?.length ?? 0)}</div>
          <p className="card-subtitle">Các đơn được cấp phát từ nhiều kho</p>
        </div>
        <div className="card">
          <p className="card-title">Low stock rows</p>
          <div className="kpi-value">{formatnumber(lowStock.data?.length ?? 0)}</div>
          <p className="card-subtitle">Bản ghi tồn thấp cần theo dõi</p>
        </div>
      </div>

      <ApiStatePanel isLoading={health.isLoading} errorMessage={health.error instanceof Error ? health.error.message : null} hasData={Boolean(health.data?.length)} emptyMessage="Chưa có dữ liệu health.">
        <div className="grid three">
          {health.data?.map((item) => <SiteHealthCard key={item.site_code} item={item} />)}
        </div>
      </ApiStatePanel>

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
