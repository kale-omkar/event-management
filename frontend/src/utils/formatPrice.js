/**
 * The single place prices are turned into a readable string.
 *
 * Every price in the app goes through this, so there is never a hardcoded
 * "$" or "Rs" anywhere. Amounts are stored in the database as plain Rupee
 * numbers (e.g. 150000) and rendered as ₹1,50,000.
 */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  // Round figures such as ₹1,50,000, never ₹1,50,000.00.
  maximumFractionDigits: 0,
})

/**
 * Format a Rupee amount for display.
 *
 * @param {number|string|null|undefined} amount Amount in Rupees
 * @param {object} [options]
 * @param {boolean} [options.freeLabel] Show "Free" instead of ₹0 when zero
 * @returns {string} e.g. "₹1,50,000" or "Free"
 */
export default function formatPrice(amount, { freeLabel = true } = {}) {
  const value = Number(amount)

  // Anything unparseable is treated as free rather than showing "₹NaN".
  if (!Number.isFinite(value) || value <= 0) {
    return freeLabel ? 'Free' : '₹0'
  }

  return inrFormatter.format(value)
}

/**
 * Compact form for tight spaces: ₹1.5L, ₹2.25L, ₹1.2Cr.
 *
 * Below one lakh this falls back to the exact figure, because rounding a real
 * price such as ₹9,999 up to "₹10K" would misquote it.
 */
export function formatPriceShort(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value) || value <= 0) return 'Free'

  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2).replace(/\.?0+$/, '')}Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(2).replace(/\.?0+$/, '')}L`

  return inrFormatter.format(value)
}