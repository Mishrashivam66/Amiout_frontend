// ============================================================
// AMIOUT Enterprise Edition
// ResetPasswordCard.jsx
// ============================================================

import { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { ArrowRight, ShieldCheck } from "lucide-react";

import { toast } from "sonner";

import { resetPassword } from "../services/auth.service";

import PasswordInput from "../common/PasswordInput";

const ResetPasswordCard = () => {
  // ==========================================================
  // Navigation
  // ==========================================================

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  // ==========================================================
  // State
  // ==========================================================

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
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
  // Password Strength
  // ==========================================================

  const passwordStrength = () => {
    const password = formData.password;

    let score = 0;

    if (password.length >= 8) score++;

    if (/[A-Z]/.test(password)) score++;

    if (/[0-9]/.test(password)) score++;

    if (/[@$!%*?&]/.test(password)) score++;

    return score;
  };
  // ==========================================================
  // Handle Submit
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Invalid password reset session.");

      navigate("/forgot-password");

      return;
    }

    if (!formData.password) {
      toast.error("Please enter a new password.");

      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");

      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");

      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({
        email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      toast.success(response.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Password reset failed.");
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

      <div className="relative z-10 p-8 md:p-8">
        {/* ====================================== */}
        {/* Header */}
        {/* ====================================== */}

        <div className="flex justify-center">
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

        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Create New Password
        </h2>

        <p className="mt-3 text-center text-slate-400">
          Your identity has been verified.
        </p>

        <p className="text-center text-slate-400">
          Please create a strong password.
        </p>

        {/* ====================================== */}
        {/* Form */}
        {/* ====================================== */}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* ====================================== */}
          {/* New Password */}
          {/* ====================================== */}

          <PasswordInput
            label="New Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your new password"
          />

          {/* ====================================== */}
          {/* Confirm Password */}
          {/* ====================================== */}

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your new password"
          />

          {/* ====================================== */}
          {/* Password Strength */}
          {/* ====================================== */}

          <div>
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-slate-400">Password Strength</span>

              <span className="text-sm font-semibold text-cyan-400">
                {
                  ["Very Weak", "Weak", "Good", "Strong", "Excellent"][
                    passwordStrength()
                  ]
                }
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-700">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${passwordStrength() * 25}%`,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600"
              />
            </div>
          </div>

          {/* ====================================== */}
          {/* Reset Password Button */}
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
              py-3.5
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
                Updating Password...
              </>
            ) : (
              <>
                Reset Password
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

export default ResetPasswordCard;
