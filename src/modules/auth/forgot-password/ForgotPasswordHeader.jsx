// ============================================================
// AMIOUT Enterprise Edition
// ForgotPasswordHeader.jsx
// ============================================================

import { motion } from "framer-motion";

import { LockKeyhole } from "lucide-react";

const ForgotPasswordHeader = () => {
  return (
    <div className="text-center">
      {/* ====================================== */}
      {/* Icon */}
      {/* ====================================== */}

      <motion.div
        initial={{
          scale: 0,
          rotate: -180,
        }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          duration: 0.6,
          type: "spring",
        }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-2xl shadow-cyan-500/20"
      >
        <LockKeyhole className="h-10 w-10 text-white" />
      </motion.div>

      {/* ====================================== */}
      {/* Title */}
      {/* ====================================== */}

      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
        className="mt-6 text-4xl font-bold tracking-tight text-white"
      >
        Forgot Password
      </motion.h1>

      {/* ====================================== */}
      {/* Subtitle */}
      {/* ====================================== */}

      <motion.p
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
        className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-400"
      >
        Don't worry.
        <br />
        Enter your registered university email to receive a secure password
        reset OTP.
      </motion.p>
    </div>
  );
};

export default ForgotPasswordHeader;
