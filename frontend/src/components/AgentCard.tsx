import type { Agent } from '../types'

interface AgentCardProps {
  agent: Agent
  onSelect: (agent: Agent) => void
}

function AgentCard({ agent, onSelect }: AgentCardProps) {
  return (
    <button
      type="button"
      className="agent-card"
      onClick={() => onSelect(agent)}
      aria-label={`Select ${agent.name}`}
    >
      <h3 className="agent-card__title">{agent.name}</h3>
      <p className="agent-card__technique">{agent.technique}</p>
      <p className="agent-card__description">{agent.description}</p>
      <p className="agent-card__recommended">
        <strong>Recommended use:</strong> {agent.recommendedUse}
      </p>
    </button>
  )
}

export default AgentCard
