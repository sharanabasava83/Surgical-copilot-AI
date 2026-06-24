import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { sendChatMessage, translateText } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const SESSION_ID = 'multilingual-session-' + Math.random().toString(36).slice(2, 8)
const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'es', label: 'Spanish' },
  { code: 'hi', label: 'Hindi' }, { code: 'fr', label: 'French' },
  { code: 'ar', label: 'Arabic' },
]

export default function MultilingualChatbot() {
  const [language, setLanguage] = useState('es')
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! Ask me a general medical question — I'll answer in English and show a translation alongside.", translated: '' },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages((m) => [...m, { role: 'user', text: userMsg, translated: '' }])
    setInput('')
    setSending(true)
    try {
      const chatRes = await sendChatMessage({ sessionId: SESSION_ID, userName: 'Demo User', message: userMsg, language: 'en' })
      const botText = chatRes.data.response
      let translated = ''
      if (language !== 'en') {
        const transRes = await translateText({ text: botText, sourceLanguage: 'en', targetLanguage: language, context: 'CHAT' })
        translated = transRes.data.translatedText
      }
      setMessages((m) => [...m, { role: 'bot', text: botText, translated }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">COMMUNICATION &amp; LANGUAGE</div>
        <h1 className="page-title">Multilingual AI Medical Chatbot</h1>
        <p className="page-description">The medical chatbot with a live translation overlay in the patient's language.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Combines the real chatbot (rule-based or real LLM if configured) with the real
        translation engine (mock by default, real with a provider key) — general medical
        information only, not diagnosis.
      </SimulatedBanner>

      <div className="form-field" style={{ marginBottom: 16, maxWidth: 260 }}>
        <label>Patient language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 460 }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, padding: '6px 4px' }}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div>{m.text}</div>
              {m.translated && (
                <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: 12, color: 'var(--signal-cyan)' }}>
                  {m.translated}
                </div>
              )}
            </div>
          ))}
          {sending && <div className="chat-bubble bot"><span className="spinner" /></div>}
          <div ref={scrollRef} />
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            style={{ flex: 1, background: 'var(--ink-800)', border: '1px solid var(--ink-600)', borderRadius: 8, padding: '10px 12px', color: 'var(--ink-50)' }}
            placeholder="Ask a general medical question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={sending}><Send size={14} /></button>
        </form>
      </div>
    </div>
  )
}
