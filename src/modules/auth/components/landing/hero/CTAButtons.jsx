// ============================================================
// AMIOUT
// CTAButtons.jsx
// ============================================================

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, LogIn } from "lucide-react";

const MotionLink = motion(Link);

const CTAButtons = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Register */}

      <MotionLink
        to="/register"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 font-semibold text-white shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40"
      >
        Register
        <ArrowRight className="h-5 w-5 transition duration-300 group-hover:translate-x-1" />
      </MotionLink>

      {/* Login */}

      <MotionLink
        to="/login"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-white/10"
      >
        <LogIn className="h-5 w-5 text-cyan-400" />
        Login
      </MotionLink>
    </div>
  );
};

export default CTAButtons;
