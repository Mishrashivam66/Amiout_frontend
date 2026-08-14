// ============================================================
// AMIOUT Enterprise Edition
// RegisterCard.jsx
// ============================================================
import { register } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  ArrowRight,
} from "lucide-react";

import { toast } from "sonner";

import RegisterHeader from "./RegisterHeader";

import AuthInput from "../common/AuthInput";
import PasswordInput from "../common/PasswordInput";

const RegisterCard = () => {
  // ======================================
  // State
  // ======================================
  const navigate = useNavigate();
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

  // ======================================
  // Handle Change
  // ======================================
  // ======================================
  // Handle Change
  // ======================================

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // ======================================
  // Submit
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Terms Check
    if (!formData.terms) {
      toast.error("Please accept the Terms & Conditions.");
      return;
    }

    // Password Match Check
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.fullName,

        email: formData.email,

        enrollmentNo: formData.enrollment,

        mobileNumber: formData.mobile,

        course: "B.Tech",

        branch: formData.department,

        semester: parseInt(formData.semester),

        password: formData.password,
      };

      const response = await register(payload);

      toast.success(response.message || "Registration successful");

      navigate("/verify-otp", {
        state: {
          email: formData.email,

          purpose: "REGISTER",
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
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
        overflow-hidden
        rounded-[28px]
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

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-violet-500/10 blur-[140px]" />

      {/* Content */}

      <div className="relative z-10 px-8 py-8">
        <RegisterHeader />

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* ====================================== */}
          {/* Full Name */}
          {/* ====================================== */}

          <AuthInput
            label="Full Name"
            icon={User}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          {/* ====================================== */}
          {/* University Email */}
          {/* ====================================== */}

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
          {/* Enrollment + Mobile */}
          {/* ====================================== */}

          <div className="grid gap-6 md:grid-cols-2">
            <AuthInput
              label="Enrollment Number"
              icon={GraduationCap}
              name="enrollment"
              value={formData.enrollment}
              onChange={handleChange}
              placeholder="A123456789"
            />

            <AuthInput
              label="Mobile Number"
              icon={Phone}
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="9876543210"
            />
          </div>

          {/* ====================================== */}
          {/* Department + Academic Year */}
          {/* ====================================== */}

          <div className="grid gap-6 md:grid-cols-2">
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
          {/* ====================================== */}
          {/* Semester */}
          {/* ====================================== */}

          <AuthInput
            label="Semester"
            icon={GraduationCap}
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="5th Semester"
          />

          {/* ====================================== */}
          {/* Password */}
          {/* ====================================== */}

          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
          />

          {/* ====================================== */}
          {/* Confirm Password */}
          {/* ====================================== */}

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
          />

          {/* ====================================== */}
          {/* Terms & Conditions */}
          {/* ====================================== */}

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="mt-1 h-5 w-5 rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
            />

            <span className="text-sm leading-6 text-slate-400">
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

          {/* ====================================== */}
          {/* Register Button */}
          {/* ====================================== */}

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
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>

          {/* ====================================== */}
          {/* Footer */}
          {/* ====================================== */}

          <div className="pt-2 text-center">
            <p className="text-slate-400">
              Already have an account?
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
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterCard;
