import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getSurgeries } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

export default function BloodLossPrediction() {
  const [surgeries, setSurgeries] = useState([])

  useEffect(() => {
    getSurgeries().then((res) => setSurgeries(res.data)).catch(() => {})
  }, [])

  const chartData = surgeries.map((s) => ({
    name: s.procedureName?.slice(0, 18) || `Surgery ${s.id}`,
    bloodLoss: s.predictedBloodLossMl,
  }))

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">CORE SURGICAL INTELLIGENCE</div>
        <h1 className="page-title">Blood Loss Prediction</h1>
        <p className="page-description">Simulated estimate of expected intra-operative blood loss per scheduled surgery.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Estimates are computed from a simple heuristic by procedure type plus randomized
        variation, shown here for surgeries already created in the Success Prediction module —
        not a clinically validated blood-loss model.
      </SimulatedBanner>

      {chartData.length === 0 ? (
        <div className="card"><div className="empty-state">No surgeries yet. Create one in the Surgery Success Prediction module.</div></div>
      ) : (
        <div className="card" style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid stroke="var(--ink-700)" strokeDasharray="3 3" />
              <XAxis type="number" stroke="var(--ink-400)" fontSize={11} unit="ml" />
              <YAxis type="category" dataKey="name" stroke="var(--ink-400)" fontSize={11} width={150} />
              <Tooltip contentStyle={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }} />
              <Bar dataKey="bloodLoss" fill="#34e1c8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
