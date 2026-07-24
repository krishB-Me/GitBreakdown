import { useState } from 'react'
import { GitBranch, Code2, MessageSquare } from 'lucide-react'

export default function App() {

  const [currentPage, setCurrentPage] = useState('home');
  const [repoURL, setRepoURL] = useState('');

  const handleAnalyze = () => {
    if (repoURL.trim()) {
      setCurrentPage('dashboard');
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.nativeEvent?.isComposing) {
      handleAnalyze();
    }
  }

  if (currentPage === 'dashboard') { // Rendering the dashboard page is we are there
    return <DashboardPage onBack={() => setCurrentPage('home')} repoUrl={repoURL} />
  }

  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Header */}
      <header className="bg-vintage-cream border-b-2 border-vintage-charcoal sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-3xl font-serif font-bold text-vintage-charcoal">GitBreakdown</div>
          <nav className="flex items-center gap-8">
            <a href="#" className="text-vintage-charcoal hover:text-vintage-amber font-medium">Features</a>
            <a href="#" className="text-vintage-charcoal hover:text-vintage-amber font-medium">Docs</a>
            <a href="#" className="text-vintage-charcoal hover:text-vintage-amber font-medium">About</a>
            <button
              onClick={() => {
                handleAnalyze()
              }}
              className="px-6 py-2 bg-vintage-yellow text-vintage-charcoal font-bold rounded-full hover:bg-vintage-amber"
            >
              Launch App
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-vintage-charcoal mb-6">
            I thought I saw your code today...{' '}
            <span className="block text-vintage-amber">Deconstructed.</span>
          </h1>
          <p className="text-lg text-vintage-charcoal opacity-90 max-w-2xl mx-auto">
            Explore your repository in a whole new way. Visualize your code structure, understand dependencies, and chat with an AI-powered companion.
          </p>
        </div>

        {/* Repository Input */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="https://github.com/username/repository"
              value={repoURL}
              onChange={(e) => { setRepoURL(e.target.value); }}
              onKeyDown={handleKeyPress}
              className="flex-1 px-5 py-4 bg-white border-2 border-vintage-charcoal rounded text-vintage-charcoal focus:outline-none focus:ring-2 focus:ring-vintage-yellow"
            />
            <button
              onClick={() => {
                handleAnalyze()
              }}
              className="px-8 py-4 bg-vintage-yellow text-vintage-charcoal font-bold rounded hover:bg-vintage-amber whitespace-nowrap"
            >
              Analyze Repository
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-vintage-parchment border-2 border-vintage-charcoal p-6 rounded hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <GitBranch className="w-8 h-8 text-vintage-charcoal" />
              <h3 className="font-serif text-2xl font-bold text-vintage-charcoal">3D File Tree</h3>
            </div>
            <p className="text-vintage-charcoal opacity-85">
              Visualize your entire repository structure in an interactive 3D canvas.
            </p>
          </div>

          <div className="bg-vintage-parchment border-2 border-vintage-charcoal p-6 rounded hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-8 h-8 text-vintage-charcoal" />
              <h3 className="font-serif text-2xl font-bold text-vintage-charcoal">AI Code Summaries</h3>
            </div>
            <p className="text-vintage-charcoal opacity-85">
              Get intelligent summaries of any file in your repository.
            </p>
          </div>

          <div className="bg-vintage-parchment border-2 border-vintage-charcoal p-6 rounded hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-8 h-8 text-vintage-charcoal" />
              <h3 className="font-serif text-2xl font-bold text-vintage-charcoal">Interactive Chatbot</h3>
            </div>
            <p className="text-vintage-charcoal opacity-85">
              Ask questions about your code with an AI-powered companion.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardPage({ onBack, repoUrl }) {

  const [activePanel, setActivePanel] = useState('code');
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: "Hello! I'm your code companion. Ask me anything about your repository!" }
  ])
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const sampleCode = `import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  )
}`

  const response = "I'm analyzing your response."
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, type: 'user', text: inputValue },
        { id: messages.length + 2, type: 'ai', text: response }
      ])
    }
    setInputValue('');
  }

  return (
    <div className="min-h-screen bg-vintage-cream flex flex-col">
      {/* Header */}
      <header className="bg-vintage-cream border-b-2 border-vintage-charcoal">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              onBack();
            }}
            className="text-3xl font-serif font-bold text-vintage-charcoal"
          >
            GitBreakdown
          </button>
          <button
            onClick={() => {
              onBack();
            }}
            className="px-4 py-2 bg-vintage-yellow text-vintage-charcoal font-bold rounded hover:bg-vintage-amber"
          >
            Back
          </button>
        </div>
      </header>

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 overflow-hidden flex gap-2 p-2">
        {/* Left Panel - File Tree */}
        <div className="w-1/4 bg-vintage-parchment border-2 border-vintage-charcoal rounded overflow-y-auto">
          <div className="p-4 border-b-2 border-vintage-charcoal bg-vintage-yellow">
            <h2 className="font-serif text-lg font-bold text-vintage-charcoal">3D File Map</h2>
          </div>
          <div className="p-3 space-y-2">
            {/* TODO: Replace with dynamic file list and selected state checks */}
            {['src', 'components', 'pages', 'App.jsx', 'index.css'].map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedFile(item)
                }}
                className={`py-2 px-3 rounded cursor-pointer font-mono text-sm ${selectedFile === item
                    ? 'bg-vintage-yellow text-vintage-charcoal font-bold'
                    : 'hover:bg-vintage-cream text-vintage-charcoal'
                  }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Center Divider */}
        <div className="w-1 bg-vintage-charcoal hover:bg-vintage-yellow" />

        {/* Center Panel - Code Editor */}
        <div className="flex-1 bg-white border-2 border-vintage-charcoal rounded overflow-hidden flex flex-col">
          <div className="flex gap-2 p-3 border-b-2 border-vintage-charcoal bg-vintage-parchment">
            <button
              onClick={() => {
                setActivePanel('code')
              }}
              className={`px-4 py-2 rounded font-mono text-sm ${activePanel === 'code'
                  ? 'bg-vintage-yellow text-vintage-charcoal font-bold'
                  : 'bg-white border border-vintage-charcoal text-vintage-charcoal'
                }`}
            >
              Code
            </button>
            <button
              onClick={() => {
                setActivePanel('summary')
              }}
              className={`px-4 py-2 rounded font-mono text-sm ${activePanel === 'summary'
                  ? 'bg-vintage-yellow text-vintage-charcoal font-bold'
                  : 'bg-white border border-vintage-charcoal text-vintage-charcoal'
                }`}
            >
              AI Summary
            </button>
          </div>

          <div className="flex-1 overflow-auto">

            {activePanel === "code" && (
              <div className="p-4">
                <div className="p-4 mb-4 bg-vintage-amber bg-opacity-20 border border-vintage-amber rounded">
                  <p className="font-bold text-vintage-charcoal">File Purpose:</p>
                  <p className="text-sm text-vintage-charcoal mt-1">
                    {selectedFile ? `Details about ${selectedFile}` : `Select a file to see details`}
                  </p>
                </div>
                <pre className="bg-vintage-darkcode text-vintage-yellow p-4 rounded font-mono text-sm overflow-auto">
                  {sampleCode}
                </pre>
              </div>
            )}

            {activePanel === "summary" && (
              <div className="p-4">
                <div className="bg-vintage-parchment p-4 rounded">
                  <h3 className="font-serif text-lg font-bold text-vintage-charcoal mb-3">AI Code Summary</h3>
                  <p className="text-vintage-charcoal text-sm mb-2">
                    {/* TODO: Display summary text */}
                    This is the main application component that sets up routing.
                  </p>
                  <p className="text-vintage-charcoal text-sm"><strong>Dependencies:</strong> React Router DOM</p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Divider */}
        <div className="w-1 bg-vintage-charcoal hover:bg-vintage-yellow" />

        {/* Right Panel - Chat */}
        <div className="w-1/4 bg-vintage-parchment border-2 border-vintage-charcoal rounded overflow-hidden flex flex-col">
          <div className="p-4 border-b-2 border-vintage-charcoal bg-vintage-yellow">
            <h2 className="font-serif text-lg font-bold text-vintage-charcoal">Companion Chat</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* TODO: Map over messages state and render chat bubbles dynamically */}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded text-sm ${msg.type === 'user'
                      ? 'bg-white border border-vintage-charcoal text-vintage-charcoal'
                      : 'bg-vintage-yellow text-vintage-charcoal'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t-2 border-vintage-charcoal">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent?.isComposing) {
                    handleSendMessage()
                  }
                }}
                className="flex-1 px-3 py-2 bg-white border border-vintage-charcoal rounded text-sm text-vintage-charcoal focus:outline-none focus:ring-2 focus:ring-vintage-yellow"
              />
              <button
                onClick={() => {
                  handleSendMessage()
                }}
                className="px-3 py-2 bg-vintage-yellow text-vintage-charcoal font-bold rounded hover:bg-vintage-amber text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
