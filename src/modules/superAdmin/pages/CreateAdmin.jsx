import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ClipboardCopy,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  UserRoundPlus,
  X,
} from "lucide-react";

import superAdminService from "../services/superAdmin.service";

const initialForm = {
  name: "",
  email: "",
  phone: "",
};

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to create Admin account.";

export default function CreateAdmin() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [created, setCreated] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (name.length < 3 || name.length > 100) {
      toast.error("Enter a valid Admin name.", {
        duration: 1000,
      });
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !email.endsWith("@gwa.amity.edu")
    ) {
      toast.error("Use an authorized gwa.amity.edu email.", {
        duration: 1000,
      });
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit mobile number.", {
        duration: 1000,
      });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await superAdminService.createAdmin({
        name,
        email,
        phone,
      });

      if (!result?.admin || typeof result.temporaryPassword !== "string") {
        throw new Error("Admin creation response is missing required details.");
      }

      setCreated({
        admin: result.admin,
        temporaryPassword: result.temporaryPassword,
      });

      setForm(initialForm);
      setShowPassword(false);

      toast.success("Admin account created", {
        duration: 1000,
      });
    } catch (err) {
      const message = getError(err);
      setError(message);

      toast.error(message, {
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = async () => {
    if (!created?.temporaryPassword) return;

    try {
      await navigator.clipboard.writeText(created.temporaryPassword);

      toast.success("Temporary password copied", {
        duration: 1000,
      });
    } catch {
      toast.error("Clipboard unavailable. Use the displayed credential.", {
        duration: 1000,
      });
    }
  };

  // ==========================================================
  // SUCCESS - ONE-TIME CREDENTIAL DISPLAY
  // ==========================================================

  if (created) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-emerald-400/20 bg-[#102138] p-6 sm:p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
            <CheckCircle2 size={35} />
          </div>

          <h1 className="mt-6 text-2xl font-black text-white sm:text-3xl">
            Admin Created Successfully
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            The account has been created in the Admin collection with role
            ADMIN.
          </p>

          <div className="mt-7 space-y-4 rounded-2xl border border-[#33465e] bg-[#091629] p-5">
            <div>
              <p className="text-xs text-slate-500">Admin Name</p>
              <p className="mt-1 font-bold text-white">{created.admin.name}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Login Email</p>
              <p className="mt-1 break-all font-semibold text-amber-300">
                {created.admin.email}
              </p>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-slate-500">Temporary Password</p>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <div className="min-w-0 flex-1 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 font-mono text-sm text-white">
                  {showPassword
                    ? created.temporaryPassword
                    : "••••••••••••••••••••"}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword
                        ? "Hide temporary password"
                        : "Show temporary password"
                    }
                    className="rounded-xl border border-[#33465e] p-3 text-slate-300 hover:bg-white/5"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>

                  <button
                    type="button"
                    onClick={copyPassword}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-[#091629] hover:bg-amber-300"
                  >
                    <ClipboardCopy size={17} />
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4">
            <AlertTriangle size={21} className="shrink-0 text-amber-300" />

            <p className="text-xs leading-6 text-amber-100">
              This temporary password is displayed only in the current creation
              result. Securely deliver it to the authorized Admin. Automatic
              email delivery is not configured yet. The Admin must change the
              password at first login.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/super-admin/admins"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-[#091629] hover:bg-amber-300"
            >
              View Admin Accounts
            </Link>

            <button
              type="button"
              onClick={() => {
                setCreated(null);
                setShowPassword(false);
              }}
              className="rounded-xl border border-[#33465e] px-5 py-3 text-sm font-bold text-white hover:bg-white/5"
            >
              Create Another Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // CREATE ADMIN FORM
  // ==========================================================

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/super-admin/admins"
        className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200"
      >
        <ArrowLeft size={17} />
        Back to Admin Management
      </Link>

      <section className="overflow-hidden rounded-3xl border border-[#26384e] bg-[#112138]">
        <div className="border-b border-white/10 bg-gradient-to-r from-[#102138] to-[#19362d] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-amber-400/10 p-4 text-amber-300">
              <UserRoundPlus size={29} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
                Super Admin · Account Provisioning
              </p>

              <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Create Admin Account
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Create an authorized Admin account for AMIOUT. The ADMIN role is
                assigned automatically by the backend.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4">
              <AlertTriangle size={20} className="shrink-0 text-red-400" />
              <p className="text-sm text-red-200">{error}</p>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
                className="ml-auto text-red-200"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="admin-name"
                className="flex items-center gap-2 text-sm font-semibold text-slate-300"
              >
                <UserRound size={17} />
                Full Name
              </label>

              <input
                id="admin-name"
                type="text"
                name="name"
                value={form.name}
                onChange={updateField}
                required
                minLength={3}
                maxLength={100}
                autoComplete="name"
                placeholder="Enter authorized Admin name"
                className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="admin-email"
                className="flex items-center gap-2 text-sm font-semibold text-slate-300"
              >
                <Mail size={17} />
                University Email
              </label>

              <input
                id="admin-email"
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                required
                autoComplete="off"
                placeholder="name@gwa.amity.edu"
                className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
              />

              <p className="text-xs text-slate-500">
                Authorized gwa.amity.edu account only
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="admin-phone"
                className="flex items-center gap-2 text-sm font-semibold text-slate-300"
              >
                <Phone size={17} />
                Mobile Number
              </label>

              <input
                id="admin-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(event) => {
                  const clean = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  setForm((current) => ({
                    ...current,
                    phone: clean,
                  }));
                }}
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                autoComplete="off"
                placeholder="10-digit mobile number"
                className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-5">
            <h2 className="flex items-center gap-2 font-bold text-amber-300">
              <LockKeyhole size={19} />
              Security Configuration
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-emerald-300" />
                Role will be ADMIN only.
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-emerald-300" />A secure
                temporary password will be generated.
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-emerald-300" />
                First-login password change will be required.
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/super-admin/admins"
              className="rounded-xl border border-[#33465e] px-6 py-3.5 text-center text-sm font-bold text-white hover:bg-white/5"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-black text-[#091629] hover:bg-amber-300 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={19} className="animate-spin" />
              ) : (
                <UserRoundPlus size={19} />
              )}

              {loading ? "Creating Admin..." : "Create Admin Account"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
