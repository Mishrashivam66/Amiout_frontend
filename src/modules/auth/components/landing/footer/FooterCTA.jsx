// ============================================================
// AMIOUT
// FooterCTA.jsx
// ============================================================

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FooterCTA = () => {
  return (
    <section className="relative px-6 pt-20 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl"
      >
        {/* Background */}

        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10" />

        <div className="relative z-10 px-8 py-20 text-center lg:px-20">
          <h2 className="mx-auto max-w-4xl text-5xl font-black leading-tight text-white md:text-6xl">
            Experience{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              AMIOUT
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-400">
            A Smart Outpass Management System designed to simplify leave
            requests, mentor approvals, and campus administration through a
            modern digital workflow.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <Link
              to="/register"
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-5 font-semibold text-white shadow-xl transition hover:scale-105"
            >
              Register
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>

            <Link
              to="/login"
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-5 font-semibold text-white backdrop-blur-xl transition hover:border-cyan-500/40 hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FooterCTA;
