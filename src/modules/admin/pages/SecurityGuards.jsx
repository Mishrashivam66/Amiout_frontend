import { useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  UserRound,
  Mail,
  IdCard,
  Phone,
  MapPin,
  LockKeyhole,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import api from "../../../services/api";

const initialForm = {
  name: "",
  employeeId: "",
  email: "",
  phone: "",
  assignedGate: "",
  password: "",
};

const SecurityGuards = () => {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdGuard, setCreatedGuard] = useState(null);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "employeeId" ? value.toUpperCase() : value,
    }));
  };

  const createGuard = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");
    setCreatedGuard(null);

    if (
      !form.name.trim() ||
      !form.employeeId.trim() ||
      !form.email.trim() ||
      !form.assignedGate.trim() ||
      !form.password
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.password.length < 12) {
      setError("Temporary password must contain at least 12 characters.");
      return;
    }

    if (
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      !/[0-9]/.test(form.password) ||
      !/[^A-Za-z0-9]/.test(form.password)
    ) {
      setError(
        "Password must contain uppercase, lowercase, number and symbol.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/admin/security-guards", {
        name: form.name.trim(),
        employeeId: form.employeeId.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        assignedGate: form.assignedGate.trim(),
        password: form.password,
      });

      const result = response.data;

      if (result?.success !== true) {
        throw new Error(result?.message || "Unable to create guard.");
      }

      setCreatedGuard(result.data || null);
      setSuccess(result.message || "Security Guard created successfully.");

      // Do not keep the temporary password in the form.
      setForm(initialForm);
      setShowPassword(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create Security Guard.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Guard Name",
      placeholder: "Enter full name",
      icon: UserRound,
      required: true,
    },
    {
      name: "employeeId",
      label: "Employee ID",
      placeholder: "SEC001",
      icon: IdCard,
      required: true,
    },
    {
      name: "email",
      label: "Login Email",
      placeholder: "guard@example.com",
      icon: Mail,
      required: true,
      type: "email",
    },
    {
      name: "phone",
      label: "Mobile Number (Optional)",
      placeholder: "10-digit phone number",
      icon: Phone,
      required: false,
      type: "tel",
    },
    {
      name: "assignedGate",
      label: "Assigned Gate",
      placeholder: "Main Gate",
      icon: MapPin,
      required: true,
    },
  ];

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-7 flex items-start gap-4">
          <div className="rounded-2xl bg-indigo-100 p-3">
            <ShieldCheck className="text-indigo-700" size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Security Guards
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Create an authorized campus gate security account.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
            <UserPlus className="text-indigo-600" />

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Add Security Guard
              </h2>
              <p className="text-sm text-slate-500">
                Only an authorized Admin can create accounts.
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle className="shrink-0" size={20} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
            >
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={20} />
                {success}
              </div>

              {createdGuard && (
                <div className="mt-3 space-y-1">
                  <p>
                    <strong>Name:</strong> {createdGuard.name}
                  </p>
                  <p>
                    <strong>Employee ID:</strong> {createdGuard.employeeId}
                  </p>
                  <p>
                    <strong>Email:</strong> {createdGuard.email}
                  </p>
                  <p>
                    <strong>Gate:</strong> {createdGuard.assignedGate}
                  </p>
                </div>
              )}

              <p className="mt-3">
                Share the temporary password privately. The guard must change it
                after first login.
              </p>
            </div>
          )}

          <form onSubmit={createGuard} autoComplete="off">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {fields.map((field) => {
                const Icon = field.icon;

                return (
                  <div key={field.name}>
                    <label
                      htmlFor={`guard-${field.name}`}
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      {field.label}
                      {field.required && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </label>

                    <div className="relative">
                      <Icon
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id={`guard-${field.name}`}
                        name={field.name}
                        type={field.type || "text"}
                        value={form[field.name]}
                        onChange={updateField}
                        required={field.required}
                        maxLength={
                          field.name === "employeeId"
                            ? 30
                            : field.name === "phone"
                              ? 10
                              : 100
                        }
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5">
              <label
                htmlFor="guard-password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Temporary Password
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                  placeholder="Create a strong temporary password"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-12 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Use 12–128 characters with uppercase, lowercase, number and
                symbol.
              </p>
            </div>

            <div className="mt-7 flex justify-end border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={19} className="animate-spin" />
                ) : (
                  <UserPlus size={19} />
                )}

                {loading ? "Creating Account..." : "Create Security Guard"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecurityGuards;
