export function formatcurrency(value: number | string) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export function formatnumber(value: number | string) {
  return new Intl.NumberFormat('vi-VN').format(Number(value))
}

export function formatdatetime(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}
