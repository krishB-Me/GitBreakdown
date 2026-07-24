import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GitBranch, Code2, MessageSquare } from 'lucide-react'
import Header from '../components/Header'

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState('')
  const navigate = useNavigate()

  const handleAnalyze = () => {
    if (repoUrl.trim()) {
      navigate('/dashboard')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleAnalyze()
    }
  }

  return (
    <div className="min-h-screen bg-vintage-cream">
      <Header />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-vintage-charcoal mb-6 text-balance">
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
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-5 py-4 bg-white vintage-border rounded-lg text-vintage-charcoal focus:outline-none focus:ring-2 focus:ring-vintage-yellow focus:ring-offset-2 focus:ring-offset-vintage-cream"
            />
            <button
              onClick={handleAnalyze}
              className="px-8 py-4 bg-vintage-yellow text-vintage-charcoal font-bold rounded-lg hover:bg-vintage-amber transition-colors whitespace-nowrap"
            >
              Analyze Repository
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* 3D File Tree Card */}
          <div className="bg-vintage-parchment vintage-border p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <GitBranch className="w-8 h-8 text-vintage-charcoal" />
              <h3 className="font-serif text-2xl font-bold text-vintage-charcoal">3D File Tree</h3>
            </div>
            <p className="text-vintage-charcoal opacity-85">
              Visualize your entire repository structure in an interactive 3D canvas. Navigate, explore, and understand your codebase at a glance.
            </p>
          </div>

          {/* AI Code Summaries Card */}
          <div className="bg-vintage-parchment vintage-border p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-8 h-8 text-vintage-charcoal" />
              <h3 className="font-serif text-2xl font-bold text-vintage-charcoal">AI Code Summaries</h3>
            </div>
            <p className="text-vintage-charcoal opacity-85">
              Get intelligent summaries of any file in your repository. Understand purpose, dependencies, and key functions instantly.
            </p>
          </div>

          {/* Interactive Chatbot Card */}
          <div className="bg-vintage-parchment vintage-border p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-8 h-8 text-vintage-charcoal" />
              <h3 className="font-serif text-2xl font-bold text-vintage-charcoal">Interactive Chatbot</h3>
            </div>
            <p className="text-vintage-charcoal opacity-85">
              Ask questions about your code. Our AI companion can explain implementations, suggest improvements, and answer all your queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
