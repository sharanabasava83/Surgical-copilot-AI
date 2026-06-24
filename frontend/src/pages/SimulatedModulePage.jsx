import { useEffect, useState } from 'react'
import { getModule } from '../services/api'
import ModuleIcon from '../components/ModuleIcon'
import SimulatedBanner from '../components/SimulatedBanner'
import StatusBadge from '../components/StatusBadge'

// A small set of mock data rows so the screen feels real rather than empty.
const MOCK_ROWS = [
  { label: 'Sample output A', value: '87.3%', tag: 'synthetic' },
  { label: 'Sample output B', value: 'Moderate', tag: 'synthetic' },
  { label: 'Sample output C', value: '12.4 units', tag: 'synthetic' },
]

export default function SimulatedModulePage({ moduleKey }) {
  const [module, setModule] = useState(null)

  useEffect(() => {
    getModule(moduleKey)
      .then((res) => setModule(res.data))
      .catch(() => setModule(null))
  }, [moduleKey])

  const name = module?.name || moduleKey
  const description = module?.description || 'Module description unavailable.'
  const icon = module?.icon || 'box'

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ModuleIcon name={icon} size={14} /> MODULE
        </div>
        <h1 className="page-title">{name}</h1>
        <p className="page-description">{description}</p>
        <div style={{ marginTop: 10 }}>
          <StatusBadge status="SIMULATED" />
        </div>
      </div>

      <SimulatedBanner>
        <strong>{name}</strong> is shown here as a UX/architecture mockup. It demonstrates
        how this module would fit into the ecosystem, but it does not run a real model or
        connect to real clinical data. Building it out would require a trained, validated
        model and a regulatory pathway appropriate to its risk category.
      </SimulatedBanner>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0, fontSize: 14 }}>Example output (synthetic)</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ROWS.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{row.value}</td>
                <td>
                  <span className="chip">{row.tag}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, fontSize: 14 }}>What a real implementation would need</h3>
        <ul style={{ color: 'var(--ink-300)', fontSize: 13, lineHeight: 1.7, paddingLeft: 20 }}>
          <li>A trained, clinically validated model or licensed data source</li>
          <li>Regulatory clearance appropriate to the module's risk category</li>
          <li>Integration with real hospital systems (EHR/PACS/device APIs)</li>
          <li>Clinical oversight and an audit trail for every output</li>
        </ul>
      </div>
    </div>
  )
}
