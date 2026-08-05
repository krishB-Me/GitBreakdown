
export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dev-bg-darkest/70 backdrop-blur-md">
            <div className="w-full max-w-sm mx-auto p-8 flex flex-col items-center justify-center bg-dev-bg-surface dev-glass-card border border-dev-border rounded-xl shadow-2xl">
                {/* Spinner */}
                <div className="w-12 h-12 border-4 rounded-full animate-spinner mb-6" />

                {/* Loading Message */}
                <h3 className="font-mono text-sm font-bold text-dev-text-primary uppercase tracking-wider mb-2">
                    Deconstructing Repository
                </h3>
                <p className="font-sans text-xs text-dev-text-secondary text-center leading-relaxed">
                    Analyzing code structure and resolving dependencies. This may take a few moments.
                </p>
            </div>
        </div>
    )
}