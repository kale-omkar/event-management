

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',

  maximumFractionDigits: 0,
})

export default function formatPrice(amount, { freeLabel = true } = {}) {
  const value = Number(amount)

  if (!Number.isFinite(value) || value <= 0) {
    return freeLabel ? 'Free' : '₹0'
  }

  return inrFormatter.format(value)
}

export function formatPriceShort(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value) || value <= 0) return 'Free'

  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2).replace(/\.?0+$/, '')}Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(2).replace(/\.?0+$/, '')}L`

  return inrFormatter.format(value)
}