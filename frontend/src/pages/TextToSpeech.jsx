import { useState, useEffect } from 'react'
import { Volume2, Square } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

export default function TextToSpeech() {
  const [text, setText] = useState('Please take this medication twice a day after meals, and contact us if you experience any side effects.')
  const [voices, setVoices] = useState([])
  const [voiceIndex, setVoiceIndex] = useState(0)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices())
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const handleSpeak = () => {
    if (!text.trim()) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    if (voices[voiceIndex]) utterance.voice = voices[voiceIndex]
    utterance.onend = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">COMMUNICATION &amp; LANGUAGE</div>
        <h1 className="page-title">Text-to-Speech Conversion</h1>
        <p className="page-description">Real narration using your browser's built-in speech synthesis.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        This is genuinely real audio synthesis via the Web Speech Synthesis API — no backend
        call. Voice quality and available voices depend on your browser/OS.
      </SimulatedBanner>

      <div className="card">
        <div className="form-field" style={{ marginBottom: 14 }}>
          <label>Text to speak</label>
          <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        {voices.length > 0 && (
          <div className="form-field" style={{ marginBottom: 14, maxWidth: 320 }}>
            <label>Voice</label>
            <select value={voiceIndex} onChange={(e) => setVoiceIndex(Number(e.target.value))}>
              {voices.map((v, i) => <option key={i} value={i}>{v.name} ({v.lang})</option>)}
            </select>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={handleSpeak} disabled={speaking}><Volume2 size={14} /> Speak</button>
          <button className="btn btn-secondary" onClick={handleStop} disabled={!speaking}><Square size={14} /> Stop</button>
        </div>
      </div>
    </div>
  )
}
