import { useEffect, useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { getSurgeries, getChecklist, toggleChecklistItem } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const PHASE_LABELS = { SIGN_IN: 'Sign In (before anesthesia)', TIME_OUT: 'Time Out (before incision)', SIGN_OUT: 'Sign Out (before leaving OR)' }

export default function ChecklistAutomation() {
  const [surgeries, setSurgeries] = useState([])
  const [surgeryId, setSurgeryId] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    getSurgeries().then((res) => {
      setSurgeries(res.data)
      if (res.data.length) setSurgeryId(res.data[0].id)
    }).catch(() => {})
  }, [])

  const load = (id) => {
    if (!id) return
    getChecklist(id).then((res) => setItems(res.data)).catch(() => {})
  }

  useEffect(() => { load(surgeryId) }, [surgeryId])

  const handleToggle = async (id) => {
    await toggleChecklistItem(id, 'Demo User')
    load(surgeryId)
  }

  const completedCount = items.filter((i) => i.completed).length

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">CORE SURGICAL INTELLIGENCE</div>
        <h1 className="page-title">Surgical Checklist Automation</h1>
        <p className="page-description">Digitized WHO-style pre/post-op checklist with real persisted state.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        This checklist is real, working application state (auto-generated once per surgery and
        stored in the database) — not a simulated AI output.
      </SimulatedBanner>

      <div className="form-field" style={{ marginBottom: 18, maxWidth: 360 }}>
        <label>Surgery</label>
        <select value={surgeryId} onChange={(e) => setSurgeryId(e.target.value)}>
          {surgeries.map((s) => <option key={s.id} value={s.id}>{s.procedureName} — {s.patient?.fullName}</option>)}
        </select>
      </div>

      {items.length === 0 ? (
        <div className="card"><div className="empty-state">No surgeries yet. Create one from the Surgery Success Prediction module.</div></div>
      ) : (
        <>
          <div className="metric-row" style={{ marginBottom: 6 }}>
            <div className="metric-box">
              <div className="metric-label">Progress</div>
              <div className="metric-value cyan">{completedCount}/{items.length}</div>
            </div>
          </div>
          {['SIGN_IN', 'TIME_OUT', 'SIGN_OUT'].map((phase) => (
            <div className="card" key={phase} style={{ marginBottom: 16 }}>
              <h3 style={{ marginTop: 0, fontSize: 14 }}>{PHASE_LABELS[phase]}</h3>
              {items.filter((i) => i.phase === phase).map((item) => (
                <div key={item.id} onClick={() => handleToggle(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 4px', cursor: 'pointer', borderBottom: '1px solid var(--ink-800)' }}>
                  {item.completed ? <CheckCircle2 size={18} color="var(--signal-cyan)" /> : <Circle size={18} color="var(--ink-500)" />}
                  <span style={{ fontSize: 13.5, color: item.completed ? 'var(--ink-400)' : 'var(--ink-50)', textDecoration: item.completed ? 'line-through' : 'none' }}>
                    {item.itemText}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
