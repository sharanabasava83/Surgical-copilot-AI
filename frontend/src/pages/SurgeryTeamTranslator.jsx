import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { translateText } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const TEAM = [
  { name: 'Dr. Priya Nair', role: 'Lead Surgeon', lang: 'en' },
  { name: 'Dr. Lucia Fernández', role: 'Anesthesiologist', lang: 'es' },
  { name: 'Nurse Aiko Tanaka', role: 'Scrub Nurse', lang: 'ja' },
]

export default function SurgeryTeamTranslator() {
  const [speaker, setSpeaker] = useState(TEAM[0].name)
  const [input, setInput] = useState('')
  const [thread, setThread] = useState([])
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [thread])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const speakerInfo = TEAM.find((t) => t.name === speaker)
    const text = input.trim()
    setInput('')
    setSending(true)
    try {
      const translations = await Promise.all(
        TEAM.filter((t) => t.name !== speaker).map(async (t) => {
          const res = await translateText({ text, sourceLanguage: speakerInfo.lang, targetLanguage: t.lang, context: 'SURGERY_TEAM' })
          return { name: t.name, text: res.data.translatedText }
        })
      )
      setThread((th) => [...th, { speaker: speakerInfo, original: text, translations }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">COMMUNICATION &amp; LANGUAGE</div>
        <h1 className="page-title">Real-Time Surgery Team Translator</h1>
        <p className="page-description">Simulated multi-party OR team chat — each message is translated for every other team member.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        The team roster and conversation are simulated for demo purposes, but each message
        genuinely passes through the real translation engine for every other team member's
        language.
      </SimulatedBanner>

      <div className="form-field" style={{ marginBottom: 16, maxWidth: 320 }}>
        <label>Speaking as</label>
        <select value={speaker} onChange={(e) => setSpeaker(e.target.value)}>
          {TEAM.map((t) => <option key={t.name} value={t.name}>{t.name} ({t.role})</option>)}
        </select>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 460 }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '6px 4px' }}>
          {thread.length === 0 && <div className="empty-state">Send a message to see it translated for the whole team.</div>}
          {thread.map((m, i) => (
            <div key={i} className="card" style={{ padding: 12 }}>
              <strong style={{ fontSize: 13 }}>{m.speaker.name}</strong>
              <span className="chip" style={{ marginLeft: 8 }}>{m.speaker.role}</span>
              <p style={{ margin: '6px 0', fontSize: 13.5 }}>{m.original}</p>
              {m.translations.map((t) => (
                <div key={t.name} style={{ fontSize: 12, color: 'var(--signal-cyan)' }}>→ {t.name}: {t.text}</div>
              ))}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            style={{ flex: 1, background: 'var(--ink-800)', border: '1px solid var(--ink-600)', borderRadius: 8, padding: '10px 12px', color: 'var(--ink-50)' }}
            placeholder="Type a message to the team…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={sending}><Send size={14} /></button>
        </form>
      </div>
    </div>
  )
}
