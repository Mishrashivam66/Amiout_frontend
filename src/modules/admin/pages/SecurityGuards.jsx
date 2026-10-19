import { useState } from "react";
import toast from "react-hot-toast";

import {
  ShieldCheck,
  ShieldPlus,
  UserPlus,
  UserRound,
  Mail,
  IdCard,
  Phone,
  MapPin,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  KeyRound,
  Info,
  RotateCcw,
  Shield,
} from "lucide-react";

import api from "../../../services/api";

// ============================================================
// AMIOUT ENTERPRISE - SECURITY GUARD MANAGEMENT
//
// Existing backend API preserved:
// POST /auth/admin/security-guards
//
// Creates SECURITY accounts through authorized Admin.
//
// UI: Navy + Emerald / Premium University Dashboard
// Feedback: react-hot-toast
// ============================================================

const initialForm = {
  name: "",
  employeeId: "",
  email: "",
  phone: "",
  assignedGate: "",
  password: "",
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to create Security Guard.";

const passwordRules = [
  {
    label: "12–128 characters",
    check: (value) => value.length >= 12 && value.length <= 128,
  },
  {
    label: "Uppercase letter",
    check: (value) => /[A-Z]/.test(value),
  },
  {
    label: "Lowercase letter",
    check: (value) => /[a-z]/.test(value),
  },
  {
    label: "Number",
    check: (value) => /[0-9]/.test(value),
  },
  {
    label: "Special character",
    check: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

const SectionHeading = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-6 flex items-start gap-3">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
      <Icon size={21} />
    </div>

    <div>
      <h2 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h2>

      <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
        {subtitle}
      </p>
    </div>
  </div>
);

const FormField = ({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  placeholder,
  required = false,
  type = "text",
  maxLength = 100,
  hint,
  autoComplete = "off",
  inputMode,
  pattern,
}) => (
  <div className="min-w-0">
    <label
      htmlFor={`guard-${name}`}
      className="mb-2 block text-sm font-semibold text-slate-700"
    >
      {label}

      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <div className="group relative">
      <Icon
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600"
      />

      <input
        id={`guard-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all duration-200 placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      />
    </div>

    {hint && <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p>}
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const SecurityGuards = () => {
  const [form, setForm] = useState(initialForm);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [createdGuard, setCreatedGuard] = useState(null);

  const passedRules = passwordRules.filter((rule) =>
    rule.check(form.password),
  ).length;

  const passwordValid = passedRules === passwordRules.length;

  // ==========================================================
  // FORM CHANGE HANDLER
  // ==========================================================

  const updateField = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "employeeId") {
      nextValue = value.toUpperCase().replace(/\s/g, "");
    }

    if (name === "email") {
      nextValue = value.toLowerCase();
    }

    if (name === "phone") {
      nextValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((previous) => ({
      ...previous,
      [name]: nextValue,
    }));
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    if (loading) return;

    setForm(initialForm);
    setShowPassword(false);
    setCreatedGuard(null);
  };

  // ==========================================================
  // CREATE SECURITY GUARD
  // ==========================================================

  const createGuard = async (event) => {
    event.preventDefault();

    if (loading) return;

    const payload = {
      name: form.name.trim(),
      employeeId: form.employeeId.trim().toUpperCase(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      assignedGate: form.assignedGate.trim(),
      password: form.password,
    };

    if (
      !payload.name ||
      !payload.employeeId ||
      !payload.email ||
      !payload.assignedGate ||
      !payload.password
    ) {
      toast.error("Please complete all required fields.", {
        duration: 1000,
      });
      return;
    }

    if (payload.name.length < 3) {
      toast.error("Guard name must contain at least 3 characters.", {
        duration: 1000,
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      toast.error("Please enter a valid email address.", {
        duration: 1000,
      });
      return;
    }

    if (payload.phone && !/^\d{10}$/.test(payload.phone)) {
      toast.error("Mobile number must contain 10 digits.", {
        duration: 1000,
      });
      return;
    }

    if (!passwordValid) {
      toast.error("Password must meet all security requirements.", {
        duration: 1000,
      });
      return;
    }

    setLoading(true);
    setCreatedGuard(null);

    try {
      // Existing API and request fields preserved.
      const response = await api.post("/auth/admin/security-guards", payload);

      const result = response.data;

      if (result?.success !== true) {
        throw new Error(result?.message || "Unable to create Security Guard.");
      }

      // Preserve existing backend response.
      setCreatedGuard(
        result.data || {
          name: payload.name,
          employeeId: payload.employeeId,
          email: payload.email,
          assignedGate: payload.assignedGate,
        },
      );

      // Remove temporary credentials from the form state.
      setForm(initialForm);
      setShowPassword(false);

      toast.success(result?.message || "Security Guard created successfully!", {
        duration: 1000,
        icon: "✅",
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main className="min-h-full bg-[#F3F6FA] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* ================================================
            HERO HEADER
        ================================================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0C1A2E] via-[#112740] to-[#084B3A] p-6 shadow-xl shadow-slate-900/10 sm:p-8 lg:p-10">
          {/* Decorative circles */}

          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/10 bg-emerald-400/5" />

          <div className="pointer-events-none absolute -bottom-32 right-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            {/* Hero content */}

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-lg">
                <ShieldPlus size={29} />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                  <Sparkles size={13} />
                  AMIOUT Enterprise
                </div>

                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Security Guard Management
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Create and provision authorized campus security personnel for
                  QR-based student EXIT and ENTRY verification.
                </p>
              </div>
            </div>

            <div className="inline-flex shrink-0 items-center gap-3 self-start rounded-2xl border border-emerald-400/20 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-xs font-bold text-white">Admin Authorized</p>

                <p className="mt-1 text-[11px] text-emerald-300">
                  Secure account provisioning
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================
            SUCCESS INFORMATION
        ================================================= */}

        {createdGuard && (
          <section
            role="status"
            className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={26} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-emerald-900">
                  Security Guard Created Successfully
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  The account creation request completed successfully.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Guard Name", createdGuard.name],
                    ["Employee ID", createdGuard.employeeId],
                    ["Login Email", createdGuard.email],
                    ["Assigned Gate", createdGuard.assignedGate],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                      </p>

                      <p className="mt-1 break-words text-sm font-bold text-slate-900">
                        {value || "Not provided"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-6 text-amber-900">
                  <Info size={17} className="mt-1 shrink-0" />

                  <p>
                    Share the temporary password through an authorized private
                    channel. The guard must follow the required first-login
                    password-change process.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCreatedGuard(null)}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900"
                >
                  <UserPlus size={17} />
                  Create Another Guard
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ================================================
            FORM CONTENT
        ================================================= */}

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_285px]">
          {/* MAIN FORM */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Form header */}

            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <UserPlus size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#10243A]">
                    Add New Security Guard
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Complete the required account information
                  </p>
                </div>
              </div>

              <span className="hidden rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:inline-flex">
                SECURE FORM
              </span>
            </div>

            <form
              onSubmit={createGuard}
              autoComplete="off"
              className="p-5 sm:p-7"
            >
              {/* ============================================
                  PERSONAL INFORMATION
              ============================================ */}

              <SectionHeading
                icon={UserRound}
                title="Personal Information"
                subtitle="Basic identification and contact details"
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField
                  label="Guard Full Name"
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  icon={UserRound}
                  placeholder="Enter security guard's full name"
                  required
                  maxLength={100}
                  autoComplete="name"
                />

                <FormField
                  label="Employee ID"
                  name="employeeId"
                  value={form.employeeId}
                  onChange={updateField}
                  icon={IdCard}
                  placeholder="e.g. SEC001"
                  required
                  maxLength={30}
                  hint="Use the authorized employee identifier."
                />

                <FormField
                  label="Official Login Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  icon={Mail}
                  placeholder="guard@example.com"
                  required
                  maxLength={100}
                  autoComplete="off"
                />

                <FormField
                  label="Mobile Number (Optional)"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateField}
                  icon={Phone}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                />
              </div>

              {/* SECTION DIVIDER */}

              <div className="my-8 h-px bg-slate-100" />

              {/* ============================================
                  GATE ASSIGNMENT
              ============================================ */}

              <SectionHeading
                icon={MapPin}
                title="Gate Assignment"
                subtitle="Assign the campus gate this guard will manage"
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField
                  label="Assigned Campus Gate"
                  name="assignedGate"
                  value={form.assignedGate}
                  onChange={updateField}
                  icon={MapPin}
                  placeholder="e.g. Main Gate"
                  required
                  maxLength={100}
                  hint="Must match the authorized gate name used by your backend."
                />

                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <ShieldCheck
                    size={23}
                    className="shrink-0 text-emerald-700"
                  />

                  <p className="text-xs leading-6 text-emerald-900">
                    Security access and gate authorization are validated by the
                    existing backend.
                  </p>
                </div>
              </div>

              {/* SECTION DIVIDER */}

              <div className="my-8 h-px bg-slate-100" />

              {/* ============================================
                  LOGIN CREDENTIALS
              ============================================ */}

              <SectionHeading
                icon={LockKeyhole}
                title="Account Security"
                subtitle="Set a strong temporary login password"
              />

              <div>
                <label
                  htmlFor="guard-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Temporary Password
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="group relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600"
                  />

                  <input
                    id="guard-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={updateField}
                    required
                    minLength={12}
                    maxLength={128}
                    autoComplete="new-password"
                    placeholder="Enter strong temporary password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-emerald-700"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {/* PASSWORD STRENGTH */}

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <KeyRound size={16} />
                      Password Requirements
                    </p>

                    <span
                      className={`text-xs font-bold ${
                        passwordValid ? "text-emerald-700" : "text-slate-500"
                      }`}
                    >
                      {passedRules}/5 Completed
                    </span>
                  </div>

                  {/* STRENGTH BAR */}

                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {passwordRules.map((rule, index) => (
                      <div
                        key={rule.label}
                        className={`h-1.5 rounded-full transition-colors ${
                          index < passedRules
                            ? "bg-emerald-500"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* RULES */}

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {passwordRules.map((rule) => {
                      const valid = rule.check(form.password);

                      return (
                        <div
                          key={rule.label}
                          className={`flex items-center gap-2 text-xs ${
                            valid ? "text-emerald-700" : "text-slate-500"
                          }`}
                        >
                          <CheckCircle2
                            size={15}
                            className={
                              valid ? "text-emerald-600" : "text-slate-300"
                            }
                          />

                          {rule.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ============================================
                  FORM ACTIONS
              ============================================ */}

              <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
                >
                  <RotateCcw size={17} />
                  Reset Form
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                >
                  {loading ? (
                    <Loader2 size={19} className="animate-spin" />
                  ) : (
                    <ShieldPlus size={19} />
                  )}

                  {loading
                    ? "Creating Security Guard..."
                    : "Create Security Guard"}

                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* ================================================
              RIGHT INFORMATION PANEL
          ================================================= */}

          <aside className="space-y-5">
            {/* WORKFLOW CARD */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-[#10243A] p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-300" />

                  <h3 className="font-bold text-white">Security Workflow</h3>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-300">
                  Authorized AMIOUT gate verification
                </p>
              </div>

              <div className="space-y-5 p-5">
                {[
                  {
                    number: "01",
                    title: "Create Account",
                    description:
                      "Admin provisions an authorized Security Guard.",
                  },
                  {
                    number: "02",
                    title: "Secure Login",
                    description: "Guard signs in using authorized credentials.",
                  },
                  {
                    number: "03",
                    title: "Scan Outpass",
                    description: "Scan the QR and review student details.",
                  },
                  {
                    number: "04",
                    title: "Verify EXIT / ENTRY",
                    description: "Confirm movement after reviewing details.",
                  },
                ].map((step) => (
                  <div key={step.number} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-black text-emerald-700">
                      {step.number}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {step.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECURITY REMINDER */}

            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={19} className="text-amber-700" />

                <h3 className="font-bold text-amber-950">Important</h3>
              </div>

              <p className="mt-3 text-xs leading-6 text-amber-900">
                Share login credentials only with the authorized guard. Do not
                place temporary passwords in screenshots or public messages.
              </p>
            </section>

            {/* ADMIN PRIVILEGE */}

            <section className="rounded-3xl border border-emerald-100 bg-[#EDF9F4] p-5">
              <div className="flex items-center gap-2 text-emerald-800">
                <Shield size={20} />

                <h3 className="font-bold">Access Control</h3>
              </div>

              <p className="mt-3 text-xs leading-6 text-emerald-900">
                Security Guard accounts are provisioned through the Admin
                module. Super Admin manages university administrators
                separately.
              </p>
            </section>
          </aside>
        </div>

        {/* FOOTER */}

        <div className="pb-4 text-center text-xs text-slate-400">
          AMIOUT Enterprise · Secure Campus Gate Management
        </div>
      </div>
    </main>
  );
};

export default SecurityGuards;
