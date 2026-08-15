// ============================================================
// AMIOUT Enterprise Edition
// Portal Card
// ============================================================

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { cardVariants } from "./portal.variants";

const PortalCard = ({
  index,
  icon: Icon,
  title,
  description,
  to,
  color = "from-cyan-500 to-blue-600",
}) => {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className="h-full"
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
    >
      <Link
        to={to}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.07] sm:p-6 lg:p-7"
      >
        {/* Glow */}
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

        {/* Icon */}
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16`}
        >
          <Icon className="h-7 w-7 text-white sm:h-8 sm:w-8" />
        </div>

        {/* Content */}
        <div className="mt-6 flex-1">
          <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-300 sm:text-2xl">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
          <span className="text-sm font-semibold tracking-wide text-cyan-300">
            Continue
          </span>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all duration-300 group-hover:bg-cyan-500">
            <ArrowRight className="h-5 w-5 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PortalCard;
