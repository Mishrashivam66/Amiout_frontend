// ============================================================
// AMIOUT Enterprise Edition
// Login.jsx
// ============================================================

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import LoginIllustration from "../login/LoginIllustration";
import LoginCard from "../login/LoginCard";

const Login = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050B1A]">
      {/* Background Glow */}

      <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[150px]" />

      {/* Grid Background */}

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

      {/* Main Layout */}

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[58%_42%]">
        {/* ====================================== */}
        {/* Left */}
        {/* ====================================== */}

        <div className="hidden lg:flex">
          <LoginIllustration />
        </div>

        {/* ====================================== */}
        {/* Right */}
        {/* ====================================== */}

        <div className="flex items-center justify-center px-8 py-10 lg:justify-start lg:px-16 xl:px-20">
          <div className="w-full max-w-[470px]">
            {/* Back Button */}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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

            <LoginCard />
            {/* ====================================== */}
            {/* Register Options */}
            {/* ====================================== */}

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-center text-lg font-bold text-white">
                Choose Your Portal
              </h3>

              <p className="mt-1 text-center text-sm text-slate-400">
                Select the portal you want to access
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Link
                  to="/register"
                  className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5 text-center transition hover:scale-[1.03] hover:bg-cyan-500/20"
                >
                  <div className="text-3xl">🎓</div>

                  <h4 className="mt-3 font-semibold text-cyan-300">Student</h4>

                  <p className="mt-1 text-xs text-slate-400">
                    Register Account
                  </p>
                </Link>

                <Link
                  to="/mentor/register"
                  className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5 text-center transition hover:scale-[1.03] hover:bg-violet-500/20"
                >
                  <div className="text-3xl">👨‍🏫</div>

                  <h4 className="mt-3 font-semibold text-violet-300">Mentor</h4>

                  <p className="mt-1 text-xs text-slate-400">
                    Register Account
                  </p>
                </Link>

                <Link
                  to="/admin/register"
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center transition hover:scale-[1.03] hover:bg-emerald-500/20"
                >
                  <div className="text-3xl">🛡️</div>

                  <h4 className="mt-3 font-semibold text-emerald-300">Admin</h4>

                  <p className="mt-1 text-xs text-slate-400">
                    Register Account
                  </p>
                </Link>

                <Link
                  to="/admin/login"
                  className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-center transition hover:scale-[1.03] hover:bg-amber-500/20"
                >
                  <div className="text-3xl">🔐</div>

                  <h4 className="mt-3 font-semibold text-amber-300">
                    Admin Login
                  </h4>

                  <p className="mt-1 text-xs text-slate-400">
                    Existing Account
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
