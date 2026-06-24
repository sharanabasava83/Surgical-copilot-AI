import { useState } from 'react'
import { Stethoscope } from 'lucide-react'
import api from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

export default function DiagnosisAssistant() {
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!symptoms.trim()) return
    setLoading(true)
    try {
      const res = await api.post('/diagnosis/assess', { symptoms })
      setResult(res.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">AI &amp; KNOWLEDGE SYSTEMS</div>
        <h1 className="page-title">AI Diagnosis Assistant</h1>
        <p className="page-description">Enter symptoms to see a simulated differential list.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Uses simple keyword matching against a small illustrative ruleset (try: chest pain,
        fever, headache, fatigue, joint pain, rash). <strong>This is not a real diagnostic
        model</strong> and must never inform real medical decisions.
      </SimulatedBanner>

      <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div className="form-field" style={{ marginBottom: 14 }}>
          <label>Describe symptoms</label>
          <textarea rows={3} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g. fever and headache for two days" />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          <Stethoscope size={14} /> {loading ? 'Analyzing…' : 'Generate differential'}
        </button>
      </form>

      {result && (
        <div className="card">
          <h3 style={{ marginTop: 0, fontSize: 14 }}>Possible conditions (simulated)</h3>
          <table className="data-table">
            <thead><tr><th>Condition</th><th>Matched symptom</th><th>Note</th></tr></thead>
            <tbody>
              {result.possibleConditions.map((c, i) => (
                <tr key={i}>
                  <td>{c.condition}</td>
                  <td><span className="chip">{c.matchedSymptom}</span></td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-300)' }}>{c.likelihoodNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 11.5, color: 'var(--ink-400)', marginTop: 12 }}>{result.disclaimer}</p>
        </div>
      )}
    </div>
  )
}
