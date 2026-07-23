import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AgentCharacter from '../components/AgentCharacter'
import AgentSelector from '../components/AgentSelector'
import MessageBubble from '../components/MessageBubble'
import MessageInput from '../components/MessageInput'
import Sidebar from '../components/Sidebar'
import ThemeToggle from '../components/ThemeToggle'
import { studyAgents } from '../data/agents'
import {
  createChat,
  createMessage,
  deleteChat,
  getChats,
  getMessages,
  updateChat,
} from '../services/api'
import type { Agent, Chat, Message } from '../types'

function ChatPage() {
  const location = useLocation()
  const routeAgent = (location.state as { agent?: Agent } | null)?.agent
  const savedAgentId = localStorage.getItem('sysbot_chat_agent')
  const initialAgent = routeAgent ?? studyAgents.find((agent) => agent.id === savedAgentId) ?? studyAgents[0]
  const [selectedAgent, setSelectedAgent] = useState<Agent>(initialAgent)
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedChatId, setSelectedChatId] = useState<number>()
  const [draft, setDraft] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  function changeAgent(agent: Agent) {
    setSelectedAgent(agent)
    localStorage.setItem('sysbot_chat_agent', agent.id)
  }

  useEffect(() => {
    let isActive = true

    getChats()
      .then((chatList) => {
        if (isActive) setChats(chatList)
      })
      .catch((apiError) => {
        if (isActive) {
          setError(apiError instanceof Error ? apiError.message : 'Could not load chats')
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  async function selectChat(chat: Chat) {
    setSelectedChatId(chat.id)
    setIsSidebarOpen(false)
    setIsLoading(true)
    setError('')

    try {
      const chatMessages = await getMessages(chat.id)
      setMessages(chatMessages.map((message) => ({ ...message, role: 'user' })))
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Could not load messages')
    } finally {
      setIsLoading(false)
    }
  }

  function startNewChat() {
    setSelectedChatId(undefined)
    setMessages([])
    setDraft('')
    setError('')
    setIsSidebarOpen(false)
  }

  async function sendMessage() {
    const content = draft.trim()
    if (!content || isSending) return

    setIsSending(true)
    setError('')

    try {
      if (selectedChatId === undefined) {
        const chat = await createChat(content)
        const chatMessages = await getMessages(chat.id)
        setChats((current) => [chat, ...current])
        setSelectedChatId(chat.id)
        setMessages(chatMessages.map((message) => ({ ...message, role: 'user' })))
      } else {
        const message = await createMessage(selectedChatId, content)
        setMessages((current) => [...current, { ...message, role: 'user' }])
      }
      setDraft('')
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Could not send message')
    } finally {
      setIsSending(false)
    }
  }

  async function renameChat(chat: Chat) {
    const title = window.prompt('Rename chat', chat.title)?.trim()
    if (!title || title === chat.title) return

    try {
      const updatedChat = await updateChat(chat.id, title)
      setChats((current) => current.map((item) => (item.id === chat.id ? updatedChat : item)))
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Could not rename chat')
    }
  }

  async function removeChat(chat: Chat) {
    try {
      await deleteChat(chat.id)
      setChats((current) => current.filter((item) => item.id !== chat.id))
      if (selectedChatId === chat.id) startNewChat()
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Could not delete chat')
    }
  }

  return (
    <div className="chat-layout">
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={startNewChat}
        onSelectChat={selectChat}
        onRenameChat={renameChat}
        onDeleteChat={removeChat}
      />
      <main className="chat-main">
        <header className="chat-main__header">
          <button
            type="button"
            className="icon-button chat-main__menu"
            aria-label="Open chat history"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span aria-hidden="true">&#9776;</span>
          </button>
          <Link to="/dashboard" className="chat-main__home" aria-label="Back to dashboard" title="Back to dashboard">
            <span aria-hidden="true">&#8592;</span>
          </Link>
          <AgentCharacter agent={selectedAgent} size="small" />
          <div className="chat-main__identity">
            <h1>{selectedAgent.nickname}</h1>
            <span><i /> {selectedAgent.name}</span>
          </div>
          <div className="chat-main__actions">
            <AgentSelector selectedAgent={selectedAgent} onSelect={changeAgent} />
            <ThemeToggle />
          </div>
        </header>

        <section className="chat-thread" aria-label="Conversation" aria-live="polite">
          <div className="chat-thread__content">
            {isLoading ? <p className="chat-thread__status">Loading...</p> : null}
            {!isLoading && messages.length === 0 ? (
              <div className="chat-empty">
                <AgentCharacter agent={selectedAgent} size="medium" />
                <h2>What are you learning today?</h2>
                <p>Send your first question to create a new study chat.</p>
              </div>
            ) : null}
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {error ? <p className="feedback feedback--error">{error}</p> : null}
          </div>
        </section>

        <div className="chat-composer">
          <MessageInput
            value={draft}
            isLoading={isSending}
            onChange={setDraft}
            onSubmit={sendMessage}
          />
          <p>SysBot can make mistakes. Check important course information.</p>
        </div>
      </main>
    </div>
  )
}

export default ChatPage
