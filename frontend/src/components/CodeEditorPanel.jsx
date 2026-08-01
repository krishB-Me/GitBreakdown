import { AlertCircle, X } from 'lucide-react'
import ReactMarkdown from "react-markdown"
import { useState, useEffect } from 'react'
import api from '../../api'

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

const fileContents = {
  'App.jsx': sampleCode,
  'Header.jsx': `import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-dev-bg-surface border-b border-dev-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-mono text-2xl font-bold text-dev-text-primary hover:text-dev-orange">
          GitBreakdown
        </Link>
        <nav className="flex items-center gap-8">
          <Link to="/dashboard" className="px-6 py-2 bg-dev-orange text-white font-medium rounded-full hover:bg-dev-orange-hover">
            Launch App
          </Link>
        </nav>
      </div>
    </header>
  )
}`,
  'HomePage.jsx': `import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState('')
  const navigate = useNavigate()

  const handleAnalyze = () => {
    if (repoUrl.trim()) {
      navigate('/dashboard', { state: { repoUrl } })
    }
  }

  return (
    <div className="min-h-screen bg-dev-bg-darkest text-dev-text-primary">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="font-mono text-4xl font-bold mb-6">Deconstruct your code.</h1>
        <input 
          value={repoUrl} 
          onChange={e => setRepoUrl(e.target.value)} 
          className="px-5 py-4 bg-dev-bg-base border border-dev-border rounded"
        />
        <button onClick={handleAnalyze} className="px-8 py-4 bg-dev-orange text-white font-bold rounded ml-3">
          Analyze
        </button>
      </div>
    </div>
  )
}`,
  'DashboardPage.jsx': `import { useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import Header from '../components/Header'
import FileMapPanel from '../components/FileMapPanel'
import CodeEditorPanel from '../components/CodeEditorPanel'
import ChatPanel from '../components/ChatPanel'

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  return (
    <div className="min-h-screen bg-dev-bg-darkest flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Group direction="horizontal">
          <Panel defaultSize={25}><FileMapPanel onSelectFile={setSelectedFile} /></Panel>
          <Separator className="w-1 bg-dev-border" />
          <Panel defaultSize={50}><CodeEditorPanel selectedFile={selectedFile} /></Panel>
          <Separator className="w-1 bg-dev-border" />
          <Panel defaultSize={25}><ChatPanel /></Panel>
        </Group>
      </div>
    </div>
  )
}`
}

export const handleWheel = (e) => {
  if (e.deltaY !== 0) {
    e.currentTarget.scrollLeft += e.deltaY;
  }
};

export default function CodeEditorPanel({
  selectedFile, setSelectedFile, setFilesOpened,
  filesOpened, activeTab, setActiveTab,
  summary, repoURL }) {
  const [contents, setContents] = useState('');

  // Let's use useEffect to get the file data from the backend using lazy fetch 
  useEffect(() => {
    let active = true;
    setContents('');
    const fetchFileContent = async () => {
      if (!selectedFile || !selectedFile.path) return;
      try {
        const response = await api.post("/lazy-fetch", {
          "path": selectedFile.path,
          "url": repoURL
        });
        if (active) {
          setContents(response.data.content);
        }
      } catch (error) {
        console.error("Error in lazy fetching ", error);
      }
    };

    fetchFileContent();
    return () => {
      active = false;
    };
  }, [selectedFile, repoURL])

  const activeContent = selectedFile
    ? contents || `// Code content for ${selectedFile.name}\n// ...`
    : sampleCode;

  return (
    <div className="h-full flex flex-col bg-dev-bg-base">
      {/* Tabs */}
      <div className="h-10 flex-none overflow-hidden border-b border-dev-border bg-dev-bg-surface">
        <div
          onWheel={handleWheel}
          className="flex items-center flex-nowrap overflow-x-auto h-full no-scrollbar select-none"
        >
          <button
            onClick={() => {
              setActiveTab('summary')
            }}
            className={`px-4 h-full shrink-0 flex items-center whitespace-nowrap font-mono text-sm transition-colors border-r border-dev-border cursor-pointer focus:outline-none
              ${activeTab === 'summary'
                ? 'bg-dev-bg-base text-dev-text-primary font-bold border-t-2 border-t-dev-orange'
                : 'bg-dev-bg-surface text-dev-text-secondary hover:bg-dev-bg-hover hover:text-dev-text-primary'
              }`}
          >
            AI Summary
          </button>

          {filesOpened && filesOpened.map((file) => {
            const isFileSelected = selectedFile?.path && file.path 
              ? selectedFile.path === file.path 
              : selectedFile?.name === file.name;
            return (
              <div
                key={file.path || file.id || file.name}
                onClick={() => {
                  setActiveTab('code')
                  setSelectedFile(file)
                }}
                className={`group flex items-center h-full shrink-0 flex-nowrap border-r border-dev-border cursor-pointer whitespace-nowrap transition-colors
                   ${isFileSelected && activeTab === 'code'
                    ? 'bg-dev-bg-base text-dev-text-primary font-bold border-t-2 border-t-dev-orange'
                    : 'bg-dev-bg-surface text-dev-text-secondary hover:bg-dev-bg-hover hover:text-dev-text-primary'
                  }`}
              >
                <span className="pl-3 pr-1 font-mono text-sm select-none">
                  {file.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedFiles = filesOpened.filter(f => 
                      (f.path && file.path) ? f.path !== file.path : f.name !== file.name
                    );
                    setFilesOpened(updatedFiles);
                    if (updatedFiles.length === 0) {
                      setSelectedFile(null);
                      setActiveTab('summary');
                    } else if (isFileSelected) {
                      setSelectedFile(updatedFiles.at(-1));
                      setActiveTab('code');
                    }
                  }}
                  className="pr-2 pl-1 h-full flex items-center justify-center text-dev-text-secondary hover:text-dev-orange cursor-pointer transition-colors focus:outline-none"
                >
                  <X className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto flex flex-col">
        {activeTab === "code" && (
          <>
            {/* AI Purpose Card */}
            <div className="p-4 mx-4 mt-4 bg-dev-orange/10 border border-dev-orange/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-dev-orange flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-sm font-semibold text-dev-text-primary">File Purpose:</p>
                  <p className="text-sm text-dev-text-secondary font-mono mt-1">
                    {selectedFile
                      ? `This file contains ${selectedFile.name} with important logic for the application.`
                      : 'Select a file from the 3D File Map to see its purpose and details.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Code Block */}
            <div className="flex-1 p-4 overflow-auto no-scrollbar"
              onWheel={handleWheel}>
              <pre className="bg-dev-bg-surface text-dev-text-primary p-4 rounded-lg border border-dev-border font-mono text-sm leading-relaxed overflow-auto whitespace-pre-wrap break-words">
                <code>{activeContent}</code>
              </pre>
            </div>
          </>
        )}

        {activeTab === "summary" && (
          <div className="flex-1 p-4 overflow-auto dev-glass-card">
            <div className="prose prose-invert max-w-none">
              <div className="p-6 rounded-lg">
                <h3 className="text-dev-text-primary text-lg font-mono font-bold mb-3">
                  AI Code Summary
                </h3>
                <div className="text-dev-text-primary font-mono space-y-3 text-sm">
                  {summary ? (
                    <ReactMarkdown>{summary}</ReactMarkdown>
                  ) : (
                    <p className="italic opacity-60">No summary available yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
