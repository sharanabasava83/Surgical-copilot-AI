import { useState } from 'react'
import { Plus, X, Search } from 'lucide-react'
import { checkDrugInteractions } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const SEVERITY_COLOR = { HIGH: '#e8556a', MEDIUM: '#f0a93c', LOW: '#34e1c8' }

export default function DrugInteractionChecker() {
  const [drugs, setDrugs] = useState([''])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const updateDrug = (i, value) => {
    const next = [...drugs]
    next[i] = value
    setDrugs(next)
  }

  const handleCheck = async (e) => {
    e.preventDefault()
    const filtered = drugs.map((d) => d.trim()).filter(Boolean)
    if (filtered.length < 2) return
    setLoading(true)
    try {
      const res = await checkDrugInteractions(filtered)
      setResult(res.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">AI &amp; KNOWLEDGE SYSTEMS</div>
        <h1 className="page-title">AI Drug Interaction Checker</h1>
        <p className="page-description">Check a small sample set of drug names for known interactions.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Uses a small illustrative dataset of well-known interactions (e.g. warfarin + aspirin),
        <strong> not a licensed, exhaustive drug database</strong>. Try: warfarin, aspirin,
        metformin, alcohol, sildenafil, nitrates.
      </SimulatedBanner>

      <form className="card" onSubmit={handleCheck} style={{ marginBottom: 20 }}>
        {drugs.map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input style={{ flex: 1, background: 'var(--ink-800)', border: '1px solid var(--ink-600)', borderRadius: 8, padding: '9px 11px', color: 'var(--ink-50)' }}
              placeholder={`Drug ${i + 1} name`} value={d} onChange={(e) => updateDrug(i, e.target.value)} />
            {drugs.length > 1 && (
              <button type="button" className="btn btn-secondary" onClick={() => setDrugs(drugs.filter((_, idx) => idx !== i))}>
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn btn-secondary" onClick={() => setDrugs([...drugs, ''])}>
            <Plus size={14} /> Add drug
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Search size={14} /> {loading ? 'Checking…' : 'Check interactions'}
          </button>
        </div>
      </form>

      {result && (
        <div className="card">
          <h3 style={{ marginTop: 0, fontSize: 14 }}>
            {result.interactionsFound} interaction(s) found among {result.drugsChecked.length} drugs
          </h3>
          {result.interactions.length === 0 ? (
            <p style={{ color: 'var(--ink-400)', fontSize: 13 }}>No known interactions found in this demo dataset.</p>
          ) : (
            <table className="data-table">
              <thead><tr><th>Drug A</th><th>Drug B</th><th>Severity</th><th>Description</th></tr></thead>
              <tbody>
                {result.interactions.map((it, i) => (
                  <tr key={i}>
                    <td>{it.drugA}</td>
                    <td>{it.drugB}</td>
                    <td><span className="chip" style={{ color: SEVERITY_COLOR[it.severity] }}>{it.severity}</span></td>
                    <td style={{ fontSize: 12.5 }}>{it.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p style={{ fontSize: 11.5, color: 'var(--ink-400)', marginTop: 12 }}>{result.disclaimer}</p>
        </div>
      )}
    </div>
  )
}
