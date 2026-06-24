import { useState } from 'react'
import { Search } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const ANATOMY_DATA = [
  { name: 'Heart', system: 'Cardiovascular', description: 'A four-chambered muscular organ that pumps blood through the circulatory system.', location: 'Mediastinum, left of center, behind the sternum.' },
  { name: 'Lungs', system: 'Respiratory', description: 'Paired organs responsible for gas exchange, bringing oxygen into the blood and removing carbon dioxide.', location: 'Thoracic cavity, on either side of the heart.' },
  { name: 'Liver', system: 'Digestive', description: 'The largest internal organ, responsible for metabolism, detoxification, and bile production.', location: 'Upper right abdomen, beneath the diaphragm.' },
  { name: 'Kidneys', system: 'Urinary', description: 'Paired organs that filter blood to produce urine, regulating fluid and electrolyte balance.', location: 'Retroperitoneal space, on either side of the spine.' },
  { name: 'Brain', system: 'Nervous', description: 'The central organ of the nervous system, controlling thought, movement, and most bodily functions.', location: 'Cranial cavity, protected by the skull.' },
  { name: 'Stomach', system: 'Digestive', description: 'A muscular sac that breaks down food using acid and enzymes.', location: 'Upper left abdomen, below the diaphragm.' },
  { name: 'Pancreas', system: 'Digestive/Endocrine', description: 'Produces digestive enzymes and hormones including insulin.', location: 'Behind the stomach, in the upper abdomen.' },
  { name: 'Spleen', system: 'Lymphatic', description: 'Filters blood and supports immune function.', location: 'Upper left abdomen, near the stomach.' },
  { name: 'Femur', system: 'Skeletal', description: 'The longest and strongest bone in the body, forming the thigh.', location: 'Between the hip and knee.' },
  { name: 'Spinal Cord', system: 'Nervous', description: 'A bundle of nerve tissue carrying signals between the brain and the rest of the body.', location: 'Within the vertebral column.' },
]

export default function AnatomyExplorer() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(ANATOMY_DATA[0])

  const filtered = ANATOMY_DATA.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) || a.system.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">MEDICAL IMAGING &amp; VISUALIZATION</div>
        <h1 className="page-title">Digital Anatomy Explorer</h1>
        <p className="page-description">Real, searchable reference browser for major organs and systems.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Real, working search/filter UI over a genuine (if small) reference dataset — this is a
        static educational reference, not a patient-specific or imaging-derived anatomy model.
      </SimulatedBanner>

      <div className="card" style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
        <Search size={16} style={{ marginTop: 9, color: 'var(--ink-400)' }} />
        <input
          style={{ flex: 1, background: 'var(--ink-800)', border: '1px solid var(--ink-600)', borderRadius: 8, padding: '9px 12px', color: 'var(--ink-50)' }}
          placeholder="Search organs or systems…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 8 }}>
          {filtered.map((a) => (
            <div
              key={a.name}
              onClick={() => setSelected(a)}
              style={{
                padding: '9px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 13.5,
                background: selected.name === a.name ? 'var(--ink-700)' : 'transparent',
                color: selected.name === a.name ? 'var(--signal-cyan)' : 'var(--ink-100)',
              }}
            >
              {a.name}
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0, fontSize: 18 }}>{selected.name}</h3>
          <span className="chip" style={{ marginBottom: 14, display: 'inline-block' }}>{selected.system} system</span>
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{selected.description}</p>
          <p style={{ fontSize: 13, color: 'var(--ink-300)' }}><strong>Location:</strong> {selected.location}</p>
        </div>
      </div>
    </div>
  )
}
