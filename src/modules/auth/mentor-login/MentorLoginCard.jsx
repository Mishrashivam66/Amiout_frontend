// ============================================================
// AMIOUT Enterprise Edition
// MentorLoginCard.jsx
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../../context/AuthContext";

import MentorLoginHeader from "./MentorLoginHeader";

import AuthInput from "../common/AuthInput";
import PasswordInput from "../common/PasswordInput";

import { loginMentor } from "../services/mentorAuth.service";

const MentorLoginCard = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // ======================================
  // HANDLE CHANGE
  // ======================================

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ======================================
  // LOGIN
  // ======================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginMentor({
        email: formData.email,
        password: formData.password,
      });

      login(response.user, response.accessToken);

      toast.success(response.message);

      navigate("/mentor/dashboard");
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Mentor login failed.");
    } finally {
      setLoading(false);
    }
  };

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
        max-w-[470px]
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-white/5
        shadow-2xl
        backdrop-blur-3xl
      "
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600" />

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-violet-500/10 blur-[140px]" />

      <div className="relative z-10 p-8">
        <MentorLoginHeader />

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <AuthInput
            label="Mentor Email"
            type="email"
            icon={Mail}
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your Amity Email"
          />

          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="h-5 w-5 rounded border-white/20 bg-slate-900"
              />

              <span className="text-sm text-slate-300">Remember Me</span>
            </label>

            <Link
              to="/mentor/forgot-password"
              className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Forgot Password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
              transition-all
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
                Mentor Login
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>

          <div className="pt-2 text-center">
            <p className="text-slate-400">
              Don't have an account?
              <Link
                to="/mentor/register"
                className="ml-2 font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Register Here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default MentorLoginCard;
