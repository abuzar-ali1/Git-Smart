import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, GitBranch, ChevronRight } from "lucide-react";

interface SearchBoxProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  refresh: boolean;
  setRefresh: (val: boolean) => void;
  loading: boolean;
  onAnalyze: () => void;
}

const EXAMPLE_REPOS = [
  { name: "React", url: "https://github.com/facebook/react" },
  { name: "Next.js", url: "https://github.com/vercel/next.js" },
  { name: "Django", url: "https://github.com/django/django" },
  { name: "FastAPI", url: "https://github.com/fastapi/fastapi" },
];

export default function SearchBox({ repoUrl, setRepoUrl, refresh, setRefresh, loading, onAnalyze }: SearchBoxProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="relative max-w-4xl mx-auto group z-50"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
      
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Input Wrapper with Dropdown Logic */}
          <div 
            ref={wrapperRef} 
            className="flex-1 relative flex items-center px-4 gap-3 bg-slate-800/50 rounded-xl border border-transparent focus-within:border-indigo-500/50 transition-all"
          >
            <GitBranch className="text-indigo-500 shrink-0" size={20} />
            <input
              type="text"
              placeholder="https://github.com/owner/repository"
              className="w-full bg-transparent outline-none py-4 text-sm md:text-base font-medium placeholder-slate-500 text-slate-100"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowSuggestions(false);
                  onAnalyze();
                }
              }}
            />

            {/* The Animated Dropdown Menu */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[110%] left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Quick Test Repositories
                    </div>
                    {EXAMPLE_REPOS.map((repo) => (
                      <button
                        key={repo.name}
                        onClick={() => {
                          setRepoUrl(repo.url);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-3 rounded-lg hover:bg-slate-700/50 transition-colors flex items-center justify-between group/btn"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-200 group-hover/btn:text-indigo-400 transition-colors">
                            {repo.name}
                          </span>
                          <span className="text-xs text-slate-500 truncate mt-0.5">
                            {repo.url}
                          </span>
                        </div>
                        <ChevronRight size={16} className="text-slate-600 group-hover/btn:text-indigo-400 transform group-hover/btn:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between md:justify-end gap-4 px-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
                Refresh
              </span>
              <button
                onClick={() => setRefresh(!refresh)}
                className={`w-10 h-5 rounded-full relative transition-colors ${refresh ? "bg-indigo-600" : "bg-slate-700"}`}
              >
                <motion.div
                  layout
                  className="absolute top-1 w-3 h-3 bg-white rounded-full"
                  style={{ left: refresh ? "calc(100% - 16px)" : "4px" }}
                />
              </button>
            </div>
            <button
              onClick={() => {
                setShowSuggestions(false);
                onAnalyze();
              }}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
              <span>{loading ? "Processing..." : "Analyze"}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}