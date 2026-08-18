// ============================================================
// AMIOUT Enterprise Edition
// MentorForgotPasswordHeader.jsx
// ============================================================

import { motion } from "framer-motion";

const MentorForgotPasswordHeader = () => {
  return (
    <div className="text-center">
      {/* ====================================================== */}
      {/* Badge */}
      {/* ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          inline-flex
          items-center
          rounded-full
          border
          border-cyan-400/20
          bg-cyan-500/10
          px-4
          py-1.5
          text-xs
          font-semibold
          uppercase
          tracking-[0.25em]
          text-cyan-300
        "
      >
        Mentor Portal
      </motion.div>

      {/* ====================================================== */}
      {/* Heading */}
      {/* ====================================================== */}

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
          delay: 0.1,
          duration: 0.5,
        }}
        className="
          mt-6
          text-4xl
          font-black
          tracking-tight
          text-white
        "
      >
        Forgot Password
      </motion.h1>

      {/* ====================================================== */}
      {/* Description */}
      {/* ====================================================== */}

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
          delay: 0.2,
          duration: 0.5,
        }}
        className="
          mx-auto
          mt-4
          max-w-md
          text-base
          leading-7
          text-slate-400
        "
      >
        Enter your registered mentor email address to receive a secure OTP and
        reset your password.
      </motion.p>
    </div>
  );
};

export default MentorForgotPasswordHeader;
