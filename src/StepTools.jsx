import { AI_TOOLS } from './data'
import { digits, thousands, rp } from './format'
import { toolPriceIDR } from './calc'

export default function StepTools({ tools, setTools, assumptions, seats }) {
  const { kurs } = assumptions
  const toggle = (id, base) => setTools({ ...tools, [id]: { ...(tools[id] || { usd: base.usd, idr: null }), selected: !tools[id]?.selected } })
  const setIdr = (id, v) => setTools({ ...tools, [id]: { ...tools[id], idr: v === '' ? '' : Number(v) } })

  const perSeat = Object.values(tools).filter((t) => t.selected).reduce((s, t) => s + toolPriceIDR(t, kurs), 0)

  return (
    <div>
      <h2 className="step-title">AI mana yang ingin dipakai?</h2>
      <p className="muted step-sub">
        Pilih satu atau lebih. Harga adalah contoh dan bisa Anda ubah sesuai penawaran sebenarnya (per user per bulan).
      </p>

      <div className="tool-grid">
        {AI_TOOLS.map((t) => {
          const st = tools[t.id]
          const on = !!st?.selected
          const price = on ? toolPriceIDR(st, kurs) : t.usd * kurs
          return (
            <div key={t.id} className={'card tool' + (on ? ' on' : '')}>
              <button className="tool-head" onClick={() => toggle(t.id, t)} aria-pressed={on}>
                <span className={'check' + (on ? ' on' : '')}>{on ? '✓' : ''}</span>
                <span>
                  <b>{t.name}</b>
                  <small className="muted">{t.vendor} · {t.note}</small>
                </span>
              </button>
              <div className="tool-price">
                {on ? (
                  <label className="field">
                    <span>Harga / user / bulan</span>
                    <div className="money">
                      <i>Rp</i>
                      <input inputMode="numeric" value={thousands(st.idr ?? Math.round(toolPriceIDR(st, kurs)))} onChange={(e) => setIdr(t.id, digits(e.target.value))} />
                    </div>
                  </label>
                ) : (
                  <span className="price-static">{t.usd ? `${rp(price)} / bln` : 'Isi harga sendiri'}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card cost-box">
        <div>
          <div className="tiny muted">Biaya langganan AI per bulan</div>
          <div className="big">{rp(perSeat * seats)}</div>
        </div>
        <div className="tiny muted">{rp(perSeat)} × {seats} pengguna</div>
      </div>
    </div>
  )
}
