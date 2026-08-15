// ============================================================
// AMIOUT Enterprise Edition
// Mega Menu
// ============================================================

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { modules } from "./navbar.data";
import { megaMenuVariants } from "./navbar.variants";

const MegaMenu = ({ megaMenu }) => {
  return (
    <AnimatePresence>
      {megaMenu && (
        <motion.div
          variants={megaMenuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute left-1/2 top-14 z-50 w-[430px] -translate-x-1/2 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-2xl"
        >
          {/* Header */}

          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Platform Modules
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              AMIOUT Enterprise
            </h3>
          </div>

          {/* Modules */}

          <div className="p-4">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <motion.button
                  key={module.title}
                  whileHover={{
                    x: 4,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="group flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-all duration-300 hover:bg-white/5"
                >
                  {/* Icon */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Text */}

                  <div className="flex-1">
                    <h4 className="font-semibold text-white transition-colors duration-300 group-hover:text-cyan-300">
                      {module.title}
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {module.desc}
                    </p>
                  </div>

                  {/* Arrow */}

                  <ArrowUpRight className="h-5 w-5 text-slate-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-400" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
