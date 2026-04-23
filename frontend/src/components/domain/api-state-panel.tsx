import type { PropsWithChildren } from 'react'

type ApiStatePanelProps = PropsWithChildren<{
  isLoading?: boolean
  errorMessage?: string | null
  emptyMessage?: string | null
  hasData?: boolean
}>

export function ApiStatePanel({ isLoading, errorMessage, emptyMessage, hasData = true, children }: ApiStatePanelProps) {
  if (isLoading) {
    return <div className="card muted">Đang tải dữ liệu...</div>
  }

  if (errorMessage) {
    return <div className="error-state">{errorMessage}</div>
  }

  if (!hasData && emptyMessage) {
    return <div className="empty-state">{emptyMessage}</div>
  }

  return <>{children}</>
}
