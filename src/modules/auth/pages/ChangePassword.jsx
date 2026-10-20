import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import campusLogo from "../../../assets/Campus Logo.png";
import { useAuth } from "../../../context/AuthContext";
import { changePassword } from "../services/auth.service";

// ==========================================
// PASSWORD VALIDATION
// ==========================================

const getPasswordRules = (password) => [
  {
    label: "At least 8 characters",
    valid: password.length >= 8,
  },
  {
    label: "One uppercase letter",
    valid: /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    valid: /[a-z]/.test(password),
  },
  {
    label: "One number",
    valid: /\d/.test(password),
  },
  {
    label: "One special character",
    valid: /[^A-Za-z0-9]/.test(password),
  },
];

const showError = (message) => {
  toast.error(message, {
    duration: 5000,
    position: "top-center",
  });
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error?.message ||
  error?.message ||
  "Unable to change password. Please try again.";

// ==========================================
// PASSWORD FIELD
// ==========================================

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
  disabled,
  autoComplete,
}) => (
  <div>
    <label
      htmlFor={name}
      className="mb-2 block text-sm font-medium text-slate-200"
    >
      {label}
    </label>

    <div className="relative">
      <LockKeyhole
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        id={name}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        required
        className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/[0.08] focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-300 disabled:opacity-50"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

// ==========================================
// CHANGE PASSWORD PAGE
// ==========================================

const ChangePassword = () => {
  const { user, logout } = useAuth();

  const submittingRef = useRef(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const passwordRules = getPasswordRules(formData.newPassword);

  const isStrongPassword = passwordRules.every((rule) => rule.valid);

  const passwordsMatch =
    formData.newPassword.length > 0 &&
    formData.newPassword === formData.confirmPassword;

  // ========================================
  // INPUT HANDLERS
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const togglePassword = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  // ========================================
  // SUBMIT PASSWORD CHANGE
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submittingRef.current || completed) return;

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      showError("Please fill in all fields.");
      return;
    }

    if (!isStrongPassword) {
      showError("Please choose a stronger password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("New password and confirm password do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      showError(
        "Your new password must be different from the current password.",
      );
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      // Existing backend API.
      await changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });
    } catch (error) {
      showError(getErrorMessage(error));
      submittingRef.current = false;
      setLoading(false);
      return;
    }

    // Password change has succeeded.
    // Never repeat the API request after this point.
    setCompleted(true);

    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    try {
      // Backend has invalidated the old sessions.
      // Do not call the logout API again.
      await logout({
        skipServer: true,
        showToast: false,
        redirectState: {
          passwordChanged: true,
        },
      });
    } catch (error) {
      console.error("Post-password-change redirect failed:", error);

      showError(
        "Password updated successfully. Please open the login page and sign in with your new password.",
      );
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030817] px-4 py-10 text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[110px]" />

        <div className="absolute -bottom-40 -right-28 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[510px]"
      >
        {/* BRAND */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-3 shadow-xl shadow-cyan-500/10 backdrop-blur-xl">
            <img
              src={campusLogo}
              alt="University Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AMI
            <span className="text-cyan-400">OUT</span>
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Enterprise Identity & Access Management
          </p>
        </div>

        {/* PASSWORD CARD */}
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1427]/90 shadow-2xl shadow-black/40 backdrop-blur-2xl">
          <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />

          <div className="p-6 sm:p-9">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <KeyRound size={23} className="text-cyan-400" />
              </div>

              <div>
                <h2 className="text-xl font-semibold sm:text-2xl">
                  Secure Your Account
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Change your temporary password before accessing AMIOUT.
                </p>
              </div>
            </div>

            {/* USER INFORMATION */}
            {user?.email && (
              <div className="mb-6 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Signed in as
                </p>

                <p className="mt-1 break-all text-sm font-medium text-cyan-300">
                  {user.email}
                </p>
              </div>
            )}

            {/* SECURITY NOTICE */}
            <div className="mb-7 flex gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-amber-300"
              />

              <p className="text-xs leading-6 text-amber-100/85">
                For your security, your temporary password must be replaced with
                a private password known only to you.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <PasswordField
                label="Current / Temporary Password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter temporary password"
                visible={showPasswords.oldPassword}
                onToggle={() => togglePassword("oldPassword")}
                disabled={loading || completed}
                autoComplete="current-password"
              />

              <PasswordField
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Create a strong password"
                visible={showPasswords.newPassword}
                onToggle={() => togglePassword("newPassword")}
                disabled={loading || completed}
                autoComplete="new-password"
              />

              {/* PASSWORD REQUIREMENTS */}
              {formData.newPassword.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Password Requirements
                  </p>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {passwordRules.map((rule) => (
                      <div
                        key={rule.label}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full ${
                            rule.valid
                              ? "bg-emerald-400/15 text-emerald-400"
                              : "bg-slate-700 text-slate-400"
                          }`}
                        >
                          {rule.valid ? (
                            <Check size={11} />
                          ) : (
                            <span className="h-1 w-1 rounded-full bg-current" />
                          )}
                        </span>

                        <span
                          className={
                            rule.valid ? "text-emerald-300" : "text-slate-400"
                          }
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <PasswordField
                label="Confirm New Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter new password"
                visible={showPasswords.confirmPassword}
                onToggle={() => togglePassword("confirmPassword")}
                disabled={loading || completed}
                autoComplete="new-password"
              />

              {formData.confirmPassword && (
                <p
                  className={`flex items-center gap-2 text-xs ${
                    passwordsMatch ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 size={14} />
                      Passwords match
                    </>
                  ) : (
                    "Passwords do not match"
                  )}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  loading ||
                  completed ||
                  !formData.oldPassword ||
                  !isStrongPassword ||
                  !passwordsMatch
                }
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating Password...
                  </>
                ) : completed ? (
                  <>
                    <CheckCircle2 size={18} />
                    Password Updated
                  </>
                ) : (
                  <>
                    Update Password
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* FOOTER */}
            <div className="mt-7 border-t border-white/10 pt-5 text-center">
              <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={14} />
                Secure AMIOUT Authentication
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} AMIOUT Enterprise Edition
        </p>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
