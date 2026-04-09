"use client";

import { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";
import { 
  Search, 
  RefreshCw, 
  GitBranch, 
  Calendar, 
  Database, 
  Sparkles, 
  Moon, 
  Sun,
  AlertCircle
} from "lucide-react";

// --- Types ---
type GitHubData = {
  name: string;
  full_name: string;
  github_url: string;
  github_created_at?: string;
  db_added_at?: string;
};

type AnalyzeResponse = {
  repo_details: GitHubData;
  ai_analysis: string;
  refreshed?: boolean;
};

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [guestId, setGuestId] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // --- Logic ---
  useEffect(() => {
    const storedId = window.localStorage.getItem("git-smart-guest-id");
    const nextId = storedId || crypto.randomUUID?.() || `guest-${Date.now()}`;
    window.localStorage.setItem("git-smart-guest-id", nextId);
    setGuestId(nextId);
    
    // Check system preference for theme
    const savedTheme = window.localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) return setErrorMessage("Please provide a GitHub URL.");
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/repos/analyze_new_repo/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl, guest_id: guestId, refresh }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- Navigation / Header --- */}
        <nav className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">GitSmart<span className="text-blue-500">.ai</span></span>
          </div>
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        {/* --- Hero Section --- */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Uncover the story behind the code.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Paste a GitHub URL and let our AI analyze project health, tech stack, and future potential in seconds.
          </p>
        </div>

        {/* --- Search Box --- */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 flex flex-col md:flex-row gap-2 shadow-xl">
            <div className="flex-1 flex items-center px-4 gap-3">
              <GitBranch className="text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="https://github.com/owner/repository"
                className="w-full bg-transparent outline-none py-3"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 px-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-2 md:pt-0">
              <div className="flex items-center gap-2 mr-4 ml-2">
                <span className="text-xs font-medium text-slate-400">Refresh AI?</span>
                <input 
                  type="checkbox" 
                  checked={refresh} 
                  onChange={() => setRefresh(!refresh)}
                  className="w-4 h-4 accent-blue-600"
                />
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </div>
        </div>

        {/* --- Error Handling --- */}
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Repo Stats Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-500 mb-6 flex items-center gap-2">
                <Database size={16} /> Repository Metadata
              </h3>
              
              {!analysis ? (
                <div className="text-slate-400 text-sm italic">Analyze a repo to see details...</div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Project Name</p>
                    <p className="font-bold text-lg">{analysis.repo_details.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-blue-500" />
                    <div>
                      <p className="text-xs text-slate-400">Created on GitHub</p>
                      <p className="text-sm font-medium">
                        {analysis.repo_details.github_created_at 
                          ? formatDistanceToNow(new Date(analysis.repo_details.github_created_at), { addSuffix: true })
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Database size={18} className="text-cyan-500" />
                    <div>
                      <p className="text-xs text-slate-400">Captured in System</p>
                      <p className="text-sm font-medium">
                        {analysis.repo_details.db_added_at 
                          ? formatDistanceToNow(new Date(analysis.repo_details.db_added_at), { addSuffix: true })
                          : "Just now"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: AI Analysis Report */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm min-h-[400px] overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-sm font-bold flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-500" /> AI INSIGHTS
                </span>
                {analysis && (
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${analysis.refreshed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {analysis.refreshed ? "Live Analysis" : "From Cache"}
                  </span>
                )}
              </div>
              
              <div className="p-6 md:p-8">
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                  </div>
                ) : analysis ? (
                  <article className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                    <ReactMarkdown>{analysis.ai_analysis}</ReactMarkdown>
                  </article>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Sparkles size={48} className="mb-4 opacity-10" />
                    <p>Enter a repository URL to generate intelligence report</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* --- Footer --- */}
        <footer className="text-center text-slate-400 text-sm pt-8 border-t border-slate-100 dark:border-slate-800">
          Built by <span className="text-blue-500 font-medium">Abuzar Ali</span> • Powered by Gemini Flash 2.0 & Django REST
        </footer>
      </div>
    </div>
  );
}