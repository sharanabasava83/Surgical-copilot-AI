import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { translateText } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' }, { code: 'hi', label: 'Hindi' },
  { code: 'kn', label: 'Kannada' }, { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese' }, { code: 'ar', label: 'Arabic' },
]

export default function TranslationEngine() {
  const [text, setText] = useState('')
  const [source, setSource] = useState('en')
  const [target, setTarget] = useState('es')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTranslate = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await translateText({ text, sourceLanguage: source, targetLanguage: target, context: 'GENERAL' })
      setResult(res.data.translatedText)
    } catch {
      setResult('Could not reach the backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">COMMUNICATION &amp; LANGUAGE</div>
        <h1 className="page-title">Multi-Language Translation Engine</h1>
        <p className="page-description">Translate text across supported languages.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        Runs in mock mode by default (prefixes text with the target language code) so the flow
        works with zero setup. Add a translation provider API key in
        <code> application.properties</code> for real translations.
      </SimulatedBanner>

      <div className="card">
        <form onSubmit={handleTranslate}>
          <div className="form-row">
            <div className="form-field">
              <label>From</label>
              <select value={source} onChange={(e) => setSource(e.target.value)}>
                {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>To</label>
              <select value={target} onChange={(e) => setTarget(e.target.value)}>
                {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
          </div>
          <div className="form-field" style={{ marginBottom: 14 }}>
            <label>Text</label>
            <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Please take this medication twice a day after meals." />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Translating…' : 'Translate'} <ArrowRight size={14} />
          </button>
        </form>

        {result && (
          <div style={{ marginTop: 18, padding: 14, background: 'var(--ink-800)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-400)', marginBottom: 6 }}>RESULT</div>
            <div style={{ fontSize: 14 }}>{result}</div>
          </div>
        )}
      </div>
    </div>
  )
}
