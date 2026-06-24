export default function StatusBadge({ status }) {
  const isLive = status === 'LIVE_DEMO'
  return (
    <span className={`status-badge ${isLive ? 'live' : 'simulated'}`}>
      <span className="dot" />
      {isLive ? 'LIVE DEMO' : 'SIMULATED'}
    </span>
  )
}
