// ============================================================
// AMIOUT Enterprise Edition
// Mobile Drawer
// ============================================================

import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

import { X, ArrowRight, LogIn, Phone, ShieldCheck } from "lucide-react";

import { navigation } from "./navbar.data";
import { mobileDrawerVariants, overlayVariants } from "./navbar.variants";

const MobileDrawer = ({ mobileMenu, setMobileMenu }) => {
  return (
    <AnimatePresence>
      {mobileMenu && (
        <>
          {/* Overlay */}

          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setMobileMenu(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}

          <motion.aside
            variants={mobileDrawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 z-50 flex h-screen w-[340px] flex-col overflow-y-auto border-l border-white/10 bg-slate-950 p-6 shadow-2xl lg:hidden"
          >
            {/* Header */}

            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">AMIOUT</h2>

                  <p className="text-xs uppercase tracking-widest text-cyan-300">
                    Enterprise
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{
                  rotate: 90,
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.92,
                }}
                onClick={() => setMobileMenu(false)}
                className="rounded-xl p-2 text-white transition hover:bg-white/10"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Navigation */}

            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <motion.a
                  key={item.title}
                  href={item.href}
                  whileHover={{
                    x: 6,
                  }}
                  onClick={() => setMobileMenu(false)}
                  className="rounded-2xl px-5 py-4 text-base font-medium text-slate-300 transition-all duration-300 hover:bg-white/5 hover:text-white"
                >
                  {item.title}
                </motion.a>
              ))}
            </nav>

            {/* Bottom */}

            <div className="mt-auto space-y-4 pt-10">
              <Link
                to="/login"
                onClick={() => setMobileMenu(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 py-3 font-medium text-white transition-all duration-300 hover:border-cyan-500 hover:bg-white/5"
              >
                <LogIn className="h-5 w-5" />
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileMenu(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02]"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>

              <div className="flex items-center justify-center gap-2 pt-4 text-sm text-slate-500">
                <Phone className="h-4 w-4" />
                Enterprise Support
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
