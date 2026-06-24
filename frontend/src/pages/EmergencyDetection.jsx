import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { getPatients, simulateVitalsReading } from '../services/api'
import api from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

export default function EmergencyDetection() {
  const [patients, setPatients] = useState([])
  const [patientId, setPatientId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPatients().then((res) => {
      setPatients(res.data)
      if (res.data.length) setPatientId(res.data[0].id)
    }).catch(() => {})
  }, [])

  const handleCheck = async () => {
    setLoading(true)
    try {
      await simulateVitalsReading(patientId)
      const res = await api.get(`/emergency-detection/patient/${patientId}`)
      setResult(res.data)
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">CORE SURGICAL INTELLIGENCE</div>
        <h1 className="page-title">Real-Time Emergency Detection</h1>
        <p className="page-description">Evaluates a vitals reading against real safety thresholds.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        The threshold-checking logic itself is real and transparent (e.g. heart rate &gt; 130 or
        &lt; 45 triggers a high alert). The vitals reading it checks against is simulated, not
        from a real patient monitor.
      </SimulatedBanner>

      <div className="form-row" style={{ marginBottom: 16, alignItems: 'flex-end' }}>
        <div className="form-field">
          <label>Patient</label>
          <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleCheck} disabled={loading}>
          {loading ? 'Checking…' : 'Generate reading & check'}
        </button>
      </div>

      {result && (
        <>
          <div className="metric-row">
            <div className="metric-box"><div className="metric-label">Heart rate</div><div className="metric-value">{result.latestReading.heartRateBpm} bpm</div></div>
            <div className="metric-box"><div className="metric-label">SpO2</div><div className="metric-value">{result.latestReading.oxygenSaturationPct}%</div></div>
            <div className="metric-box"><div className="metric-label">BP</div><div className="metric-value">{result.latestReading.systolicBp}/{result.latestReading.diastolicBp}</div></div>
            <div className="metric-box"><div className="metric-label">Temp</div><div className="metric-value">{result.latestReading.temperatureCelsius}°C</div></div>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0, fontSize: 14 }}>{result.alertCount} alert(s)</h3>
            {result.alerts.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--signal-cyan)' }}>
                <CheckCircle2 size={16} /> All vitals within normal thresholds.
              </div>
            ) : (
              result.alerts.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--ink-800)' }}>
                  <AlertTriangle size={16} color={a.level === 'HIGH' ? 'var(--signal-red)' : 'var(--signal-amber)'} />
                  <span style={{ fontSize: 13.5 }}>{a.message}</span>
                  <span className="chip" style={{ marginLeft: 'auto', color: a.level === 'HIGH' ? 'var(--signal-red)' : 'var(--signal-amber)' }}>{a.level}</span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
