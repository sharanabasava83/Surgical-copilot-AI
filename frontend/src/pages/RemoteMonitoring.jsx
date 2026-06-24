import { useEffect, useState, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Play, Pause } from 'lucide-react'
import { getPatients, getVitals, simulateVitalsReading } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

export default function RemoteMonitoring() {
  const [patients, setPatients] = useState([])
  const [patientId, setPatientId] = useState('')
  const [readings, setReadings] = useState([])
  const [live, setLive] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    getPatients().then((res) => {
      setPatients(res.data)
      if (res.data.length) setPatientId(res.data[0].id)
    }).catch(() => {})
  }, [])

  const loadReadings = (pid) => {
    if (!pid) return
    getVitals(pid).then((res) => setReadings(res.data.slice().reverse())).catch(() => {})
  }

  useEffect(() => { loadReadings(patientId) }, [patientId])

  useEffect(() => {
    if (live && patientId) {
      intervalRef.current = setInterval(async () => {
        await simulateVitalsReading(patientId)
        loadReadings(patientId)
      }, 2500)
    }
    return () => clearInterval(intervalRef.current)
  }, [live, patientId])

  const chartData = readings.map((r, i) => ({
    t: i,
    heartRate: r.heartRateBpm,
    spo2: r.oxygenSaturationPct,
    systolic: r.systolicBp,
  }))

  const latest = readings[readings.length - 1]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">PATIENT MONITORING &amp; RECOVERY</div>
        <h1 className="page-title">Remote Patient Monitoring</h1>
        <p className="page-description">Live simulated vitals stream with charting.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        No real wearable device is connected. Each reading is randomly generated within realistic
        physiological ranges to demonstrate the live-monitoring UI/UX.
      </SimulatedBanner>

      <div className="form-row" style={{ marginBottom: 16, alignItems: 'flex-end' }}>
        <div className="form-field">
          <label>Patient</label>
          <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setLive(!live)}>
          {live ? <Pause size={14} /> : <Play size={14} />} {live ? 'Pause stream' : 'Start live stream'}
        </button>
      </div>

      <div className="metric-row">
        <div className="metric-box"><div className="metric-label">Heart rate</div><div className="metric-value cyan">{latest?.heartRateBpm ?? '—'} bpm</div></div>
        <div className="metric-box"><div className="metric-label">Blood pressure</div><div className="metric-value">{latest ? `${latest.systolicBp}/${latest.diastolicBp}` : '—'}</div></div>
        <div className="metric-box"><div className="metric-label">SpO2</div><div className="metric-value">{latest?.oxygenSaturationPct ?? '—'}%</div></div>
        <div className="metric-box"><div className="metric-label">Temperature</div><div className="metric-value">{latest?.temperatureCelsius ?? '—'}°C</div></div>
      </div>

      <div className="card" style={{ height: 280 }}>
        <h3 style={{ marginTop: 0, fontSize: 14 }}>Live trace</h3>
        {chartData.length === 0 ? (
          <div className="empty-state">No readings yet. Press "Start live stream".</div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="var(--ink-700)" strokeDasharray="3 3" />
              <XAxis dataKey="t" stroke="var(--ink-400)" fontSize={11} />
              <YAxis stroke="var(--ink-400)" fontSize={11} />
              <Tooltip contentStyle={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }} />
              <Line type="monotone" dataKey="heartRate" stroke="#34e1c8" strokeWidth={2} dot={false} name="Heart rate" />
              <Line type="monotone" dataKey="spo2" stroke="#8e7cf2" strokeWidth={2} dot={false} name="SpO2" />
              <Line type="monotone" dataKey="systolic" stroke="#f0a93c" strokeWidth={2} dot={false} name="Systolic BP" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
