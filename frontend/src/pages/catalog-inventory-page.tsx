import { useMemo, useState } from 'react'

import { ApiStatePanel } from '../components/domain/api-state-panel'
import { InventorySiteTable } from '../components/domain/inventory-site-table'
import { InventorySummaryCard } from '../components/domain/inventory-summary-card'
import { ProductTable } from '../components/domain/product-table'
import { useProducts } from '../hooks/use-catalog'
import { useGlobalInventory } from '../hooks/use-inventory'
import { demopresets } from '../lib/constants'

export function CatalogInventoryPage() {
  const [selectedSku, setSelectedSku] = useState<string>(demopresets.sku)
  const products = useProducts()
  const inventory = useGlobalInventory(selectedSku)
  const currentProduct = useMemo(
    () => products.data?.find((item) => item.sku === selectedSku) ?? null,
    [products.data, selectedSku],
  )

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Catalog & Inventory</h1>
          <p className="page-description">Tra cứu sản phẩm dùng chung và tồn kho toàn hệ thống theo từng site/kho.</p>
        </div>
      </header>

      <div className="grid two">
        <ApiStatePanel isLoading={products.isLoading} errorMessage={products.error instanceof Error ? products.error.message : null}>
          <ProductTable items={products.data ?? []} onSelect={setSelectedSku} />
        </ApiStatePanel>
        <div className="grid">
          <div className="card">
            <p className="card-title">SKU đang chọn</p>
            <div className="button-row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div>
                <div className="kpi-value">{selectedSku}</div>
                <p className="card-subtitle">{currentProduct?.name ?? 'Chọn từ bảng bên trái'}</p>
              </div>
              <button className="button-secondary" onClick={() => inventory.refetch()}>
                Refresh tồn kho
              </button>
            </div>
          </div>
          <ApiStatePanel isLoading={inventory.isLoading} errorMessage={inventory.error instanceof Error ? inventory.error.message : null} hasData={Boolean(inventory.data)} emptyMessage="Chưa có dữ liệu tồn kho.">
            {inventory.data ? <InventorySummaryCard inventory={inventory.data} /> : null}
          </ApiStatePanel>
        </div>
      </div>

      <ApiStatePanel isLoading={inventory.isLoading} errorMessage={inventory.error instanceof Error ? inventory.error.message : null} hasData={Boolean(inventory.data?.items?.length)} emptyMessage="Không có site nào chứa SKU này.">
        {inventory.data ? <InventorySiteTable items={inventory.data.items} /> : null}
      </ApiStatePanel>
    </div>
  )
}
