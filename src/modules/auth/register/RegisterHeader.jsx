// ============================================================
// AMIOUT Enterprise Edition
// RegisterHeader.jsx
// ============================================================

import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

const RegisterHeader = () => {
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
        <UserPlus className="h-4 w-4 text-cyan-400" />

        <span className="text-sm font-semibold text-cyan-300">
          Student Registration
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
        Create Your Account
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
        Register using your official Amity University email address to access
        the AMIOUT Smart Campus Outpass Management Platform.
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
          Use your official <strong>@s.amity.edu</strong> or{" "}
          <strong>@gwa.amity.edu</strong> email. Your mentor and coordinator
          will be assigned automatically after verification.
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterHeader;
