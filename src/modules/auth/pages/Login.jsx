import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import LoginCard from "../login/LoginCard";
import campusJourney from "../../../assets/campus-journey.webp";
import campusLogo from "../../../assets/Campus Logo.png";
// ============================================================
// AMIOUT Enterprise Edition
// Common Login Page - Centered Cinematic Design
// ============================================================

const Login = () => {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#020817] text-white">
      {/* ==========================================
          FULL SCREEN CAMPUS BACKGROUND
      ========================================== */}

      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${campusJourney})`,
        }}
      />

      {/* Dark Overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#020817]/55" />

      {/* Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#020817]/55 via-transparent to-[#020817]/75" />

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />

      {/* ==========================================
          MAIN LAYOUT
      ========================================== */}

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1800px] flex-col px-4 py-5 sm:px-8 lg:px-12">
        {/* ==========================================
            HEADER
        ========================================== */}

        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between gap-4"
        >
          {/* AMIOUT LOGO */}

          {/* AMIOUT LOGO */}
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src={campusLogo}
              alt="AMIOUT Logo"
              className="h-14 w-14 shrink-0 rounded-xl object-contain drop-shadow-[0_0_12px_rgba(0,212,255,0.3)] sm:h-16 sm:w-16"
            />

            <div>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                AMIOUT
              </h1>

              <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-cyan-300 sm:text-[10px]">
                Amity University Madhya Pradesh
              </p>
            </div>
          </Link>

          {/* BACK BUTTON */}
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-[#0a1630]/70 px-3 py-2.5 text-xs font-medium text-slate-200 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white sm:px-5 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </motion.header>

        {/* ==========================================
            CENTER LOGIN CARD
        ========================================== */}

        <section className="flex flex-1 items-center justify-center py-8 sm:py-12">
          <motion.div
            initial={{
              opacity: 0,
              y: 35,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="relative w-full max-w-[570px]"
          >
            {/* Outer Glow */}
            <div className="pointer-events-none absolute -inset-[2px] rounded-[32px] bg-gradient-to-br from-cyan-400/75 via-blue-500/40 to-violet-600/75 opacity-80 blur-[2px]" />

            {/* Ambient Glow */}
            <div className="pointer-events-none absolute -inset-5 rounded-[40px] bg-gradient-to-r from-cyan-500/15 via-blue-600/10 to-violet-600/20 blur-[45px]" />

            {/* Glass Container */}
            <div className="relative overflow-hidden rounded-[30px] border border-cyan-400/40 bg-[#061226]/85 p-[2px] shadow-[0_25px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
              <LoginCard />
            </div>
          </motion.div>
        </section>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <footer className="pb-2 text-center">
          <p className="text-[11px] text-slate-300/80">
            © {new Date().getFullYear()} AMIOUT. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Login;
