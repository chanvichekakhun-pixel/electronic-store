// Product prices in this app are stored as display strings like "$1,500".
// These helpers convert between that and a plain number for cart math.

export function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr
  const num = Number(String(priceStr || '').replace(/[^0-9.]/g, ''))
  return Number.isFinite(num) ? num : 0
}

export function formatPrice(num) {
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Given a product and the currently selected option per variant group
// (e.g. { Storage: '1TB', Color: 'Black' }), returns the final unit price
// as a number: base price + the priceDelta of every selected option.
// Supports products with any number of variant groups, or none at all.
export function computeVariantPrice(product, selectedVariants = {}) {
  const base = parsePrice(product?.price)
  if (!Array.isArray(product?.variants)) return base

  const delta = product.variants.reduce((sum, group) => {
    const selectedLabel = selectedVariants[group.name]
    const option = (group.options || []).find((o) =>
      typeof o === 'string' ? o === selectedLabel : o.label === selectedLabel
    )
    const optionDelta = typeof option === 'string' ? 0 : option?.priceDelta || 0
    return sum + optionDelta
  }, 0)

  return base + delta
}
