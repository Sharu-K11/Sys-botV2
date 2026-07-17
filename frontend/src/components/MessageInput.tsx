interface MessageInputProps {
  value: string
  isLoading?: boolean
  onChange: (value: string) => void
  onSubmit: () => void
}

function MessageInput({ value, isLoading = false, onChange, onSubmit }: MessageInputProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <textarea
        value={value}
        rows={1}
        aria-label="Message SysBot"
        placeholder="Message SysBot..."
        disabled={isLoading}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="submit"
        className="message-input__send"
        aria-label="Send message"
        title="Send message"
        disabled={isLoading || value.trim().length === 0}
      >
        <span aria-hidden="true">&#8593;</span>
      </button>
    </form>
  )
}

export default MessageInput