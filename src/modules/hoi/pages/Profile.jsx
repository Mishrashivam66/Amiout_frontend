import { useCallback, useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
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

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase();

const show = (value) =>
  value === undefined || value === null || value === "" ? "—" : String(value);

const getError = (err) =>
  err?.response?.data?.message ||
  err?.message ||
  "Unable to update HOI profile.";

function Field({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-500">{label}</p>
          <p className="mt-2 break-words text-sm font-extrabold text-slate-900">
            {show(value)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HOIProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [reassignment, setReassignment] = useState(null);

  const loadProfile = useCallback(
    async ({ silent = false, notify = false } = {}) => {
      if (silent) setRefreshing(true);
      else setLoading(true);

      setError("");

      try {
        const response = await api.get("/hoi/profile");

        if (response.data?.success === false || !response.data?.data) {
          throw new Error(response.data?.message || "Invalid HOI profile.");
        }

        setProfile(response.data.data);

        if (notify) {
          toast.success("Profile refreshed", {
            duration: 1000,
          });
        }
      } catch (err) {
        setError(getError(err));

        if (notify) {
          toast.error(getError(err), {
            duration: 1000,
          });
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const availability = normalize(profile?.availabilityStatus);
  const isAvailable = availability === "AVAILABLE";

  const changeAvailability = async (nextStatus) => {
    if (
      saving ||
      !profile ||
      !["AVAILABLE", "UNAVAILABLE"].includes(nextStatus) ||
      availability === nextStatus
    ) {
      return;
    }

    setSaving(true);
    setReassignment(null);

    try {
      const response = await api.patch("/hoi/availability", {
        availabilityStatus: nextStatus,
      });

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Availability update failed.",
        );
      }

      setProfile((previous) => ({
        ...previous,
        availabilityStatus: nextStatus,
      }));

      const result = response.data?.data || {};

      if (nextStatus === "UNAVAILABLE") {
        setReassignment({
          complete: result.reassignmentComplete === true,
          details: result.reassignment || null,
        });
      }

      toast.success(
        nextStatus === "AVAILABLE"
          ? "You are now AVAILABLE"
          : "Availability updated",
        { duration: 1000 },
      );

      // Fetch canonical state saved in the database.
      await loadProfile({ silent: true });
    } catch (err) {
      toast.error(getError(err), {
        duration: 1000,
      });

      await loadProfile({ silent: true });
    } finally {
      setSaving(false);
    }
  };

  const institutes = profile?.academicScope?.institutes || [];
  const programs = profile?.academicScope?.programs || [];
  const busy = loading || saving || refreshing;

  return (
    <div className="space-y-6 pb-8">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-[28px] bg-[#091b31] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-bold text-amber-300">
              <ShieldCheck size={17} />
              HOI · VERIFIED FACULTY ACCOUNT
            </span>

            <h1 className="mt-6 text-3xl font-black">My Profile</h1>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Your institute authority, official identity and availability for
              outpass assignments.
            </p>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void loadProfile({
                silent: true,
                notify: true,
              })
            }
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-[#091b31] disabled:opacity-50"
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
        <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-16 text-sm text-slate-500">
          <Loader2 size={20} className="animate-spin" />
          Loading HOI profile...
        </div>
      )}

      {!loading && profile && (
        <>
          {/* FACULTY IDENTITY */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-[#f7b83c] to-[#ffe6aa] p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-5">
                <div className="rounded-3xl border-4 border-white bg-[#091b31] p-5 text-white">
                  <UserRound size={36} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
                    Head of Institute
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    {show(profile.name)}
                  </h2>

                  <p className="mt-1 break-all text-sm text-slate-700">
                    {show(profile.email)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 p-5">
              <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
                HOI
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                <BadgeCheck size={15} />
                {profile.isVerified ? "Verified Faculty" : "Not Verified"}
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
                {profile.isActive ? "Active Account" : "Inactive"}
              </span>
            </div>
          </section>

          {/* AVAILABILITY */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                  <Activity size={23} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Faculty Availability
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Controls eligibility for new assignments
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-xs font-black ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {availability || "UNKNOWN"}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={busy || isAvailable}
                onClick={() => void changeAvailability("AVAILABLE")}
                className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-4 text-sm font-extrabold disabled:opacity-60 ${
                  isAvailable
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {saving ? (
                  <Loader2 size={19} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={19} />
                )}
                Mark Available
              </button>

              <button
                type="button"
                disabled={busy || availability === "UNAVAILABLE"}
                onClick={() => void changeAvailability("UNAVAILABLE")}
                className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-4 text-sm font-extrabold disabled:opacity-60 ${
                  availability === "UNAVAILABLE"
                    ? "border-rose-500 bg-rose-500 text-white"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                <UserRoundX size={19} />
                Mark Unavailable
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-600">
              {isAvailable
                ? "Your account may receive authorized HOI assignments when lower authorities are unavailable."
                : "New automatic assignments should skip your account. Existing pending requests may require reassignment or administrative review."}
            </div>

            {reassignment && (
              <div
                className={`mt-4 rounded-xl border p-4 ${
                  reassignment.complete
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    size={19}
                    className="shrink-0 text-amber-700"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Reassignment Summary
                    </p>

                    {reassignment.details ? (
                      <p className="mt-2 text-xs text-slate-600">
                        Transferred: {reassignment.details.reassigned ?? 0}
                        {" · "}Unresolved:{" "}
                        {reassignment.details.unresolved ?? 0}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-slate-600">
                        Review the faculty monitoring queue to confirm pending
                        assignments.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <p className="mt-4 text-xs leading-6 text-slate-500">
              This availability status belongs to your shared faculty account.
              If you also hold Mentor, Coordinator or HOD roles, their automatic
              assignment eligibility is affected too.
            </p>
          </section>

          {/* OFFICIAL DETAILS */}

          <section>
            <h2 className="mb-4 text-xl font-black text-[#091b31]">
              Official Faculty Information
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Field
                icon={UserRound}
                label="Faculty Name"
                value={profile.name}
              />
              <Field
                icon={IdCard}
                label="Employee ID"
                value={profile.employeeId}
              />
              <Field icon={Mail} label="Official Email" value={profile.email} />
              <Field
                icon={BriefcaseBusiness}
                label="Designation"
                value={profile.designation}
              />
              <Field
                icon={Phone}
                label="Mobile Number"
                value={profile.mobileNumber}
              />
              <Field icon={ShieldCheck} label="Authority" value="HOI" />
            </div>
          </section>

          {/* ACADEMIC SCOPE */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="flex items-center gap-3 text-lg font-black text-[#091b31]">
              <Building2 size={23} className="text-amber-600" />
              Authorized Institute Scope
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {institutes.map((item) => (
                <div key={item._id} className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-bold text-slate-500">Institute</p>

                  <p className="mt-2 text-sm font-black text-slate-900">
                    {show(item.code)} · {show(item.name)}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="mb-3 mt-6 text-sm font-extrabold text-slate-900">
              Authorized Programs
            </h3>

            <div className="flex flex-wrap gap-2">
              {programs.map((item) => (
                <span
                  key={item._id}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800"
                >
                  <BookOpen size={15} />
                  {show(item.code)}
                </span>
              ))}
            </div>

            <p className="mt-5 text-xs text-slate-500">
              Academic scope and official account details are read-only. Admin
              controls role assignments.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
