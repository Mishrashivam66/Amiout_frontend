import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import {
  User,
  Mail,
  BadgeCheck,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

import AdminRegisterHeader from "./AdminRegisterHeader";
import AdminOtpModal from "./AdminOtpModal";

import { registerAdmin } from "../services/adminAuth.service";

// ============================================================
// AMIOUT ENTERPRISE EDITION
// ADMIN REGISTER CARD
// ============================================================

const getPasswordStrength = (password) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};

const validateEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@(s\.amity\.edu|gwa\.amity\.edu)$/i.test(email);

const validateEmployeeId = (id) => /^[A-Za-z0-9-]{4,20}$/.test(id);

const passwordStrengthLabels = [
  "Very Weak",
  "Weak",
  "Medium",
  "Good",
  "Strong",
  "Excellent",
];

const AdminRegisterCard = () => {
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

  // ==========================================================
  // PASSWORD STRENGTH
  // ==========================================================

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password],
  );

  const passwordStrengthLabel = passwordStrengthLabels[passwordStrength];

  // ==========================================================
  // INPUT HANDLER
  // ==========================================================

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

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

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Use your Amity official email.";
    }

    if (!validateEmployeeId(formData.employeeId)) {
      newErrors.employeeId = "Invalid Employee ID.";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must contain minimum 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.terms) {
      newErrors.terms = "Accept terms and conditions.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted fields.", {
        duration: 5000,
        position: "top-center",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await registerAdmin({
        name: formData.name,
        email: formData.email,
        employeeId: formData.employeeId,
        password: formData.password,
      });

      toast.success(response?.message || "Registration successful.", {
        duration: 2000,
        position: "top-center",
      });

      setRegisteredEmail(formData.email);
      setShowOtpModal(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Admin registration failed.",
        {
          duration: 5000,
          position: "top-center",
        },
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // REUSABLE INPUT STYLE
  // ==========================================================

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-slate-900/60 py-4 pl-12 pr-4 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20";

  const passwordInputClass =
    "w-full rounded-2xl border border-white/10 bg-slate-900/60 py-4 pl-4 pr-12 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20";

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 35,
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
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] shadow-[0_25px_80px_rgba(6,182,212,0.15)] backdrop-blur-3xl"
      >
        {/* Top Gradient */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600" />

        {/* Background Glow */}
        <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute -right-28 -bottom-28 h-72 w-72 rounded-full bg-violet-500/10 blur-[150px]" />

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

          <AdminRegisterHeader />

          {/* ================================================= */}
          {/* REGISTRATION FORM */}
          {/* ================================================= */}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Validation Summary */}
            {Object.values(errors).some(Boolean) && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-4"
              >
                <p className="mb-2 text-sm font-semibold text-red-300">
                  Please correct the following:
                </p>

                <ul className="list-inside list-disc space-y-1 text-xs text-red-200">
                  {Object.entries(errors)
                    .filter(([, message]) => Boolean(message))
                    .map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                </ul>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label
                htmlFor="admin-name"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400" />

                <input
                  id="admin-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Full Name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  className={inputClass}
                />
              </div>

              {errors.name && (
                <p className="mt-2 text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Official Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Official Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400" />

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@gwa.amity.edu"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className={inputClass}
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
                      <span className="text-red-400">
                        Use Amity Official Email
                      </span>
                    </>
                  )}
                </div>
              )}

              {errors.email && (
                <p className="mt-2 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label
                htmlFor="admin-employee-id"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Employee ID
              </label>

              <div className="relative">
                <BadgeCheck className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400" />

                <input
                  id="admin-employee-id"
                  name="employeeId"
                  type="text"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="EMP00123"
                  aria-invalid={Boolean(errors.employeeId)}
                  className={inputClass}
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

              {errors.employeeId && (
                <p className="mt-2 text-xs text-red-400">{errors.employeeId}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create strong password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                  className={passwordInputClass}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 text-xs text-red-400">{errors.password}</p>
              )}

              {formData.password && (
                <>
                  {/* Strength Bar */}
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

                  <p className="mt-2 text-sm font-semibold text-cyan-300">
                    Strength: {passwordStrengthLabel}
                  </p>

                  {/* Password Requirements */}
                  <div className="mt-3 space-y-2 text-sm">
                    {[
                      {
                        label: "Minimum 8 characters",
                        valid: formData.password.length >= 8,
                      },
                      {
                        label: "One uppercase letter",
                        valid: /[A-Z]/.test(formData.password),
                      },
                      {
                        label: "One number",
                        valid: /[0-9]/.test(formData.password),
                      },
                      {
                        label: "One special character",
                        valid: /[^A-Za-z0-9]/.test(formData.password),
                      },
                    ].map((rule) => (
                      <div key={rule.label} className="flex items-center gap-2">
                        {rule.valid ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}

                        <span className="text-slate-400">{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="admin-confirm-password"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="admin-confirm-password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  className={passwordInputClass}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">Password matched</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400">Password not matched</span>
                    </>
                  )}
                </div>
              )}

              {errors.confirmPassword && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mt-1 h-5 w-5 rounded border-white/20 bg-slate-900 text-cyan-500"
              />

              <span className="text-sm text-slate-400">
                I agree to the{" "}
                <Link to="/terms" className="font-semibold text-cyan-400">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="font-semibold text-cyan-400">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {errors.terms && (
              <p className="-mt-4 text-xs text-red-400">{errors.terms}</p>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{
                scale: loading ? 1 : 1.02,
              }}
              whileTap={{
                scale: loading ? 1 : 0.98,
              }}
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 py-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Registering...
                </>
              ) : (
                <>
                  Create Admin Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>

            {/* Login */}
            <div className="text-center">
              <p className="text-sm text-slate-400">
                Already have an admin account?
              </p>

              <Link
                to="/admin/login"
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-cyan-300"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Existing OTP Modal */}
      <AdminOtpModal
        open={showOtpModal}
        email={registeredEmail}
        onClose={() => setShowOtpModal(false)}
      />
    </>
  );
};

export default AdminRegisterCard;
