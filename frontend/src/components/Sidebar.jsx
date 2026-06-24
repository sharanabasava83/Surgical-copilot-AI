import { NavLink } from 'react-router-dom'
import { LayoutGrid, AlertCircle } from 'lucide-react'
import { useModules } from '../context/ModuleContext'
import ModuleIcon from './ModuleIcon'

export default function Sidebar() {
  const { modules, categories, apiOnline } = useModules()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="pulse-dot" />
          SURGICAL COPILOT
        </div>
        <div className="sidebar-sub">Global AI Ecosystem &middot; 53 modules</div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-item-label">
            <LayoutGrid size={16} /> Dashboard
          </span>
        </NavLink>

        {!apiOnline && (
          <div style={{ padding: '10px', fontSize: '11.5px', color: 'var(--signal-amber)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
            Backend not reachable. Start the Spring Boot API on port 8080.
          </div>
        )}

        {categories.map((category) => (
          <div key={category}>
            <div className="nav-category">{category}</div>
            {modules
              .filter((m) => m.category === category)
              .map((m) => (
                <NavLink
                  key={m.moduleKey}
                  to={`/module/${m.moduleKey}`}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  title={m.name}
                >
                  <span className="nav-item-label">
                    <ModuleIcon name={m.icon} size={15} />
                    {m.name}
                  </span>
                </NavLink>
              ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
