import { ShieldAlert } from 'lucide-react'
import { useModules } from '../context/ModuleContext'

export default function TopDisclaimer() {
  const { disclaimer } = useModules()
  return (
    <div className="top-disclaimer">
      <ShieldAlert size={14} style={{ flexShrink: 0 }} />
      <span>{disclaimer}</span>
    </div>
  )
}
