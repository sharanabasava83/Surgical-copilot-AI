import { useRef, useState, useEffect } from 'react'
import { Camera, Square } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

export default function ARSurgeryGuidance() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [active, setActive] = useState(false)
  const [error, setError] = useState('')
  const animationRef = useRef(null)

  const handleStart = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      videoRef.current.play()
      setActive(true)
    } catch (err) {
      setError('Could not access the camera. Check browser permissions.')
    }
  }

  const handleStop = () => {
    const stream = videoRef.current?.srcObject
    stream?.getTracks().forEach((t) => t.stop())
    setActive(false)
    cancelAnimationFrame(animationRef.current)
  }

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext('2d')

    const draw = () => {
      if (!video.videoWidth) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Simulated overlay: a fixed "guidance" crosshair + label box.
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      ctx.strokeStyle = '#34e1c8'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(cx - 40, cy)
      ctx.lineTo(cx + 40, cy)
      ctx.moveTo(cx, cy - 40)
      ctx.lineTo(cx, cy + 40)
      ctx.stroke()

      ctx.strokeStyle = '#8e7cf2'
      ctx.strokeRect(cx - 90, cy - 70, 180, 140)
      ctx.fillStyle = '#8e7cf2'
      ctx.font = '14px monospace'
      ctx.fillText('Simulated target zone', cx - 88, cy - 78)

      animationRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animationRef.current)
  }, [active])

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">MEDICAL IMAGING &amp; VISUALIZATION</div>
        <h1 className="page-title">AR Surgery Guidance</h1>
        <p className="page-description">Real webcam feed with a simulated overlay annotation.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Uses your real webcam feed (via <code>getUserMedia</code>) — but the overlay crosshair and
        "target zone" are a fixed, simulated graphic, not real depth-tracking, instrument
        recognition, or surgical AR hardware integration.
      </SimulatedBanner>

      {error && <div className="simulated-banner" style={{ borderColor: 'var(--signal-red)' }}>{error}</div>}

      <div className="card" style={{ position: 'relative', padding: 0, overflow: 'hidden', minHeight: 360 }}>
        <video ref={videoRef} style={{ width: '100%', display: active ? 'block' : 'none' }} muted playsInline />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', display: active ? 'block' : 'none' }} />
        {!active && (
          <div className="empty-state" style={{ padding: 60 }}>Camera is off. Press "Start camera" below.</div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        {!active ? (
          <button className="btn btn-primary" onClick={handleStart}><Camera size={14} /> Start camera</button>
        ) : (
          <button className="btn btn-danger" onClick={handleStop}><Square size={14} /> Stop camera</button>
        )}
      </div>
    </div>
  )
}
