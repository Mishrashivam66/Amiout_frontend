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
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3 text-center lg:text-left"
          >
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-white">
                AMIOUT Enterprise Edition
              </span>
              . All Rights Reserved.
            </p>

            <p className="text-sm text-slate-500">
              Developed by{" "}
              <span className="font-semibold text-cyan-300">Shivam Kumar</span>{" "}
              (Lead Developer) &{" "}
              <span className="font-semibold text-cyan-300">Ayush</span>{" "}
              (Frontend Developer)
            </p>

            <p className="text-sm text-slate-500">
              Project Mentor :{" "}
              <span className="font-semibold text-white">
                Dr. Dinesh Sharma
              </span>{" "}
              — Associate Professor, Amity University Madhya Pradesh
            </p>
          </motion.div>

          {/* Right */}

          <motion.button
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="group mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 lg:mx-0"
          >
            <ChevronUp className="h-6 w-6 text-slate-300 transition duration-300 group-hover:-translate-y-1 group-hover:text-cyan-300" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
