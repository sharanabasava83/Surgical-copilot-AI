import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import api from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const EMPTY = { authorName: '', hospitalName: '', country: '', postType: 'CASE_SHARE', title: '', body: '' }

export default function HospitalCollaboration({ filterType, pageTitle, pageDesc }) {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ ...EMPTY, postType: filterType || 'CASE_SHARE' })
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    api.get('/collaboration-posts', { params: filterType ? { postType: filterType } : {} })
      .then((res) => setPosts(res.data))
      .catch(() => {})
  }

  useEffect(load, [filterType])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/collaboration-posts', form)
    setForm({ ...EMPTY, postType: filterType || 'CASE_SHARE' })
    setShowForm(false)
    load()
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">GLOBAL COLLABORATION</div>
        <h1 className="page-title">{pageTitle}</h1>
        <p className="page-description">{pageDesc}</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Posts are real, persisted data shared across all visitors of this demo app — there's no
        real multi-hospital network or identity verification behind it.
      </SimulatedBanner>

      <button className="btn btn-primary" style={{ marginBottom: 16 }} onClick={() => setShowForm(!showForm)}>
        <Plus size={14} /> New post
      </button>

      {showForm && (
        <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <div className="form-row">
            <div className="form-field"><label>Your name *</label><input required value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} /></div>
            <div className="form-field"><label>Hospital</label><input value={form.hospitalName} onChange={(e) => setForm({ ...form, hospitalName: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-field"><label>Country</label><input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            <div className="form-field">
              <label>Type</label>
              <select value={form.postType} onChange={(e) => setForm({ ...form, postType: e.target.value })}>
                <option value="CASE_SHARE">Case share</option>
                <option value="DISCUSSION">Discussion</option>
                <option value="ALERT">Alert</option>
              </select>
            </div>
          </div>
          <div className="form-field" style={{ marginBottom: 12 }}><label>Title *</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="form-field" style={{ marginBottom: 12 }}><label>Details (keep anonymized)</label><textarea rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
          <button className="btn btn-primary" type="submit">Post</button>
        </form>
      )}

      {posts.length === 0 ? (
        <div className="card"><div className="empty-state">No posts yet.</div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {posts.map((p) => (
            <div className="card" key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <h3 style={{ margin: 0, fontSize: 15 }}>{p.title}</h3>
                <span className="chip">{p.postType}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--ink-400)', margin: '0 0 8px' }}>
                {p.authorName} · {p.hospitalName} · {p.country}
              </p>
              <p style={{ fontSize: 13.5, color: 'var(--ink-100)', lineHeight: 1.5 }}>{p.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
