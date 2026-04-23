import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  ShoppingCart, 
  BarChart2 
} from 'lucide-react'

const navitems = [
  { to: '/dashboard', label: 'Dashboard', subtitle: 'Health & KPI', icon: LayoutDashboard },
  { to: '/catalog-inventory', label: 'Inventory', subtitle: 'Quản lý tồn kho', icon: Package },
  { to: '/fulfillment-quote', label: 'Fulfillment', subtitle: 'Phân bổ đa kho', icon: Truck },
  { to: '/order-execution', label: 'Orders', subtitle: 'Tạo đơn hàng', icon: ShoppingCart },
  { to: '/reports-concurrency', label: 'Reports', subtitle: 'Báo cáo & Đồng thời', icon: BarChart2 },
]

export function AppShell() {
  const location = useLocation()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <p className="brand-title">DistriWare</p>
        <p className="brand-subtitle">CSDL Phân tán Đa kho</p>
        
        <nav className="flow-nav">
          {navitems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flow-link ${location.pathname === item.to ? 'active' : ''}`}
              >
                <Icon size={20} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.label}</div>
                  <div className="muted" style={{ fontSize: '0.75rem' }}>{item.subtitle}</div>
                </div>
              </NavLink>
            )
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', fontSize: '0.8rem' }} className="muted">
          v1.0.0-demo
        </div>
      </aside>
      
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
