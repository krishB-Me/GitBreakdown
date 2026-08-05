import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GitBranch, Code2, MessageSquare } from 'lucide-react'
import api from "../../api.js"
import Header from '../components/Header'
import useTypingEffect from '../hooks/TypingEffect'
import useInView from '../hooks/useInView'

const CODE_ART_LINES = [
  [
    { text: 'const', type: 'orange' },
    { text: ' codebase = ', type: 'secondary' },
    { text: 'import', type: 'cyan' },
    { text: '(', type: 'secondary' },
    { text: '"your-repository"', type: 'emerald' },
    { text: ');', type: 'secondary' }
  ],
  [
    { text: 'const', type: 'orange' },
    { text: ' { structure, logic, insights } = ', type: 'secondary' },
    { text: 'deconstruct', type: 'cyan' },
    { text: '(codebase);', type: 'secondary' }
  ],
  [
    { text: 'return', type: 'cyan' },
    { text: ' ', type: 'primary' },
    { text: 'visualize', type: 'orange-bold' },
    { text: '(structure); ', type: 'primary' },
    { text: '// Ready.', type: 'dim' }
  ]
];

const TOKEN_STYLES = {
  orange: 'text-dev-orange',
  secondary: 'text-dev-text-secondary',
  cyan: 'text-dev-cyan',
  emerald: 'text-dev-emerald',
  primary: 'text-dev-text-primary',
  'orange-bold': 'text-dev-orange font-bold',
  dim: 'text-dev-text-dim'
};

const CODE_ART_FULL_TEXT = CODE_ART_LINES.map(line => line.map(t => t.text).join('')).join('\n');

export default function HomePage({loading, setLoading}) {
  const [repoUrl, setRepoUrl] = useState('');
  const navigate = useNavigate();
  const { displayedText, isFinished } = useTypingEffect(CODE_ART_FULL_TEXT, 50, 200);

  const [panelRef, panelInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [card1Ref, card1InView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [card2Ref, card2InView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [card3Ref, card3InView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) return;

    // sending the request to the backend
    try {
      console.log("Analyzing");
      setLoading(true);
      const response = await api.post("/analyze",
        { url: repoUrl }
      )
      const treeStructure = response.data.tree
      const summary = response.data.summary
      setLoading(false);
      navigate('/dashboard', { state: { repoUrl, treeStructure, summary } });
    } catch (error) {
      setLoading(false);
      console.error("There was an error processing repo: ", error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.nativeEvent?.isComposing) {
      handleAnalyze();
    }
  }

  return (
    <div className="min-h-screen bg-dev-bg-darkest text-dev-text-primary bg-dots-pattern">
      <Header />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        {/* Headline */}
        <div className="text-center mb-12 select-none">
          {/* Stylized Logo Title */}
          <h1 className="font-mono text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-widest uppercase mb-4 animate-fadeIn">
            <span className="bg-gradient-to-r from-dev-text-primary via-dev-text-primary to-dev-orange bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(255,107,0,0.15)]">
              GitBreakdown
            </span>
          </h1>

          {/* AI / Tech Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-dev-orange/20 bg-dev-orange/5 text-xs font-mono text-dev-orange mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-dev-orange animate-pulse" />
            v1.0.0 // REPO_DECONSTRUCT_ENGINE
          </div>

          <h2 className="font-mono text-3xl md:text-4xl font-bold text-dev-text-primary mb-6 text-balance">
            Open the hood and see
            <span className="block text-dev-orange mt-1">your App Deconstructed.</span>
          </h2>
          <p className="text-lg text-dev-text-secondary max-w-2xl mx-auto font-sans leading-relaxed">
            Explore repository layouts, understand file dependencies, and converse with an AI companion.
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
              onKeyDown={handleKeyPress}
              className="flex-1 px-5 py-4 bg-dev-bg-base border border-dev-border rounded-lg text-dev-text-primary placeholder:text-dev-text-dim focus:outline-none focus:border-dev-orange focus:ring-1 focus:ring-dev-orange text-base font-mono"
            />
            <button
              onClick={handleAnalyze}
              className="px-8 py-4 bg-dev-orange text-white font-bold rounded-lg hover:bg-dev-orange-hover transition-colors whitespace-nowrap shadow-lg hover:shadow-dev-orange/20"
            >
              Analyze Repository
            </button>
          </div>
        </div>

        {/* Code Art Panel */}
        <div
          ref={panelRef}
          className={`font-mono text-dev-text-primary text-sm sm:text-base md:text-lg mb-16 leading-relaxed max-w-2xl mx-auto border border-dev-border bg-dev-bg-surface/40 rounded-xl p-5 text-left select-none relative overflow-hidden shadow-2xl transition-all duration-700
            ${panelInView ? 'animate-fadeIn opacity-100' : 'opacity-0'}`}
        >
          <div className="flex items-center justify-between border-b border-dev-border/40 pb-3 mb-4 text-xs text-dev-text-dim uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-dev-orange animate-pulse" />
              <span>AST_DECONSTRUCT_ENGINE.LOG</span>
            </div>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-dev-border-active/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-dev-border-active/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-dev-border-active/40" />
            </div>
          </div>
          <div className="space-y-2 pl-3 border-l-2 border-dev-orange/50 min-h-[5.5rem] sm:min-h-[6.5rem]">
            {(() => {
              let runningCharCount = 0;
              const currentLength = displayedText.length;

              return CODE_ART_LINES.map((lineTokens, lineIdx) => {
                const lineStart = runningCharCount;
                const lineTextLength = lineTokens.reduce((acc, t) => acc + t.text.length, 0);
                const lineEnd = lineStart + lineTextLength;

                const renderedTokens = lineTokens.map((token, tokenIdx) => {
                  const tokenStart = runningCharCount;
                  const tokenEnd = tokenStart + token.text.length;
                  runningCharCount += token.text.length;

                  if (currentLength >= tokenEnd) {
                    return (
                      <span key={tokenIdx} className={TOKEN_STYLES[token.type]}>
                        {token.text}
                      </span>
                    );
                  } else if (currentLength >= tokenStart && currentLength < tokenEnd) {
                    const typedPart = token.text.slice(0, currentLength - tokenStart);
                    return (
                      <span key={tokenIdx} className={TOKEN_STYLES[token.type]}>
                        {typedPart}
                        <span className="inline-block w-[2px] h-[1.1em] bg-dev-orange align-middle animate-blink ml-0.5" />
                      </span>
                    );
                  } else {
                    return null;
                  }
                });

                let isCursorAtNewline = false;
                if (lineIdx < CODE_ART_LINES.length - 1) {
                  isCursorAtNewline = currentLength === lineEnd;
                  runningCharCount += 1; // for '\n'
                }

                const isLineVisible = currentLength >= lineStart;
                if (!isLineVisible) return null;

                if (lineIdx < CODE_ART_LINES.length - 1) {
                  return (
                    <p key={lineIdx} className={lineIdx === 2 ? "text-dev-text-primary" : "text-dev-text-secondary"}>
                      {renderedTokens}
                      {isCursorAtNewline && (
                        <span className="inline-block w-[2px] h-[1.1em] bg-dev-orange align-middle animate-blink ml-0.5" />
                      )}
                    </p>
                  );
                }

                const isFinishedAndAtEnd = isFinished && currentLength >= lineEnd;
                return (
                  <p key={lineIdx} className={lineIdx === 2 ? "text-dev-text-primary" : "text-dev-text-secondary"}>
                    {renderedTokens}
                    {isFinishedAndAtEnd && (
                      <span className="inline-block w-[2px] h-[1.1em] bg-dev-orange align-middle animate-blink ml-0.5" />
                    )}
                  </p>
                );
              });
            })()}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* 3D File Tree Card */}
          <div
            ref={card1Ref}
            className={`bg-dev-bg-surface border border-dev-border p-6 rounded-lg hover:border-dev-border-active transition-all hover:bg-dev-bg-hover duration-500
              ${card1InView ? 'animate-fadeIn opacity-100' : 'opacity-0'}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <GitBranch className="w-8 h-8 text-dev-orange" />
              <h3 className="font-mono text-xl font-bold text-dev-text-primary">3D File Tree</h3>
            </div>
            <p className="text-dev-text-secondary text-sm leading-relaxed">
              Visualize your entire repository structure in an interactive 3D canvas. Navigate, explore, and understand your codebase at a glance.
            </p>
          </div>

          {/* AI Code Summaries Card */}
          <div
            ref={card2Ref}
            className={`bg-dev-bg-surface border border-dev-border p-6 rounded-lg hover:border-dev-border-active transition-all hover:bg-dev-bg-hover duration-500
              ${card2InView ? 'animate-fadeIn opacity-100' : 'opacity-0'}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-8 h-8 text-dev-orange" />
              <h3 className="font-mono text-xl font-bold text-dev-text-primary">AI Code Summaries</h3>
            </div>
            <p className="text-dev-text-secondary text-sm leading-relaxed">
              Get intelligent summaries of any file in your repository. Understand purpose, dependencies, and key functions instantly.
            </p>
          </div>

          {/* Interactive Chatbot Card */}
          <div
            ref={card3Ref}
            className={`bg-dev-bg-surface border border-dev-border p-6 rounded-lg hover:border-dev-border-active transition-all hover:bg-dev-bg-hover duration-500
              ${card3InView ? 'animate-fadeIn opacity-100' : 'opacity-0'}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-8 h-8 text-dev-orange" />
              <h3 className="font-mono text-xl font-bold text-dev-text-primary">Interactive Chatbot</h3>
            </div>
            <p className="text-dev-text-secondary text-sm leading-relaxed">
              Ask questions about your code. Our AI companion can explain implementations, suggest improvements, and answer all your queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
