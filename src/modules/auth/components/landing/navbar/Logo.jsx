// ============================================================
// AMIOUT Enterprise Edition
// Navbar Logo
// ============================================================

import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const Logo = () => {
  return (
    <Link
      to="/"
      aria-label="AMIOUT Home"
      className="group flex items-center gap-3"
    >
      <motion.div
        whileHover={{
          scale: 1.08,
          rotate: -5,
        }}
        whileTap={{
          scale: 0.96,
        }}
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20"
      >
        <ShieldCheck className="h-6 w-6 text-white" />
      </motion.div>

      <div className="leading-none">
        <h1 className="text-xl font-black tracking-wide text-white transition-colors duration-300 group-hover:text-cyan-300">
          AMIOUT
        </h1>

        <p className="mt-1 text-[11px] font-semibold tracking-[0.22em] text-cyan-300 uppercase">
          Enterprise Edition
        </p>
      </div>
    </Link>
  );
};

export default Logo;
