// ============================================================
// AMIOUT Enterprise Edition
// FooterCTA.jsx
// ============================================================

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

const FooterCTA = () => {
  return (
    <section className="relative px-6 pt-20 lg:px-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
        viewport={{
          once: true,
        }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl"
      >
        {/* Background */}

        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-violet-500/10" />

        {/* Glow */}

        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-violet-500/20 blur-[120px]" />

        <div className="relative z-10 px-8 py-20 text-center lg:px-20">
          {/* Badge */}

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />

            <span className="text-sm font-semibold text-cyan-300">
              Enterprise Ready
            </span>
          </div>

          {/* Heading */}

          <h2 className="mx-auto mt-8 max-w-4xl text-5xl font-black leading-tight text-white md:text-6xl">
            Ready to Transform
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-500 bg-clip-text text-transparent">
              {" "}
              Campus Mobility?
            </span>
          </h2>

          {/* Subtitle */}

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-400">
            Join universities embracing digital transformation with AMIOUT's
            enterprise-grade Smart Outpass Management Platform.
          </p>

          {/* Buttons */}

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <Link
              to="/register"
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-5 font-semibold text-white shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40"
            >
              Get Started
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/login"
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-5 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-white/10"
            >
              Login
            </Link>
          </div>

          {/* Bottom */}

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />

              <span>Enterprise Security</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />

              <span>99.9% Uptime</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />

              <span>24×7 Support</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FooterCTA;
