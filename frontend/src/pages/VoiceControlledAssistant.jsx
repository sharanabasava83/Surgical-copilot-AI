import { useState, useRef } from 'react'
import { Mic, Square } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const COMMANDS = [
  { phrase: 'open patients', action: '/module/patient-management', label: 'Open Patient Management' },
  { phrase: 'open scheduling', action: '/module/surgery-scheduling', label: 'Open Surgery Scheduling' },
  { phrase: 'open checklist', action: '/module/checklist-automation', label: 'Open Checklist Automation' },
  { phrase: 'open monitoring', action: '/module/remote-monitoring', label: 'Open Remote Monitoring' },
  { phrase: 'open dashboard', action: '/', label: 'Open Dashboard' },
]

export default function VoiceControlledAssistant() {
  const [heard, setHeard] = useState('')
  const [matchedCommand, setMatchedCommand] = useState(null)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const navigate = useNavigate()

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  const handleStart = () => {
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase()
      setHeard(text)
      const match = COMMANDS.find((c) => text.includes(c.phrase))
      setMatchedCommand(match || null)
      if (match) {
        setTimeout(() => navigate(match.action), 900)
      }
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  const handleStop = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">CORE SURGICAL INTELLIGENCE</div>
        <h1 className="page-title">Voice-Controlled Surgical Assistant</h1>
        <p className="page-description">Speak a command to navigate the app hands-free.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Uses your browser's real speech recognition to match against a small fixed command list
        below (not a real OR voice-control system with sterile-field hardware integration).
      </SimulatedBanner>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0, fontSize: 14 }}>Try saying…</h3>
        <div className="chip-row">
          {COMMANDS.map((c) => <span className="chip" key={c.phrase}>"{c.phrase}"</span>)}
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: 30, marginBottom: 20 }}>
        {!listening ? (
          <button className="btn btn-primary" onClick={handleStart}><Mic size={16} /> Start listening</button>
        ) : (
          <button className="btn btn-danger" onClick={handleStop}><Square size={16} /> Stop</button>
        )}
      </div>

      {heard && (
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--ink-400)', marginBottom: 4 }}>HEARD</div>
          <p style={{ fontSize: 14, marginBottom: 10 }}>"{heard}"</p>
          {matchedCommand ? (
            <p style={{ color: 'var(--signal-cyan)', fontSize: 13 }}>Matched: {matchedCommand.label} — navigating…</p>
          ) : (
            <p style={{ color: 'var(--signal-amber)', fontSize: 13 }}>No matching command recognized.</p>
          )}
        </div>
      )}
    </div>
  )
}
