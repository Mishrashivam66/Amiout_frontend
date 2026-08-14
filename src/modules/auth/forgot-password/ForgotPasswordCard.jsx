// ============================================================
// AMIOUT Enterprise Edition
// ForgotPasswordCard.jsx
// ============================================================

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { Mail, ArrowRight, ShieldCheck } from "lucide-react";

import { toast } from "sonner";

import { forgotPassword } from "../services/auth.service";

import AuthInput from "../common/AuthInput";

import ForgotPasswordHeader from "./ForgotPasswordHeader";

const ForgotPasswordCard = () => {
  // ==========================================================
  // Navigation
  // ==========================================================

  const navigate = useNavigate();

  // ==========================================================
  // State
  // ==========================================================

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
  });

  // ==========================================================
  // Handle Change
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // Handle Submit
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter your university email.");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword(formData.email);

      toast.success(response.message);

      navigate("/verify-reset-otp", {
        state: {
          email: formData.email,
          purpose: "RESET_PASSWORD",
        },
      });
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Unable to send OTP.");
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
      }}
      className="
        relative
        w-full
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-white/5
        shadow-2xl
        backdrop-blur-3xl
      "
    >
      {/* ====================================== */}
      {/* Top Gradient */}
      {/* ====================================== */}

      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600" />

      {/* ====================================== */}
      {/* Glow */}
      {/* ====================================== */}

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-violet-500/10 blur-[140px]" />

      {/* ====================================== */}
      {/* Content */}
      {/* ====================================== */}

      <div className="relative z-10 p-8">
        <ForgotPasswordHeader />

        {/* ====================================== */}
        {/* Icon */}
        {/* ====================================== */}

        <div className="mt-8 flex justify-center">
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-gradient-to-br
              from-cyan-500/20
              to-violet-500/20
              ring-1
              ring-white/10
            "
          >
            <ShieldCheck className="h-10 w-10 text-cyan-400" />
          </div>
        </div>

        {/* ====================================== */}
        {/* Description */}
        {/* ====================================== */}

        <p className="mt-6 text-center leading-7 text-slate-400">
          Enter your registered university email.
          <br />
          We'll send you a secure OTP to reset your password.
        </p>

        {/* ====================================== */}
        {/* Form */}
        {/* ====================================== */}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <AuthInput
            label="University Email"
            type="email"
            icon={Mail}
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="yourname@s.amity.edu"
          />

          {/* ====================================== */}
          {/* Send OTP Button */}
          {/* ====================================== */}

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
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending OTP...
              </>
            ) : (
              <>
                Send Reset OTP
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
          {/* ====================================== */}
          {/* Footer */}
          {/* ====================================== */}

          <div className="pt-2 text-center">
            <p className="text-slate-400">
              Remember your password?
              <Link
                to="/login"
                className="
                  ml-2
                  font-semibold
                  text-cyan-400
                  transition-all
                  duration-300
                  hover:text-cyan-300
                "
              >
                Back to Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordCard;
