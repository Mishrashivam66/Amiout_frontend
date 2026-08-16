// ============================================================
// AMIOUT Enterprise Edition
// Student Register Card
// ============================================================

import { register } from "../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { useMemo, useState } from "react";

import { motion } from "framer-motion";

import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

import RegisterHeader from "./RegisterHeader";

import AuthInput from "../common/AuthInput";
import PasswordInput from "../common/PasswordInput";

const RegisterCard = () => {
  // ============================================================
  // State
  // ============================================================

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    enrollment: "",
    mobile: "",
    department: "",
    year: "",
    semester: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
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

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@(s\.amity\.edu|gwa\.amity\.edu)$/i.test(email);

  const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

  const validateEnrollment = (value) => /^[A-Za-z0-9]{6,20}$/.test(value);
  const emailValid = formData.email && validateEmail(formData.email);

  const mobileValid = formData.mobile && validateMobile(formData.mobile);

  const enrollmentValid =
    formData.enrollment && validateEnrollment(formData.enrollment);

  const passwordMatch =
    formData.confirmPassword && formData.password === formData.confirmPassword;

  const passwordChecks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    let newValue = type === "checkbox" ? checked : value;

    if (name === "email") {
      newValue = newValue.toLowerCase();
    }

    if (name === "mobile") {
      newValue = newValue.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "fullName") {
      newValue = newValue
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    if (name === "enrollment") {
      newValue = newValue.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ============================================================
  // Handle Submit
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!formData.terms) {
      toast.error("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        enrollmentNo: formData.enrollment,
        mobileNumber: formData.mobile,
        course: formData.department,
        branch: formData.year,
        semester: formData.semester,
        password: formData.password,
      };
      const response = await register(payload);

      toast.success(response?.message || "OTP sent successfully.");

      navigate("/verify-otp", {
        replace: true,
        state: {
          email: formData.email,
          purpose: "register",
        },
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      toast.error(message);
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
        overflow-hidden
        rounded-4xl
        border
        border-white/10
        bg-white/6
        shadow-[0_25px_80px_rgba(6,182,212,0.15)]
        backdrop-blur-3xl
      "
    >
      {/* ===================================================== */}
      {/* Top Gradient */}
      {/* ===================================================== */}

      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-500 via-blue-500 to-violet-600" />

      {/* ===================================================== */}
      {/* Glow */}
      {/* ===================================================== */}

      <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-violet-500/10 blur-[150px]" />

      {/* ===================================================== */}
      {/* Content */}
      {/* ===================================================== */}

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        {/* Badge */}

        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              AMIOUT Enterprise
            </span>
          </div>
        </div>

        {/* Header */}

        <div className="text-center">
          <h1 className="text-3xl font-black text-white sm:text-4xl">
            Student Registration
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
            Create your AMIOUT account to access the Smart Outpass Management
            Platform.
          </p>
        </div>

        {/* Existing Header */}

        <div className="mt-8">
          <RegisterHeader />
        </div>

        {/* ===================================================== */}
        {/* Form */}
        {/* ===================================================== */}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* ===================================================== */}
          {/* Full Name */}
          {/* ===================================================== */}

          <AuthInput
            label="Full Name"
            icon={User}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          {/* ===================================================== */}
          {/* University Email */}
          {/* ===================================================== */}

          <AuthInput
            label="University Email"
            type="email"
            icon={Mail}
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="yourname@s.amity.edu"
            isValid={emailValid}
            isInvalid={formData.email && !emailValid}
            helperText={
              formData.email
                ? emailValid
                  ? "✔ Valid University Email"
                  : "❌ Invalid University Email"
                : ""
            }
          />

          {/* ===================================================== */}
          {/* Enrollment + Mobile */}
          {/* ===================================================== */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AuthInput
              label="Enrollment Number"
              icon={GraduationCap}
              name="enrollment"
              value={formData.enrollment}
              onChange={handleChange}
              placeholder="A123456789"
              isValid={enrollmentValid}
              isInvalid={formData.enrollment && !enrollmentValid}
              helperText={
                formData.enrollment
                  ? enrollmentValid
                    ? "✔ Valid Enrollment"
                    : "❌ Invalid Enrollment"
                  : ""
              }
            />

            <AuthInput
              label="Mobile Number"
              icon={Phone}
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="9876543210"
              inputMode="numeric"
              maxLength={10}
              isValid={mobileValid}
              isInvalid={formData.mobile && !mobileValid}
              helperText={
                formData.mobile
                  ? mobileValid
                    ? "✔ Valid Mobile Number"
                    : "❌ Invalid Mobile Number"
                  : ""
              }
            />
          </div>

          {/* ===================================================== */}
          {/* Department + Academic Year */}
          {/* ===================================================== */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AuthInput
              label="Department"
              icon={Building2}
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Computer Science & Engineering"
            />

            <AuthInput
              label="Academic Year"
              icon={GraduationCap}
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="3rd Year"
            />
          </div>

          {/* ===================================================== */}
          {/* Semester */}
          {/* ===================================================== */}

          <AuthInput
            label="Semester"
            icon={GraduationCap}
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="5th Semester"
          />

          {/* ===================================================== */}
          {/* Password */}
          {/* ===================================================== */}

          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            showStrength
            showChecklist
            strength={passwordStrength}
            strengthLabel={passwordStrengthLabel}
            passwordChecks={passwordChecks}
          />

          {/* ===================================================== */}
          {/* Confirm Password */}
          {/* ===================================================== */}

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            isValid={passwordMatch}
            isInvalid={formData.confirmPassword && !passwordMatch}
            helperText={
              formData.confirmPassword
                ? passwordMatch
                  ? "✔ Passwords Match"
                  : "❌ Passwords do not match"
                : ""
            }
          />

          {/* ===================================================== */}
          {/* Terms */}
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
                className="font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* ===================================================== */}
          {/* Submit Button */}
          {/* ===================================================== */}

          <motion.button
            whileHover={{
              scale: loading ? 1 : 1.02,
            }}
            whileTap={{
              scale: loading ? 1 : 0.98,
            }}
            type="submit"
            disabled={loading}
            className="
              group
              relative
              flex
              w-full
              items-center
              justify-center
              overflow-hidden
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              via-blue-600
              to-violet-600
              px-6
              py-4
              text-base
              font-bold
              text-white
              shadow-xl
              shadow-cyan-500/20
              transition-all
              duration-300
              hover:shadow-cyan-500/40
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {loading ? (
              <div className="relative z-10 flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating Account...
              </div>
            ) : (
              <div className="relative z-10 flex items-center gap-3">
                Create Student Account
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
              <span className="bg-slate-950 px-4 text-sm text-slate-500">
                OR
              </span>
            </div>
          </div>

          {/* ===================================================== */}
          {/* Login */}
          {/* ===================================================== */}

          <div className="text-center">
            <p className="text-sm text-slate-400">Already have an account?</p>

            <Link
              to="/login"
              className="
                mt-3
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-6
                py-3
                font-semibold
                text-cyan-300
                transition-all
                duration-300
                hover:border-cyan-500/30
                hover:bg-cyan-500/10
                hover:text-white
              "
            >
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterCard;
