import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { getAppointments, createAppointment, deleteAppointment, getPatients, getDoctors } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const EMPTY = { patientId: '', doctorId: '', reason: '', appointmentTime: '', type: 'CONSULTATION' }

export default function SurgeryScheduling() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.all([getAppointments(), getPatients(), getDoctors()])
      .then(([a, p, d]) => {
        setAppointments(a.data)
        setPatients(p.data)
        setDoctors(d.data)
      })
      .catch(() => setError('Could not reach the backend.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createAppointment({
        patient: { id: form.patientId },
        doctor: form.doctorId ? { id: form.doctorId } : null,
        reason: form.reason,
        appointmentTime: form.appointmentTime,
        type: form.type,
      })
      setForm(EMPTY)
      load()
    } catch (err) {
      if (err.response?.status === 409) {
        setError(err.response.data.message)
      } else {
        setError('Failed to schedule. Check all required fields.')
      }
    }
  }

  const handleDelete = async (id) => {
    await deleteAppointment(id)
    load()
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">SMART HOSPITAL &amp; EMERGENCY SERVICES</div>
        <h1 className="page-title">AI Surgery Scheduling System</h1>
        <p className="page-description">Real scheduling with automatic conflict detection against each doctor's calendar.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        The conflict-checking logic here is real (30-minute buffer per doctor) — this is genuine
        scheduling logic, not a simulated AI prediction.
      </SimulatedBanner>

      <div className="card" style={{ marginBottom: 20 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Patient *</label>
              <select required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
                <option value="">Select patient</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Doctor</label>
              <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
                <option value="">Select doctor</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.fullName}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Date &amp; time *</label>
              <input required type="datetime-local" value={form.appointmentTime} onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="CONSULTATION">Consultation</option>
                <option value="PRE_OP">Pre-op</option>
                <option value="POST_OP">Post-op</option>
                <option value="FOLLOW_UP">Follow-up</option>
              </select>
            </div>
          </div>
          <div className="form-field" style={{ marginBottom: 12 }}>
            <label>Reason</label>
            <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </div>
          {error && <p style={{ color: 'var(--signal-red)', fontSize: 13 }}>{error}</p>}
          <button className="btn btn-primary" type="submit"><Plus size={14} /> Schedule</button>
        </form>
      </div>

      <div className="card">
        {loading ? <p style={{ color: 'var(--ink-400)' }}>Loading…</p> : appointments.length === 0 ? (
          <div className="empty-state">No appointments scheduled yet.</div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Patient</th><th>Doctor</th><th>When</th><th>Type</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.patient?.fullName}</td>
                  <td>{a.doctor?.fullName || '—'}</td>
                  <td>{a.appointmentTime ? new Date(a.appointmentTime).toLocaleString() : '—'}</td>
                  <td><span className="chip">{a.type}</span></td>
                  <td><span className="chip">{a.status}</span></td>
                  <td><button className="btn btn-danger" onClick={() => handleDelete(a.id)}><Trash2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
