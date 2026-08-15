// ============================================================
// AMIOUT Enterprise Edition
// LoginCard.jsx
// Part 1
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Mail, ArrowRight } from "lucide-react";

import { toast } from "sonner";

import { useAuth } from "../../../context/AuthContext";
import { login as loginService } from "../services/auth.service";

import LoginHeader from "./LoginHeader";
import AuthInput from "../common/AuthInput";
import PasswordInput from "../common/PasswordInput";

const LoginCard = () => {
  // ==========================================================
  // Hooks
  // ==========================================================

  const navigate = useNavigate();

  const { login } = useAuth();

  // ==========================================================
  // State
  // ==========================================================

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // ==========================================================
  // Handle Change
  // ==========================================================

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================================
  // Login
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginService({
        email: formData.email,
        password: formData.password,
      });

      login(response.user, response.accessToken);

      toast.success(response.message);

      switch (response.user.role) {
        case "ADMIN":
          navigate("/admin/dashboard", {
            replace: true,
          });
          break;

        case "STUDENT":
          navigate("/student/dashboard", {
            replace: true,
          });
          break;

        case "MENTOR":
          navigate("/mentor/dashboard", {
            replace: true,
          });
          break;

        case "SECURITY":
          navigate("/security/dashboard", {
            replace: true,
          });
          break;

        default:
          navigate("/", {
            replace: true,
          });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="
        relative
        mx-auto
        w-full
        max-w-xl
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-white/5
        shadow-2xl
        backdrop-blur-3xl
      "
    >
      {/* Top Gradient */}

      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600" />

      {/* Glow */}

      <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-cyan-500/10 blur-[160px]" />

      <div className="absolute -right-28 -bottom-28 h-80 w-80 rounded-full bg-violet-500/10 blur-[160px]" />

      {/* Content */}

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <LoginHeader />

        {/* Form */}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* University Email */}

          <AuthInput
            label="University Email"
            type="email"
            icon={Mail}
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your Amity University email"
          />

          {/* Password */}

          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          {/* Remember */}

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="h-5 w-5 rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />

              <span className="text-sm font-medium text-slate-300">
                Remember Me
              </span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}

          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            disabled={loading}
            className="
              group
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              via-blue-500
              to-violet-600
              px-6
              py-4
              font-semibold
              text-white
              shadow-xl
              shadow-cyan-500/20
              transition-all
              duration-300
              hover:shadow-cyan-500/40
              hover:scale-[1.01]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing In...
              </>
            ) : (
              <>
                Sign In Securely
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
          {/* ========================================================== */}
          {/* Footer */}
          {/* ========================================================== */}

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?
              <Link
                to="/student/register"
                className="
                  ml-2
                  font-semibold
                  text-cyan-400
                  transition-all
                  duration-300
                  hover:text-cyan-300
                "
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginCard;
