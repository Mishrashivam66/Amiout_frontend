// ============================================================
// AMIOUT Enterprise Edition
// Student Register Page
// ============================================================

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import AuthBackground from "../components/layouts/AuthBackground";
import RegisterCard from "../register/RegisterCard";

const StudentRegister = () => {
  return (
    <AuthBackground>
      <div className="w-full max-w-7xl">
        {/* Top Navigation */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mb-8 flex items-center justify-between"
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="hidden rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 md:block">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Student Registration
            </span>
          </div>
        </motion.div>

        {/* Register Form */}

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mx-auto w-full max-w-2xl"
        >
          <RegisterCard />
        </motion.div>
      </div>
    </AuthBackground>
  );
};

export default StudentRegister;
