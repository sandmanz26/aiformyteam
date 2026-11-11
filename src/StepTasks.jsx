import { useState } from 'react'
import { CATEGORIES, ROLES } from './data'
import { taskMonthlyHours } from './calc'
import { n1, hrs } from './format'
import { uid } from './StepTeam'

const PERIODS = [['hari', 'per hari'], ['minggu', 'per minggu'], ['bulan', 'per bulan']]

export default function StepTasks({ employees, setEmployees, mode, setMode }) {
  const [active, setActive] = useState(employees[0]?.id)
  const emp = employees.find((e) => e.id === active) || employees[0]
  const role = ROLES.find((r) => r.id === emp.role)

  const setTasks = (tasks) => setEmployees(employees.map((e) => (e.id === emp.id ? { ...e, tasks } : e)))
  const upd = (id, patch) => setTasks(emp.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const addBlank = () => setTasks([...emp.tasks, { id: uid('t'), name: '', category: 'writing', hoursPer: 2, freq: 1, period: 'minggu' }])
  const addSuggest = (s) => setTasks([...emp.tasks, { ...s, id: uid('t') }])
  const del = (id) => setTasks(emp.tasks.filter((t) => t.id !== id))

  const total = emp.tasks.reduce((s, t) => s + taskMonthlyHours(t, mode), 0)
  const unused = role.tasks.filter((s) => !emp.tasks.some((t) => t.name === s.name))

  return (
    <div>
      <h2 className="step-title">Apa saja pekerjaan mereka?</h2>
      <p className="muted step-sub">
        Ini bagian terpenting. Tulis pekerjaan yang berulang dan berapa lama biasanya selesai. Tebakan kasar pun tidak apa-apa.
      </p>

      <div className="toolbar">
        <div className="tabs" role="tablist">
          {employees.map((e) => (
            <button key={e.id} role="tab" aria-selected={e.id === emp.id} className={'tab' + (e.id === emp.id ? ' on' : '')} onClick={() => setActive(e.id)}>
              {e.name || 'Karyawan'} <span className="badge">{e.tasks.length}</span>
            </button>
          ))}
        </div>
        <div className="seg" title="Cara memasukkan waktu">
          <button className={mode === 'detail' ? 'on' : ''} onClick={() => setMode('detail')}>Jam × frekuensi</button>
          <button className={mode === 'simple' ? 'on' : ''} onClick={() => setMode('simple')}>Total jam saja</button>
        </div>
      </div>

      <p className="tiny muted mode-hint">
        {mode === 'detail'
          ? 'Contoh: menulis artikel memakan 2 jam, dikerjakan 5 kali per minggu.'
          : 'Contoh: seluruh pekerjaan ini memakan 10 jam per minggu (tanpa frekuensi).'}
      </p>

      <div className="stack">
        {emp.tasks.length === 0 && <div className="empty">Belum ada tugas untuk {emp.name || 'karyawan ini'}. Klik saran di bawah atau tambah manual.</div>}
        {emp.tasks.map((t) => (
          <div className={'card task ' + mode} key={t.id}>
            <label className="field t-name">
              <span>Nama tugas</span>
              <input value={t.name} onChange={(e) => upd(t.id, { name: e.target.value })} placeholder="mis. Menulis laporan mingguan" />
            </label>
            <label className="field t-cat">
              <span>Jenis pekerjaan</span>
              <select value={t.category} onChange={(e) => upd(t.id, { category: e.target.value })}>
                {Object.entries(CATEGORIES).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </label>
            <label className="field t-h">
              <span>{mode === 'detail' ? 'Jam sekali kerja' : 'Total jam'}</span>
              <input type="number" min="0" step="0.5" value={t.hoursPer} onChange={(e) => upd(t.id, { hoursPer: e.target.value })} />
            </label>
            {mode === 'detail' && (
              <label className="field t-f">
                <span>Berapa kali</span>
                <input type="number" min="0" step="1" value={t.freq} onChange={(e) => upd(t.id, { freq: e.target.value })} />
              </label>
            )}
            <label className="field t-p">
              <span>Periode</span>
              <select value={t.period} onChange={(e) => upd(t.id, { period: e.target.value })}>
                {PERIODS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
            <div className="t-res">
              <b>{n1(taskMonthlyHours(t, mode))}</b>
              <small>jam / bulan</small>
            </div>
            <button className="icon-btn" onClick={() => del(t.id)} aria-label="Hapus tugas" title="Hapus">✕</button>
          </div>
        ))}
      </div>

      <div className="row-between">
        <button className="btn ghost" onClick={addBlank}>+ Tambah tugas sendiri</button>
        <div className="total-pill">Total {emp.name || 'karyawan'}: <b>{hrs(total)}</b> / bulan</div>
      </div>

      {unused.length > 0 && (
        <div className="suggest">
          <span className="tiny muted">Saran untuk {role.name}, klik untuk menambahkan:</span>
          <div className="chips">
            {unused.map((s) => <button key={s.name} className="chip" onClick={() => addSuggest(s)}>+ {s.name}</button>)}
          </div>
        </div>
      )}
    </div>
  )
}
