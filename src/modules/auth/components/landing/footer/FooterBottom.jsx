// ============================================================
// AMIOUT Enterprise Edition
// FooterBottom.jsx
// ============================================================

import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

const FooterBottom = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="border-t border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-8 md:flex-row lg:px-8">
        {/* ====================================== */}
        {/* Left */}
        {/* ====================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="text-center md:text-left"
        >
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">AMIOUT</span> Enterprise
            Edition. All Rights Reserved.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Designed & Developed by{" "}
            <span className="font-semibold text-cyan-300">
              Shivam Kumar Mishra
            </span>
          </p>
        </motion.div>

        {/* ====================================== */}
        {/* Center */}
        {/* ====================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          transition={{
            delay: 0.2,
          }}
          viewport={{
            once: true,
          }}
          className="flex items-center gap-6 text-sm text-slate-500"
        >
          <span className="transition hover:text-cyan-300">Privacy</span>

          <span className="transition hover:text-cyan-300">Terms</span>

          <span className="transition hover:text-cyan-300">Cookies</span>
        </motion.div>

        {/* ====================================== */}
        {/* Right */}
        {/* ====================================== */}

        <motion.button
          whileHover={{
            y: -4,
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={scrollToTop}
          className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/10"
        >
          <ChevronUp className="h-6 w-6 text-slate-300 transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-cyan-300" />
        </motion.button>
      </div>
    </div>
  );
};

export default FooterBottom;
