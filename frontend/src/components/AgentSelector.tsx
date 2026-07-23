import { useState } from 'react'
import { studyAgents } from '../data/agents'
import type { Agent } from '../types'
import AgentCharacter from './AgentCharacter'

interface AgentSelectorProps {
  selectedAgent: Agent
  onSelect: (agent: Agent) => void
}

function AgentSelector({ selectedAgent, onSelect }: AgentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  function selectAgent(agent: Agent) {
    onSelect(agent)
    setIsOpen(false)
  }

  return (
    <div className="model-selector">
      <button
        type="button"
        className="model-selector__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{selectedAgent.nickname}</span>
        <i aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="model-selector__menu" role="listbox" aria-label="Choose a tutor">
          <div className="model-selector__heading">
            <strong>Choose your tutor</strong>
            <span>Each one has a different way of teaching</span>
          </div>
          {studyAgents.map((agent) => (
            <button
              type="button"
              role="option"
              aria-selected={selectedAgent.id === agent.id}
              className={selectedAgent.id === agent.id ? 'model-selector__option--active' : ''}
              key={agent.id}
              onClick={() => selectAgent(agent)}
            >
              <AgentCharacter agent={agent} size="small" />
              <span>
                <strong>{agent.nickname}</strong>
                <small>{agent.name}</small>
              </span>
              {selectedAgent.id === agent.id ? <b aria-hidden="true">&#10003;</b> : null}
            </button>
          ))}
          <p>{selectedAgent.personality}</p>
        </div>
      ) : null}
    </div>
  )
}

export default AgentSelector