import { useMemo, useState } from 'react'
import Gate from './Gate'
import StepTeam, { uid } from './StepTeam'
import StepTasks from './StepTasks'
import StepTools from './StepTools'
import Results from './Results'
import { DEFAULT_ASSUMPTIONS, DEMO, ROLES } from './data'
import { compute, taskMonthlyHours } from './calc'
import { rp, n1 } from './format'

const STEPS = ['Tim & gaji', 'Tugas', 'AI & harga', 'Hasil']
const blankEmployee = () => ({ id: uid('e'), name: '', role: ROLES[0].id, salary: ROLES[0].salary, tasks: [] })

export default function App() {
  const [user, setUser] = useState(null)
  const [step, setStep] = useState(0)
  const [employees, setEmployees] = useState([blankEmployee()])
  const [mode, setMode] = useState('detail')
  const [tools, setTools] = useState({})
  const [assumptions, setAssumptions] = useState(DEFAULT_ASSUMPTIONS)
  const [loading, setLoading] = useState(false)

  const state = { employees, mode, tools, assumptions, company: user?.company }
  const calc = useMemo(() => compute(state), [employees, mode, tools, assumptions])

  const totalHours = employees.reduce((s, e) => s + e.tasks.reduce((a, t) => a + taskMonthlyHours(t, mode), 0), 0)
  const anyTool = Object.values(tools).some((t) => t.selected)

  const errors = [
    employees.every((e) => e.salary > 0) ? null : 'Isi gaji semua karyawan.',
    totalHours > 0 ? null : 'Tambahkan minimal satu tugas dengan jam kerja.',
    anyTool ? null : 'Pilih minimal satu AI.',
  ]
  const canNext = [!errors[0], !errors[0] && !errors[1], !errors[0] && !errors[1] && !errors[2]][step]
  const hint = [errors[0], errors[1], errors[2]][step]

  const fillDemo = () => {
    setEmployees(DEMO.employees.map((e) => ({ ...e, tasks: e.tasks.map((t) => ({ ...t })) })))
    setTools(JSON.parse(JSON.stringify(DEMO.tools)))
    setMode('detail')
  }

  const generate = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }) }, 1100)
  }

  const reset = () => {
    setStep(0); setEmployees([blankEmployee()]); setTools({}); setAssumptions(DEFAULT_ASSUMPTIONS)
  }

  if (!user) return <Gate onEnter={setUser} />

  return (
    <div className="app">
      <header className="top no-print">
        <div className="brand"><span className="logo">ROI</span> Kalkulator ROI AI</div>
        <div className="who">{user.company}</div>
      </header>

      <nav className="stepper no-print" aria-label="Langkah">
        {STEPS.map((s, i) => (
          <button key={s} disabled={i > step} className={'st' + (i === step ? ' on' : '') + (i < step ? ' done' : '')} onClick={() => i <= step && setStep(i)}>
            <span className="st-n">{i < step ? '✓' : i + 1}</span><span className="st-l">{s}</span>
          </button>
        ))}
      </nav>

      <main className="wrap">
        {step < 3 && (
          <div className="demo-bar no-print">
            <span className="tiny muted">Belum punya data? Lihat contoh perhitungannya dulu.</span>
            <button className="btn small ghost" onClick={fillDemo}>✨ Isi contoh data</button>
          </div>
        )}

        {step === 0 && <StepTeam employees={employees} setEmployees={setEmployees} />}
        {step === 1 && <StepTasks employees={employees} setEmployees={setEmployees} mode={mode} setMode={setMode} />}
        {step === 2 && <StepTools tools={tools} setTools={setTools} assumptions={assumptions} seats={calc.active.length || employees.length} />}
        {step === 3 && <Results calc={calc} state={state} setAssumptions={setAssumptions} onBack={() => setStep(2)} onReset={reset} />}

        {loading && (
          <div className="overlay" role="status">
            <div className="spinner" />
            <p>Menghitung potensi penghematan tim Anda…</p>
          </div>
        )}
      </main>

      {step < 3 && (
        <footer className="bar no-print">
          <div className="bar-in">
            <div className="live">
              <span><small>Jam tugas</small><b>{n1(totalHours)} / bln</b></span>
              <span><small>Biaya AI</small><b>{anyTool ? rp(calc.cost) : '—'}</b></span>
            </div>
            <div className="nav">
              {hint && <span className="tiny hint">{hint}</span>}
              {step > 0 && <button className="btn ghost" onClick={() => setStep(step - 1)}>← Kembali</button>}
              {step < 2 && <button className="btn primary" disabled={!canNext} onClick={() => setStep(step + 1)}>Lanjut →</button>}
              {step === 2 && <button className="btn primary glow" disabled={!canNext} onClick={generate}>✨ Hitung ROI sekarang</button>}
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
