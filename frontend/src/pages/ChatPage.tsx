import { useState } from 'react'
import MessageBubble from '../components/MessageBubble'
import MessageInput from '../components/MessageInput'
import Sidebar from '../components/Sidebar'
import type { Chat, Message } from '../types'

const previewChats: Chat[] = [
  { id: 1, title: 'Virtual memory overview' },
  { id: 2, title: 'Operating system scheduling' },
  { id: 3, title: 'Database normalization' },
]

const previewMessages: Message[] = [
  {
    id: 1,
    user_id: 1,
    content: 'Can you explain virtual memory in simple terms?',
    role: 'user',
  },
  {
    id: 2,
    user_id: 0,
    content:
      'Virtual memory lets your computer use part of its storage as if it were extra RAM. It gives each program its own address space and moves less-used pages between memory and disk as needed.',
    role: 'assistant',
  },
]

function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState(1)
  const [draft, setDraft] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  function selectChat(chat: Chat) {
    setSelectedChatId(chat.id)
    setIsSidebarOpen(false)
  }

  return (
    <div className="chat-layout">
      <Sidebar
        chats={previewChats}
        selectedChatId={selectedChatId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={() => setDraft('')}
        onSelectChat={selectChat}
        onRenameChat={() => undefined}
        onDeleteChat={() => undefined}
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
          <div>
            <h1>SysBot</h1>
            <span>AI Course Assistant</span>
          </div>
        </header>

        <section className="chat-thread" aria-label="Conversation" aria-live="polite">
          <div className="chat-thread__content">
            {previewMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        </section>

        <div className="chat-composer">
          <MessageInput
            value={draft}
            onChange={setDraft}
            onSubmit={() => setDraft('')}
          />
          <p>SysBot can make mistakes. Check important course information.</p>
        </div>
      </main>
    </div>
  )
}

export default ChatPage
