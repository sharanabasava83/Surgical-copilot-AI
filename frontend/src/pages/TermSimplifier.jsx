import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import { simplifyTerms } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const SAMPLE = "The patient presented with tachycardia and dyspnea following a laparoscopic procedure. Postoperative course was complicated by mild edema; no signs of sepsis. Prognosis is favorable."

export default function TermSimplifier() {
  const [text, setText] = useState(SAMPLE)
  const [simplified, setSimplified] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSimplify = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await simplifyTerms(text)
      setSimplified(res.data.simplified)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">AI &amp; KNOWLEDGE SYSTEMS</div>
        <h1 className="page-title">Medical Term Simplifier</h1>
        <p className="page-description">Rewrites clinical text into plain language using a glossary of common terms.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        This is real, deterministic rule-based text replacement (a glossary lookup) — not a
        generative AI model, and it covers only the terms in its glossary.
      </SimulatedBanner>

      <form className="card" onSubmit={handleSimplify} style={{ marginBottom: 20 }}>
        <div className="form-field" style={{ marginBottom: 14 }}>
          <label>Clinical text</label>
          <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          <Wand2 size={14} /> {loading ? 'Simplifying…' : 'Simplify'}
        </button>
      </form>

      {simplified && (
        <div className="card">
          <h3 style={{ marginTop: 0, fontSize: 14 }}>Plain-language version</h3>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{simplified}</p>
        </div>
      )}
    </div>
  )
}
