"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";
import { 
  Search, RefreshCw, GitBranch, Calendar, Database, 
  Sparkles, AlertCircle, Star, GitFork, User, ExternalLink
} from "lucide-react";

// --- Types (Updated with Metadata) ---
type GitHubData = {
  name: string;
  full_name: string;
  github_url: string;
  github_created_at?: string;
  db_added_at?: string;
  owner_name?: string;
  stars_count?: number;
  forks_count?: number;
  language?: string;
};

type AnalyzeResponse = {
  repo_details: GitHubData;
  ai_analysis: string;
  refreshed?: boolean;
};

export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const [repoUrl, setRepoUrl] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [guestId, setGuestId] = useState("");

  useEffect(() => {
    const storedId = window.localStorage.getItem("git-smart-guest-id");
    const nextId = storedId || crypto.randomUUID?.() || `guest-${Date.now()}`;
    window.localStorage.setItem("git-smart-guest-id", nextId);
    setGuestId(nextId);
  }, []);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) return setErrorMessage("Please provide a GitHub URL.");
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/repos/analyze_new_repo/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl, guest_id: guestId, refresh }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 text-slate-900 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12 space-y-10">
        
        {/* --- Header --- */}
        <nav className="flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">GitSmart<span className="text-indigo-500">.ai</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 text-indigo-700 px-4 py-2 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Pure bright workflow
            </span>
          </div>
        </nav>

        {/* --- Hero --- */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
            Analyze Code <br/> 
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              With Intelligence.
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
            Enter a repository URL to extract deep architectural insights, project health metrics, and automated growth roadmaps.
          </p>
        </section>

        {/* --- Search Box (Responsive) --- */}
        <div className="relative max-w-4xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center px-4 gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent focus-within:border-indigo-500/50 transition-all">
                <GitBranch className="text-indigo-500 shrink-0" size={20} />
                <input 
                  type="text"
                  placeholder="https://github.com/owner/repository"
                  className="w-full bg-transparent outline-none py-4 text-sm md:text-base font-medium"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Refresh</span>
                  <button 
                    onClick={() => setRefresh(!refresh)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${refresh ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${refresh ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all active:scale-95"
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                  <span>{loading ? "Processing..." : "Analyze"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Results Section --- */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto flex items-center gap-3 p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 animate-shake">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Metadata Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Database size={120} />
              </div>
              
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-8">Metadata Explorer</h3>
              
              {!analysis ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-6 relative">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-3 mb-1">
                      <User size={14} className="text-indigo-400" />
                      <span className="text-[10px] font-bold uppercase text-slate-400">Main Architect</span>
                    </div>
                    {/* No more hardcoded names! */}
                    <p className="font-bold text-lg truncate">
                      {analysis.repo_details.owner_name ? `@${analysis.repo_details.owner_name}` : "Unknown Author"}
                    </p>
                    {analysis.repo_details.full_name && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Repository: <span className="font-semibold">{analysis.repo_details.full_name}</span>
                      </p>
                    )}
                    {analysis.repo_details.language && (
                      <span className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                        {analysis.repo_details.language}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-center">
                      <Star size={16} className="text-yellow-500 mx-auto mb-1" />
                      <p className="text-xl font-black">{analysis.repo_details.stars_count?.toLocaleString() ?? 0}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Stars</p>
                    </div>
                    <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 text-center">
                      <GitFork size={16} className="text-cyan-500 mx-auto mb-1" />
                      <p className="text-xl font-black">{analysis.repo_details.forks_count?.toLocaleString() ?? 0}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Forks</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-2"><Calendar size={14}/> Born</span>
                      <span className="font-semibold">{analysis.repo_details.github_created_at ? formatDistanceToNow(new Date(analysis.repo_details.github_created_at), { addSuffix: true }) : "Unknown"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-2"><Database size={14}/> Indexed</span>
                      <span className="font-semibold text-indigo-500">{analysis.repo_details.db_added_at ? formatDistanceToNow(new Date(analysis.repo_details.db_added_at), { addSuffix: true }) : "Live"}</span>
                    </div>
                  </div>

                  <a 
                    href={analysis.repo_details.github_url} 
                    target="_blank" 
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                  >
                    View Source <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* AI Content (8 cols) */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-xl overflow-hidden min-h-[500px]">
              <div className="bg-slate-50 dark:bg-slate-800/30 px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest">Intelligence Report</span>
                </div>
                {analysis && (
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${analysis.refreshed ? 'bg-green-500/10 text-green-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                    {analysis.refreshed ? "⚡ Real-time" : "💾 System Cache"}
                  </div>
                )}
              </div>
              
              <div className="p-8 md:p-12">
                {loading ? (
                  <div className="space-y-6">
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/3 animate-pulse" />
                    <div className="space-y-3">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className={`h-4 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse`} style={{ width: `${100 - (i * 5)}%` }} />
                      ))}
                    </div>
                  </div>
                ) : analysis ? (
                  <article className="prose prose-slate dark:prose-invert max-w-none 
                    prose-headings:font-black prose-headings:tracking-tight 
                    prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
                    prose-strong:text-indigo-500 dark:prose-strong:text-indigo-400">
                    <ReactMarkdown>{analysis.ai_analysis}</ReactMarkdown>
                  </article>
                ) : (
                  <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full">
                      <Sparkles size={40} className="text-indigo-500/20" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-400">Awaiting Signal...</h4>
                      <p className="text-sm text-slate-500">Input a URL above to initialize the AI engine.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* --- Footer --- */}
        <footer className="text-center space-y-2 py-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Developer Ecosystem</p>
          <p className="text-sm font-medium text-slate-500 italic">
            Engineered by <span className="text-indigo-500 not-italic font-bold">Abuzar Ali</span> in Lahore, PK
          </p>
        </footer>
      </div>
    </div>
  );
}