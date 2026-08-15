"use client";

// ============================================================
// AMIOUT Enterprise Edition
// Mentor Register Card
// ============================================================

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  User,
  Mail,
  BadgeCheck,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { motion } from "framer-motion";

import MentorRegisterHeader from "./MentorRegisterHeader";
import MentorOtpModal from "./MentorOtpModal";

import { registerMentor } from "../services/mentorAuth.service";

const MentorRegisterCard = () => {
  // ============================================================
  // State
  // ============================================================

  const [loading, setLoading] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);

  const [registeredEmail, setRegisteredEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  // ============================================================
  // Validation
  // ============================================================

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@(s\.amity\.edu|gwa\.amity\.edu)$/i.test(email);

  const validateEmployeeId = (id) => /^[A-Za-z0-9-]{4,20}$/.test(id);

  const getPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password],
  );

  const passwordStrengthLabel = [
    "Very Weak",
    "Weak",
    "Medium",
    "Good",
    "Strong",
    "Excellent",
  ][passwordStrength];

  // ============================================================
  // Handle Change
  // ============================================================

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "email"
          ? newValue.toLowerCase()
          : name === "employeeId"
            ? newValue.toUpperCase()
            : newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.employeeId ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return toast.error("Please fill all fields.");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      const response = await registerMentor({
        name: formData.name,
        email: formData.email,
        employeeId: formData.employeeId,
        password: formData.password,
      });

      toast.success(response.message);

      setRegisteredEmail(formData.email);

      setShowOtpModal(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Mentor registration failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] shadow-[0_25px_80px_rgba(6,182,212,0.15)] backdrop-blur-3xl"
      >
        {/* Top Gradient */}

        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600" />

        {/* Glow */}

        <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-cyan-500/10 blur-[150px]" />

        <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-violet-500/10 blur-[150px]" />

        <div className="relative z-10 p-8 md:p-10">
          {/* Enterprise Badge */}

          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                AMIOUT Enterprise
              </span>
            </div>
          </div>

          <MentorRegisterHeader />

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Name */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400" />

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Full Name"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-4 pl-12 pr-4 text-white outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            {/* Official Email */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Official Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400" />

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="mentor@s.amity.edu"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-4 pl-12 pr-4 text-white outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {formData.email && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  {validateEmail(formData.email) ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">
                        Valid Official Email
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400">Use your Amity Email</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Employee ID */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Employee ID
              </label>

              <div className="relative">
                <BadgeCheck className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400" />

                <input
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="EMP00123"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-4 pl-12 pr-4 text-white outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {formData.employeeId && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  {validateEmployeeId(formData.employeeId) ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">
                        Valid Employee ID
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400">Invalid Employee ID</span>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* ===================================================== */}
            {/* Password */}
            {/* ===================================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-4 pl-4 pr-12 text-white outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Strength */}

              {formData.password && (
                <>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        passwordStrength <= 1
                          ? "w-1/5 bg-red-500"
                          : passwordStrength === 2
                            ? "w-2/5 bg-orange-500"
                            : passwordStrength === 3
                              ? "w-3/5 bg-yellow-500"
                              : passwordStrength === 4
                                ? "w-4/5 bg-cyan-500"
                                : "w-full bg-emerald-500"
                      }`}
                    />
                  </div>

                  <p className="mt-2 text-sm font-medium text-cyan-300">
                    Password Strength : {passwordStrengthLabel}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {formData.password.length >= 8 ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-slate-400">
                        Minimum 8 characters
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/[A-Z]/.test(formData.password) ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-slate-400">
                        One uppercase letter
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/[0-9]/.test(formData.password) ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-slate-400">One number</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/[^A-Za-z0-9]/.test(formData.password) ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-slate-400">
                        One special character
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ===================================================== */}
            {/* Confirm Password */}
            {/* ===================================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-4 pl-4 pr-12 text-white outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {formData.confirmPassword && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* ===================================================== */}
            {/* Terms & Conditions */}
            {/* ===================================================== */}

            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-cyan-500/30">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mt-1 h-5 w-5 rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />

              <span className="text-sm leading-7 text-slate-400">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* ===================================================== */}
            {/* Register Button */}
            {/* ===================================================== */}

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {loading ? (
                <div className="relative z-10 flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Registering...
                </div>
              ) : (
                <div className="relative z-10 flex items-center gap-3">
                  Register Mentor
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              )}
            </motion.button>

            {/* ===================================================== */}
            {/* Divider */}
            {/* ===================================================== */}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-[#111827] px-4 text-sm text-slate-500">
                  OR
                </span>
              </div>
            </div>

            {/* ===================================================== */}
            {/* Login */}
            {/* ===================================================== */}

            <div className="text-center">
              <p className="text-sm text-slate-400">
                Already have a mentor account?
              </p>

              <Link
                to="/mentor/login"
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-cyan-300 transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </form>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* OTP Modal */}
      {/* ===================================================== */}

      <MentorOtpModal
        open={showOtpModal}
        email={registeredEmail}
        onClose={() => setShowOtpModal(false)}
      />
    </>
  );
};

export default MentorRegisterCard;
