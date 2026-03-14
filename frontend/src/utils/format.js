export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function getStockStatus(quantity, reorderLevel) {
  if (quantity <= reorderLevel) return 'Low'
  if (quantity <= reorderLevel * 1.5) return 'Watch'
  return 'Healthy'
}
