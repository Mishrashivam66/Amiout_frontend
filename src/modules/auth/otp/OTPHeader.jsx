// ============================================================
// AMIOUT Enterprise Edition
// OTPHeader.jsx
// ============================================================

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const OTPHeader = () => {
  return (
    <div>
      {/* ====================================== */}
      {/* Badge */}
      {/* ====================================== */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 backdrop-blur-xl"
      >
        <ShieldCheck className="h-4 w-4 text-cyan-400" />

        <span className="text-sm font-semibold text-cyan-300">
          Email Verification
        </span>
      </motion.div>

      {/* ====================================== */}
      {/* Title */}
      {/* ====================================== */}

      <motion.h2
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 text-4xl font-black tracking-tight text-white"
      >
        Verify Your Email
      </motion.h2>

      {/* ====================================== */}
      {/* Subtitle */}
      {/* ====================================== */}

      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-base leading-7 text-slate-400"
      >
        Enter the 6-digit verification code sent to your official Amity
        University email address to activate your account.
      </motion.p>

      {/* ====================================== */}
      {/* Info Box */}
      {/* ====================================== */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-4"
      >
        <p className="text-sm leading-6 text-cyan-300">
          The OTP is valid for <strong>10 minutes</strong>. If you don't receive
          the email, you can request a new OTP after the countdown expires.
        </p>
      </motion.div>
    </div>
  );
};

export default OTPHeader;
