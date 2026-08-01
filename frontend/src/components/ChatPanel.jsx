import { Send } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { handleWheel } from './CodeEditorPanel.jsx'
import api from "../../api.js"
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

export default function ChatPanel({
  messages, onSendMessage, selectedFile, repoURL
}) {

  const [inputValue, setInputValue] = useState('');
  const [activeCard, setActiveCard] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const abortControllerRef = useRef(null);
  const messageScrollRef = useRef(null);

  const scrollToBottom = () => {
    messageScrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    // If no file is selected, reset state and hide the context card (State 1)
    if (!selectedFile) {
      setActiveCard(null);
      return;
    }

    // Cancel any in-flight request to prevent race conditions during rapid sidebar clicks
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Immediately set loading state and reset collapsed state (State 2)
    setActiveCard({
      "path": selectedFile.path,
      "loading": true,
      "summary": null
    });
    setIsCollapsed(false);

    // Debounce API request by 150ms to handle rapid clicks
    const timer = setTimeout(async () => {
      try {
        const response = await api.post("/lazy-summary", {
          "path": selectedFile.path,
          "url": repoURL
        }, {
          signal: controller.signal // Signal goes in config object (third parameter) to cancel the Axios call
        });

        if (!response || !response.data) return;
        
        // Update card state with backend response (State 3)
        setActiveCard({
          "path": selectedFile.path,
          "loading": false,
          "summary": response.data.summary || "No summary available"
        });
      } catch (error) {
        if (axios.isCancel(error) || error.name === 'AbortError' || error.message === 'canceled') {
          console.log('Cancelled fetch for fast click:', selectedFile.path);
        } else {
          console.error('Failed to fetch summary:', error);
          setActiveCard(null);
        }
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [selectedFile, repoURL])
  
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
      <div className="px-4 py-[5.5px] vintage-border border-b-2 border-vintage-charcoal bg-vintage-yellow">
        <h2 className="font-serif text-lg font-bold text-vintage-charcoal">Companion Chat</h2>
      </div>

      {/* Pinned AI Context Card (Slide-down, fade, and height transitions) */}
      <div
        className={`flex-none overflow-hidden transition-all duration-300 ease-in-out bg-vintage-cream border-vintage-charcoal
          ${activeCard 
            ? 'max-h-[450px] opacity-100 border-b-2' 
            : 'max-h-0 opacity-0 pointer-events-none border-b-0'
          }`}
      >
        {activeCard && (
          <div className="flex flex-col">
            {/* Card Header Badge */}
            <div className="flex items-center justify-between px-4 py-2 bg-vintage-yellow/20 border-b border-vintage-charcoal/20 select-none">
              <div className="flex items-center gap-2 overflow-hidden mr-4">
                <span className="text-xs font-serif font-bold text-vintage-charcoal truncate">
                  📄 ACTIVE CONTEXT: {activeCard.path}
                </span>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                {activeCard.loading ? (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-vintage-amber animate-pulse" />
                    <span className="text-xs font-mono font-bold text-vintage-charcoal/80">
                      ● Analyzing...
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="px-2 py-0.5 text-xs font-mono border border-vintage-charcoal rounded bg-white hover:bg-vintage-amber hover:text-white transition-colors cursor-pointer font-bold focus:outline-none"
                  >
                    {isCollapsed ? '▼ Expand' : '▲ Hide'}
                  </button>
                )}
              </div>
            </div>

            {/* Card Body - expands down to fit content with a max-height guardrail */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden
                ${isCollapsed || activeCard.loading ? 'max-h-0' : 'max-h-80'}`}
            >
              <div className="p-4 text-sm text-vintage-charcoal font-sans bg-white/60 border-t border-vintage-charcoal/10 overflow-y-auto max-h-80 leading-relaxed markdown-body no-scrollbar">
                <div className="prose prose-sm max-w-none prose-stone">
                  <ReactMarkdown>
                    {activeCard.summary || ''}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
        onWheel={handleWheel}>
        {messages.map((message) => (
          <div className={message.type === "user" ? "flex justify-end" : "flex justify-start"} key={message.id}>
            <div className={
              message.type === "user"
                ? "max-w-xs px-4 py-3 rounded-lg bg-white border border-vintage-charcoal text-vintage-charcoal"
                : "max-w-xs px-4 py-3 rounded-lg bg-vintage-yellow text-vintage-charcoal"
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
