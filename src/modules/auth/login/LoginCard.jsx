import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import campusLogo from "../../../assets/Campus Logo.png";
import { useAuth } from "../../../context/AuthContext";
import { login as loginService } from "../services/auth.service";

// ==========================================
// DASHBOARD ROUTES
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
// NOTIFICATION HELPERS
// ==========================================

const showSuccess = (message) => {
  toast.success(message, {
    duration: 2000,
    position: "top-center",
  });
};

const showError = (message) => {
  toast.error(message, {
    duration: 5000,
    position: "top-center",
  });
};

const getLoginErrorMessage = (error) => {
  const status = error?.response?.status;

  const serverMessage = String(error?.response?.data?.message || "");

  if (status === 401 || status === 404) {
    return "Invalid email or password. Please check your credentials and try again.";
  }

  if (status === 429) {
    return "Too many login attempts. Please try again later.";
  }

  if (status === 403) {
    return /inactive|disabled|suspend|blocked/i.test(serverMessage)
      ? "Your account is inactive or restricted. Please contact the administrator."
      : "Access denied. Please contact the administrator.";
  }

  if (
    /invalid credentials|incorrect password|wrong password|invalid email or password/i.test(
      serverMessage,
    )
  ) {
    return "Invalid email or password. Please check your credentials and try again.";
  }

  if (status >= 500) {
    return "Login service is temporarily unavailable. Please try again later.";
  }

  if (!error?.response && error?.request) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  return (
    serverMessage || error?.message || "Unable to sign in. Please try again."
  );
};

// ==========================================
// AMIOUT ENTERPRISE - LOGIN CARD
// ==========================================

const LoginCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const submittingRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // ========================================
  // PASSWORD CHANGE SUCCESS NOTIFICATION
  // ========================================

  useEffect(() => {
    if (!location.state?.passwordChanged) {
      return;
    }

    toast.success(
      "Password updated successfully! Please sign in with your new password.",
      {
        id: "amiout-password-updated",
        duration: 3000,
        position: "top-center",
      },
    );

    // Clear navigation state to avoid
    // showing the same message again.
    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.pathname, location.state, navigate]);

  // ========================================
  // INPUT CHANGE
  // ========================================

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ========================================
  // LOGIN SUBMISSION
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submittingRef.current) return;

    const email = formData.email.trim().toLowerCase();

    const password = formData.password;

    if (!email && !password) {
      showError("Please enter your university email and password.");
      return;
    }

    if (!email) {
      showError("Please enter your university email address.");
      return;
    }

    if (!password) {
      showError("Please enter your password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Please enter a valid university email address.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      const response = await loginService({
        email,
        password,
      });

      if (!response?.user || !response?.accessToken) {
        throw new Error("Invalid login response. Please try again.");
      }

      const user = response.user;

      // Resolve available roles.
      const assignedRoles = [
        ...new Set(
          [...(Array.isArray(user.roles) ? user.roles : []), user.role]
            .filter((role) => typeof role === "string" && role.trim())
            .map((role) => role.trim().toUpperCase()),
        ),
      ];

      const availableRoles = assignedRoles.filter(
        (role) => DASHBOARD_ROUTES[role],
      );

      if (!availableRoles.length) {
        throw new Error("No authorized dashboard is assigned to this account.");
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

      // Save existing authenticated session.
      login(normalizedUser, response.accessToken);

      // First login password change.
      if (normalizedUser.mustChangePassword) {
        toast.info("Please change your temporary password to continue.", {
          duration: 4000,
          position: "top-center",
        });

        navigate("/change-password", {
          replace: true,
        });

        return;
      }

      showSuccess("Login successful! Welcome back.");

      navigate(DASHBOARD_ROUTES[primaryRole], {
        replace: true,
      });
    } catch (error) {
      showError(getLoginErrorMessage(error));
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  // ==========================================
  // LOGIN UI
  // ==========================================

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] bg-[#061225]/90 px-5 py-7 text-white backdrop-blur-2xl sm:px-9 sm:py-9">
      {/* BACKGROUND GLOWS */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-[90px]" />

      <div className="pointer-events-none absolute -bottom-24 -right-20 h-60 w-60 rounded-full bg-violet-600/15 blur-[90px]" />

      <div className="relative z-10">
        {/* LOGO */}
        <div className="mb-6 flex flex-col items-center text-center">
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

        {/* WELCOME */}
        <div className="mb-7 text-center">
          <h3 className="text-2xl font-extrabold sm:text-[28px]">
            Welcome Back
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Sign in with your university credentials
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* EMAIL */}
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              University Email Address
            </label>

            <div className="flex items-center rounded-xl border border-white/15 bg-[#111e34]/80 transition-all focus-within:border-cyan-400/70 focus-within:ring-2 focus-within:ring-cyan-400/10">
              <Mail className="ml-4 h-5 w-5 shrink-0 text-cyan-400" />

              <input
                id="login-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your university email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                disabled={loading}
                aria-required="true"
                className="w-full min-w-0 bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* PASSWORD */}
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
                className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="flex items-center rounded-xl border border-white/15 bg-[#111e34]/80 transition-all focus-within:border-cyan-400/70 focus-within:ring-2 focus-within:ring-cyan-400/10">
              <LockKeyhole className="ml-4 h-5 w-5 shrink-0 text-cyan-400" />

              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                aria-required="true"
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="mr-4 text-slate-400 transition hover:text-white disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* REMEMBER ME */}
          <label className="flex w-fit cursor-pointer items-center gap-3">
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

          {/* SIGN IN */}
          <motion.button
            whileHover={loading ? undefined : { scale: 1.015 }}
            whileTap={loading ? undefined : { scale: 0.985 }}
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-500/25 transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
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

        {/* SECURITY FOOTER */}
        <div className="mt-7 flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-center">
          <ShieldCheck
            className="h-4 w-4 shrink-0 text-emerald-400"
            aria-hidden="true"
          />

          <p className="text-xs text-slate-400">
            Secure University Authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
