import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";
import { AnalyzeResponse } from "@/types";

export default function IntelligenceReport({ analysis, loading }: { analysis: AnalyzeResponse | null, loading: boolean }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] shadow-xl overflow-hidden min-h-[500px] flex flex-col h-full">
      <div className="bg-slate-800/30 px-8 py-5 border-b border-slate-800 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${loading ? "bg-indigo-500 animate-pulse" : "bg-green-500"}`} />
          <span className="text-xs font-black uppercase tracking-widest text-slate-300">
            Intelligence Report
          </span>
        </div>
        {analysis && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${analysis.refreshed ? "bg-green-500/10 text-green-400" : "bg-indigo-500/10 text-indigo-400"}`}
          >
            {analysis.refreshed ? "⚡ Real-time" : "💾 System Cache"}
          </motion.div>
        )}
      </div>

      <div className="p-8 md:p-12 overflow-y-auto max-h-[600px] overscroll-contain">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="h-8 bg-slate-800/50 rounded-lg w-1/3 animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 bg-slate-800/50 rounded-full animate-pulse" style={{ width: `${100 - i * 5}%` }} />
                ))}
              </div>
            </motion.div>
          ) : analysis ? (
            <motion.article
              key="report"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="prose prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-400 prose-p:leading-relaxed prose-strong:text-indigo-400 prose-a:text-cyan-400"
            >
              <ReactMarkdown>
                {typeof analysis.ai_analysis === 'string' 
                  ? analysis.ai_analysis 
                  : `### ⚠️ Backend Data Error\n\n\`\`\`json\n${JSON.stringify(analysis.ai_analysis, null, 2)}\n\`\`\``}
              </ReactMarkdown>
            </motion.article>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-80 text-center space-y-4">
              <div className="p-6 bg-slate-800/50 rounded-full">
                <Sparkles size={40} className="text-indigo-500/20" />
              </div>
              <div>
                <h4 className="font-bold text-slate-500">Awaiting Signal...</h4>
                <p className="text-sm text-slate-600 mt-1">Input a URL above to initialize the AI engine.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}