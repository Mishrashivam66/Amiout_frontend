// ============================================================
// AMIOUT Enterprise Edition
// HeroContent.jsx
// Premium Hero Content
// ============================================================

import { motion } from "framer-motion";
import CTAButtons from "./CTAButtons";
import StatsBar from "./StatsBar";

import { Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

const HeroContent = () => {
  return (
    <div className="relative z-20 max-w-[760px]">
      {/* ====================================== */}
      {/* Enterprise Badge */}
      {/* ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-6 py-3 backdrop-blur-xl"
      >
        <Sparkles className="h-4 w-4 text-cyan-400" />

        <span className="text-lg font-bold text-cyan-300">
          Smart Campus Platform
        </span>
      </motion.div>

      {/* ====================================== */}
      {/* Main Heading */}
      {/* ====================================== */}

      <motion.h1
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
          duration: 0.7,
        }}
        className="mt-8 text-6xl font-black leading-[0.88] tracking-[-0.04em] text-white md:text-7xl xl:text-8xl 2xl:text-[6.8rem]"
      >
        <span className="block">Campus</span>

        <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-500 bg-clip-text text-transparent">
          Mobility
        </span>

        <span className="mt-2 block text-white">Reimagined</span>

        <div className="mt-6">
          <span className="block text-2xl font-light tracking-wide text-slate-400 md:text-3xl xl:text-4xl">
            for{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-500 bg-clip-text font-semibold text-transparent">
              Modern
            </span>{" "}
            Universities
          </span>
        </div>
      </motion.h1>

      {/* ====================================== */}
      {/* Subtitle */}
      {/* ====================================== */}

      <motion.p
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.4,
          duration: 0.7,
        }}
        className="mt-10 max-w-[560px] text-lg leading-8 font-medium text-slate-300 md:text-xl xl:text-2xl"
      >
        AMIOUT is an enterprise-grade Smart Outpass Management Platform powered
        by QR verification, real-time tracking, multi-level approvals,
        role-based access and modern security for next-generation universities.
      </motion.p>

      {/* ====================================== */}
      {/* Highlights */}
      {/* ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.6,
        }}
        className="mt-10 grid gap-5 sm:grid-cols-2"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />

          <span className="text-base font-medium text-slate-200">
            QR Based Verification
          </span>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />

          <span className="text-base font-medium text-slate-200">
            Multi-Level Approval
          </span>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />

          <span className="text-base font-medium text-slate-200">
            Live Notifications
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-cyan-400" />

          <span className="text-base font-medium text-slate-200">
            Enterprise Security
          </span>
        </div>
      </motion.div>

      {/* ====================================== */}
      {/* CTA Buttons */}
      {/* Part 2 Starts Here */}
      {/* ====================================== */}
      {/* ====================================== */}
      {/* CTA Buttons */}
      {/* ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.8,
          duration: 0.6,
        }}
        className="mt-10"
      >
        <CTAButtons />
      </motion.div>

      {/* ====================================== */}
      {/* Stats Bar */}
      {/* ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1,
          duration: 0.6,
        }}
        className="mt-14"
      >
        <StatsBar />
      </motion.div>

      {/* ====================================== */}
      {/* Trusted By */}
      {/* ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.2,
        }}
        className="mt-14"
      >
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          Trusted Technologies
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
            <span className="font-semibold text-cyan-300">React</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
            <span className="font-semibold text-green-400">Node.js</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
            <span className="font-semibold text-emerald-400">MongoDB</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
            <span className="font-semibold text-orange-400">JWT</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
            <span className="font-semibold text-violet-400">Docker</span>
          </div>
        </div>
      </motion.div>

      {/* ====================================== */}
      {/* Bottom Info */}
      {/* ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.4,
        }}
        className="mt-12 flex flex-wrap items-center gap-6"
      >
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />

          <span className="text-sm font-medium text-emerald-400">
            Platform Online
          </span>
        </div>

        <div className="text-sm text-slate-500">
          Version 2.0 Enterprise Edition
        </div>

        <div className="text-sm text-slate-500">
          Built for Modern Universities
        </div>
      </motion.div>

      {/* ====================================== */}
      {/* Part 3 Starts Here */}
      {/* ====================================== */}
    </div>
  );
};

export default HeroContent;
