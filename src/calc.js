import { CATEGORIES, SCENARIOS } from './data'

export const PERIOD_MULT = { hari: 22, minggu: 4.33, bulan: 1 }

export const num = (v) => {
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : 0
}

// Jam kerja per bulan untuk satu tugas.
// mode 'detail' : jam sekali kerja × frekuensi × periode
// mode 'simple' : total jam per periode (hari/minggu/bulan)
export function taskMonthlyHours(t, mode) {
  const freq = mode === 'simple' ? 1 : num(t.freq)
  return num(t.hoursPer) * freq * (PERIOD_MULT[t.period] || 1)
}

export function toolPriceIDR(tool, kurs) {
  if (tool.idr != null && tool.idr !== '') return num(tool.idr)
  return num(tool.usd) * kurs
}

export function compute({ employees, mode, tools, assumptions }) {
  const { kurs, workHours, overhead, scenario } = assumptions
  const factor = SCENARIOS[scenario].factor

  const rows = employees.map((e) => {
    const hourly = (num(e.salary) * num(overhead || 1)) / num(workHours || 173)
    const tasks = e.tasks
      .map((t) => {
        const hours = taskMonthlyHours(t, mode)
        const pct = Math.min(0.9, (CATEGORIES[t.category]?.pct ?? 0.3) * factor)
        const saved = hours * pct
        return { id: t.id, name: t.name || 'Tugas tanpa nama', category: t.category, hours, pct, saved, after: hours - saved, value: saved * hourly }
      })
      .filter((t) => t.hours > 0)
    const hours = tasks.reduce((s, t) => s + t.hours, 0)
    const saved = tasks.reduce((s, t) => s + t.saved, 0)
    return { id: e.id, name: e.name || 'Karyawan', role: e.role, salary: num(e.salary), hourly, tasks, hours, saved, value: saved * hourly, workCost: hours * hourly }
  })

  const active = rows.filter((r) => r.hours > 0)
  const selectedTools = Object.entries(tools).filter(([, v]) => v.selected)
  const perSeat = selectedTools.reduce((s, [, v]) => s + toolPriceIDR(v, kurs), 0)
  const seats = active.length
  const cost = perSeat * seats

  const hours = rows.reduce((s, r) => s + r.hours, 0)
  const saved = rows.reduce((s, r) => s + r.saved, 0)
  const value = rows.reduce((s, r) => s + r.value, 0)
  const workCost = rows.reduce((s, r) => s + r.workCost, 0)
  const avgHourly = saved > 0 ? value / saved : 0
  const net = value - cost

  return {
    rows, active, perSeat, seats, cost, hours, saved, value, workCost, net,
    avgHourly,
    roi: cost > 0 ? (net / cost) * 100 : 0,
    multiple: cost > 0 ? value / cost : 0,
    breakEvenHours: avgHourly > 0 ? cost / avgHourly : 0,
    paybackDays: value > 0 ? (cost / value) * 22 : 0, // hari kerja
    perEmployeeBreakEven: active.map((r) => ({ name: r.name, hours: r.hourly > 0 ? perSeat / r.hourly : 0, saved: r.saved })),
  }
}
