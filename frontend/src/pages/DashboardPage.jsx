import { useState } from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { Folder, Code2, MessageCircle } from 'lucide-react'
import Header from '../components/Header'
import FileMapPanel from '../components/FileMapPanel'
import CodeEditorPanel from '../components/CodeEditorPanel'
import ChatPanel from '../components/ChatPanel'

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Hello! I&apos;m your code companion. Ask me anything about your repository structure, files, or implementation details.' }
  ])

  return (
    <div className="min-h-screen bg-vintage-cream flex flex-col">
      <Header />

      {/* Main Dashboard Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Panel 1: 3D File Map */}
          <Panel defaultSize={25} minSize={15} className="bg-vintage-cream">
            <FileMapPanel selectedFile={selectedFile} onSelectFile={setSelectedFile} />
          </Panel>

          {/* Resizer 1 */}
          <PanelResizeHandle className="w-1 bg-vintage-charcoal hover:bg-vintage-yellow transition-colors cursor-col-resize flex items-center justify-center group">
            <div className="w-0.5 h-8 bg-vintage-charcoal group-hover:bg-vintage-yellow transition-colors" />
          </PanelResizeHandle>

          {/* Panel 2: Code Editor */}
          <Panel defaultSize={50} minSize={30} className="bg-white">
            <CodeEditorPanel selectedFile={selectedFile} />
          </Panel>

          {/* Resizer 2 */}
          <PanelResizeHandle className="w-1 bg-vintage-charcoal hover:bg-vintage-yellow transition-colors cursor-col-resize flex items-center justify-center group">
            <div className="w-0.5 h-8 bg-vintage-charcoal group-hover:bg-vintage-yellow transition-colors" />
          </PanelResizeHandle>

          {/* Panel 3: Chat */}
          <Panel defaultSize={25} minSize={15} className="bg-vintage-cream">
            <ChatPanel messages={messages} onSendMessage={(text) => {
              setMessages([
                ...messages,
                { id: messages.length + 1, type: 'user', text },
                { id: messages.length + 2, type: 'ai', text: 'That&apos;s a great question! I&apos;m analyzing your code...' }
              ])
            }} />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}
