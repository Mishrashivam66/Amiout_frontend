// ============================================================
// AMIOUT Enterprise Edition
// AdminRegister.jsx
// ============================================================

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import AdminRegisterIllustration from "../admin-register/AdminRegisterIllustration";
import AdminRegisterCard from "../admin-register/AdminRegisterCard";

const AdminRegister = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816]">
      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[150px]" />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[58%_42%]">
        <div className="hidden lg:flex">
          <AdminRegisterIllustration />
        </div>

        <div className="flex items-center justify-center px-8 py-10 lg:justify-start lg:px-16 xl:px-20">
          <div className="w-full max-w-[470px]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                to="/"
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </motion.div>

            <AdminRegisterCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
