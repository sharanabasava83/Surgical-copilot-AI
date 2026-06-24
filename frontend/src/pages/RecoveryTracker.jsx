import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus } from 'lucide-react'
import { getPatients, getRecoveryRecords, createRecoveryRecord } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const EMPTY = { recordDate: '', painScore: 3, temperatureCelsius: 36.8, heartRateBpm: 78, mobilityScore: 60, notes: '' }

export default function RecoveryTracker() {
  const [patients, setPatients] = useState([])
  const [patientId, setPatientId] = useState('')
  const [records, setRecords] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    getPatients().then((res) => {
      setPatients(res.data)
      if (res.data.length) setPatientId(res.data[0].id)
    }).catch(() => {})
  }, [])

  const loadRecords = (pid) => {
    if (!pid) return
    getRecoveryRecords(pid).then((res) => setRecords(res.data)).catch(() => {})
  }

  useEffect(() => { loadRecords(patientId) }, [patientId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createRecoveryRecord({
      patient: { id: patientId },
      recordDate: form.recordDate || new Date().toISOString().slice(0, 10),
      painScore: Number(form.painScore),
      temperatureCelsius: Number(form.temperatureCelsius),
      heartRateBpm: Number(form.heartRateBpm),
      mobilityScore: Number(form.mobilityScore),
      notes: form.notes,
    })
    setForm(EMPTY)
    setShowForm(false)
    loadRecords(patientId)
  }

  const chartData = records.map((r) => ({
    date: r.recordDate,
    progress: r.recoveryProgressPct,
    pain: r.painScore,
  }))

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">PATIENT MONITORING &amp; RECOVERY</div>
        <h1 className="page-title">Recovery Progress Tracker</h1>
        <p className="page-description">Log real check-in data and chart recovery trends over time.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Data entry, storage, and charting here are real. The <strong>infection/readmission risk
        level and recovery-progress percentage</strong> shown per entry are computed from simple
        heuristic thresholds, not a validated clinical model.
      </SimulatedBanner>

      <div className="form-row" style={{ marginBottom: 16 }}>
        <div className="form-field">
          <label>Patient</label>
          <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
          </select>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="card" style={{ marginBottom: 20, height: 260 }}>
          <h3 style={{ marginTop: 0, fontSize: 14 }}>Recovery progress over time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="var(--ink-700)" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="var(--ink-400)" fontSize={11} />
              <YAxis stroke="var(--ink-400)" fontSize={11} />
              <Tooltip contentStyle={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }} />
              <Line type="monotone" dataKey="progress" stroke="#34e1c8" strokeWidth={2} name="Recovery %" />
              <Line type="monotone" dataKey="pain" stroke="#e8556a" strokeWidth={2} name="Pain score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <button className="btn btn-primary" style={{ marginBottom: 16 }} onClick={() => setShowForm(!showForm)}>
        <Plus size={14} /> Log check-in
      </button>

      {showForm && (
        <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <div className="form-row">
            <div className="form-field"><label>Date</label><input type="date" value={form.recordDate} onChange={(e) => setForm({ ...form, recordDate: e.target.value })} /></div>
            <div className="form-field"><label>Pain score (0-10)</label><input type="number" min="0" max="10" value={form.painScore} onChange={(e) => setForm({ ...form, painScore: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-field"><label>Temperature (°C)</label><input type="number" step="0.1" value={form.temperatureCelsius} onChange={(e) => setForm({ ...form, temperatureCelsius: e.target.value })} /></div>
            <div className="form-field"><label>Heart rate (bpm)</label><input type="number" value={form.heartRateBpm} onChange={(e) => setForm({ ...form, heartRateBpm: e.target.value })} /></div>
          </div>
          <div className="form-field" style={{ marginBottom: 12 }}><label>Mobility score (0-100)</label><input type="number" min="0" max="100" value={form.mobilityScore} onChange={(e) => setForm({ ...form, mobilityScore: e.target.value })} /></div>
          <div className="form-field" style={{ marginBottom: 12 }}><label>Notes</label><textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <button className="btn btn-primary" type="submit">Save check-in</button>
        </form>
      )}

      <div className="card">
        {records.length === 0 ? <div className="empty-state">No check-ins logged yet for this patient.</div> : (
          <table className="data-table">
            <thead><tr><th>Date</th><th>Pain</th><th>Mobility</th><th>Progress</th><th>Infection risk</th><th>Readmission risk</th></tr></thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.recordDate}</td>
                  <td>{r.painScore}</td>
                  <td>{r.mobilityScore}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{r.recoveryProgressPct}%</td>
                  <td><span className="chip">{r.infectionRiskLevel}</span></td>
                  <td><span className="chip">{r.readmissionRiskLevel}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
