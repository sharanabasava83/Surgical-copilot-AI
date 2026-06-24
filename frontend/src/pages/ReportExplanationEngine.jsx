import { useState } from 'react'
import { FileText } from 'lucide-react'
import api from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const SAMPLE = "MRI demonstrates a small lesion in the left lobe with mild surrounding edema. No evidence of metastasis. Findings are consistent with a benign process; recommend follow-up imaging in 6 months."

export default function ReportExplanationEngine() {
  const [text, setText] = useState(SAMPLE)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/report-explanation', { text })
      setResult(res.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">AI &amp; KNOWLEDGE SYSTEMS</div>
        <h1 className="page-title">Report Explanation Engine</h1>
        <p className="page-description">Plain-language rewrite of a clinical report, plus suggested questions to ask your doctor.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Reuses the real glossary-based Term Simplifier for the rewrite (genuine text transform).
        The "suggested questions" are a fixed helpful template, not a clinical interpretation of
        your specific report.
      </SimulatedBanner>

      <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div className="form-field" style={{ marginBottom: 14 }}>
          <label>Report text</label>
          <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          <FileText size={14} /> {loading ? 'Explaining…' : 'Explain report'}
        </button>
      </form>

      {result && (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginTop: 0, fontSize: 14 }}>Plain-language version</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{result.explanation}</p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0, fontSize: 14 }}>Questions you might ask your doctor</h3>
            <ul style={{ paddingLeft: 20, color: 'var(--ink-200)', lineHeight: 1.8 }}>
              {result.suggestedQuestions.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
