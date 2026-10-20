import { useCallback, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";

import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  GraduationCap,
  IdCard,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
  UserRoundX,
} from "lucide-react";

import api from "../../../services/api";

const TOAST_DURATION = 1000;

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to complete the request.";

const display = (value) =>
  value === null || value === undefined || value === "" ? "—" : String(value);

const normalize = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500">{label}</p>

          <p className="mt-2 break-words text-sm font-extrabold text-[#101e36]">
            {display(value)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HODProfile() {
  const mountedRef = useRef(true);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [reassignment, setReassignment] = useState(null);

  const availability = normalize(profile?.availabilityStatus);

  const isAvailable = availability === "AVAILABLE";

  // ==========================================================
  // LOAD REAL HOD PROFILE
  // ==========================================================

  const loadProfile = useCallback(async ({ notify = false } = {}) => {
    if (notify) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await api.get("/hod/profile");

      if (response.data?.success === false) {
        throw new Error(response.data.message || "Failed to load HOD profile.");
      }

      const data = response.data?.data;

      if (!data || typeof data !== "object") {
        throw new Error("Invalid profile response.");
      }

      if (mountedRef.current) {
        setProfile(data);
      }

      if (notify) {
        toast.success("Profile refreshed", {
          id: "hod-profile-refresh",
          duration: TOAST_DURATION,
        });
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(getError(err));
      }

      if (notify) {
        toast.error(getError(err), {
          id: "hod-profile-refresh",
          duration: TOAST_DURATION,
        });
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void loadProfile();

    return () => {
      mountedRef.current = false;
    };
  }, [loadProfile]);

  // ==========================================================
  // CHANGE AVAILABLE / UNAVAILABLE
  // ==========================================================

  const changeAvailability = async (nextStatus) => {
    if (saving || !profile) return;

    if (!["AVAILABLE", "UNAVAILABLE"].includes(nextStatus)) {
      return;
    }

    if (nextStatus === availability) {
      return;
    }

    setSaving(true);
    setReassignment(null);

    try {
      const response = await api.patch("/hod/availability", {
        availabilityStatus: nextStatus,
      });

      const result = response.data;

      if (result?.success === false) {
        throw new Error(result.message || "Availability update failed.");
      }

      const savedStatus = normalize(result?.data?.availabilityStatus);

      if (savedStatus !== nextStatus) {
        throw new Error("Server did not confirm the requested status.");
      }

      const transfer = result?.data?.reassignment;

      if (mountedRef.current) {
        setProfile((previous) => ({
          ...previous,
          availabilityStatus: savedStatus,
        }));

        setReassignment(
          nextStatus === "UNAVAILABLE"
            ? {
                complete: result?.data?.reassignmentComplete === true,
                details: transfer || null,
              }
            : null,
        );
      }

      if (
        nextStatus === "UNAVAILABLE" &&
        result?.data?.reassignmentComplete !== true
      ) {
        toast.error("Unavailable saved. Some transfers need review.", {
          id: "hod-availability",
          duration: TOAST_DURATION,
        });
      } else {
        toast.success(
          nextStatus === "AVAILABLE"
            ? "You are now AVAILABLE"
            : "You are now UNAVAILABLE",
          {
            id: "hod-availability",
            duration: TOAST_DURATION,
          },
        );
      }

      // Fetch canonical current account data again.
      // Reassignment summary is retained separately.
      await loadProfile();
    } catch (err) {
      toast.error(getError(err), {
        id: "hod-availability",
        duration: TOAST_DURATION,
      });

      await loadProfile();
    } finally {
      if (mountedRef.current) {
        setSaving(false);
      }
    }
  };

  const institutes = profile?.academicScope?.institutes || [];

  const departments = profile?.academicScope?.departments || [];

  const programs = profile?.academicScope?.programs || [];

  const busy = loading || saving || refreshing;

  return (
    <div className="space-y-6 pb-8">
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[28px] bg-[#091b31] p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-300">
              <ShieldCheck size={16} />
              AMIOUT · HOD ACCOUNT
            </span>

            <h1 className="mt-6 text-2xl font-black sm:text-3xl">My Profile</h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              Your official faculty identity, academic authority and current
              availability.
            </p>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() => void loadProfile({ notify: true })}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-[#091b31] transition hover:bg-amber-300 disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RefreshCw size={18} />
            )}
            Refresh Profile
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-14 text-slate-500">
          <Loader2 size={21} className="animate-spin" />
          Loading HOD profile...
        </div>
      )}

      {!loading && profile && (
        <>
          {/* ==================================================
              OFFICIAL IDENTITY
          ================================================== */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-[#f7b83c] via-[#ffd783] to-[#ffe7b5] p-6 sm:p-8">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-[#091b31] text-white shadow-lg">
                  <UserRound size={38} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Head of Department
                  </p>

                  <h2 className="mt-2 break-words text-2xl font-black text-slate-950">
                    {display(profile.name)}
                  </h2>

                  <p className="mt-2 break-all text-sm font-medium text-slate-700">
                    {display(profile.email)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 p-5 sm:p-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
                <GraduationCap size={16} />
                HOD
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={16} />
                {profile.isActive ? "Active Account" : "Inactive Account"}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
                <BadgeCheck size={16} />
                {profile.isVerified
                  ? "Verified Faculty"
                  : "Verification Pending"}
              </span>
            </div>
          </section>

          {/* ==================================================
              AVAILABILITY CONTROL
          ================================================== */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                    <Activity size={23} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-[#101e36]">
                      Faculty Availability
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Manage your availability for new outpass assignments.
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {isAvailable ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <UserRoundX size={16} />
                  )}
                  {availability || "UNKNOWN"}
                </span>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-7">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={busy || isAvailable}
                  onClick={() => void changeAvailability("AVAILABLE")}
                  className={`flex items-center justify-center gap-3 rounded-2xl border px-5 py-4 text-sm font-extrabold transition disabled:cursor-not-allowed ${
                    isAvailable
                      ? "border-emerald-400 bg-emerald-500 text-white"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  } disabled:opacity-75`}
                >
                  {saving && !isAvailable ? (
                    <Loader2 size={19} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={20} />
                  )}
                  Mark Available
                </button>

                <button
                  type="button"
                  disabled={busy || availability === "UNAVAILABLE"}
                  onClick={() => void changeAvailability("UNAVAILABLE")}
                  className={`flex items-center justify-center gap-3 rounded-2xl border px-5 py-4 text-sm font-extrabold transition disabled:cursor-not-allowed ${
                    !isAvailable
                      ? "border-rose-400 bg-rose-500 text-white"
                      : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  } disabled:opacity-75`}
                >
                  {saving && isAvailable ? (
                    <Loader2 size={19} className="animate-spin" />
                  ) : (
                    <UserRoundX size={20} />
                  )}
                  Mark Unavailable
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <Clock3 size={20} className="shrink-0 text-slate-600" />

                  <div>
                    <p className="text-sm font-extrabold text-slate-900">
                      {isAvailable
                        ? "You are accepting new assignments"
                        : "New assignments should skip your account"}
                    </p>

                    <p className="mt-2 text-xs leading-6 text-slate-600">
                      {isAvailable
                        ? "Your account is eligible for HOD escalation when the preceding assigned authorities are unavailable."
                        : "Your availability is marked UNAVAILABLE. The system attempts to transfer currently pending assigned outpasses to the next available authorized authority."}
                    </p>
                  </div>
                </div>
              </div>

              {reassignment && (
                <div
                  className={`flex items-start gap-3 rounded-2xl border p-4 ${
                    reassignment.complete
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  {reassignment.complete ? (
                    <CheckCircle2
                      size={21}
                      className="shrink-0 text-emerald-700"
                    />
                  ) : (
                    <AlertTriangle
                      size={21}
                      className="shrink-0 text-amber-700"
                    />
                  )}

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Reassignment Summary
                    </p>

                    {reassignment.details ? (
                      <p className="mt-2 text-xs leading-6 text-slate-700">
                        Scanned: {reassignment.details.scanned ?? 0}
                        {" · "}Transferred:{" "}
                        {reassignment.details.reassigned ?? 0}
                        {" · "}Unresolved:{" "}
                        {reassignment.details.unresolved ?? 0}
                        {" · "}Skipped: {reassignment.details.skipped ?? 0}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs leading-6 text-slate-700">
                        Transfer verification is incomplete. Please review
                        pending assignments.
                      </p>
                    )}

                    {!reassignment.complete && (
                      <p className="mt-2 text-xs font-semibold text-amber-800">
                        Some requests may require Admin review or reassignment
                        retry.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <p className="text-xs leading-6 text-slate-500">
                Availability stays in its selected state until you or an
                authorized administrator changes it. This is not an automatic
                one-day leave scheduler.
              </p>
            </div>
          </section>

          {/* ==================================================
              OFFICIAL FACULTY DETAILS
          ================================================== */}

          <section>
            <h2 className="mb-4 text-xl font-black text-[#101e36]">
              Official Faculty Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <ProfileField
                icon={UserRound}
                label="Full Name"
                value={profile.name}
              />

              <ProfileField
                icon={IdCard}
                label="Faculty / Employee ID"
                value={profile.employeeId}
              />

              <ProfileField
                icon={Mail}
                label="Official Email"
                value={profile.email}
              />

              <ProfileField
                icon={BriefcaseBusiness}
                label="Designation"
                value={profile.designation}
              />

              <ProfileField
                icon={Phone}
                label="Mobile Number"
                value={profile.phone}
              />

              <ProfileField
                icon={GraduationCap}
                label="Faculty Role"
                value={profile.role || "HOD"}
              />
            </div>
          </section>

          {/* ==================================================
              AUTHORIZED ACADEMIC SCOPE
          ================================================== */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <ShieldCheck size={23} />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Authorized Academic Scope
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Assigned by University Administration
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Building2 size={17} />
                  Institute
                </div>

                <p className="mt-3 text-sm font-extrabold text-slate-900">
                  {institutes.length
                    ? institutes
                        .map((item) => `${item.code} - ${item.name}`)
                        .join(", ")
                    : "Not assigned"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <GraduationCap size={17} />
                  Department
                </div>

                <p className="mt-3 text-sm font-extrabold text-slate-900">
                  {departments.join(", ") || display(profile.department)}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="mb-3 text-sm font-extrabold text-slate-900">
                Authorized Programs
              </h3>

              <div className="flex flex-wrap gap-2">
                {programs.length ? (
                  programs.map((program) => (
                    <span
                      key={program._id}
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800"
                    >
                      <BookOpen size={15} />
                      {program.code}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    No active programs assigned.
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <ShieldCheck size={22} className="shrink-0 text-emerald-700" />

            <p className="text-xs leading-6 text-emerald-800">
              Your identity and department assignments are read-only.
              Availability can be updated here; role and academic permissions
              remain controlled by Admin.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
