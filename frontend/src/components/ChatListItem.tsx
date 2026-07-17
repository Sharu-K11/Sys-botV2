import type { Chat } from '../types'

interface ChatListItemProps {
  chat: Chat
  isSelected: boolean
  onSelect: (chat: Chat) => void
  onRename: (chat: Chat) => void
  onDelete: (chat: Chat) => void
}

function ChatListItem({
  chat,
  isSelected,
  onSelect,
  onRename,
  onDelete,
}: ChatListItemProps) {
  return (
    <li className={`chat-list-item ${isSelected ? 'chat-list-item--selected' : ''}`}>
      <button
        type="button"
        className="chat-list-item__title"
        onClick={() => onSelect(chat)}
      >
        {chat.title}
      </button>
      <div className="chat-list-item__actions">
        <button
          type="button"
          className="icon-button"
          aria-label={`Rename ${chat.title}`}
          title="Rename chat"
          onClick={() => onRename(chat)}
        >
          <span aria-hidden="true">&#9998;</span>
        </button>
        <button
          type="button"
          className="icon-button icon-button--danger"
          aria-label={`Delete ${chat.title}`}
          title="Delete chat"
          onClick={() => onDelete(chat)}
        >
          <span aria-hidden="true">&#128465;</span>
        </button>
      </div>
    </li>
  )
}

export default ChatListItem