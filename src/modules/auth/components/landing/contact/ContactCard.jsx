// ============================================================
// AMIOUT Enterprise Edition
// ContactCard.jsx
// ============================================================

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ContactCard = ({ icon: Icon, title, subtitle, value, color }) => {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl"
    >
      {/* Hover Gradient */}

      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-violet-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Left Border */}

      <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-gradient-to-b from-cyan-400 via-blue-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Glow */}

      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Content */}

      <div className="relative flex items-center gap-5 p-6">
        {/* Icon */}

        <motion.div
          whileHover={{
            rotate: 8,
            scale: 1.08,
          }}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 shadow-lg"
        >
          <Icon className={`h-8 w-8 ${color}`} />
        </motion.div>

        {/* Text */}

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

          <h4 className="mt-3 break-all text-lg font-semibold text-white transition-colors duration-300 group-hover:text-cyan-300">
            {value}
          </h4>
        </div>

        {/* Arrow */}

        <motion.div
          whileHover={{
            x: 3,
            y: -3,
          }}
        >
          <ArrowUpRight className="h-6 w-6 text-slate-500 transition-colors duration-300 group-hover:text-cyan-400" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactCard;
