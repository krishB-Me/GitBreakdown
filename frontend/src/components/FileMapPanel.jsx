import { useState } from 'react'
import { ChevronRight, ChevronDown, FileText, Folder } from 'lucide-react'
import { handleWheel } from './CodeEditorPanel.jsx'

const sampleFileTree = [
  {
    id: 1,
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: 2,
        name: 'components',
        type: 'folder',
        expanded: false,
        children: [
          { id: 3, name: 'Header.jsx', type: 'file' },
          { id: 4, name: 'Footer.jsx', type: 'file' },
          { id: 5, name: 'Navigation.jsx', type: 'file' }
        ]
      },
      {
        id: 6,
        name: 'pages',
        type: 'folder',
        expanded: false,
        children: [
          { id: 7, name: 'HomePage.jsx', type: 'file' },
          { id: 8, name: 'DashboardPage.jsx', type: 'file' }
        ]
      },
      { id: 9, name: 'App.jsx', type: 'file' },
      { id: 10, name: 'index.css', type: 'file' }
    ]
  },
  {
    id: 11,
    name: 'public',
    type: 'folder',
    expanded: false,
    children: [
      { id: 12, name: 'index.html', type: 'file' }
    ]
  },
  { id: 13, name: 'package.json', type: 'file' },
  { id: 14, name: 'vite.config.js', type: 'file' }
]

function TreeNode({ node, level = 0, onSelectFile, selectedFile, filesOpened, setFilesOpened }) {
  const [expanded, setExpanded] = useState(node.expanded || false)

  const isFile = node.type === 'file'
  
  // Use path to compare selected files if available (for backend nodes), falling back to id (for mock nodes)
  const isSelected = selectedFile 
    ? (selectedFile.path && node.path 
        ? selectedFile.path === node.path 
        : selectedFile.id === node.id)
    : false

  return (
    <div>
      <div
        onClick={() => {
          if (isFile) {
            onSelectFile(node) 
            const isOpen = filesOpened.some(file => (file.path && node.path) ? file.path === node.path : file.name === node.name)
            setFilesOpened((prevFiles) => { 
              return isOpen ? prevFiles : [...prevFiles, node]
            })
          } else {
            setExpanded(!expanded)
          }
        }}
        className={`flex items-center gap-2 py-2 px-3 cursor-pointer rounded transition-colors text-vintage-charcoal
          ${isSelected
            ? 'bg-vintage-yellow text-vintage-charcoal font-semibold'
            : 'hover:bg-vintage-parchment text-vintage-charcoal'
          }`}
      >
        {!isFile && (
          <div className="w-5 flex justify-center">
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        )}
        {isFile ? (
          <FileText className="w-4 h-4 text-vintage-amber" />
        ) : (
          <Folder className="w-4 h-4 text-vintage-charcoal" />
        )}
        <span className="text-sm font-mono">{node.name}</span>
      </div>

      {expanded && node.children && (
        <div className="pl-4">
          {node.children.map((child) => (
            <TreeNode
              key={child.path || child.id || child.name}
              node={child}
              level={level + 1}
              onSelectFile={onSelectFile}
              selectedFile={selectedFile}
              filesOpened={filesOpened}
              setFilesOpened={setFilesOpened}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FileMapPanel({ selectedFile, onSelectFile, filesOpened, setFilesOpened, treeStructure }) {
  return (
    <div className="h-full flex flex-col bg-vintage-parchment vintage-border border-r-2 border-vintage-charcoal">
      {/* Header */}
      <div className="px-4 py-[5.5px] vintage-border border-b-2 border-vintage-charcoal bg-vintage-yellow">
        <h2 className="font-serif text-lg font-bold text-vintage-charcoal">3D File Map</h2>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2 no-scrollbar"
        onWheel={handleWheel}>
        {(treeStructure || sampleFileTree).map((node) => (
          <TreeNode
            key={node.path || node.id || node.name}
            node={node}
            onSelectFile={onSelectFile}
            selectedFile={selectedFile}
            filesOpened={filesOpened}
            setFilesOpened={setFilesOpened}
          />
        ))}
      </div>
    </div>
  )
}
