// ============================================================
// AMIOUT Enterprise Edition
// ScrollIndicator.jsx
// ============================================================

import { motion } from "framer-motion";
import { Mouse, ChevronDown } from "lucide-react";

const ScrollIndicator = () => {
  const handleScroll = () => {
    const nextSection = document.getElementById("trusted");

    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.button
      onClick={handleScroll}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: 1.6,
        duration: 0.8,
      }}
      className="absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center lg:flex"
    >
      <span className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        Scroll Down
      </span>

      <motion.div
        animate={{
          y: [0, 6, 0],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
        }}
        className="flex h-14 w-9 items-start justify-center rounded-full border-2 border-cyan-500/30 p-2"
      >
        <motion.div
          animate={{
            y: [0, 16, 0],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
          }}
          className="h-3 w-3 rounded-full bg-cyan-400"
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
        }}
        className="mt-4"
      >
        <ChevronDown className="h-5 w-5 text-cyan-400" />
      </motion.div>

      <Mouse className="mt-3 h-5 w-5 text-slate-500" />
    </motion.button>
  );
};

export default ScrollIndicator;
