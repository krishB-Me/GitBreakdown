# Exact extension matches (Set for O(1) hash lookup)
IGNORED_EXTENSIONS = {
    # Images & Icons
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.avif', '.bmp', '.tiff',
    
    # Fonts
    '.ttf', '.otf', '.woff', '.woff2', '.eot',
    
    # Audio & Video
    '.mp3', '.mp4', '.wav', '.webm', '.ogg', '.mov', '.avi',
    
    # Compiled Binaries / Executables / WebAssembly
    '.exe', '.dll', '.so', '.dylib', '.bin', '.wasm', '.class', '.pyc', '.pyo', '.o', '.a',
    
    # Archives & Compressed Files
    '.zip', '.tar', '.gz', '.7z', '.rar', '.tgz',
    
    # Source Maps, Logs, & DB dumps
    '.map', '.log', '.sqlite', '.db', '.sql', '.sqlite3',
    
    # Lock files (they contain thousands of dependency versions, not architecture)
    '.lock', '-lock.json', '.lockb'
}

# Directory substrings (Tuple for Python string methods like .startswith / in)
IGNORED_DIRECTORIES = (
    # Node / JavaScript
    'node_modules/', '.next/', '.nuxt/', '.svelte-kit/', '.output/', '.out/', 'build/', 'dist/',
    
    # Python
    '__pycache__/', '.venv/', 'venv/', 'env/', '.pytest_cache/', '.mypy_cache/', '.eggs/', '*.egg-info/',
    
    # Git & IDEs
    '.git/', '.github/', '.vscode/', '.idea/', '.husky/',
    
    # Mobile & Native Apps
    'ios/Pods/', 'android/.gradle/', 'ios/build/', 'android/app/build/',
    
    # Coverage & Testing
    'coverage/', '.nyc_output/', '.playwright/',
    
    # Docker / Terraform / Deployment
    '.terraform/', '.serverless/'
)

# Ranked manifest targets per ecosystem
MANIFEST_TARGETS = [
    # JavaScript / Node.js
    "package.json",
    
    # Python (Modern standards first)
    "pyproject.toml",
    "requirements.txt",
    "Pipfile",
    "setup.py",
    
    # Rust
    "Cargo.toml",
    
    # Go
    "go.mod",
    
    # Ruby
    "Gemfile",
    
    # Java / Kotlin
    "pom.xml",
    "build.gradle",
    "build.gradle.kts"
]

README_TARGETS = (
    "README.md",
    "readme.md",
    "Readme.md",
    "README.markdown",
    "README.rst",
    "README.txt",
    "docs/README.md",
    ".github/README.md"
)