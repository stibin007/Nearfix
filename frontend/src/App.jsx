import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5001/api'

function App() {
  const [services, setServices] = useState([])
  const [areas, setAreas] = useState([])
  const [providers, setProviders] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load the dropdown options once, when the page opens
  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, areasRes] = await Promise.all([
          fetch(`${API_URL}/services`),
          fetch(`${API_URL}/areas`),
        ])
        setServices(await servicesRes.json())
        setAreas(await areasRes.json())
      } catch (err) {
        setError('Could not load data. Is the backend running?')
      }
    }
    loadData()
  }, [])

  // Load providers on page open, and again whenever a dropdown changes
  useEffect(() => {
    async function loadProviders() {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams()
        if (selectedService) params.append('service', selectedService)
        if (selectedArea) params.append('area', selectedArea)

        const res = await fetch(`${API_URL}/providers?${params.toString()}`)
        setProviders(await res.json())
      } catch (err) {
        setError('Could not load providers. Is the backend running?')
      }
      setLoading(false)
    }
    loadProviders()
  }, [selectedService, selectedArea])

  return (
    <div className="app">
      <header className="header">
        <h1>NearFix</h1>
        <p>Find electricians, plumbers and AC technicians in Kerala.</p>
      </header>

      <div className="filters">
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          <option value="">All areas</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.district})
            </option>
          ))}
        </select>
      </div>

      {error && <p className="message error">{error}</p>}
      {loading && <p className="message">Loading...</p>}
      {!loading && providers.length === 0 && !error && (
        <p className="message">No providers found.</p>
      )}

      <div className="grid">
        {providers.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.name}</h3>
            <p className="meta">
              {p.type} · {p.experience_years} years experience
            </p>
            <p className="location">
              {p.area}, {p.district}
            </p>
            <div className="tags">
              {p.services.map((s) => (
                <span className="tag" key={s.id}>
                  {s.name}
                </span>
              ))}
            </div>
            <p className="description">{p.description}</p>
            <a className="phone" href={`tel:${p.phone.replace(/\s/g, '')}`}>
              Call {p.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App