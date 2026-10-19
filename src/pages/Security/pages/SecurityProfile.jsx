import { useEffect, useState } from "react";

import {
  UserRound,
  ShieldCheck,
  Mail,
  Phone,
  IdCard,
  Building2,
  BadgeCheck,
  CalendarDays,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

import api from "../../../services/api";

// Match this URL with your existing backend route.
const PROFILE_API = "/outpass/security/profile";

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
  }).format(date);
};

const show = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  return String(value);
};

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
          <Icon size={20} />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-400">{label}</p>

          <p className="mt-2 break-words text-sm font-semibold text-white">
            {show(value)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SecurityProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(PROFILE_API, {
          signal: controller.signal,
        });

        const data = response.data?.data ?? response.data;

        const security = data?.security ?? data?.user ?? data?.profile ?? data;

        if (
          !security ||
          typeof security !== "object" ||
          Array.isArray(security)
        ) {
          throw new Error("Invalid security profile response.");
        }

        if (!controller.signal.aborted) {
          setProfile(security);
        }
      } catch (err) {
        if (controller.signal.aborted || err.code === "ERR_CANCELED") {
          return;
        }

        setProfile(null);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load security profile.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => controller.abort();
  }, [reload]);

  const securityName = profile?.name || profile?.fullName || "Security Officer";

  const accountStatus =
    profile?.isActive === false
      ? "INACTIVE"
      : profile?.isActive === true
        ? "ACTIVE"
        : "Not available";

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-7 sm:px-6">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-extrabold text-white">
            <UserRound className="text-amber-400" />
            Security Profile
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Your official AMIOUT Security account.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReload((value) => value + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-bold text-slate-950 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh Profile
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-12 text-slate-300">
          <Loader2 size={23} className="animate-spin text-amber-400" />
          Loading profile...
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-800 bg-rose-950/50 p-5 text-rose-200">
          <AlertCircle size={22} />
          {error}
        </div>
      )}

      {!loading && profile && (
        <>
          {/* Profile hero */}
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
            <div className="h-28 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-900/50" />

            <div className="px-6 pb-7">
              <div className="-mt-11 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                  <div className="flex h-22 w-22 items-center justify-center rounded-2xl border-4 border-slate-900 bg-amber-500 text-slate-950">
                    <ShieldCheck size={40} />
                  </div>

                  <div className="pb-1">
                    <h2 className="text-xl font-extrabold text-white">
                      {securityName}
                    </h2>

                    <p className="mt-1 text-sm text-amber-400">
                      Campus Security Officer
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-xl border px-4 py-2 text-xs font-bold ${
                    accountStatus === "ACTIVE"
                      ? "border-emerald-700 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-600 bg-slate-800 text-slate-300"
                  }`}
                >
                  {accountStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Personal information */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-white">
              <UserRound size={21} className="text-amber-400" />
              Personal Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField
                icon={UserRound}
                label="Full Name"
                value={securityName}
              />

              <ProfileField
                icon={Mail}
                label="Email Address"
                value={profile.email}
              />

              <ProfileField
                icon={Phone}
                label="Mobile Number"
                value={profile.phone || profile.mobileNumber}
              />

              <ProfileField
                icon={IdCard}
                label="Employee / Security ID"
                value={
                  profile.employeeId || profile.securityId || profile.guardId
                }
              />
            </div>
          </section>

          {/* Official information */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-white">
              <ShieldCheck size={21} className="text-amber-400" />
              Official Account Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField
                icon={BadgeCheck}
                label="Account Role"
                value={profile.role || "SECURITY"}
              />

              <ProfileField
                icon={Building2}
                label="Assigned Gate / Location"
                value={profile.assignedGate || profile.gate || profile.location}
              />

              <ProfileField
                icon={BadgeCheck}
                label="Account Status"
                value={accountStatus}
              />

              <ProfileField
                icon={CalendarDays}
                label="Account Created"
                value={formatDate(profile.createdAt)}
              />
            </div>
          </section>

          {/* Security note */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck size={23} className="shrink-0 text-amber-400" />

              <div>
                <h3 className="font-bold text-amber-300">
                  Protected Security Account
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Your official profile and assigned permissions are managed by
                  the university administration. Do not share your login
                  credentials or scanned QR tokens.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
