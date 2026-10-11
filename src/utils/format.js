/**
 * Format a numeric amount as Indian Rupees (or specified currency) with no fractional digits.
 *
 * @param {number} val - The amount to format
 * @param {string} [currency='INR'] - ISO currency code
 * @returns {string} Formatted currency string
 */
export function formatCurrency(val, currency = 'INR') {
  if (typeof val !== 'number') return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(val)
}
