import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navitems = [
  { to: '/dashboard', label: 'Dashboard', subtitle: 'Seed, health, KPI' },
  { to: '/catalog-inventory', label: 'Catalog & Inventory', subtitle: 'Sản phẩm và tồn kho' },
  { to: '/fulfillment-quote', label: 'Fulfillment Quote', subtitle: 'Phân bổ đa kho' },
  { to: '/order-execution', label: 'Order Execution', subtitle: 'Tạo đơn và allocation' },
  { to: '/reports-concurrency', label: 'Reports & Concurrency', subtitle: 'Báo cáo và đồng thời' },
]

export function AppShell() {
  const location = useLocation()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <p className="brand-title">Distributed Warehouse</p>
        <p className="brand-subtitle">React demo cho đồ án CSDL phân tán đa kho</p>
        <nav className="flow-nav">
          {navitems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flow-link ${location.pathname === item.to ? 'active' : ''}`}
            >
              <div style={{ fontWeight: 700 }}>{item.label}</div>
              <div className="muted" style={{ fontSize: '0.88rem' }}>{item.subtitle}</div>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
