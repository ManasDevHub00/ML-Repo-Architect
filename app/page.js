"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Copy, 
  Check, 
  Upload, 
  FileCode, 
  Trash2, 
  Loader2, 
  GitBranch, 
  Save, 
  ShieldAlert, 
  Sparkles, 
  Terminal, 
  FileText,
  Clock,
  Layers,
  ArrowRight,
  RefreshCw
} from "lucide-react";

// Custom CodeBlock component with hover copy button
const CodeBlock = ({ className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 group">
      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 bg-slate-900/95 border border-slate-700 hover:border-emerald-500/50 p-1.5 rounded-lg text-[10px] font-mono text-slate-300 hover:text-emerald-400 transition-all backdrop-blur cursor-pointer"
          title="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      {language && (
        <div className="absolute -top-3 left-3 bg-slate-900 border border-slate-800 text-[10px] px-2 py-0.5 rounded font-mono text-slate-400 uppercase tracking-wider">
          {language}
        </div>
      )}
      <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 pt-6 overflow-x-auto text-xs font-mono text-emerald-400 shadow-inner">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
};

// Markdown elements custom styling mapping for high-fidelity rendering
const MarkdownComponents = {
  h1: ({ children }) => <h1 className="text-2xl font-extrabold text-emerald-400 mt-6 mb-4 border-b border-slate-800 pb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-slate-100 mt-6 mb-3 flex items-center gap-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-emerald-300 mt-4 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-slate-300 leading-relaxed mb-4 text-sm">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-slate-300 space-y-1.5 text-sm">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-slate-300 space-y-1.5 text-sm">{children}</ol>,
  li: ({ children }) => <li className="text-slate-300">{children}</li>,
  code: ({ inline, className, children, ...props }) => {
    return !inline ? (
      <CodeBlock className={className} {...props}>
        {children}
      </CodeBlock>
    ) : (
      <code className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-xs font-mono text-emerald-400" {...props}>
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 border border-slate-800 rounded-xl">
      <table className="min-w-full divide-y divide-slate-800 text-left">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-900/50">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-slate-800 bg-slate-950/20">{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => <th className="px-4 py-3 text-xs font-bold text-slate-300 uppercase tracking-wider">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3 text-xs text-slate-400 font-mono">{children}</td>,
  blockquote: ({ children }) => <blockquote className="border-l-4 border-emerald-500 bg-emerald-950/10 px-4 py-2.5 my-4 rounded-r-lg text-slate-300 italic text-xs">{children}</blockquote>,
};

export default function Home() {
  const [githubUrl, setGithubUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [bigO, setBigO] = useState([]);
  const [logs, setLogs] = useState([]);
  const [savedPath, setSavedPath] = useState("");
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState("preview"); // "preview" or "raw"
  
  // Loading dynamic text rotation helper
  const [activeLoadingMessage, setActiveLoadingMessage] = useState("Agent is initializing...");

  useEffect(() => {
    if (!loading) return;
    const messages = [
      "Agent is starting up...",
      "Reading local repository source files...",
      "Analysing functions and loops...",
      "Evaluating Big-O time and space complexity...",
      "Spawning custom GitHub MCP server...",
      "Fetching repository directory layout...",
      "Structuring markdown documentation layout...",
      "Generating flawless README.md output...",
      "Spawning local Filesystem MCP server...",
      "Writing README.md file to project workspace root...",
      "Refining and finalizing documents..."
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setActiveLoadingMessage(messages[idx]);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  const onDrop = useCallback((acceptedFiles) => {
    setError("");
    acceptedFiles.forEach((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext !== "py" && ext !== "java") {
        setError("Unsupported file format. Only Python (.py) and Java (.java) files are accepted.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result;
        setFiles((prev) => {
          if (prev.some((f) => f.name === file.name)) return prev;
          return [...prev, { name: file.name, content, size: file.size }];
        });
      };
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".py", ".java"]
    }
  });

  const removeFile = (name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const loadLocalReadme = async () => {
    try {
      const response = await fetch("/api/readme");
      const data = await response.json();
      if (response.ok) {
        if (data.exists) {
          setMarkdownOutput(data.content);
          setSavedPath(data.filePath || "README.md");
          setError("");
        } else {
          setError("No existing README.md found on local disk.");
        }
      } else {
        setError(data.error || "Failed to read local README.md.");
      }
    } catch (err) {
      setError("Error connecting to local server: " + err.message);
    }
  };

  useEffect(() => {
    loadLocalReadme();
  }, []);

  const handleGenerate = async () => {
    if (files.length === 0 && !githubUrl) {
      setError("Please paste a GitHub Repository URL or upload code files to document.");
      return;
    }

    setLoading(true);
    setError("");
    setMarkdownOutput("");
    setBigO([]);
    setLogs([]);
    setSavedPath("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubUrl,
          files: files.map(f => ({ name: f.name, content: f.content }))
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Execution failed.");
      }

      setMarkdownOutput(data.markdown);
      setBigO(data.bigO || []);
      setLogs(data.logs || []);
      setSavedPath(data.savedPath || "");
    } catch (err) {
      setError(err.message || "An unexpected error occurred during agent processing.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!markdownOutput) return;
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-emerald-500/25 selection:text-emerald-400">
      
      {/* Premium Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/85 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <span className="font-mono text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            ML Repo Architect
          </span>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 backdrop-blur text-xs font-mono font-medium text-emerald-400 shadow-md">
          Dev: 24EBKCS045_MANAS
        </div>
      </header>

      {/* Main Split-Screen Panel */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        
        {/* Left Column - Inputs */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Action Input Card */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              Configure Inputs
            </h2>

            {/* GitHub Repo Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Paste GitHub Repository URL (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all font-mono"
                />
                <GitBranch className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
              </div>
            </div>

            {/* Drag & Drop Code Files */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Upload Source Code (.py, .java)
              </label>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                  isDragActive 
                    ? "border-emerald-400 bg-emerald-500/5 shadow-inner shadow-emerald-500/5" 
                    : "border-slate-700 hover:border-emerald-500/50 bg-slate-950/30 hover:bg-slate-950/50"
                }`}
              >
                <input {...getInputProps()} />
                <div className={`p-3 rounded-full ${isDragActive ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800/80 text-slate-400"} transition-all`}>
                  <Upload className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-300">
                    Drag & drop files here, or <span className="text-emerald-400 underline">browse</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    Accepts: .py (Python) & .java (Java)
                  </p>
                </div>
              </div>
            </div>

            {/* List of uploaded files */}
            {files.length > 0 && (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 border border-slate-800/55 rounded-xl p-3 bg-slate-950/40">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1">
                  Queue Files ({files.length})
                </p>
                <div className="flex flex-col gap-2">
                  {files.map((file) => (
                    <div 
                      key={file.name} 
                      className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-lg p-2 px-3 text-xs"
                    >
                      <div className="flex items-center gap-2 text-slate-300">
                        <FileCode className="h-4 w-4 text-emerald-400" />
                        <span className="font-mono truncate max-w-[180px]">{file.name}</span>
                        <span className="text-[10px] text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        onClick={() => removeFile(file.name)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error alerts */}
            {error && (
              <div className="flex items-start gap-2 bg-red-950/20 border border-red-800/40 text-red-400 p-3 rounded-xl text-xs font-mono leading-relaxed">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Process Execution Trigger Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3 font-mono tracking-wide mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{activeLoadingMessage}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Analyze Code & Generate README</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Agent Process Trace log */}
          {(loading || logs.length > 0) && (
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2 border-b border-slate-800 pb-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                Agent Execution Trace Log
              </h3>
              
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 text-xs font-mono scrollbar-thin">
                {logs.map((log, index) => (
                  <div key={index} className="flex gap-3 text-slate-300">
                    <span className="text-emerald-500 font-bold shrink-0">[{log.step}]</span>
                    <span className="text-slate-400">{log.message}</span>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex gap-3 text-slate-400 animate-pulse">
                    <span className="text-emerald-500 font-bold shrink-0">[*]</span>
                    <span>{activeLoadingMessage}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Display compiled Big-O details if returned */}
          {bigO.length > 0 && (
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2 border-b border-slate-800 pb-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                Complexity Analysis (Big-O)
              </h3>
              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {bigO.map((item, idx) => (
                  <div key={idx} className="bg-slate-950/50 border border-slate-800/80 p-3 rounded-xl text-xs font-mono">
                    <div className="font-bold text-slate-200 truncate mb-1.5">{item.fileName}</div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-slate-500">Time:</span>
                      <span className="text-emerald-400 font-bold">{item.timeComplexity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Space:</span>
                      <span className="text-emerald-400 font-bold">{item.spaceComplexity}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic leading-relaxed border-t border-slate-800/40 pt-1.5 mt-1.5">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right Column - Outputs */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Markdown Content Card */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col h-[calc(100vh-7rem)] min-h-[650px] relative transition-all">
            
            {/* Header / Operations toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white font-mono">
                  Agent Output (README.md)
                </h2>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Sync Local Disk Button */}
                <button
                  onClick={loadLocalReadme}
                  className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 hover:border-emerald-500 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-emerald-400 transition-all active:scale-[0.98] cursor-pointer"
                  title="Load README.md from local disk"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Sync Local Disk</span>
                </button>

                {markdownOutput && (
                  <>
                    {/* Preview / Raw Toggle */}
                    <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
                      <button
                        onClick={() => setViewMode("preview")}
                        className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          viewMode === "preview"
                            ? "bg-slate-800 text-emerald-400 border border-slate-700/50 shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setViewMode("raw")}
                        className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          viewMode === "raw"
                            ? "bg-slate-800 text-emerald-400 border border-slate-700/50 shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Raw
                      </button>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 hover:border-emerald-500 px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-emerald-400 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Clipboard</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Dynamic Local Save Path alert banner */}
            {savedPath && (
              <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-mono flex items-center justify-between gap-2 animate-fadeIn animate-duration-300">
                <div className="flex items-center gap-2">
                  <Save className="h-4.5 w-4.5" />
                  <span>Autonomously saved to disk via Local Filesystem MCP:</span>
                </div>
                <span className="bg-emerald-950/50 px-2 py-0.5 rounded text-[10px] truncate max-w-xs border border-emerald-800/40 font-bold">
                  {savedPath.split(/[\\\/]/).pop()}
                </span>
              </div>
            )}

            {/* Main markdown scroll viewer */}
            <div className="flex-1 overflow-y-auto bg-slate-950/40 border border-slate-850 rounded-2xl p-6 font-sans scrollbar-thin flex flex-col">
              {markdownOutput ? (
                viewMode === "preview" ? (
                  <div className="prose prose-invert prose-emerald max-w-none flex-1">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={MarkdownComponents}
                    >
                      {markdownOutput}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex-1 h-full w-full">
                    <textarea
                      readOnly
                      value={markdownOutput}
                      className="w-full h-full min-h-[450px] bg-transparent border-0 resize-none font-mono text-xs text-slate-300 focus:ring-0 focus:outline-none leading-relaxed outline-none"
                    />
                  </div>
                )
              ) : (
                <div className="h-full flex-1 flex flex-col items-center justify-center gap-4 text-slate-500 text-center py-12">
                  {loading ? (
                    <>
                      <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-slate-400">Agent Running reasoning loops...</p>
                        <p className="text-xs text-slate-500 max-w-xs">{activeLoadingMessage}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl text-slate-400">
                        <Terminal className="h-10 w-10 text-slate-500" />
                      </div>
                      <div className="flex flex-col gap-1 max-w-md px-4">
                        <p className="text-sm font-bold text-slate-400">Agent System is Idle</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Paste a repository URL or upload python/java code files in the configurations tab on the left, then click analyze to generate your project documentation.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
