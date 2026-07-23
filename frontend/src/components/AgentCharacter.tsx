import type { Agent } from '../types'

interface AgentCharacterProps {
  agent: Agent
  size?: 'small' | 'medium' | 'large'
}

function AgentCharacter({ agent, size = 'medium' }: AgentCharacterProps) {
  return (
    <div
      className={`agent-character agent-character--${agent.id} agent-character--${size}`}
      role={size === 'small' ? undefined : 'img'}
      aria-label={size === 'small' ? undefined : `${agent.nickname}: ${agent.personality}`}
      aria-hidden={size === 'small' ? true : undefined}
    >
      <span className="agent-character__float">
        <span className="agent-character__halo" />
        <span className="agent-character__prop agent-character__prop--one" />
        <span className="agent-character__prop agent-character__prop--two" />
        <span className="agent-character__hair" />
        <span className="agent-character__head">
          <i className="agent-character__eye agent-character__eye--left" />
          <i className="agent-character__eye agent-character__eye--right" />
          <i className="agent-character__mouth" />
          <i className="agent-character__glasses" />
        </span>
        <span className="agent-character__body" />
        <span className="agent-character__mark" />
      </span>
      {size !== 'small' ? <strong className="agent-character__nickname">{agent.nickname}</strong> : null}
      {size !== 'small' ? (
        <span className="agent-character__tooltip" role="tooltip">
          <strong>{agent.nickname}</strong>
          <small>{agent.personality}</small>
          <span>{agent.traits.join(' · ')}</span>
        </span>
      ) : null}
    </div>
  )
}

export default AgentCharacter