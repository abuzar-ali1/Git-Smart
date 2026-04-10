import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function Hero() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="text-center space-y-6 pt-8 pb-4"
    >
      <motion.h1
        variants={fadeUp}
        className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-[1.1]"
      >
        Analyze Code <br />
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
          With Intelligence.
        </span>
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed"
      >
        Enter a repository URL to extract deep architectural insights,
        project health metrics, and automated growth roadmaps.
      </motion.p>
    </motion.section>
  );
}