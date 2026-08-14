// ============================================================
// AMIOUT Enterprise Edition
// OTPIllustration.jsx
// ============================================================

import { motion } from "framer-motion";

import { ShieldCheck, CheckCircle2 } from "lucide-react";

// ============================================================
// Features
// ============================================================

const features = [
  "Email OTP Verification",
  "Enterprise Security",
  "Mentor Mapping",
  "Smart Outpass Ready",
];

const OTPIllustration = () => {
  return (
    <div className="relative flex h-full w-full items-start justify-center overflow-hidden px-16 pt-4">
      {/* ====================================== */}
      {/* Background Glow */}
      {/* ====================================== */}

      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-violet-500/20 blur-[120px]" />

      <div className="relative max-w-xl">
        {/* ====================================== */}
        {/* Badge */}
        {/* ====================================== */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl"
        >
          <ShieldCheck className="h-5 w-5 text-cyan-400" />

          <span className="font-semibold text-cyan-300">
            Email Verification
          </span>
        </motion.div>

        {/* ====================================== */}
        {/* Heading */}
        {/* ====================================== */}

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mt-8 text-6xl font-black leading-[0.9] text-white"
        >
          Verify
          <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-500 bg-clip-text text-transparent">
            Your
          </span>
          Email
        </motion.h1>

        {/* ====================================== */}
        {/* Subtitle */}
        {/* ====================================== */}

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-lg text-lg leading-8 text-slate-300"
        >
          We've sent a secure 6-digit verification code to your official Amity
          University email. Verify your email to activate your AMIOUT Enterprise
          account.
        </motion.p>

        {/* ====================================== */}
        {/* Verification Card */}
        {/* ====================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Secure Verification
              </h3>

              <p className="text-sm text-slate-400">
                Activate your student account
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-5">
            {features.map((item) => (
              <div key={item} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>

                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm leading-7 text-slate-400">
              Once your email is verified, your account will be activated
              automatically and you'll be able to log in and start using AMIOUT
              Enterprise.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OTPIllustration;
