import { ApiStatePanel } from '../components/domain/api-state-panel'
import { ConcurrencyDemoPanel } from '../components/domain/concurrency-demo-panel'
import { MultiWarehouseTable } from '../components/domain/multi-warehouse-table'
import { RevenueChart } from '../components/domain/revenue-chart'
import { TopProductsTable } from '../components/domain/top-products-table'
import { useMultiWarehouseOrders, useRevenueBySite, useTopProducts } from '../hooks/use-reports'

export function ReportsConcurrencyPage() {
  const revenue = useRevenueBySite()
  const topProducts = useTopProducts()
  const multiWarehouse = useMultiWarehouseOrders()

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Reports & Concurrency</h1>
          <p className="page-description">Màn kỹ thuật để chốt báo cáo toàn hệ thống và chứng minh tính nhất quán tồn kho.</p>
        </div>
      </header>

      <div className="grid two">
        <ApiStatePanel isLoading={revenue.isLoading} errorMessage={revenue.error instanceof Error ? revenue.error.message : null}>
          <RevenueChart items={revenue.data ?? []} />
        </ApiStatePanel>
        <ApiStatePanel isLoading={topProducts.isLoading} errorMessage={topProducts.error instanceof Error ? topProducts.error.message : null}>
          <TopProductsTable items={topProducts.data ?? []} />
        </ApiStatePanel>
      </div>

      <ApiStatePanel isLoading={multiWarehouse.isLoading} errorMessage={multiWarehouse.error instanceof Error ? multiWarehouse.error.message : null}>
        <MultiWarehouseTable items={multiWarehouse.data ?? []} />
      </ApiStatePanel>

      <ConcurrencyDemoPanel />
    </div>
  )
}
