import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-vintage-cream vintage-border border-b-2 border-vintage-charcoal sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-serif text-3xl font-bold text-vintage-charcoal hover:text-vintage-amber transition-colors">
          GitBreakdown
        </Link>

        {/* Nav Items */}
        <nav className="flex items-center gap-8">
          <a href="#features" className="text-vintage-charcoal hover:text-vintage-amber transition-colors font-medium">
            Features
          </a>
          <a href="#docs" className="text-vintage-charcoal hover:text-vintage-amber transition-colors font-medium">
            Docs
          </a>
          <a href="#about" className="text-vintage-charcoal hover:text-vintage-amber transition-colors font-medium">
            About
          </a>

          {/* Launch Button */}
          <Link
            to="/dashboard"
            className="px-6 py-2 bg-vintage-yellow text-vintage-charcoal font-bold rounded-full hover:bg-vintage-amber transition-colors"
          >
            Launch App
          </Link>
        </nav>
      </div>
    </header>
  )
}
