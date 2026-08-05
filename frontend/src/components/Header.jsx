import { Link } from 'react-router-dom'

export default function Header({ onNavigate }) {
  // TODO: Define navigation props or handlers if custom routing is implemented

  return (
    <header className="bg-[#0a0b0d] border-b border-dev-border sticky top-0 z-50 animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-mono text-2xl font-bold text-dev-text-primary hover:text-dev-orange transition-colors"
        >
          GitBreakdown
        </Link>

        {/* Nav Items */}
        <nav className="flex items-center gap-8">
          <a
            href="#features"
            className="text-dev-text-secondary hover:text-dev-orange transition-colors font-medium"
          >
            Features
          </a>
          <a
            href="#docs"
            className="text-dev-text-secondary hover:text-dev-orange transition-colors font-medium"
          >
            Docs
          </a>
          <a
            href="#about"
            className="text-dev-text-secondary hover:text-dev-orange transition-colors font-medium"
          >
            About
          </a>

          <Link
            to="/dashboard"
            className="px-6 py-2 bg-dev-orange font-extrabold text-white rounded-full hover:bg-dev-orange-hover transition-colors"
          >
            Launch App
          </Link>
        </nav>
      </div>
    </header>
  )
}
