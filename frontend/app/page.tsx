"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RefreshCw,
  GitBranch,
  Calendar,
  Database,
  Sparkles,
  AlertCircle,
  Star,
  GitFork,
  User,
  ExternalLink,
  Moon,
  Sun,
} from "lucide-react";

// --- Types ---
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
  ai_analysis: any; // Changed to 'any' so TypeScript doesn't complain if an object slips through
  refreshed?: boolean;
};

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const [repoUrl, setRepoUrl] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [guestId, setGuestId] = useState("");

  // Dark mode state
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  // Initialize Theme and Guest ID
  useEffect(() => {
    setMounted(true);
    const storedId = window.localStorage.getItem("git-smart-guest-id");
    const nextId = storedId || crypto.randomUUID?.() || `guest-${Date.now()}`;
    window.localStorage.setItem("git-smart-guest-id", nextId);
    setGuestId(nextId);

    const savedTheme = window.localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  // Apply Theme to Document
  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("theme", theme);
  }, [theme, mounted]);

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
      console.log("FULL BACKEND RESPONSE:", JSON.stringify(data, null, 2));
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  // Prevent hydration mismatch on theme toggle
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 dark:bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12 space-y-10 relative z-10">
        {/* --- Header --- */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              GitSmart<span className="text-indigo-500">.ai</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-2 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-4 py-2 text-xs font-semibold tracking-wide border border-indigo-500/10">
              <Sparkles className="w-3.5 h-3.5" />
              Intelligence Engine Online
            </span>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:ring-2 ring-indigo-500/50 transition-all text-slate-600 dark:text-slate-300"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </motion.nav>

        {/* --- Hero --- */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center space-y-6 pt-8 pb-4"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]"
          >
            Analyze Code <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              With Intelligence.
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed"
          >
            Enter a repository URL to extract deep architectural insights,
            project health metrics, and automated growth roadmaps.
          </motion.p>
        </motion.section>

        {/* --- Search Box (Responsive) --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative max-w-4xl mx-auto group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center px-4 gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent focus-within:border-indigo-500/50 transition-all">
                <GitBranch className="text-indigo-500 shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="https://github.com/owner/repository"
                  className="w-full bg-transparent outline-none py-4 text-sm md:text-base font-medium placeholder-slate-400 dark:placeholder-slate-500"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
                    Refresh
                  </span>
                  <button
                    onClick={() => setRefresh(!refresh)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${refresh ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"}`}
                  >
                    <motion.div
                      layout
                      className="absolute top-1 w-3 h-3 bg-white rounded-full"
                      style={{ left: refresh ? "calc(100% - 16px)" : "4px" }}
                    />
                  </button>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all active:scale-95"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <Search size={18} />
                  )}
                  <span>{loading ? "Processing..." : "Analyze"}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Error Message --- */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto flex items-center gap-3 p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-500/20"
            >
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Results Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Metadata Sidebar */}
          <motion.div
            layout
            className="lg:col-span-4 space-y-6 order-2 lg:order-1"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Database size={120} />
              </div>

              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-8">
                Metadata Explorer
              </h3>

              <AnimatePresence mode="wait">
                {!analysis ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse"
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6 relative"
                  >
                    <motion.div
                      variants={fadeUp}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50"
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <User size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Main Architect
                        </span>
                      </div>
                      <p className="font-bold text-lg truncate">
                        {analysis.repo_details.owner_name
                          ? `@${analysis.repo_details.owner_name}`
                          : "Unknown Author"}
                      </p>
                      {analysis.repo_details.language && (
                        <span className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                          {analysis.repo_details.language}
                        </span>
                      )}
                    </motion.div>

                    <motion.div
                      variants={fadeUp}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-500/5 rounded-2xl border border-yellow-100 dark:border-yellow-500/10 text-center">
                        <Star
                          size={16}
                          className="text-yellow-500 mx-auto mb-1"
                        />
                        <p className="text-xl font-black">
                          {analysis.repo_details.stars_count?.toLocaleString() ??
                            0}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Stars
                        </p>
                      </div>
                      <div className="p-4 bg-cyan-50 dark:bg-cyan-500/5 rounded-2xl border border-cyan-100 dark:border-cyan-500/10 text-center">
                        <GitFork
                          size={16}
                          className="text-cyan-500 mx-auto mb-1"
                        />
                        <p className="text-xl font-black">
                          {analysis.repo_details.forks_count?.toLocaleString() ??
                            0}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Forks
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={fadeUp}
                      className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Calendar size={14} /> Born
                        </span>
                        <span className="font-semibold">
                          {analysis.repo_details.github_created_at
                            ? formatDistanceToNow(
                                new Date(
                                  analysis.repo_details.github_created_at,
                                ),
                                { addSuffix: true },
                              )
                            : "Unknown"}
                        </span>
                      </div>
                    </motion.div>

                    <motion.a
                      variants={fadeUp}
                      href={analysis.repo_details.github_url}
                      target="_blank"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform"
                    >
                      View Source <ExternalLink size={14} />
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* AI Content */}
          <motion.div layout className="lg:col-span-8 order-1 lg:order-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-xl overflow-hidden min-h-[500px]">
              <div className="bg-slate-50 dark:bg-slate-800/30 px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${loading ? "bg-indigo-500 animate-pulse" : "bg-green-500"}`}
                  />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                    Intelligence Report
                  </span>
                </div>
                {analysis && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${analysis.refreshed ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"}`}
                  >
                    {analysis.refreshed ? "⚡ Real-time" : "💾 System Cache"}
                  </motion.div>
                )}
              </div>

              <div className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="h-8 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-1/3 animate-pulse" />
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-full animate-pulse"
                            style={{ width: `${100 - i * 5}%` }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : analysis ? (
                    <motion.article
                      key="report"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="prose prose-slate dark:prose-invert max-w-none 
                        prose-headings:font-black prose-headings:tracking-tight 
                        prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
                        prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400
                        prose-a:text-cyan-600 dark:prose-a:text-cyan-400"
                    >
                      {/* --- THE INDESTRUCTIBLE SAFETY NET --- */}
                      <ReactMarkdown>
                        {typeof analysis.ai_analysis === 'string' 
                          ? analysis.ai_analysis 
                          : `### ⚠️ Backend Data Error\n\nThe backend sent an object instead of text. Here is the raw data:\n\n\`\`\`json\n${JSON.stringify(analysis.ai_analysis, null, 2)}\n\`\`\``}
                      </ReactMarkdown>
                    </motion.article>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-80 text-center space-y-4"
                    >
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full">
                        <Sparkles size={40} className="text-indigo-500/20" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-400 dark:text-slate-500">
                          Awaiting Signal...
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-600 mt-1">
                          Input a URL above to initialize the AI engine.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Footer --- */}
        <footer className="text-center space-y-2 py-8 mt-12 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
            Developer Ecosystem
          </p>
          <p className="text-sm font-medium text-slate-500 italic">
            Engineered by{" "}
            <span className="text-indigo-500 not-italic font-bold">
              Abuzar Ali
            </span>{" "}
            in Lahore, PK
          </p>
        </footer>
      </div>
    </div>
  );
}