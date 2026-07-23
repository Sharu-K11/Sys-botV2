import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AgentCard from '../components/AgentCard'
import { studyAgents } from '../data/agents'
import Navbar from '../components/Navbar'
import type { Agent } from '../types'

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [agentList, setAgentList] = useState<Agent[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setAgentList(studyAgents)
      } catch {
        setError('Could not load agents right now.')
      } finally {
        setIsLoading(false)
      }
    }, 250)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  function handleSelectAgent(agent: Agent) {
    navigate('/chat', {
      state: { agent },
    })
  }

  return (
    <div className="page-shell">
      <Navbar studentName="Alex Student" />
      <main className="dashboard-page">
        <header className="dashboard-hero">
          <div>
            <p className="dashboard-hero__eyebrow">Wednesday, July 22</p>
            <h1>Good afternoon, Alex.</h1>
            <p>What would you like to understand today?</p>
          </div>
          <button type="button" className="dashboard-hero__action" onClick={() => navigate('/chat')}>
            <span aria-hidden="true">+</span>
            New study session
          </button>
        </header>

        <section className="study-overview" aria-label="Study overview">
          <div>
            <span className="study-overview__label">Study sessions</span>
            <strong>12</strong>
            <small>This semester</small>
          </div>
          <div>
            <span className="study-overview__label">Topics explored</span>
            <strong>28</strong>
            <small>Across 4 courses</small>
          </div>
          <div>
            <span className="study-overview__label">Learning streak</span>
            <strong>6 days</strong>
            <small>Personal best: 9</small>
          </div>
          <div className="study-overview__progress">
            <span className="study-overview__label">Weekly goal</span>
            <strong>4 / 5</strong>
            <div><span /></div>
          </div>
        </section>

        <div className="dashboard-section-heading">
          <div>
            <p>AI tutors</p>
            <h2>Choose how you want to learn</h2>
          </div>
          <span>{studyAgents.length} available</span>
        </div>

        {isLoading ? <p className="feedback">Loading available agents...</p> : null}
        {error ? <p className="feedback feedback--error">{error}</p> : null}

        {!isLoading && !error ? (
          <section className="agent-grid">
            {agentList.map((agent, index) => (
              <AgentCard key={agent.id} agent={agent} index={index} onSelect={handleSelectAgent} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  )
}

export default DashboardPage
