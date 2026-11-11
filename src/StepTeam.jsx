import { ROLES } from './data'
import { digits, thousands, rp } from './format'

let seq = 100
export const uid = (p) => `${p}${++seq}`

export default function StepTeam({ employees, setEmployees }) {
  const update = (id, patch) => setEmployees(employees.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  const add = () => {
    const r = ROLES[0]
    setEmployees([...employees, { id: uid('e'), name: '', role: r.id, salary: r.salary, tasks: [] }])
  }
  const remove = (id) => setEmployees(employees.filter((e) => e.id !== id))

  const changeRole = (e, roleId) => {
    const prev = ROLES.find((r) => r.id === e.role)
    const next = ROLES.find((r) => r.id === roleId)
    // ganti gaji default hanya jika belum diubah manual
    const salary = !e.salary || e.salary === prev?.salary ? next.salary : e.salary
    update(e.id, { role: roleId, salary })
  }

  return (
    <div>
      <h2 className="step-title">Siapa saja yang akan memakai AI?</h2>
      <p className="muted step-sub">
        Tambahkan karyawan, pilih jabatan, dan isi gaji bulanan. Gaji dipakai untuk menghitung nilai satu jam kerja.
      </p>

      <div className="stack">
        {employees.map((e, i) => (
          <div className="card emp" key={e.id}>
            <div className="emp-num">{i + 1}</div>
            <label className="field">
              <span>Nama / panggilan</span>
              <input value={e.name} onChange={(ev) => update(e.id, { name: ev.target.value })} placeholder="mis. Rina" />
            </label>
            <label className="field">
              <span>Jabatan</span>
              <select value={e.role} onChange={(ev) => changeRole(e, ev.target.value)}>
                {ROLES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Gaji per bulan</span>
              <div className="money">
                <i>Rp</i>
                <input inputMode="numeric" value={thousands(e.salary)} onChange={(ev) => update(e.id, { salary: Number(digits(ev.target.value)) || 0 })} />
              </div>
              <small className="muted">≈ {rp(e.salary / 173)} per jam</small>
            </label>
            {employees.length > 1 && (
              <button className="icon-btn" onClick={() => remove(e.id)} aria-label={`Hapus ${e.name || 'karyawan'}`} title="Hapus">✕</button>
            )}
          </div>
        ))}
      </div>
      <button className="btn ghost" onClick={add}>+ Tambah karyawan</button>
    </div>
  )
}
