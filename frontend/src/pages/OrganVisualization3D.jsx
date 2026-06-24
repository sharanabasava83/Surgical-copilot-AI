import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import StatusBadge from '../components/StatusBadge'
import SimulatedBanner from '../components/SimulatedBanner'

const ORGANS = [
  { key: 'heart', label: 'Heart', color: 0xe8556a, geometry: 'sphere-cluster' },
  { key: 'lung', label: 'Lungs', color: 0xf0a93c, geometry: 'lobed' },
  { key: 'kidney', label: 'Kidney', color: 0x8e7cf2, geometry: 'capsule-like' },
  { key: 'brain', label: 'Brain', color: 0x34e1c8, geometry: 'sphere-textured' },
]

export default function OrganVisualization3D() {
  const mountRef = useRef(null)
  const [organ, setOrgan] = useState('heart')
  const sceneRef = useRef({})

  useEffect(() => {
    const mount = mountRef.current
    const width = mount.clientWidth
    const height = 420

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0e131b)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    mount.innerHTML = ''
    mount.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    const point = new THREE.PointLight(0xffffff, 1.2)
    point.position.set(5, 5, 5)
    scene.add(ambient, point)

    let group = new THREE.Group()
    scene.add(group)

    sceneRef.current = { scene, camera, renderer, group, mount }

    let frameId
    const animate = () => {
      group.rotation.y += 0.006
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      const w = mount.clientWidth
      camera.aspect = w / height
      camera.updateProjectionMatrix()
      renderer.setSize(w, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    const { group } = sceneRef.current
    if (!group) return
    while (group.children.length) group.remove(group.children[0])

    const config = ORGANS.find((o) => o.key === organ)
    const material = new THREE.MeshStandardMaterial({ color: config.color, roughness: 0.4, metalness: 0.1 })

    if (organ === 'heart') {
      const main = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 32), material)
      const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 24), material)
      lobe1.position.set(0.9, 0.7, 0)
      const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 24), material)
      lobe2.position.set(-0.8, 0.6, 0.2)
      group.add(main, lobe1, lobe2)
    } else if (organ === 'lung') {
      const left = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 24), material)
      left.position.set(-1, 0, 0)
      left.scale.set(0.8, 1.4, 0.7)
      const right = new THREE.Mesh(new THREE.SphereGeometry(1.0, 24, 24), material)
      right.position.set(1, 0, 0)
      right.scale.set(0.8, 1.5, 0.7)
      group.add(left, right)
    } else if (organ === 'kidney') {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.8, 16), material)
      body.rotation.z = Math.PI / 2
      group.add(body)
    } else {
      const main = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 32), material)
      const wire = new THREE.Mesh(
        new THREE.SphereGeometry(1.42, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.15 })
      )
      group.add(main, wire)
    }
  }, [organ])

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-eyebrow">MEDICAL IMAGING &amp; VISUALIZATION</div>
        <h1 className="page-title">3D Human Organ Visualization</h1>
        <p className="page-description">Real interactive 3D viewer — rotates automatically, switch organs below.</p>
        <div style={{ marginTop: 10 }}><StatusBadge status="LIVE_DEMO" /></div>
      </div>

      <SimulatedBanner>
        This is a genuinely real, interactive 3D scene (Three.js), but the organ shapes are
        simplified geometric approximations for illustration — not anatomically precise,
        patient-specific, or derived from real imaging data.
      </SimulatedBanner>

      <div className="chip-row" style={{ marginBottom: 16 }}>
        {ORGANS.map((o) => (
          <span key={o.key} className="chip" style={{ cursor: 'pointer', borderColor: organ === o.key ? 'var(--signal-cyan)' : undefined, color: organ === o.key ? 'var(--signal-cyan)' : undefined }}
            onClick={() => setOrgan(o.key)}>
            {o.label}
          </span>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div ref={mountRef} style={{ width: '100%', height: 420 }} />
      </div>
    </div>
  )
}
