// ============================================================
// AMIOUT Enterprise Edition
// Navbar.jsx
// ============================================================

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileDrawer from "./MobileDrawer";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [megaMenu, setMegaMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{
          y: -80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}

          <Logo />

          {/* Desktop Navigation */}

          <DesktopNav megaMenu={megaMenu} setMegaMenu={setMegaMenu} />

          {/* Right Buttons */}

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href="/login"
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:border-cyan-500 hover:bg-white/5"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() => setMobileMenu(true)}
            className="rounded-xl border border-white/10 p-2 text-white transition-all duration-300 hover:border-cyan-500 hover:bg-white/5 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}

      <MobileDrawer mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
    </>
  );
};

export default Navbar;
