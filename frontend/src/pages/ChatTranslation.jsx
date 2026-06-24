import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { translateText } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'es', label: 'Spanish' },
  { code: 'hi', label: 'Hindi' }, { code: 'fr', label: 'French' },
  { code: 'ar', label: 'Arabic' },
]

export default function ChatTranslation() {
  const [myLang, setMyLang] = useState('en')
  const [theirLang, setTheirLang] = useState('es')
  const [input, setInput] = useState('')
  const [thread, setThread] = useState([])
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const text = input.trim()
    setInput('')
    setSending(true)
    try {
      const res = await translateText({ text, sourceLanguage: myLang, targetLanguage: theirLang, context: 'CHAT' })
      setThread((t) => [...t, { from: 'me', original: text, translated: res.data.translatedText }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">COMMUNICATION &amp; LANGUAGE</div>
        <h1 className="page-title">Real-Time Chat Translation</h1>
        <p className="page-description">Each message you send is translated live into the other party's language.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Runs through the same translation engine as the Multi-Language Translation module
        (mock mode by default; add a provider key for real translations).
      </SimulatedBanner>

      <div className="form-row" style={{ marginBottom: 16 }}>
        <div className="form-field">
          <label>I speak</label>
          <select value={myLang} onChange={(e) => setMyLang(e.target.value)}>
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label>They speak</label>
          <select value={theirLang} onChange={(e) => setTheirLang(e.target.value)}>
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 420 }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, padding: '6px 4px' }}>
          {thread.length === 0 && <div className="empty-state">Send a message to see it translated live.</div>}
          {thread.map((m, i) => (
            <div key={i} className="chat-bubble user" style={{ alignSelf: 'flex-end' }}>
              <div>{m.original}</div>
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: 12, color: 'var(--signal-cyan)' }}>
                {m.translated}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            style={{ flex: 1, background: 'var(--ink-800)', border: '1px solid var(--ink-600)', borderRadius: 8, padding: '10px 12px', color: 'var(--ink-50)' }}
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={sending}><Send size={14} /></button>
        </form>
      </div>
    </div>
  )
}
