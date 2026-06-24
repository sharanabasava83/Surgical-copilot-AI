import { useState, useRef } from 'react'
import { Mic, Square } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

export default function SpeechToText() {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef(null)

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  const handleStart = () => {
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let finalText = ''
      for (let i = 0; i < event.results.length; i++) {
        finalText += event.results[i][0].transcript
      }
      setTranscript(finalText)
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
        <div className="page-eyebrow">COMMUNICATION &amp; LANGUAGE</div>
        <h1 className="page-title">Speech-to-Text Conversion</h1>
        <p className="page-description">Real-time transcription using your browser's built-in speech recognition.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        This is genuinely real transcription — it uses your browser's native Web Speech API
        (no backend call, no simulated text). Works best in Chrome/Edge; requires microphone
        permission. Not a medical-grade transcription service.
      </SimulatedBanner>

      {!supported && (
        <div className="simulated-banner" style={{ borderColor: 'var(--signal-red)' }}>
          Your browser doesn't support the Web Speech API. Try Chrome or Edge.
        </div>
      )}

      <div className="card" style={{ textAlign: 'center', padding: 30, marginBottom: 20 }}>
        {!listening ? (
          <button className="btn btn-primary" onClick={handleStart}><Mic size={16} /> Start listening</button>
        ) : (
          <button className="btn btn-danger" onClick={handleStop}><Square size={16} /> Stop</button>
        )}
        {listening && <p style={{ marginTop: 14, color: 'var(--signal-cyan)', fontSize: 12 }}>Listening… speak now</p>}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, fontSize: 14 }}>Transcript</h3>
        <p style={{ fontSize: 14, lineHeight: 1.6, minHeight: 60, color: transcript ? 'var(--ink-50)' : 'var(--ink-400)' }}>
          {transcript || 'Your speech will appear here…'}
        </p>
      </div>
    </div>
  )
}
