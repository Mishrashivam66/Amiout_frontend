import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Users,
  Building2,
  ScanLine,
} from "lucide-react";

import { toast } from "sonner";

import campusLogo from "../../../assets/Campus Logo.png";
import { useAuth } from "../../../context/AuthContext";
import { login as loginService } from "../services/auth.service";

// ==========================================
// ROLE DASHBOARD ROUTES
// ==========================================

const DASHBOARD_ROUTES = {
  STUDENT: "/student/dashboard",
  MENTOR: "/mentor/dashboard",
  COORDINATOR: "/coordinator/dashboard",
  HOD: "/hod/dashboard",
  HOI: "/hoi/dashboard",
  ADMIN: "/admin/dashboard",
  SECURITY: "/security/dashboard",
  SUPER_ADMIN: "/super-admin/dashboard",
};

// ==========================================
// ROLE LABELS
// ==========================================

const roleItems = [
  {
    label: "Student",
    icon: GraduationCap,
    color: "text-emerald-400",
  },
  {
    label: "Faculty",
    icon: Users,
    color: "text-cyan-400",
  },
  {
    label: "Admin",
    icon: Building2,
    color: "text-violet-400",
  },
  {
    label: "Security",
    icon: ScanLine,
    color: "text-rose-400",
  },
];

// ==========================================
// LOGIN CARD
// ==========================================

const LoginCard = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // ========================================
  // INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ========================================
  // HANDLE LOGIN
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!formData.email.trim() || !formData.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Common backend login for all roles.
      const response = await loginService({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (!response?.user || !response?.accessToken) {
        throw new Error("Invalid login response.");
      }

      const user = response.user;

      // ====================================
      // RESOLVE AUTHORIZED ROLES
      // ====================================

      const assignedRoles = [
        ...new Set(
          [...(Array.isArray(user.roles) ? user.roles : []), user.role]
            .filter((role) => typeof role === "string")
            .map((role) => role.trim().toUpperCase()),
        ),
      ];

      const availableRoles = assignedRoles.filter(
        (role) => DASHBOARD_ROUTES[role],
      );

      if (!availableRoles.length) {
        throw new Error("No dashboard assigned to this account.");
      }

      const preferredRole = String(user.role || "")
        .trim()
        .toUpperCase();

      const primaryRole = availableRoles.includes(preferredRole)
        ? preferredRole
        : availableRoles[0];

      const normalizedUser = {
        ...user,
        role: primaryRole,
        roles: assignedRoles,
        mustChangePassword:
          response.mustChangePassword === true ||
          user.mustChangePassword === true,
      };

      // ====================================
      // SAVE AUTHENTICATED USER
      // ====================================

      // Reuse existing AuthContext.
      login(normalizedUser, response.accessToken);
      console.log("LOGIN RESPONSE:", response);
      console.log("USER ROLE:", primaryRole);
      console.log("MUST CHANGE PASSWORD:", normalizedUser.mustChangePassword);
      console.log("REDIRECT PATH:", DASHBOARD_ROUTES[primaryRole]);
      // ====================================
      // FIRST LOGIN PASSWORD CHANGE
      // ====================================

      if (normalizedUser.mustChangePassword) {
        toast.info("Please change your temporary password to continue.");

        navigate("/change-password", {
          replace: true,
        });

        return;
      }

      // ====================================
      // NORMAL DASHBOARD REDIRECT
      // ====================================

      toast.success(response.message || "Login successful!");

      navigate(DASHBOARD_ROUTES[primaryRole], {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] bg-[#061225]/90 px-5 py-6 text-white backdrop-blur-2xl sm:px-9 sm:py-8">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-60 w-60 rounded-full bg-violet-600/15 blur-[90px]" />

      <div className="relative z-10">
        {/* Center Logo */}
        <div className="mb-5 flex flex-col items-center text-center">
          <img
            src={campusLogo}
            alt="AMIOUT Logo"
            className="mb-3 h-24 w-24 rounded-2xl object-contain drop-shadow-[0_0_20px_rgba(0,212,255,0.35)] sm:h-28 sm:w-28"
          />

          <h2 className="text-3xl font-black tracking-tight">AMIOUT</h2>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.19em] text-cyan-300">
            Amity University Madhya Pradesh
          </p>
        </div>

        {/* Welcome Heading */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-extrabold sm:text-[28px]">
            Welcome Back
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Sign in with your university email to continue
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              University Email Address
            </label>

            <div className="flex items-center rounded-xl border border-white/15 bg-[#111e34]/80 transition focus-within:border-cyan-400/70">
              <Mail className="ml-4 h-5 w-5 shrink-0 text-cyan-400" />

              <input
                id="login-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your university email"
                autoComplete="username"
                required
                disabled={loading}
                className="w-full min-w-0 bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="login-password"
                className="text-sm font-semibold text-slate-200"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="flex items-center rounded-xl border border-white/15 bg-[#111e34]/80 transition focus-within:border-cyan-400/70">
              <LockKeyhole className="ml-4 h-5 w-5 shrink-0 text-cyan-400" />

              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="mr-4 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              disabled={loading}
              className="h-4 w-4 accent-cyan-500"
            />

            <span className="text-sm text-slate-300">Remember me</span>
          </label>

          {/* Sign In */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-500/25 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-slate-500">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Activate Account */}
        <div className="rounded-xl border border-white/15 bg-white/[0.035] px-4 py-3.5 text-center">
          <p className="text-sm text-slate-300">First time using AMIOUT?</p>

          <Link
            to="/activate-account"
            className="mt-1.5 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-cyan-200"
          >
            Activate Your Account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Role Labels */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {roleItems.map(({ label, icon: Icon, color }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-2 py-2.5 text-xs font-medium text-slate-200"
            >
              <Icon className={`h-4 w-4 ${color}`} />
              {label}
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-slate-400">
          One secure login for Students, Faculty, Administration and Security.
        </p>
      </div>
    </div>
  );
};

export default LoginCard;
