import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { sendChatMessage } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const SESSION_ID = 'demo-session-' + Math.random().toString(36).slice(2, 8)

export default function MedicalChatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi, I'm a general medical information assistant. I can't diagnose or prescribe — ask me a general question to try it out." },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages((m) => [...m, { role: 'user', text: userMsg }])
    setInput('')
    setSending(true)
    try {
      const res = await sendChatMessage({ sessionId: SESSION_ID, userName: 'Demo User', message: userMsg, language: 'en' })
      setMessages((m) => [...m, { role: 'bot', text: res.data.response }])
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: 'Could not reach the backend. Make sure the Spring Boot API is running.' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">AI &amp; KNOWLEDGE SYSTEMS</div>
        <h1 className="page-title">AI Medical Chatbot</h1>
        <p className="page-description">General-purpose medical Q&amp;A assistant for informational use only.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Runs on simple rule-based matching by default — no diagnosis, no prescriptions. Add a real
        Claude or OpenAI API key in <code>application.properties</code> to enable genuine LLM-powered
        responses (it automatically falls back to rule-based if the call fails). Either way,
        this is general information only, not a substitute for professional medical advice.
      </SimulatedBanner>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 480 }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, padding: '6px 4px' }}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.text}
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
          <button className="btn btn-primary" type="submit" disabled={sending}>
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  )
}
