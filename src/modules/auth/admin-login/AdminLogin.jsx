// ============================================================
// AMIOUT Enterprise Edition
// AdminLogin.jsx
// ============================================================

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import AdminLoginCard from "../admin-login/AdminLoginCard";

const AdminLogin = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* ===================================================== */}
      {/* Background Gradient */}
      {/* ===================================================== */}

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* ===================================================== */}
      {/* Grid Background */}
      {/* ===================================================== */}

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ===================================================== */}
      {/* Watermark */}
      {/* ===================================================== */}

      <h1 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[18vw] font-black uppercase tracking-[0.15em] text-white/[0.03]">
        AMIOUT
      </h1>

      {/* ===================================================== */}
      {/* Background Glow */}
      {/* ===================================================== */}

      <div className="absolute -left-44 top-0 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[170px]" />

      <div className="absolute -right-44 bottom-0 h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[170px]" />

      {/* ===================================================== */}
      {/* Main Content */}
      {/* ===================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          {/* Back Button */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/"
              className="
                mb-8
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/5
                px-5
                py-3
                text-slate-300
                transition-all
                duration-300
                hover:border-cyan-400/40
                hover:bg-cyan-500/10
                hover:text-white
              "
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          {/* Login Card */}

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <AdminLoginCard />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
