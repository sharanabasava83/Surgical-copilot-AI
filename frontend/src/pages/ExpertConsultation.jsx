import { useEffect, useState } from 'react'
import { Send, MessageSquare } from 'lucide-react'
import api, { getDoctors } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const EMPTY = { expertDoctorId: '', question: '', urgency: 'ROUTINE' }

export default function ExpertConsultation() {
  const [doctors, setDoctors] = useState([])
  const [requests, setRequests] = useState([])
  const [form, setForm] = useState(EMPTY)

  const load = () => {
    getDoctors().then((res) => setDoctors(res.data)).catch(() => {})
    api.get('/consult-requests').then((res) => setRequests(res.data)).catch(() => {})
  }

  useEffect(load, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/consult-requests', {
      expertDoctor: { id: form.expertDoctorId },
      question: form.question,
      urgency: form.urgency,
    })
    setForm(EMPTY)
    load()
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">GLOBAL COLLABORATION</div>
        <h1 className="page-title">Worldwide Expert Consultation</h1>
        <p className="page-description">Request a consult from a specialist in the directory.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        The directory and request flow are real, stored data. There's no real-time
        notification or video-call infrastructure connecting to the expert.
      </SimulatedBanner>

      <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div className="form-row">
          <div className="form-field">
            <label>Expert *</label>
            <select required value={form.expertDoctorId} onChange={(e) => setForm({ ...form, expertDoctorId: e.target.value })}>
              <option value="">Select an expert</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.fullName} — {d.specialization} ({d.country})</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Urgency</label>
            <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
              <option value="ROUTINE">Routine</option>
              <option value="URGENT">Urgent</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>
        </div>
        <div className="form-field" style={{ marginBottom: 12 }}>
          <label>Your question *</label>
          <textarea required rows={3} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
        </div>
        <button className="btn btn-primary" type="submit"><Send size={14} /> Send request</button>
      </form>

      {requests.length === 0 ? (
        <div className="card"><div className="empty-state">No consult requests yet.</div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {requests.map((r) => (
            <div className="card" key={r.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <strong style={{ fontSize: 14 }}><MessageSquare size={14} style={{ marginRight: 6, verticalAlign: -2 }} />To: {r.expertDoctor?.fullName || '—'}</strong>
                <span className="chip">{r.status}</span>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--ink-100)', marginBottom: 6 }}>{r.question}</p>
              <span className="chip" style={{ color: r.urgency === 'EMERGENCY' ? 'var(--signal-red)' : 'var(--ink-300)' }}>{r.urgency}</span>
              {r.expertResponse && (
                <p style={{ marginTop: 10, padding: 10, background: 'var(--ink-800)', borderRadius: 8, fontSize: 13, color: 'var(--signal-cyan)' }}>
                  {r.expertResponse}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
