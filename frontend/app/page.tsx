"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { AnalyzeResponse } from "@/types";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchBox from "@/components/SearchBox";
import MetadataExplorer from "@/components/MetadataExplorer";
import IntelligenceReport from "@/components/IntelligenceReport";

export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const [repoUrl, setRepoUrl] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [guestId, setGuestId] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
  
  if (!mounted) return null;

  return (
    <div className="dark min-h-screen bg-[#020617] text-slate-100 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12 space-y-10 relative z-10">
        <Header />
        <Hero />
        
        <SearchBox 
          repoUrl={repoUrl} 
          setRepoUrl={setRepoUrl} 
          refresh={refresh} 
          setRefresh={setRefresh} 
          loading={loading} 
          onAnalyze={handleAnalyze} 
        />

        <AnimatePresence>
          {errorMessage && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-4xl mx-auto flex items-center gap-3 p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <motion.div layout className="lg:col-span-4 order-2 lg:order-1">
            <MetadataExplorer analysis={analysis} />
          </motion.div>
          <motion.div layout className="lg:col-span-8 order-1 lg:order-2">
            <IntelligenceReport analysis={analysis} loading={loading} />
          </motion.div>
        </div>

        <footer className="text-center space-y-2 py-8 mt-12 border-t border-slate-800">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Developer Ecosystem</p>
          <p className="text-sm font-medium text-slate-500 italic">
            Engineered by <span className="text-indigo-500 not-italic font-bold">Abuzar Ali</span> in Lahore, PK
          </p>
        </footer>
      </div>
    </div>
  );
}