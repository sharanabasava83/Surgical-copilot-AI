import { useEffect, useState, useRef } from 'react'
import { Play, Pause } from 'lucide-react'
import { getAmbulances, advanceAmbulance } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

function project(lat, lng) {
  const x = ((lng + 180) / 360) * 100
  const y = ((90 - lat) / 180) * 100
  return { x, y }
}

const STATUS_COLOR = {
  AVAILABLE: '#5b6b82', DISPATCHED: '#f0a93c', EN_ROUTE: '#34e1c8', ARRIVED: '#8e7cf2', COMPLETED: '#5b6b82',
}

export default function AmbulanceTracking() {
  const [ambulances, setAmbulances] = useState([])
  const [live, setLive] = useState(false)
  const intervalRef = useRef(null)

  const load = () => getAmbulances().then((res) => setAmbulances(res.data)).catch(() => {})

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (live) {
      intervalRef.current = setInterval(async () => {
        const res = await getAmbulances()
        await Promise.all(
          res.data
            .filter((a) => a.status === 'EN_ROUTE' || a.status === 'DISPATCHED')
            .map((a) => advanceAmbulance(a.id))
        )
        load()
      }, 2000)
    }
    return () => clearInterval(intervalRef.current)
  }, [live])

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">SMART HOSPITAL &amp; EMERGENCY SERVICES</div>
        <h1 className="page-title">Ambulance Tracking System</h1>
        <p className="page-description">Live simulated ambulance location and ETA tracking.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        No real GPS/telematics feed is connected. Positions move toward their destination using a
        simulated step function so the live-tracking UI can be demonstrated.
      </SimulatedBanner>

      <button className="btn btn-primary" style={{ marginBottom: 16 }} onClick={() => setLive(!live)}>
        {live ? <Pause size={14} /> : <Play size={14} />} {live ? 'Pause simulation' : 'Start live simulation'}
      </button>

      <div className="card" style={{ position: 'relative', height: 380, marginBottom: 20, background: 'linear-gradient(180deg, var(--ink-800), var(--ink-900))' }}>
        {ambulances.map((a) => {
          const { x, y } = project(a.currentLat, a.currentLng)
          return (
            <div key={a.id} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLOR[a.status] }} />
              <div style={{ fontSize: 10, color: 'var(--ink-200)', marginTop: 4, whiteSpace: 'nowrap' }}>{a.vehicleCode}</div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <table className="data-table">
          <thead><tr><th>Vehicle</th><th>Driver</th><th>Status</th><th>Destination</th><th>ETA</th></tr></thead>
          <tbody>
            {ambulances.map((a) => (
              <tr key={a.id}>
                <td>{a.vehicleCode}</td>
                <td>{a.driverName}</td>
                <td><span className="chip" style={{ color: STATUS_COLOR[a.status] }}>{a.status}</span></td>
                <td>{a.destinationHospital}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{a.etaMinutes != null ? `${a.etaMinutes} min` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
