// ============================================================
// AMIOUT Enterprise Edition
// Premium Navbar
// Part 1 - Imports, Data & State
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
  Cpu,
  Users,
  Phone,
  LogIn,
} from "lucide-react";

// ============================================================
// Navigation Links
// ============================================================

const navigation = [
  {
    title: "Home",
    href: "#hero",
  },
  {
    title: "Features",
    href: "#modules",
  },
  {
    title: "Technology",
    href: "#technology",
  },
  {
    title: "Security",
    href: "#security",
  },
  {
    title: "Roadmap",
    href: "#roadmap",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

// ============================================================
// Mega Menu
// ============================================================

const modules = [
  {
    icon: LayoutDashboard,
    title: "Student Portal",
    desc: "Apply & Track Outpasses",
  },
  {
    icon: Users,
    title: "Mentor Portal",
    desc: "Approve Student Requests",
  },
  {
    icon: ShieldCheck,
    title: "Security Portal",
    desc: "QR Verification",
  },
  {
    icon: Cpu,
    title: "Admin Dashboard",
    desc: "Analytics & Monitoring",
  },
];

// ============================================================
// Motion Variants
// ============================================================

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    x: "100%",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
    },
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: {
      duration: 0.25,
    },
  },
};

// ============================================================
// Component
// ============================================================

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const [mobileMenu, setMobileMenu] = useState(false);

  const [megaMenu, setMegaMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ====================================== */}
      {/* Navbar */}
      {/* ====================================== */}

      <motion.header
        initial={{
          y: -80,
        }}
        animate={{
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* ====================================== */}
          {/* Logo */}
          {/* ====================================== */}

          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>

            <div>
              <h2 className="text-xl font-black tracking-wide text-white">
                AMIOUT
              </h2>

              <p className="text-xs text-cyan-300">Enterprise Edition</p>
            </div>
          </Link>

          {/* ====================================== */}
          {/* Desktop Navigation */}
          {/* Part 2 Starts Here */}
          {/* ====================================== */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group relative text-sm font-medium text-slate-300 transition-colors duration-300 hover:text-white"
              >
                {item.title}

                <span className="absolute -bottom-2 left-0 h-0.5 w-0 bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}

            {/* =============================== */}
            {/* Modules Mega Menu */}
            {/* =============================== */}

            <div
              className="relative"
              onMouseEnter={() => setMegaMenu(true)}
              onMouseLeave={() => setMegaMenu(false)}
            >
              <button className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors duration-300 hover:text-white">
                Modules
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    megaMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {megaMenu && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 15,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="absolute left-1/2 top-14 w-[420px] -translate-x-1/2 rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="grid gap-4">
                      {modules.map((module) => {
                        const Icon = module.icon;

                        return (
                          <button
                            key={module.title}
                            className="group flex items-start gap-4 rounded-2xl p-4 text-left transition-all duration-300 hover:bg-white/5"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600">
                              <Icon className="h-6 w-6 text-white" />
                            </div>

                            <div>
                              <h4 className="font-semibold text-white group-hover:text-cyan-300">
                                {module.title}
                              </h4>

                              <p className="mt-1 text-sm text-slate-400">
                                {module.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* =============================== */}
          {/* Right Side Actions */}
          {/* =============================== */}

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-base font-medium text-slate-300 transition-all duration-300 hover:border-cyan-400/40 hover:text-white"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>

            <Link
              to="/login"
              className="group flex items-center gap-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* =============================== */}
          {/* Mobile Menu Button */}
          {/* =============================== */}

          <button
            onClick={() => setMobileMenu(true)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-all duration-300 hover:bg-white/10 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </motion.header>

      {/* ====================================== */}
      {/* Mobile Drawer */}
      {/* ====================================== */}

      <AnimatePresence>
        {mobileMenu && (
          <>
            {/* Overlay */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}

            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
             className="fixed right-0 top-0 z-50 flex h-screen w-[340px] flex-col overflow-y-auto overflow-x-hidden border-l border-white/10 bg-slate-950 p-6 shadow-2xl lg:hidden"
            >
              {/* Header */}

              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h2 className="font-bold text-white">AMIOUT</h2>

                    <p className="text-xs text-cyan-300">Enterprise</p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenu(false)}
                  className="rounded-xl p-2 text-white transition hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation */}

              <nav className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileMenu(false)}
                    className="rounded-2xl px-5 py-4 text-base font-medium text-slate-300 transition-all duration-300 hover:bg-white/5 hover:text-white"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>

              {/* Divider */}

              <div className="my-8 h-px bg-white/10" />

              {/* Modules */}

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-300">
                  Platform Modules
                </h3>

                <div className="space-y-3">
                  {modules.map((module) => {
                    const Icon = module.icon;

                    return (
                      <div
                        key={module.title}
                        className="flex items-center gap-4 rounded-2xl bg-white/5 p-4"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-blue-600">
                          <Icon className="h-5 w-5 text-white" />
                        </div>

                        <div>
                          <h4 className="font-medium text-white">
                            {module.title}
                          </h4>

                          <p className="text-sm text-slate-400">
                            {module.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions */}

              <div className="mt-auto space-y-4 pt-8">
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 py-3 font-medium text-white transition hover:border-cyan-500 hover:bg-white/5">
                  <LogIn className="h-5 w-5" />
                  Login
                </button>

                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02]">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </button>

                <div className="flex items-center justify-center gap-2 pt-4 text-sm text-slate-500">
                  <Phone className="h-4 w-4" />
                  Enterprise Support
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ====================================== */}
      {/* Part 4 Starts Here */}
      {/* ====================================== */}
    </>
  );
};

export default Navbar;
