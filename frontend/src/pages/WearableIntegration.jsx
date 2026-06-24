import { useEffect, useState } from 'react'
import { Watch, Wifi } from 'lucide-react'
import { getPatients, simulateVitalsReading, getVitals } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

export default function WearableIntegration() {
  const [patients, setPatients] = useState([])
  const [patientId, setPatientId] = useState('')
  const [paired, setPaired] = useState(false)
  const [latest, setLatest] = useState(null)

  useEffect(() => {
    getPatients().then((res) => {
      setPatients(res.data)
      if (res.data.length) setPatientId(res.data[0].id)
    }).catch(() => {})
  }, [])

  const handlePair = async () => {
    setPaired(true)
    const res = await simulateVitalsReading(patientId)
    setLatest(res.data)
  }

  const handleSync = async () => {
    const res = await simulateVitalsReading(patientId)
    setLatest(res.data)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">PATIENT MONITORING &amp; RECOVERY</div>
        <h1 className="page-title">Wearable Device Integration</h1>
        <p className="page-description">Simulated wearable pairing and data sync — no real device connection.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        There is no real Bluetooth/device SDK integration here. "Pairing" and "sync" generate a
        synthetic vitals reading server-side to demonstrate the UX of wearable integration.
      </SimulatedBanner>

      <div className="form-field" style={{ marginBottom: 18, maxWidth: 320 }}>
        <label>Patient</label>
        <select value={patientId} onChange={(e) => { setPatientId(e.target.value); setPaired(false); setLatest(null) }}>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
        </select>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <Watch size={42} color={paired ? 'var(--signal-cyan)' : 'var(--ink-500)'} />
        <p style={{ margin: '14px 0', color: 'var(--ink-300)' }}>
          {paired ? 'Device paired (simulated)' : 'No device paired'}
        </p>
        {!paired ? (
          <button className="btn btn-primary" onClick={handlePair}><Wifi size={14} /> Pair device</button>
        ) : (
          <button className="btn btn-secondary" onClick={handleSync}>Sync now</button>
        )}
      </div>

      {latest && (
        <div className="metric-row" style={{ marginTop: 20 }}>
          <div className="metric-box"><div className="metric-label">Heart rate</div><div className="metric-value cyan">{latest.heartRateBpm} bpm</div></div>
          <div className="metric-box"><div className="metric-label">SpO2</div><div className="metric-value">{latest.oxygenSaturationPct}%</div></div>
          <div className="metric-box"><div className="metric-label">Temp</div><div className="metric-value">{latest.temperatureCelsius}°C</div></div>
          <div className="metric-box"><div className="metric-label">Resp. rate</div><div className="metric-value">{latest.respiratoryRate}/min</div></div>
        </div>
      )}
    </div>
  )
}
