import { useEffect, useState } from 'react'
import { Search, BookOpen } from 'lucide-react'
import api from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

export default function MedicalResearchHub() {
  const [articles, setArticles] = useState([])
  const [search, setSearch] = useState('')

  const load = (q) => {
    api.get('/knowledge-articles', { params: q ? { search: q } : {} })
      .then((res) => setArticles(res.data))
      .catch(() => {})
  }

  useEffect(() => { load('') }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    load(search)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">AI &amp; KNOWLEDGE SYSTEMS</div>
        <h1 className="page-title">Medical Research Hub &amp; Knowledge Engine</h1>
        <p className="page-description">Searchable, curated reference article library.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Real, working search/filter over a real stored dataset — but the dataset itself is a
        small set of illustrative sample articles, not a live connection to PubMed or a real
        research database.
      </SimulatedBanner>

      <form onSubmit={handleSearch} className="card" style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <input
          style={{ flex: 1, background: 'var(--ink-800)', border: '1px solid var(--ink-600)', borderRadius: 8, padding: '9px 12px', color: 'var(--ink-50)' }}
          placeholder="Search by title, category, or tag (e.g. cardiac, orthopedics, infection)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" type="submit"><Search size={14} /> Search</button>
      </form>

      {articles.length === 0 ? (
        <div className="card"><div className="empty-state">No articles match your search.</div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {articles.map((a) => (
            <div className="card" key={a.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 15 }}><BookOpen size={14} style={{ marginRight: 6, verticalAlign: -2 }} />{a.title}</h3>
                <span className="chip">{a.category}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--ink-400)', margin: '0 0 8px' }}>
                {a.authors} · {a.sourceJournal} · {a.publishedDate}
              </p>
              <p style={{ fontSize: 13.5, color: 'var(--ink-100)', lineHeight: 1.5 }}>{a.summary}</p>
              {a.tags && (
                <div className="chip-row" style={{ marginTop: 10 }}>
                  {a.tags.split(',').map((t) => <span className="chip" key={t}>{t.trim()}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
