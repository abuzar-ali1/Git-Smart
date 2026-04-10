import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GithubIcon } from "./icons";

export default function Header() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/50 shadow-sm"
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
        <span className="hidden md:inline-flex items-center gap-2 rounded-full bg-indigo-500/20 text-indigo-300 px-4 py-2 text-xs font-semibold tracking-wide border border-indigo-500/10">
          <Sparkles className="w-3.5 h-3.5" />
          Intelligence Engine Online
        </span>
        <a
          href="https://github.com/abuzar-ali1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 hover:ring-2 ring-indigo-500/50 transition-all text-slate-300 font-semibold text-sm shadow-md shadow-black/20"
        >
          <GithubIcon size={16} className="text-indigo-400" />
          <span className="hidden sm:inline">Meet the Developer</span>
        </a>
      </div>
    </motion.nav>
  );
}