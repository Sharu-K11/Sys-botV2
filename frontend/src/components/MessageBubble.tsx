import type { ChatMessage } from '../types'

interface MessageBubbleProps {
  message: ChatMessage
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <article
      className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--assistant'}`}
      aria-label={`${message.role} message`}
    >
      <p className="message-bubble__content">{message.content}</p>
      <time className="message-bubble__time" dateTime={message.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </time>
    </article>
  )
}

export default MessageBubble
