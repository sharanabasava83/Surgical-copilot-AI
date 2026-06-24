import { Info } from 'lucide-react'

export default function SimulatedBanner({ children }) {
  return (
    <div className="simulated-banner">
      <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
      <div>
        {children || (
          <>
            This module shows a <strong>simulated</strong> output for demonstration purposes.
            It is not powered by a clinically validated model and must not be used for real
            patient care decisions.
          </>
        )}
      </div>
    </div>
  )
}
