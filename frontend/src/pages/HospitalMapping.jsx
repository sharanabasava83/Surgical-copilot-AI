import { useEffect, useState } from 'react'
import { getHospitals } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

// Simple equirectangular projection - no external maps API key required.
function project(lat, lng) {
  const x = ((lng + 180) / 360) * 100
  const y = ((90 - lat) / 180) * 100
  return { x, y }
}

const CAPACITY_COLOR = { NORMAL: '#34e1c8', BUSY: '#f0a93c', CRITICAL: '#e8556a' }

export default function HospitalMapping() {
  const [hospitals, setHospitals] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getHospitals().then((res) => setHospitals(res.data)).catch(() => {})
  }, [])

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">SMART HOSPITAL &amp; EMERGENCY SERVICES</div>
        <h1 className="page-title">Global Location &amp; Hospital Mapping</h1>
        <p className="page-description">Map view of hospital locations and live capacity.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Hospital records are real, stored data. The map uses a simple built-in projection
        instead of a paid maps API (add a maps API key in <code>application.properties</code>
        to upgrade to satellite/street tiles).
      </SimulatedBanner>

      <div className="card" style={{ position: 'relative', height: 420, overflow: 'hidden', background: 'linear-gradient(180deg, var(--ink-800), var(--ink-900))' }}>
        {hospitals.map((h) => {
          const { x, y } = project(h.latitude, h.longitude)
          return (
            <div
              key={h.id}
              onClick={() => setSelected(h)}
              style={{
                position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)',
                cursor: 'pointer', textAlign: 'center',
              }}
            >
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: CAPACITY_COLOR[h.emergencyCapacity] || '#34e1c8',
                boxShadow: `0 0 0 4px ${CAPACITY_COLOR[h.emergencyCapacity]}33`,
              }} />
              <div style={{ fontSize: 10, color: 'var(--ink-200)', marginTop: 4, whiteSpace: 'nowrap' }}>{h.city}</div>
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginTop: 0, fontSize: 14 }}>{selected.name}</h3>
          <p style={{ fontSize: 13, color: 'var(--ink-300)' }}>{selected.city}, {selected.country} · {selected.type}</p>
          <div className="metric-row">
            <div className="metric-box"><div className="metric-label">Beds available</div><div className="metric-value cyan">{selected.bedsAvailable}</div></div>
            <div className="metric-box"><div className="metric-label">ICU beds</div><div className="metric-value">{selected.icuBedsAvailable}</div></div>
            <div className="metric-box"><div className="metric-label">Capacity</div><div className="metric-value" style={{ color: CAPACITY_COLOR[selected.emergencyCapacity] }}>{selected.emergencyCapacity}</div></div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: 16 }}>
        <table className="data-table">
          <thead><tr><th>Hospital</th><th>Location</th><th>Type</th><th>Beds</th><th>Capacity</th></tr></thead>
          <tbody>
            {hospitals.map((h) => (
              <tr key={h.id} onClick={() => setSelected(h)} style={{ cursor: 'pointer' }}>
                <td>{h.name}</td>
                <td>{h.city}, {h.country}</td>
                <td><span className="chip">{h.type}</span></td>
                <td>{h.bedsAvailable}</td>
                <td><span className="chip" style={{ color: CAPACITY_COLOR[h.emergencyCapacity] }}>{h.emergencyCapacity}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
