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
        <p className="dashboard-page__intro">
          Select an agent tuned to how you want to study your course textbook.
        </p>

        {isLoading ? <p className="feedback">Loading available agents...</p> : null}
        {error ? <p className="feedback feedback--error">{error}</p> : null}

        {!isLoading && !error ? (
          <section className="agent-grid">
            {agentList.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onSelect={handleSelectAgent} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  )
}

export default DashboardPage
