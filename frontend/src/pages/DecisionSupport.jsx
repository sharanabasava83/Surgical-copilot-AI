import { useEffect, useState } from 'react'
import { Compass } from 'lucide-react'
import { getSurgeries } from '../services/api'
import api from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const PRIORITY_COLOR = { HIGH: '#e8556a', MEDIUM: '#f0a93c', LOW: '#34e1c8' }

export default function DecisionSupport() {
  const [surgeries, setSurgeries] = useState([])
  const [surgeryId, setSurgeryId] = useState('')
  const [recs, setRecs] = useState(null)

  useEffect(() => {
    getSurgeries().then((res) => {
      setSurgeries(res.data)
      if (res.data.length) setSurgeryId(res.data[0].id)
    }).catch(() => {})
  }, [])

  const handleCheck = () => {
    api.get(`/decision-support/surgery/${surgeryId}`).then((res) => setRecs(res.data)).catch(() => {})
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">CORE SURGICAL INTELLIGENCE</div>
        <h1 className="page-title">AI Surgical Decision Support</h1>
        <p className="page-description">Rule-based recommendations evaluated against a surgery's predicted metrics.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        The rule engine genuinely evaluates real stored surgery data (predicted blood loss,
        duration, procedure type) — but the thresholds and recommendation text are illustrative,
        not clinically validated guidance.
      </SimulatedBanner>

      <div className="form-row" style={{ marginBottom: 16, alignItems: 'flex-end' }}>
        <div className="form-field">
          <label>Surgery</label>
          <select value={surgeryId} onChange={(e) => setSurgeryId(e.target.value)}>
            {surgeries.map((s) => <option key={s.id} value={s.id}>{s.procedureName} — {s.patient?.fullName}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleCheck}><Compass size={14} /> Get recommendations</button>
      </div>

      {recs && (
        <div className="card">
          {recs.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--ink-800)' }}>
              <span className="chip" style={{ color: PRIORITY_COLOR[r.priority] }}>{r.priority}</span>
              <span style={{ fontSize: 13.5 }}>{r.recommendation}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
