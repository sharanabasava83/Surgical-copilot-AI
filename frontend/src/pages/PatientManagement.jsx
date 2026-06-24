import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { getPatients, createPatient, deletePatient } from '../services/api'
import StatusBadge from '../components/StatusBadge'

const EMPTY_FORM = {
  fullName: '', gender: '', dateOfBirth: '', bloodGroup: '', email: '',
  phone: '', address: '', preferredLanguage: 'en', medicalHistory: '', allergies: '',
}

export default function PatientManagement() {
  const [patients, setPatients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    getPatients()
      .then((res) => setPatients(res.data))
      .catch(() => setError('Could not reach the backend. Make sure the Spring Boot API is running on port 8080.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createPatient(form)
      setForm(EMPTY_FORM)
      setShowForm(false)
      load()
    } catch (err) {
      setError('Failed to create patient. Check required fields.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient record?')) return
    await deletePatient(id)
    load()
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-eyebrow">CORE SURGICAL INTELLIGENCE</div>
          <h1 className="page-title">Patient Management System</h1>
          <p className="page-description">Register, search, and manage patient records.</p>
          <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={15} /> New Patient
        </button>
      </div>

      {error && <div className="simulated-banner" style={{ borderColor: 'var(--signal-red)' }}>{error}</div>}

      {showForm && (
        <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <div className="form-row">
            <div className="form-field">
              <label>Full name *</label>
              <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Date of birth</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Blood group</label>
              <input value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} placeholder="O+" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-field" style={{ marginBottom: 12 }}>
            <label>Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Medical history</label>
              <textarea rows={2} value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Allergies</label>
              <textarea rows={2} value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit">Save patient</button>
        </form>
      )}

      <div className="card">
        {loading ? (
          <p style={{ color: 'var(--ink-400)' }}>Loading patients…</p>
        ) : patients.length === 0 ? (
          <div className="empty-state">No patients yet. Add one to get started.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Gender</th><th>Blood group</th><th>Phone</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/patients/${p.id}`)}>
                  <td>{p.fullName}</td>
                  <td>{p.gender || '—'}</td>
                  <td>{p.bloodGroup || '—'}</td>
                  <td>{p.phone || '—'}</td>
                  <td><span className="chip">{p.status}</span></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
