// ============================================================
// AMIOUT Enterprise Edition
// MentorLoginHeader.jsx
// ============================================================

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const MentorLoginHeader = () => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600 shadow-2xl shadow-cyan-500/30"
      >
        <ShieldCheck className="h-10 w-10 text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-3xl font-bold tracking-tight text-white"
      >
        Mentor Login
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-3 text-sm leading-6 text-slate-400"
      >
        Sign in using your official Amity mentor account to access the Mentor
        Dashboard.
      </motion.p>
    </div>
  );
};

export default MentorLoginHeader;
