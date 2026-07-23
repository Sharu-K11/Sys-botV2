import ChatListItem from './ChatListItem'
import type { Chat } from '../types'
import { Link } from 'react-router-dom'

interface SidebarProps {
  chats: Chat[]
  selectedChatId?: number
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
  onSelectChat: (chat: Chat) => void
  onRenameChat: (chat: Chat) => void
  onDeleteChat: (chat: Chat) => void
}

function Sidebar({
  chats,
  selectedChatId,
  isOpen,
  onClose,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}: SidebarProps) {
  return (
    <>
      <aside className={`chat-sidebar ${isOpen ? 'chat-sidebar--open' : ''}`}>
        <div className="chat-sidebar__brand">
          <span>S</span>
          <div>
            <strong>SysBot</strong>
            <small>Learning workspace</small>
          </div>
        </div>
        <Link to="/dashboard" className="chat-sidebar__home">
          <span aria-hidden="true">&#8592;</span>
          Back to dashboard
        </Link>
        <div className="chat-sidebar__header">
          <button type="button" className="new-chat-button" onClick={onNewChat}>
            <span aria-hidden="true">+</span>
            New chat
          </button>
          <button
            type="button"
            className="icon-button chat-sidebar__close"
            aria-label="Close chat history"
            onClick={onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <p className="chat-sidebar__label">Recent</p>
        <nav aria-label="Chat history">
          <ul className="chat-list">
            {chats.length === 0 ? (
              <li className="chat-list__empty">No chats yet</li>
            ) : null}
            {chats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isSelected={chat.id === selectedChatId}
                onSelect={onSelectChat}
                onRename={onRenameChat}
                onDelete={onDeleteChat}
              />
            ))}
          </ul>
        </nav>

        <div className="chat-sidebar__footer">
          <span className="chat-sidebar__avatar" aria-hidden="true">S</span>
          <div>
            <strong>Student</strong>
            <span>Course workspace</span>
          </div>
        </div>
      </aside>
      {isOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close chat history"
          onClick={onClose}
        />
      ) : null}
    </>
  )
}

export default Sidebar