import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'

export default function ChatPanel({ messages, onSendMessage }) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim() && !inputValue.nativeEvent?.isComposing) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col bg-vintage-parchment vintage-border border-l-2 border-vintage-charcoal">
      {/* Header */}
      <div className="px-4 py-4 vintage-border border-b-2 border-vintage-charcoal bg-vintage-yellow">
        <h2 className="font-serif text-lg font-bold text-vintage-charcoal">Companion Chat</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-white vintage-border border text-vintage-charcoal'
                  : 'bg-vintage-yellow text-vintage-charcoal'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 vintage-border border-t-2 border-vintage-charcoal bg-vintage-cream">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your code..."
            className="flex-1 px-3 py-2 bg-white vintage-border rounded text-sm text-vintage-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vintage-yellow"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-vintage-yellow text-vintage-charcoal font-bold rounded hover:bg-vintage-amber transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
