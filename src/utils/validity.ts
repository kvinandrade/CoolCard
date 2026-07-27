export function formatValidity(endDate: string): string {
  if (!endDate) return '—'
  const [year, month] = endDate.split('-')
  if (!year || !month) return '—'
  return `${month}/${year}`
}

export function formatPeriod(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return '—'
  const start = formatValidity(startDate)
  const end = formatValidity(endDate)
  return `${start} — ${end}`
}

export function isCardCurrentlyValid(endDate: string): boolean {
  if (!endDate) return false
  const end = new Date(`${endDate}T23:59:59`)
  return end.getTime() >= Date.now()
}
