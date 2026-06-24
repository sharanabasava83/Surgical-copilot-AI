import { useState, useRef } from 'react'
import { Mic, Square, Volume2 } from 'lucide-react'
import { translateText } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const LANGUAGES = [
  { code: 'en', label: 'English', speech: 'en-US' },
  { code: 'es', label: 'Spanish', speech: 'es-ES' },
  { code: 'hi', label: 'Hindi', speech: 'hi-IN' },
  { code: 'fr', label: 'French', speech: 'fr-FR' },
]

export default function VoiceToVoiceTranslation() {
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('es')
  const [heard, setHeard] = useState('')
  const [translated, setTranslated] = useState('')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  const handleStart = () => {
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = LANGUAGES.find((l) => l.code === sourceLang)?.speech || 'en-US'
    recognition.interimResults = false

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript
      setHeard(text)
      const res = await translateText({ text, sourceLanguage: sourceLang, targetLanguage: targetLang, context: 'GENERAL' })
      setTranslated(res.data.translatedText)
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

  const handlePlayback = () => {
    if (!translated) return
    const utterance = new SpeechSynthesisUtterance(translated.replace(/^\[[A-Z]+\]\s*/, ''))
    utterance.lang = LANGUAGES.find((l) => l.code === targetLang)?.speech || 'en-US'
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">COMMUNICATION &amp; LANGUAGE</div>
        <h1 className="page-title">Voice-to-Voice Translation</h1>
        <p className="page-description">Speak in one language, hear it translated and read aloud in another.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Chains three real browser/backend pieces: native speech recognition → the translation
        engine (mock by default, real with a provider key) → native speech synthesis. The
        pipeline is genuinely real; translation quality depends on whether a real provider key
        is configured.
      </SimulatedBanner>

      <div className="form-row" style={{ marginBottom: 16 }}>
        <div className="form-field">
          <label>I speak</label>
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label>Translate to</label>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: 30, marginBottom: 20 }}>
        {!listening ? (
          <button className="btn btn-primary" onClick={handleStart}><Mic size={16} /> Start speaking</button>
        ) : (
          <button className="btn btn-danger" onClick={handleStop}><Square size={16} /> Stop</button>
        )}
      </div>

      {heard && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-400)', marginBottom: 4 }}>YOU SAID</div>
          <p style={{ fontSize: 14 }}>{heard}</p>
        </div>
      )}
      {translated && (
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--ink-400)', marginBottom: 4 }}>TRANSLATED</div>
          <p style={{ fontSize: 14, color: 'var(--signal-cyan)', marginBottom: 12 }}>{translated}</p>
          <button className="btn btn-secondary" onClick={handlePlayback}><Volume2 size={14} /> Play translation</button>
        </div>
      )}
    </div>
  )
}
