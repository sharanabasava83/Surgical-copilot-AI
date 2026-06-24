import { useEffect, useState } from 'react'
import { Upload } from 'lucide-react'
import { getPatients, uploadReport } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

export default function ImageAnalysis() {
  const [patients, setPatients] = useState([])
  const [patientId, setPatientId] = useState('')
  const [reportType, setReportType] = useState('XRAY')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getPatients().then((res) => setPatients(res.data)).catch(() => {})
  }, [])

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    setFile(f)
    setResult(null)
    if (f && f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f))
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patientId || !file) {
      setError('Select a patient and choose a file.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('patientId', patientId)
      formData.append('reportType', reportType)
      formData.append('file', file)
      formData.append('findingsSummary', 'Preliminary radiologist notes pending review.')
      const res = await uploadReport(formData)
      setResult(res.data)
    } catch (err) {
      setError('Upload failed. Check the backend is running and patient is selected.')
    } finally {
      setLoading(false)
    }
  }

  let boxes = []
  try {
    boxes = result?.aiFindingsJson ? JSON.parse(result.aiFindingsJson) : []
  } catch {
    boxes = []
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">MEDICAL IMAGING &amp; VISUALIZATION</div>
        <h1 className="page-title">Medical Image Analysis (MRI/CT/X-Ray)</h1>
        <p className="page-description">Upload a scan and view a simulated AI overlay annotation.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        The upload, storage, and viewer pipeline here are fully functional. The
        <strong> annotation overlay itself is synthetic</strong> — randomly generated boxes, not
        output from a real trained vision model. No real diagnostic inference happens here.
      </SimulatedBanner>

      <div className="card" style={{ marginBottom: 20 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Patient *</label>
              <select value={patientId} onChange={(e) => setPatientId(e.target.value)} required>
                <option value="">Select patient</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Scan type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="XRAY">X-Ray</option>
                <option value="MRI">MRI</option>
                <option value="CT">CT</option>
              </select>
            </div>
          </div>
          <div className="form-field" style={{ marginBottom: 14 }}>
            <label>Scan image file</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {error && <p style={{ color: 'var(--signal-red)', fontSize: 13 }}>{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            <Upload size={14} /> {loading ? 'Analyzing…' : 'Upload & analyze (simulated)'}
          </button>
        </form>
      </div>

      {preview && (
        <div className="card">
          <h3 style={{ marginTop: 0, fontSize: 14 }}>Scan viewer</h3>
          <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
            <img src={preview} alt="Uploaded scan" style={{ maxWidth: '100%', maxHeight: 480, borderRadius: 8, display: 'block' }} />
            {boxes.map((b, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: `${b.width}%`,
                  height: `${b.height}%`,
                  border: '2px solid var(--signal-violet)',
                  borderRadius: 4,
                  boxShadow: '0 0 0 1px rgba(142,124,242,0.3)',
                }}
              >
                <span style={{
                  position: 'absolute', top: -22, left: 0, background: 'var(--signal-violet)',
                  color: 'var(--ink-950)', fontSize: 10, padding: '2px 6px', borderRadius: 4,
                  fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
                }}>
                  {b.label} · {b.confidence}% (simulated)
                </span>
              </div>
            ))}
          </div>
          {boxes.length > 0 && (
            <p style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 10 }}>
              {boxes.length} simulated region(s) flagged. These are randomly generated for demo purposes only.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
