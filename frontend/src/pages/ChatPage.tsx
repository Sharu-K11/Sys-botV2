import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import MessageBubble from '../components/MessageBubble'
import { studyAgents } from '../data/agents'
import Navbar from '../components/Navbar'
import { sendChatMessage } from '../services/api'
import type { Agent, ChatMessage, ChatModel } from '../types'

interface ChatLocationState {
  agent?: Agent
}

const chatModels: ChatModel[] = [
  'GPT-4.1',
  'GPT-4o',
  'Claude 3.7 Sonnet',
  'Gemini 2.5 Pro',
]

function createMessage(role: 'user' | 'assistant', content: string): ChatMessage {
  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  }
}

function ChatPage() {
  const location = useLocation()
  const state = (location.state as ChatLocationState | undefined) || {}
  const [currentAgent, setCurrentAgent] = useState<Agent | undefined>(
    state.agent || studyAgents[0],
  )

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [selectedModel, setSelectedModel] = useState<ChatModel>('GPT-4.1')
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  function handleAgentChange(agent: Agent) {
    setCurrentAgent(agent)
    setIsAgentMenuOpen(false)
  }

  async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedDraft = draft.trim()
    if (!trimmedDraft || !currentAgent) {
      return
    }

    const userMessage = createMessage('user', trimmedDraft)
    setMessages((prev) => [...prev, userMessage])
    setDraft('')
    setIsSending(true)
    setError('')

    try {
      const assistantReply = await sendChatMessage(
        currentAgent,
        trimmedDraft,
        selectedModel,
      )
      const assistantMessage = createMessage('assistant', assistantReply)
      setMessages((prev) => [...prev, assistantMessage])
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Could not send message')
    } finally {
      setIsSending(false)
    }
  }

  if (!currentAgent) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <h2 className="auth-card__title">No agent selected</h2>
          <p className="auth-card__subtitle">
            Please create at least one agent before starting a chat.
          </p>
        </section>
      </main>
    )
  }

  return (
    <div className="page-shell">
      <Navbar studentName="Alex Student" />
      <main className="chat-page">
        <div className="chat-page__header">
          <p className="chat-page__agent-title">Active Agent: {currentAgent.name}</p>

          <div className="chat-agent-switcher">
            <button
              type="button"
              className="chat-agent-switcher__button"
              aria-haspopup="menu"
              aria-expanded={isAgentMenuOpen}
              aria-controls="chat-agent-menu"
              aria-label="Switch chat agent"
              onClick={() => setIsAgentMenuOpen((prev) => !prev)}
            >
              <span className="chat-agent-switcher__dot" />
              <span className="chat-agent-switcher__dot" />
              <span className="chat-agent-switcher__dot" />
            </button>

            {isAgentMenuOpen ? (
              <div id="chat-agent-menu" className="chat-agent-switcher__menu" role="menu">
                <p className="chat-agent-switcher__label">Pick Agent</p>
                {studyAgents.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    role="menuitem"
                    className={`chat-agent-switcher__option ${
                      currentAgent.id === agent.id
                        ? 'chat-agent-switcher__option--active'
                        : ''
                    }`}
                    onClick={() => handleAgentChange(agent)}
                  >
                    {agent.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <section className="chat-messages" aria-live="polite">
          {messages.length === 0 ? (
            <p className="feedback">
              Start by asking a question about your course textbook.
            </p>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {isSending ? (
            <p className="feedback">Assistant is thinking...</p>
          ) : null}
          {error ? <p className="feedback feedback--error">{error}</p> : null}
        </section>

        <form className="chat-form" onSubmit={handleSendMessage}>
          <div className="chat-form__row">
            <label htmlFor="chat-model" className="chat-form__label">
              Model
            </label>
            <select
              id="chat-model"
              className="chat-form__select"
              value={selectedModel}
              onChange={(event) => setSelectedModel(event.target.value as ChatModel)}
            >
              {chatModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="chat-input" className="chat-form__label">
            Message
          </label>
          <textarea
            id="chat-input"
            className="chat-form__textarea"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={4}
            placeholder="Ask about a chapter, theorem, or concept..."
          />
          <button
            type="submit"
            className="primary-button"
            disabled={isSending || draft.trim().length === 0}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default ChatPage
