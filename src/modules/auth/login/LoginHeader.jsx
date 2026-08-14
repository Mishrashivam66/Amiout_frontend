// ============================================================
// AMIOUT Enterprise Edition
// LoginHeader.jsx
// ============================================================

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const LoginHeader = () => {
  return (
    <div>
      {/* ====================================== */}
      {/* Badge */}
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
          duration: 0.5,
        }}
        className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 backdrop-blur-xl"
      >
        <ShieldCheck className="h-4 w-4 text-cyan-400" />

        <span className="text-sm font-semibold text-cyan-300">
          Secure Student Login
        </span>
      </motion.div>

      {/* ====================================== */}
      {/* Heading */}
      {/* ====================================== */}

      <motion.h2
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.1,
        }}
        className="mt-6 text-4xl font-black tracking-tight text-white"
      >
        Welcome Back
      </motion.h2>

      {/* ====================================== */}
      {/* Subtitle */}
      {/* ====================================== */}

      <motion.p
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
        className="mt-3 text-sm leading-6 text-slate-400"
      >
        Sign in using your official Amity University email to securely access
        the AMIOUT Enterprise Platform and manage your smart campus outpasses.
      </motion.p>

      {/* ====================================== */}
      {/* Security Note */}
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
          delay: 0.3,
        }}
        className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4"
      >
        <p className="text-sm leading-6 text-emerald-300">
          Official Amity University students only.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginHeader;
