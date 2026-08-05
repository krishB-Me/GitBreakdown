import { AlertCircle, X } from 'lucide-react'
import ReactMarkdown from "react-markdown"
import { useState, useEffect } from 'react'
import api from '../../api'
import useTypingEffect from '../hooks/TypingEffect'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { detectLanguage } from '../utils/LanguageMap'
import ignoredExtensions from '../utils/IgnoredExtensions.json'

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
  const [language, setLanguage] = useState('text');

  const purposeText = selectedFile
    ? `This file contains ${selectedFile.name} with important logic for the application.`
    : 'Select a file from the 3D File Map to see its purpose and details.';

  const { displayedText: typedPurpose, isFinished: isPurposeFinished } = useTypingEffect(purposeText, 1, 100);

  // Let's use useEffect to get the file data from the backend using lazy fetch 
  useEffect(() => {
    let active = true;
    setContents('');
    if (selectedFile && selectedFile.path) {
      setLanguage(detectLanguage(selectedFile.path));
    } else {
      setLanguage('text');
    }
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

  function checkBinary(file) {
    if (!file) return false;
    const pathOrName = typeof file === 'string' ? file : (file.path || file.name || '');
    if (!pathOrName.includes('.')) return false;
    const ext = '.' + pathOrName.split('.').pop().toLowerCase().trim();
    return Array.isArray(ignoredExtensions) && ignoredExtensions.includes(ext);
  }

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
            {/*
            <div className="p-4 mx-4 mt-4 bg-dev-bg-surface/40 border border-dev-border border-l-2 border-l-dev-orange backdrop-blur rounded-xl shadow-lg relative overflow-hidden animate-fadeIn" key={selectedFile?.path || 'initial'}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-dev-orange flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-sm font-semibold text-dev-text-primary">File Purpose:</p>
                  <p className="text-sm text-dev-text-secondary font-mono mt-1">
                    {typedPurpose}
                    {!isPurposeFinished && (
                      <span className="inline-block w-[2px] h-[1.1em] bg-dev-orange align-middle animate-blink ml-0.5" />
                    )}
                  </p>
                </div>
              </div>
            </div>
            */}

            {/* Code Block */}
            <div className="flex-1 p-4 overflow-auto no-scrollbar min-w-0 flex flex-col">
              <div className="animate-fadeIn flex-1 flex flex-col" key={selectedFile?.path || 'sample'}>
                {checkBinary(selectedFile) ? (
                  <div>
                    <span className="text-red-700 font-mono">Can't open a binary file in editor.</span>
                  </div>
                ) : contents ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={language}
                    showLineNumbers={true}
                    wrapLines={false}
                    wrapLongLines={false}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: '#121418', // dev-bg-surface
                      fontSize: '0.875rem',
                      lineHeight: '1.625',
                      borderRadius: '0.5rem',
                      border: '1px solid #22272E',
                      fontFamily: 'inherit',
                      flex: 1,
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily: 'inherit',
                      }
                    }}
                  >
                    {contents}
                  </SyntaxHighlighter>
                ) : (
                  <div className="font-mono text-dev-emerald">
                    Working<span className="inline-block animate-dot1 mt-1">.</span>
                    <span className="inline-block animate-dot2 mt-1">.</span>
                    <span className="inline-block animate-dot3 mt-1">.</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "summary" && (
          <div className="flex-1 p-4 overflow-auto">
            <div className="bg-dev-bg-surface/40 border border-dev-border backdrop-blur rounded-xl p-6 shadow-2xl prose prose-invert max-w-none animate-fadeIn">
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
        )}
      </div>
    </div>
  )
}
