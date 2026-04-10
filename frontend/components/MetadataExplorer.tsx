import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Database, Star, GitFork, User, Calendar, ExternalLink } from "lucide-react";
import { AnalyzeResponse } from "@/types";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function MetadataExplorer({ analysis }: { analysis: AnalyzeResponse | null }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-sm overflow-hidden relative group h-full">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <Database size={120} />
      </div>

      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-8">
        Metadata Explorer
      </h3>

      <AnimatePresence mode="wait">
        {!analysis ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-800/50 rounded-xl animate-pulse" />
            ))}
          </motion.div>
        ) : (
          <motion.div key="content" variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 relative">
            <motion.div variants={fadeUp} className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-1">
                <User size={14} className="text-indigo-400" />
                <span className="text-[10px] font-bold uppercase text-slate-400">Main Architect</span>
              </div>
              <p className="font-bold text-lg truncate">
                {analysis.repo_details.owner_name ? `@${analysis.repo_details.owner_name}` : "Unknown Author"}
              </p>
              {analysis.repo_details.language && (
                <span className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-900/40 text-indigo-300 border border-indigo-800/50">
                  {analysis.repo_details.language}
                </span>
              )}
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 text-center">
                <Star size={16} className="text-yellow-500 mx-auto mb-1" />
                <p className="text-xl font-black">{analysis.repo_details.stars_count?.toLocaleString() ?? 0}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Stars</p>
              </div>
              <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 text-center">
                <GitFork size={16} className="text-cyan-500 mx-auto mb-1" />
                <p className="text-xl font-black">{analysis.repo_details.forks_count?.toLocaleString() ?? 0}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Forks</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2"><Calendar size={14} /> Born</span>
                <span className="font-semibold">
                  {analysis.repo_details.github_created_at
                    ? formatDistanceToNow(new Date(analysis.repo_details.github_created_at), { addSuffix: true })
                    : "Unknown"}
                </span>
              </div>
            </motion.div>

            <motion.a
              variants={fadeUp}
              href={analysis.repo_details.github_url}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform"
            >
              View Source <ExternalLink size={14} />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}