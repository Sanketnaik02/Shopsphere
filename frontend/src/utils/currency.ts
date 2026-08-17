// Backend stores price in minor units (paise). Convert to whole rupees with
// Indian digit grouping using integer arithmetic only (no float precision loss).
export function formatPrice(pricePaise: number): string {
  const rupees = Math.floor(pricePaise / 100)
  const paise = pricePaise % 100
  const grouped = rupees.toLocaleString('en-IN')
  return paise > 0 ? `₹${grouped}.${String(paise).padStart(2, '0')}` : `₹${grouped}`
}