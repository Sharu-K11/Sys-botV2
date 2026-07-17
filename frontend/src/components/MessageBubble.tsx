import type { Message } from '../types'

interface MessageBubbleProps {
  message: Message
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <article
      className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--assistant'}`}
      aria-label={`${message.role} message`}
    >
      <p className="message-bubble__content">{message.content}</p>
      {message.created_at ? (
        <time className="message-bubble__time" dateTime={message.created_at}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      ) : null}
    </article>
  )
}

export default MessageBubble
