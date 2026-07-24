import { AlertCircle } from 'lucide-react'
import { useState } from 'react'

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

export default function CodeEditorPanel({ selectedFile }) {

  const [activeTab, setActiveTab] = useState('code');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Tabs */}
      <div className="flex items-center gap-2 px-4 py-3 vintage-border border-b-2 border-vintage-charcoal bg-vintage-parchment">
        <button
          onClick={() => {
            setActiveTab('code')
          }}
          className={`px-4 py-2 rounded font-mono text-sm transition-colors
            ${activeTab === "code"
              ? 'bg-vintage-yellow text-vintage-charcoal font-bold'
              : 'bg-white vintage-border border text-vintage-charcoal hover:bg-vintage-parchment'
            }`}
        >
          Code
        </button>
        <button
          onClick={() => {
            setActiveTab('summary')
          }}
          className={`px-4 py-2 rounded font-mono text-sm transition-colors
            ${activeTab === 'summary'
              ? 'bg-vintage-yellow text-vintage-charcoal font-bold'
              : 'bg-white vintage-border border text-vintage-charcoal hover:bg-vintage-parchment'
            }`}
        >
          AI Summary
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto flex flex-col">
        {activeTab === "code" && (
          <>
            {/* AI Purpose Card */}
            <div className="p-4 mx-4 mt-4 bg-vintage-amber bg-opacity-20 vintage-border border rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-vintage-amber flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-serif font-semibold text-vintage-charcoal">File Purpose:</p>
                  <p className="text-sm text-vintage-charcoal opacity-85 mt-1">
                    {selectedFile
                      ? `This file contains ${selectedFile.name} with important logic for the application.`
                      : 'Select a file from the 3D File Map to see its purpose and details.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Code Block */}
            <div className="flex-1 p-4 overflow-auto">
              <pre className="bg-vintage-darkcode text-vintage-yellow p-4 rounded-lg font-mono text-sm leading-relaxed overflow-auto whitespace-pre-wrap break-words">
                <code>{selectedFile ? selectedFile.content : sampleCode}</code>
              </pre>
            </div>
          </>
        )}


        {/* TODO: Conditionally render summary panel when activeTab === 'summary' (e.g. wrapper div should have `hidden` class or not render) */}
        {activeTab === "summary" && (
          <div className="flex-1 p-4 overflow-auto">
            <div className="prose prose-invert max-w-none">
              <div className="bg-vintage-parchment p-6 rounded-lg">
                <h3 className="font-serif text-lg font-bold text-vintage-charcoal mb-3">
                  AI Code Summary
                </h3>
                <div className="text-vintage-charcoal space-y-3 text-sm">
                  <p>
                    This component serves as the main application router. It imports React Router and establishes
                    the routing structure for the entire application.
                  </p>
                  <p>
                    <strong>Key Dependencies:</strong> React Router DOM, HomePage component, DashboardPage component
                  </p>
                  <p>
                    <strong>Main Functionality:</strong> Sets up two main routes - a home page at "/" and a
                    dashboard page at "/dashboard". Both routes are wrapped in a Router component.
                  </p>
                  <p>
                    <strong>Suggested Improvements:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Consider adding error boundary for better error handling</li>
                    <li>Implement lazy loading for route components for better performance</li>
                    <li>Add NotFound route for unmatched paths</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
