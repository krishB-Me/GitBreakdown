import { Send } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function ChatPanel({ messages, onSendMessage }) {

  const [inputValue, setInputValue] = useState('');
  const messageScrollRef = useRef(null);

  const scrollToBottom = () => {
    messageScrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) { // Checking if the input is valid & not empty 
      onSendMessage(inputValue);
      setInputValue('');
    }
  }

  const handleKeyPress = (e) => {
    if (e.key == "Enter" && !e.nativeEvent?.isComposing) {
      e.preventDefault()
      handleSendMessage();
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
          <div className={message.type === "user" ? "flex justify-start" : "flex justify-end"} key={message.id}>
            <div className={
              message.type === "user" 
                ? "max-w-xs px-4 py-3 rounded-lg bg-vintage-yellow text-vintage-charcoal" 
                :"max-w-xs px-4 py-3 rounded-lg bg-vintage-parchment text-vintage-charcoal"
            }>
              <p className="text-sm leading-relaxed">
                {message.text}
              </p>
            </div>
          </div>
        ))}

        <div ref={messageScrollRef}>

        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 vintage-border border-t-2 border-vintage-charcoal bg-vintage-cream">
        <div className="flex gap-2">
          <input
            type="text"
            
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            value={inputValue}
            placeholder="Ask a question about your code..."
            className="flex-1 px-3 py-2 bg-white vintage-border rounded text-sm text-vintage-charcoal focus:outline-none focus:ring-2 focus:ring-vintage-yellow"
          />
          <button
            onClick={() => {
              handleSendMessage()
            }}
            className="px-4 py-2 bg-vintage-yellow text-vintage-charcoal font-bold rounded hover:bg-vintage-amber transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
