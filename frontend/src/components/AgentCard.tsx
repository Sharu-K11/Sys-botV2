import type { Agent } from '../types'
import AgentCharacter from './AgentCharacter'

interface AgentCardProps {
  agent: Agent
  index: number
  onSelect: (agent: Agent) => void
}

function AgentCard({ agent, index, onSelect }: AgentCardProps) {
  return (
    <button
      type="button"
      className="agent-card"
      onClick={() => onSelect(agent)}
      aria-label={`Select ${agent.name}`}
    >
      <div className="agent-card__topline">
        <span className="agent-card__index">0{index + 1}</span>
        <span className="agent-card__arrow" aria-hidden="true">&#8599;</span>
      </div>
      <AgentCharacter agent={agent} size="large" />
      <div>
        <p className="agent-card__technique">{agent.technique}</p>
        <h3 className="agent-card__title">{agent.name}</h3>
      </div>
      <p className="agent-card__description">{agent.description}</p>
      <p className="agent-card__recommended">
        <strong>Best for</strong> {agent.recommendedUse.replace('Use this for ', '')}
      </p>
    </button>
  )
}

export default AgentCard
