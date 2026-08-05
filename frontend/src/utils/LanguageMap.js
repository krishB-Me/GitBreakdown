/**
 * Comprehensive mapping from file extensions to Prism/Highlight.js language identifiers.
 */
export const EXTENSION_TO_LANGUAGE = {
    // Web & Frontend
    js: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    mts: 'typescript',
    cts: 'typescript',
    tsx: 'tsx',
    html: 'html',
    htm: 'html',
    xhtml: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    styl: 'stylus',
    vue: 'markup',
    svelte: 'markup',
    astro: 'astro',

    // Python
    py: 'python',
    pyw: 'python',
    pyi: 'python',
    ipynb: 'json', // Jupyter Notebooks are JSON structures

    // Systems & C-Family
    c: 'c',
    h: 'c',
    cpp: 'cpp',
    cxx: 'cpp',
    cc: 'cpp',
    hpp: 'cpp',
    hxx: 'cpp',
    cs: 'csharp',
    rs: 'rust',
    go: 'go',
    swift: 'swift',
    kt: 'kotlin',
    kts: 'kotlin',
    java: 'java',
    class: 'java',
    jav: 'java',
    scala: 'scala',
    sc: 'scala',
    d: 'd',
    zig: 'zig',
    nim: 'nim',

    // Scripting & Dynamic Languages
    rb: 'ruby',
    rbw: 'ruby',
    rake: 'ruby',
    php: 'php',
    phtml: 'php',
    php7: 'php',
    pl: 'perl',
    pm: 'perl',
    lua: 'lua',
    r: 'r',
    jl: 'julia',
    dart: 'dart',
    ex: 'elixir',
    exs: 'elixir',
    erl: 'erlang',
    hrl: 'erlang',
    clj: 'clojure',
    cljs: 'clojure',
    hs: 'haskell',
    lhs: 'haskell',
    elm: 'elm',
    ocaml: 'ocaml',
    ml: 'ocaml',
    mli: 'ocaml',
    f: 'fortran',
    f90: 'fortran',
    pas: 'pascal',
    lisp: 'lisp',
    lsp: 'lisp',

    // Shell, Scripts & OS
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
    fish: 'bash',
    bat: 'batch',
    cmd: 'batch',
    ps1: 'powershell',
    psm1: 'powershell',
    vbs: 'visual-basic',
    vb: 'visual-basic',

    // Data Interchange & Configuration
    json: 'json',
    json5: 'json5',
    jsonc: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',
    xml: 'xml',
    svg: 'xml',
    plist: 'xml',
    ini: 'ini',
    env: 'bash',
    properties: 'ini',
    conf: 'ini',
    cfg: 'ini',

    // Markdown & Documentation
    md: 'markdown',
    markdown: 'markdown',
    mdown: 'markdown',
    mdx: 'mdx',
    rst: 'rest',
    tex: 'latex',
    latex: 'latex',

    // Databases & Query Languages
    sql: 'sql',
    pgsql: 'pgsql',
    mysql: 'sql',
    plsql: 'sql',
    graphql: 'graphql',
    gql: 'graphql',
    prisma: 'prisma',

    // Infrastructure, DevOps & Build Tools
    dockerfile: 'dockerfile',
    tf: 'hcl',
    tfvars: 'hcl',
    hcl: 'hcl',
    proto: 'protobuf',
    nix: 'nix',
    cmake: 'cmake',
    make: 'makefile',
    mk: 'makefile',

    // WebAssembly & Low Level
    wasm: 'wasm',
    wat: 'wasm',
    asm: 'asm6502',
    s: 'asm6502',
};

/**
 * Exact filename lookup for common dotfiles and extensionless files.
 */
export const EXACT_FILENAME_MAP = {
    dockerfile: 'dockerfile',
    makefile: 'makefile',
    'cmakelists.txt': 'cmake',
    '.gitignore': 'bash',
    '.npmrc': 'ini',
    '.prettierrc': 'json',
    '.eslintrc': 'json',
    '.babelrc': 'json',
    '.env': 'bash',
    '.env.local': 'bash',
    '.env.production': 'bash',
    '.env.development': 'bash',
    'cargo.toml': 'toml',
    'gemfile': 'ruby',
    'procfile': 'yaml',
};

/**
 * Main function to detect language from filename or path.
 */
export function detectLanguage(filepath) {
    if (!filepath || typeof filepath !== 'string') return 'text';

    // Normalize path separators to support both Windows (\) and Unix (/) paths
    const filename = filepath.replace(/\\/g, '/').split('/').pop().toLowerCase().trim();

    if (EXACT_FILENAME_MAP[filename]) {
        return EXACT_FILENAME_MAP[filename];
    }

    const parts = filename.split('.');
    if (parts.length > 1) {
        const ext = parts.pop();
        if (EXTENSION_TO_LANGUAGE[ext]) {
            return EXTENSION_TO_LANGUAGE[ext];
        }
    }

    return 'text';
}