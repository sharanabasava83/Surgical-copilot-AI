import { useState } from 'react'
import { Search } from 'lucide-react'
import api from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

export default function SimilarCaseRecommendation() {
  const [procedureType, setProcedureType] = useState('CARDIAC')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.get('/similar-cases', { params: { procedureType, query } })
      setResults(res.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">AI &amp; KNOWLEDGE SYSTEMS</div>
        <h1 className="page-title">Similar Case Recommendation</h1>
        <p className="page-description">Find stored surgeries similar to a given procedure type and keyword.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        The similarity-ranking logic here is genuinely real — it scores and sorts actual stored
        surgery records. The "case database" itself is just this demo's small sample dataset,
        not a real clinical case repository.
      </SimulatedBanner>

      <form className="card" onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <div className="form-row">
          <div className="form-field">
            <label>Procedure type</label>
            <select value={procedureType} onChange={(e) => setProcedureType(e.target.value)}>
              <option value="CARDIAC">Cardiac</option>
              <option value="ORTHOPEDIC">Orthopedic</option>
              <option value="NEURO">Neuro</option>
              <option value="GENERAL">General</option>
              <option value="TRANSPLANT">Transplant</option>
            </select>
          </div>
          <div className="form-field">
            <label>Keyword</label>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. bypass, knee" />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}><Search size={14} /> Find similar cases</button>
      </form>

      {results && (
        <div className="card">
          {results.length === 0 ? <div className="empty-state">No similar cases found.</div> : (
            <table className="data-table">
              <thead><tr><th>Procedure</th><th>Patient</th><th>Type</th><th>Status</th><th>Similarity score</th></tr></thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.surgeryId}>
                    <td>{r.procedureName}</td>
                    <td>{r.patientName}</td>
                    <td><span className="chip">{r.procedureType}</span></td>
                    <td>{r.status}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--signal-cyan)' }}>{r.similarityScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
