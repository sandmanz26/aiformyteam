import { useState } from 'react'

export default function Gate({ onEnter }) {
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [err, setErr] = useState({})

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!company.trim()) next.company = 'Nama perusahaan wajib diisi'
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Masukkan email yang valid'
    setErr(next)
    if (Object.keys(next).length === 0) onEnter({ company: company.trim(), email: email.trim() })
  }

  return (
    <main className="gate">
      <section className="gate-hero">
        <span className="eyebrow">Kalkulator ROI AI</span>
        <h1>Buktikan ke bos: <em>AI bukan biaya, tapi hemat uang.</em></h1>
        <p className="lead">
          Masukkan gaji, tugas, dan berapa jam yang dihabiskan tiap minggu. Kami hitung berapa jam dan rupiah
          yang bisa dihemat dengan AI, dibanding harga langganannya.
        </p>
        <div className="proof">
          <div className="proof-num">5 jam</div>
          <div className="proof-text">
            hemat per bulan <b>≈ Rp 400 rb</b> dari gaji, sudah cukup menutup langganan AI
            <b> ≈ Rp 330 rb</b>. Sisanya adalah keuntungan.
          </div>
        </div>
        <ul className="ticks">
          <li>Tanpa daftar akun, data hanya di browser Anda</li>
          <li>Selesai dalam sekitar 3 menit</li>
          <li>Hasilnya bisa disalin sebagai ringkasan untuk atasan</li>
        </ul>
      </section>

      <form className="card gate-form" onSubmit={submit} noValidate>
        <h2>Mulai hitung</h2>
        <p className="muted">Isi dulu data singkat ini.</p>
        <label className="field">
          <span>Nama perusahaan</span>
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="mis. PT Maju Bersama" autoFocus />
          {err.company && <small className="err">{err.company}</small>}
        </label>
        <label className="field">
          <span>Email kerja</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@perusahaan.com" />
          {err.email && <small className="err">{err.email}</small>}
        </label>
        <button className="btn primary block" type="submit">Lanjut ke kalkulator →</button>
        <p className="tiny muted">Ini demo dengan data contoh. Email tidak dikirim ke mana pun.</p>
      </form>
    </main>
  )
}
