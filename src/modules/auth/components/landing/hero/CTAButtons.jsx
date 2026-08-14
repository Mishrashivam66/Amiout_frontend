// ============================================================
// AMIOUT Enterprise Edition
// CTAButtons.jsx
// ============================================================

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { ArrowRight, PlayCircle, BookOpen, Code2 } from "lucide-react";

const MotionLink = motion(Link);

const CTAButtons = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {/* ====================================== */}
      {/* Start Free */}
      {/* ====================================== */}

      <MotionLink
        to="/register"
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.97,
        }}
        className="group inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-7 py-4 font-semibold text-white shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40"
      >
        <span>Start Free</span>

        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </MotionLink>

      {/* ====================================== */}
      {/* Watch Demo */}
      {/* ====================================== */}

      <motion.button
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.97,
        }}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/10"
      >
        <PlayCircle className="h-5 w-5 text-cyan-400" />
        Watch Demo
      </motion.button>

      {/* ====================================== */}
      {/* GitHub */}
      {/* ====================================== */}

      <motion.button
        whileHover={{
          y: -3,
        }}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-slate-300 backdrop-blur-xl transition-all duration-300 hover:text-white"
      >
        <Code2 className="h-5 w-5" />
        GitHub
      </motion.button>

      {/* ====================================== */}
      {/* Documentation */}
      {/* ====================================== */}

      <motion.button
        whileHover={{
          y: -3,
        }}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-slate-300 backdrop-blur-xl transition-all duration-300 hover:text-white"
      >
        <BookOpen className="h-5 w-5" />
        Docs
      </motion.button>
    </div>
  );
};

export default CTAButtons;
