import { useNavigate } from 'react-router-dom'
import { useModules } from '../context/ModuleContext'
import ModuleIcon from '../components/ModuleIcon'
import StatusBadge from '../components/StatusBadge'

export default function Dashboard() {
  const { modules, categories, loading } = useModules()
  const navigate = useNavigate()

  const liveCount = modules.filter((m) => m.implementationStatus === 'LIVE_DEMO').length

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">ECOSYSTEM OVERVIEW</div>
        <h1 className="page-title">Global AI Surgical Copilot Ecosystem</h1>
        <p className="page-description">
          53 modules spanning surgical intelligence, imaging, knowledge systems, language,
          global collaboration, monitoring, and hospital operations. {liveCount} modules are
          fully interactive demos; the rest are simulated mockups labeled for architecture review.
        </p>
      </div>

      <div className="metric-row">
        <div className="metric-box">
          <div className="metric-label">Total Modules</div>
          <div className="metric-value">{modules.length || 53}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Live Demos</div>
          <div className="metric-value cyan">{liveCount}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Simulated</div>
          <div className="metric-value" style={{ color: 'var(--signal-violet)' }}>
            {modules.length - liveCount}
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Categories</div>
          <div className="metric-value">{categories.length || 8}</div>
        </div>
      </div>

      {loading && <p style={{ color: 'var(--ink-400)' }}>Loading module catalog…</p>}

      {categories.map((category) => {
        const items = modules.filter((m) => m.category === category)
        return (
          <div className="category-section" key={category}>
            <div className="category-heading">
              <h2>{category}</h2>
              <span className="category-count">{items.length} modules</span>
            </div>
            <div className="module-grid">
              {items.map((m) => (
                <div
                  key={m.moduleKey}
                  className="module-card"
                  onClick={() => navigate(`/module/${m.moduleKey}`)}
                >
                  <div className="module-card-top">
                    <div className="module-card-icon">
                      <ModuleIcon name={m.icon} />
                    </div>
                    <StatusBadge status={m.implementationStatus} />
                  </div>
                  <div className="module-card-name">{m.name}</div>
                  <div className="module-card-desc">{m.description}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
