// ============================================================
// HeroContent.jsx
// Clean Modern Hero
// ============================================================

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

import CTAButtons from "./CTAButtons";

const HeroContent = () => {
  return (
    <div className="relative z-20 max-w-3xl">
      {/* Badge */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl"
      >
        <Sparkles className="h-4 w-4 text-cyan-400" />

        <span className="text-sm font-semibold text-cyan-300">
          Digital Campus Solution
        </span>
      </motion.div>

      {/* Heading */}

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-5xl font-black leading-tight text-white md:text-7xl"
      >
        Smart
        <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-500 bg-clip-text text-transparent">
          Outpass
        </span>
        <span className="block">Management</span>
      </motion.h1>

      {/* Subtitle */}

      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 max-w-2xl text-lg leading-8 text-slate-300"
      >
        AMIOUT is a smart digital outpass management platform that streamlines
        approvals, tracks student requests in real time, and provides secure
        role-based access for students, mentors, wardens, security staff, and
        administrators.
      </motion.p>

      {/* Highlights */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 grid gap-4 sm:grid-cols-3"
      >
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <CheckCircle2 className="text-emerald-400" />

          <span className="text-slate-200">Digital Outpass</span>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <CheckCircle2 className="text-emerald-400" />

          <span className="text-slate-200">Role Based Access</span>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <CheckCircle2 className="text-emerald-400" />

          <span className="text-slate-200">Real-Time Tracking</span>
        </div>
      </motion.div>

      {/* Buttons */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12"
      >
        <CTAButtons />
      </motion.div>
    </div>
  );
};

export default HeroContent;
