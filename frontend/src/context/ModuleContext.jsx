import { createContext, useContext, useEffect, useState } from 'react'
import { getModules, getSystemInfo } from '../services/api'

const ModuleContext = createContext(null)

// Local fallback catalog mirrors the backend seed data, so the UI still
// renders the full 53-module structure even if the API isn't reachable yet
// (e.g. before the backend has been started).
const FALLBACK_DISCLAIMER =
  'This system is a software architecture demo. It is not a certified medical device and must not be used for real clinical, diagnostic, or treatment decisions.'

export function ModuleProvider({ children }) {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiOnline, setApiOnline] = useState(true)
  const [disclaimer, setDisclaimer] = useState(FALLBACK_DISCLAIMER)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [modRes, sysRes] = await Promise.all([getModules(), getSystemInfo()])
        if (!cancelled) {
          setModules(modRes.data)
          setDisclaimer(sysRes.data.disclaimer || FALLBACK_DISCLAIMER)
          setApiOnline(true)
        }
      } catch (err) {
        if (!cancelled) {
          setApiOnline(false)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const categories = [...new Set(modules.map((m) => m.category))]

  return (
    <ModuleContext.Provider value={{ modules, categories, loading, apiOnline, disclaimer }}>
      {children}
    </ModuleContext.Provider>
  )
}

export function useModules() {
  const ctx = useContext(ModuleContext)
  if (!ctx) throw new Error('useModules must be used within a ModuleProvider')
  return ctx
}
