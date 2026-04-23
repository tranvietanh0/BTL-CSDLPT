import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AppShell } from '../components/layout/app-shell'
import { CatalogInventoryPage } from '../pages/catalog-inventory-page'
import { DashboardPage } from '../pages/dashboard-page'
import { FulfillmentQuotePage } from '../pages/fulfillment-quote-page'
import { OrderExecutionPage } from '../pages/order-execution-page'
import { ReportsConcurrencyPage } from '../pages/reports-concurrency-page'

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'catalog-inventory', element: <CatalogInventoryPage /> },
      { path: 'fulfillment-quote', element: <FulfillmentQuotePage /> },
      { path: 'order-execution', element: <OrderExecutionPage /> },
      { path: 'reports-concurrency', element: <ReportsConcurrencyPage /> },
    ],
  },
])
