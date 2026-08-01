import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Group, Panel, Separator } from 'react-resizable-panels'
import Header from '../components/Header'
import FileMapPanel from '../components/FileMapPanel'
import CodeEditorPanel from '../components/CodeEditorPanel'
import ChatPanel from '../components/ChatPanel'

export default function DashboardPage() {
  const location = useLocation()
  const repoUrl = location.state?.repoUrl || ''
  const treeStructure = location.state?.treeStructure || []
  const summary = location.state?.summary || "Repo has no Summary"
  const [filesOpened, setFilesOpened] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null)
  const [activeTab, setActiveTab] = useState('code')
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: "Hello! I'm your code companion. Ask me anything about your repository!" }
  ])

  const handleSendMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: 'user', text },
      { id: Date.now() + 1, type: 'ai', text: "I'm analyzing your response." }
    ])
  }

  return (
    <div className="h-screen bg-dev-bg-darkest flex flex-col overflow-hidden">
      <Header />

      {/* Main Dashboard Content */}
      <div className="flex-1 overflow-hidden">
        <Group direction="horizontal" className="h-full">
          {/* Panel 1: 3D File Map */}
          <Panel defaultSize={25} minSize={15} className="bg-dev-bg-base">
            <FileMapPanel
              selectedFile={selectedFile}
              onSelectFile={(file) => {
                setSelectedFile(file)
                setActiveTab('code')
              }}
              filesOpened={filesOpened}
              setFilesOpened={setFilesOpened}
              treeStructure={treeStructure}
            />
          </Panel>

          {/* Resizer 1 */}
          <Separator className="w-1 bg-dev-border hover:bg-dev-orange transition-colors cursor-col-resize flex items-center justify-center group">
            <div className="w-0.5 h-8 bg-dev-border group-hover:bg-dev-orange transition-colors" />
          </Separator>

          {/* Panel 2: Code Editor */}
          <Panel defaultSize={50} minSize={30} className="bg-dev-bg-base">
            <CodeEditorPanel
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              setFilesOpened={setFilesOpened}
              filesOpened={filesOpened}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              summary={summary}
              repoURL={repoUrl} 
            />
          </Panel>

          {/* Resizer 2 */}
          <Separator className="w-1 bg-dev-border hover:bg-dev-orange transition-colors cursor-col-resize flex items-center justify-center group">
            <div className="w-0.5 h-8 bg-dev-border group-hover:bg-dev-orange transition-colors" />
          </Separator>

          {/* Panel 3: Chat */}
          <Panel defaultSize={25} minSize={15} className="bg-dev-bg-base">
            <ChatPanel 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              selectedFile={selectedFile}
              repoURL={repoUrl}
              setMessages={setMessages}
            />
          </Panel>
        </Group>
      </div>
    </div>
  )
}
