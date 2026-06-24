import Sidebar from './Sidebar'
import TopDisclaimer from './TopDisclaimer'

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopDisclaimer />
        {children}
      </div>
    </div>
  )
}
