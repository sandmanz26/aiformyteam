const nf = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })
const nf1 = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 })

export const rp = (n) => 'Rp ' + nf.format(Math.round(n || 0))
export const rpShort = (n) => {
  const v = Math.abs(n || 0)
  const sign = n < 0 ? '-' : ''
  if (v >= 1e9) return `${sign}Rp ${nf1.format(v / 1e9)} M`
  if (v >= 1e6) return `${sign}Rp ${nf1.format(v / 1e6)} jt`
  if (v >= 1e3) return `${sign}Rp ${nf.format(v / 1e3)} rb`
  return `${sign}Rp ${nf.format(v)}`
}
export const hrs = (n) => `${nf1.format(n || 0)} jam`
export const n1 = (n) => nf1.format(n || 0)
export const nInt = (n) => nf.format(n || 0)
export const digits = (s) => String(s).replace(/\D/g, '')
export const thousands = (v) => (v === '' || v == null ? '' : nf.format(Number(v)))
