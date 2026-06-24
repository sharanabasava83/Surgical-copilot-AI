import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import api, { getSurgeriesByPatient, getReportsByPatient, getRecoveryRecords } from '../services/api'

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [surgeries, setSurgeries] = useState([])
  const [reports, setReports] = useState([])
  const [recovery, setRecovery] = useState([])

  useEffect(() => {
    api.get(`/patients/${id}`).then((res) => setPatient(res.data))
    getSurgeriesByPatient(id).then((res) => setSurgeries(res.data)).catch(() => {})
    getReportsByPatient(id).then((res) => setReports(res.data)).catch(() => {})
    getRecoveryRecords(id).then((res) => setRecovery(res.data)).catch(() => {})
  }, [id])

  if (!patient) {
    return <div className="page-container"><p style={{ color: 'var(--ink-400)' }}>Loading patient…</p></div>
  }

  return (
    <div className="page-container">
      <button className="btn btn-secondary" style={{ marginBottom: 18 }} onClick={() => navigate(-1)}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="page-header">
        <div className="page-eyebrow">PATIENT RECORD</div>
        <h1 className="page-title">{patient.fullName}</h1>
        <p className="page-description">
          {patient.gender} · DOB {patient.dateOfBirth || 'N/A'} · Blood group {patient.bloodGroup || 'N/A'}
        </p>
      </div>

      <div className="metric-row">
        <div className="metric-box">
          <div className="metric-label">Status</div>
          <div className="metric-value cyan" style={{ fontSize: 15 }}>{patient.status}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Surgeries</div>
          <div className="metric-value">{surgeries.length}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Reports</div>
          <div className="metric-value">{reports.length}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Recovery logs</div>
          <div className="metric-value">{recovery.length}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0, fontSize: 14 }}>Contact &amp; history</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-300)' }}><strong>Email:</strong> {patient.email || '—'}</p>
        <p style={{ fontSize: 13, color: 'var(--ink-300)' }}><strong>Phone:</strong> {patient.phone || '—'}</p>
        <p style={{ fontSize: 13, color: 'var(--ink-300)' }}><strong>Address:</strong> {patient.address || '—'}</p>
        <p style={{ fontSize: 13, color: 'var(--ink-300)' }}><strong>Medical history:</strong> {patient.medicalHistory || '—'}</p>
        <p style={{ fontSize: 13, color: 'var(--ink-300)' }}><strong>Allergies:</strong> {patient.allergies || '—'}</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0, fontSize: 14 }}>Surgeries</h3>
        {surgeries.length === 0 ? (
          <p style={{ color: 'var(--ink-400)', fontSize: 13 }}>No surgeries recorded.</p>
        ) : (
          <table className="data-table">
            <thead><tr><th>Procedure</th><th>Status</th><th>Scheduled</th><th>Predicted success</th></tr></thead>
            <tbody>
              {surgeries.map((s) => (
                <tr key={s.id}>
                  <td>{s.procedureName}</td>
                  <td><span className="chip">{s.status}</span></td>
                  <td>{s.scheduledStart ? new Date(s.scheduledStart).toLocaleString() : '—'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{s.predictedSuccessRate ? `${s.predictedSuccessRate}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, fontSize: 14 }}>Reports</h3>
        {reports.length === 0 ? (
          <p style={{ color: 'var(--ink-400)', fontSize: 13 }}>No reports uploaded. Try the Medical Image Analysis module.</p>
        ) : (
          <table className="data-table">
            <thead><tr><th>Type</th><th>File</th><th>Status</th></tr></thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.reportType}</td>
                  <td>{r.fileName}</td>
                  <td><span className="chip">{r.aiAnalysisStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
