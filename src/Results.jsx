import { useState } from 'react'
import { AI_TOOLS, CATEGORIES, SCENARIOS } from './data'
import { rp, rpShort, hrs, n1, nInt } from './format'
import { toolPriceIDR } from './calc'

function Cumulative({ value, cost }) {
  // Akumulasi 12 bulan: nilai waktu yang dihemat vs biaya langganan
  const W = 560, H = 230, P = { l: 64, r: 12, t: 12, b: 28 }
  const pts = Array.from({ length: 13 }, (_, m) => ({ m, v: value * m, c: cost * m }))
  const max = Math.max(...pts.map((p) => p.v), 1)
  const x = (m) => P.l + (m / 12) * (W - P.l - P.r)
  const y = (v) => H - P.b - (v / max) * (H - P.t - P.b)
  const line = (k) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.m)},${y(p[k])}`).join(' ')
  const area = `${line('v')} L${x(12)},${y(0)} L${x(0)},${y(0)} Z`
  const ticks = [0, 0.5, 1].map((f) => max * f)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Grafik akumulasi nilai hemat dan biaya AI selama 12 bulan">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} className="grid" />
          <text x={P.l - 8} y={y(t) + 4} textAnchor="end" className="axis">{rpShort(t)}</text>
        </g>
      ))}
      {[0, 3, 6, 9, 12].map((m) => <text key={m} x={x(m)} y={H - 8} textAnchor="middle" className="axis">{m === 0 ? '' : `Bln ${m}`}</text>)}
      <path d={area} className="area-v" />
      <path d={line('v')} className="line-v" />
      <path d={line('c')} className="line-c" />
      <circle cx={x(12)} cy={y(pts[12].v)} r="4" className="dot-v" />
      <circle cx={x(12)} cy={y(pts[12].c)} r="4" className="dot-c" />
    </svg>
  )
}

export default function Results({ calc, state, setAssumptions, onBack, onReset }) {
  const { assumptions, tools, company } = state
  const [showAssume, setShowAssume] = useState(false)
  const [copied, setCopied] = useState(false)
  const positive = calc.net > 0
  const toolNames = AI_TOOLS.filter((t) => tools[t.id]?.selected).map((t) => t.name).join(' + ') || 'AI'
  const bestTask = calc.rows.flatMap((r) => r.tasks.map((t) => ({ ...t, who: r.name }))).sort((a, b) => b.value - a.value)[0]

  const summary = [
    `RINGKASAN ROI AI: ${company}`,
    ``,
    `Tool: ${toolNames} untuk ${calc.seats} orang`,
    `Biaya langganan: ${rp(calc.cost)} / bulan`,
    `Waktu yang bisa dihemat: ${n1(calc.saved)} jam / bulan (dari ${n1(calc.hours)} jam pekerjaan berulang)`,
    `Nilai waktu yang dihemat: ${rp(calc.value)} / bulan (berdasarkan gaji)`,
    `Keuntungan bersih: ${rp(calc.net)} / bulan  |  ROI ${nInt(calc.roi)}%  |  tiap Rp 1 jadi Rp ${n1(calc.multiple)}`,
    `Balik modal: cukup hemat ${n1(calc.breakEvenHours)} jam / bulan, atau sekitar hari kerja ke-${Math.max(1, Math.ceil(calc.paybackDays))} tiap bulan.`,
    `Proyeksi 12 bulan: hemat ${rp(calc.net * 12)} setelah dikurangi biaya AI.`,
    ``,
    `Catatan: estimasi memakai skenario "${SCENARIOS[assumptions.scenario].label}", ${assumptions.workHours} jam kerja/bulan.`,
  ].join('\n')

  const copy = async () => {
    try { await navigator.clipboard.writeText(summary) } catch { /* abaikan */ }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const setA = (k, v) => setAssumptions({ ...assumptions, [k]: v })

  return (
    <div className="results">
      <div className={'hero-result ' + (positive ? 'good' : 'warn')}>
        <span className="eyebrow">Hasil untuk {company}</span>
        {positive ? (
          <h2>Dengan AI, tim Anda hemat <em>{rp(calc.value)}</em> per bulan, hanya dengan biaya <em>{rp(calc.cost)}</em>.</h2>
        ) : (
          <h2>Dengan input saat ini, AI belum menutup biayanya. Coba tambah tugas atau kurangi jumlah pengguna.</h2>
        )}
        {positive && (
          <p className="lead">
            Langganan sudah <b>balik modal hanya dengan menghemat {n1(calc.breakEvenHours)} jam</b> per bulan.
            Estimasi hemat tim Anda adalah <b>{n1(calc.saved)} jam</b>, sekitar <b>{n1(calc.saved / Math.max(1, calc.seats))} jam per orang</b>.
          </p>
        )}
        <div className="scenario">
          {Object.entries(SCENARIOS).map(([k, s]) => (
            <button key={k} className={assumptions.scenario === k ? 'on' : ''} onClick={() => setA('scenario', k)} title={s.desc}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="kpis">
        <div className="kpi"><small>ROI</small><b className="pos">{nInt(calc.roi)}%</b><span>tiap Rp 1 jadi Rp {n1(calc.multiple)}</span></div>
        <div className="kpi"><small>Jam dihemat / bulan</small><b>{n1(calc.saved)}</b><span>dari {n1(calc.hours)} jam tugas</span></div>
        <div className="kpi"><small>Untung bersih / bulan</small><b className={positive ? 'pos' : 'neg'}>{rpShort(calc.net)}</b><span>nilai hemat − biaya AI</span></div>
        <div className="kpi"><small>Balik modal</small><b>{n1(calc.breakEvenHours)} jam</b><span>≈ hari kerja ke-{Math.max(1, Math.ceil(calc.paybackDays))} tiap bulan</span></div>
      </div>

      <div className="grid-2">
        <section className="card">
          <h3>Waktu sebelum vs sesudah AI</h3>
          <p className="tiny muted">Jam per bulan, per tugas. Abu-abu = sekarang, hijau = dengan AI.</p>
          <div className="bars">
            {calc.rows.flatMap((r) => r.tasks.map((t) => ({ ...t, who: r.name }))).map((t) => (
              <div className="bar-row" key={t.id}>
                <div className="bar-label"><b>{t.name}</b><small className="muted">{t.who} · {CATEGORIES[t.category].label}</small></div>
                <div className="bar-track" title={`${n1(t.hours)} jam → ${n1(t.after)} jam`}>
                  <div className="bar-before" style={{ width: '100%' }} />
                  <div className="bar-after" style={{ width: `${(t.after / t.hours) * 100}%` }} />
                </div>
                <div className="bar-num"><b>−{n1(t.saved)} jam</b><small className="muted">{rpShort(t.value)}</small></div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h3>Proyeksi 12 bulan</h3>
          <p className="tiny muted"><span className="dot v" /> Nilai waktu yang dihemat &nbsp; <span className="dot c" /> Biaya langganan AI</p>
          <Cumulative value={calc.value} cost={calc.cost} />
          <div className="projection">
            Setelah 12 bulan: hemat <b className="pos">{rp(calc.value * 12)}</b>, biaya AI <b>{rp(calc.cost * 12)}</b>, untung bersih <b className="pos">{rp(calc.net * 12)}</b>.
          </div>
        </section>
      </div>

      <section className="card">
        <h3>Rincian per karyawan</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Karyawan</th><th>Nilai 1 jam</th><th>Jam tugas</th><th>Jam dihemat</th><th>Nilai hemat</th><th>Biaya AI</th><th>Balik modal</th></tr>
            </thead>
            <tbody>
              {calc.active.map((r, i) => (
                <tr key={r.id}>
                  <td><b>{r.name}</b></td>
                  <td>{rp(r.hourly)}</td>
                  <td>{n1(r.hours)}</td>
                  <td>{n1(r.saved)}</td>
                  <td className="pos"><b>{rp(r.value)}</b></td>
                  <td>{rp(calc.perSeat)}</td>
                  <td>{hrs(calc.perEmployeeBreakEven[i].hours)}</td>
                </tr>
              ))}
              <tr className="total">
                <td>Total</td><td /><td>{n1(calc.hours)}</td><td>{n1(calc.saved)}</td>
                <td className="pos">{rp(calc.value)}</td><td>{rp(calc.cost)}</td><td />
              </tr>
            </tbody>
          </table>
        </div>
        {bestTask && <p className="tiny muted insight">Tugas dengan dampak terbesar: <b>{bestTask.name}</b> ({bestTask.who}), hemat sekitar {rp(bestTask.value)} per bulan.</p>}
      </section>

      <section className="card boss">
        <div>
          <h3>Ringkasan untuk atasan</h3>
          <p className="tiny muted">Salin teks ini dan kirim lewat WhatsApp atau email.</p>
        </div>
        <pre>{summary}</pre>
        <div className="actions">
          <button className="btn primary" onClick={copy}>{copied ? '✓ Tersalin' : 'Salin ringkasan'}</button>
          <button className="btn ghost" onClick={() => window.print()}>Cetak / simpan PDF</button>
        </div>
      </section>

      <section className="card">
        <button className="link" onClick={() => setShowAssume(!showAssume)} aria-expanded={showAssume}>
          {showAssume ? '▾' : '▸'} Asumsi perhitungan (bisa diubah)
        </button>
        {showAssume && (
          <div className="assume">
            <label className="field"><span>Jam kerja per bulan</span><input type="number" value={assumptions.workHours} min="1" onChange={(e) => setA('workHours', Number(e.target.value) || 173)} /></label>
            <label className="field"><span>Kurs USD → Rp</span><input type="number" value={assumptions.kurs} min="1" onChange={(e) => setA('kurs', Number(e.target.value) || 16500)} /></label>
            <label className="field"><span>Pengali biaya penuh karyawan</span>
              <select value={assumptions.overhead} onChange={(e) => setA('overhead', Number(e.target.value))}>
                <option value={1}>1× (hanya gaji)</option>
                <option value={1.15}>1,15× (+ BPJS)</option>
                <option value={1.3}>1,3× (+ BPJS & tunjangan)</option>
              </select>
            </label>
            <p className="tiny muted full">Persentase hemat per jenis pekerjaan adalah angka contoh (mock), bukan hasil riset. Skenario konservatif mengalikannya 0,6×.</p>
          </div>
        )}
      </section>

      <div className="row-between no-print">
        <button className="btn ghost" onClick={onBack}>← Ubah input</button>
        <button className="btn ghost" onClick={onReset}>Mulai ulang</button>
      </div>
    </div>
  )
}
