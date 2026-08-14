// ============================================================
// AMIOUT Enterprise Edition
// LoginIllustration.jsx
// ============================================================

import { motion } from "framer-motion";

import { ShieldCheck, CheckCircle2 } from "lucide-react";

const features = [
  "Email OTP Authentication",
  "QR Based Smart Outpass",
  "Mentor Approval Workflow",
  "Parent Notifications",
];

const LoginIllustration = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-16">
      {/* ====================================== */}
      {/* Background Glow */}
      {/* ====================================== */}

      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-500/20 blur-[120px]" />

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
            Enterprise Student Login
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
          Access
          <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-500 bg-clip-text text-transparent">
            AMIOUT
          </span>
          Enterprise
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
          Sign in using your official Amity University account to access secure,
          paperless Smart Outpass services.
        </motion.p>

        {/* ====================================== */}
        {/* Features */}
        {/* ====================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 space-y-4"
        >
          {features.map((item) => (
            <div key={item} className="flex items-center gap-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>

              <span className="text-base font-medium text-slate-200">
                {item}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginIllustration;
