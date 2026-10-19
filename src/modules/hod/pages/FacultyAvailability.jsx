import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowRightLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  GraduationCap,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  UserRoundX,
  Users,
} from "lucide-react";

import api from "../../../services/api";

const TOAST_DURATION = 1000;

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to load faculty availability.";

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const STATUS_STYLES = {
  AVAILABLE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  UNAVAILABLE: "border-rose-200 bg-rose-50 text-rose-700",
  DISABLED: "border-slate-200 bg-slate-100 text-slate-600",
};

function AvailabilityBadge({ status }) {
  const value = status || "UNKNOWN";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-extrabold ${
        STATUS_STYLES[value] || "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          value === "AVAILABLE"
            ? "bg-emerald-500"
            : value === "UNAVAILABLE"
              ? "bg-rose-500"
              : "bg-slate-400"
        }`}
      />
      {value}
    </span>
  );
}

function MetricCard({ title, value, icon: Icon, accent, subtitle }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}
      >
        <Icon size={23} />
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-500">{title}</p>

      <h3 className="mt-1 text-3xl font-black text-[#101e36]">{value}</h3>

      <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

export default function FacultyAvailability() {
  const versionRef = useRef(0);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  // ==========================================================
  // FETCH LIVE FACULTY AVAILABILITY
  // ==========================================================

  const loadData = useCallback(async (notify = false) => {
    const currentVersion = ++versionRef.current;

    if (notify) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await api.get("/hod/faculty-availability");

      if (currentVersion !== versionRef.current) {
        return;
      }

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Unable to load faculty monitoring.",
        );
      }

      const result = response.data?.data;

      if (
        !result ||
        !Array.isArray(result.faculty) ||
        !Array.isArray(result.escalations)
      ) {
        throw new Error("Invalid faculty monitoring response.");
      }

      setData(result);

      if (notify) {
        toast.success("Faculty status refreshed", {
          id: "hod-faculty-refresh",
          duration: TOAST_DURATION,
        });
      }
    } catch (err) {
      if (currentVersion !== versionRef.current) {
        return;
      }

      const message = getError(err);

      setError(message);

      if (notify) {
        toast.error(message, {
          id: "hod-faculty-refresh",
          duration: TOAST_DURATION,
        });
      }
    } finally {
      if (currentVersion === versionRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadData();

    return () => {
      versionRef.current += 1;
    };
  }, [loadData]);

  const faculty = data?.faculty || [];
  const escalations = data?.escalations || [];
  const stats = data?.stats || {};

  // ==========================================================
  // LOCAL SEARCH / STATUS FILTER
  // ==========================================================

  const filteredFaculty = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return faculty.filter((item) => {
      if (filter !== "ALL" && item.status !== filter) {
        return false;
      }

      if (!keyword) return true;

      return [
        item.name,
        item.email,
        item.employeeId,
        item.designation,
        ...(item.roles || []),
        ...(item.scopes || []),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [faculty, search, filter]);

  const metrics = [
    {
      title: "Total Faculty",
      value: stats.totalFaculty ?? 0,
      icon: Users,
      accent: "bg-blue-50 text-blue-600",
      subtitle: "Assigned Mentor / Coordinator",
    },
    {
      title: "Available",
      value: stats.available ?? 0,
      icon: CheckCircle2,
      accent: "bg-emerald-50 text-emerald-600",
      subtitle: "Active and available accounts",
    },
    {
      title: "Unavailable",
      value: stats.unavailable ?? 0,
      icon: UserRoundX,
      accent: "bg-rose-50 text-rose-600",
      subtitle: "Faculty marked unavailable",
    },
    {
      title: "HOD Pending Queue",
      value: stats.pendingAssignedToHOD ?? 0,
      icon: ArrowRightLeft,
      accent: "bg-amber-50 text-amber-600",
      subtitle: "Currently assigned to this HOD",
    },
  ];

  return (
    <div className="space-y-7 pb-8">
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[28px] bg-[#091b31] p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3.5 py-2 text-[11px] font-extrabold text-amber-300">
              <Activity size={16} />
              AMIOUT · HOD MONITORING
            </span>

            <div className="mt-6 flex items-center gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 p-3 text-[#091b31]">
                <Users size={28} />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Faculty Availability
                </h1>
                <p className="mt-1 text-xs font-bold text-amber-300">
                  Department Authority & Escalation Monitor
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
              See which Mentors and Coordinators are available, identify pending
              requests requiring attention and track outpasses assigned to the
              HOD.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-[11px] font-semibold">
                Department Scoped
              </span>
              <span className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-[11px] font-semibold">
                Read-only Monitoring
              </span>
              <span className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-[11px] font-semibold">
                Transfer Audit
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={loading || refreshing}
            onClick={() => void loadData(true)}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#f7b83c] px-5 py-3.5 text-sm font-extrabold text-[#091b31] transition hover:bg-amber-300 disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RefreshCw size={18} />
            )}
            Refresh Status
          </button>
        </div>
      </section>

      {/* ======================================================
          ERROR / LOADING
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <AlertCircle size={20} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-14 text-sm text-slate-500">
          <Loader2 size={21} className="animate-spin" />
          Loading department faculty...
        </div>
      )}

      {!loading && data && (
        <>
          {/* ==================================================
              STATISTICS
          ================================================== */}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((item) => (
              <MetricCard key={item.title} {...item} />
            ))}
          </section>

          {/* ==================================================
              REASSIGNMENT WARNING
          ================================================== */}

          {(stats.attentionRequired || 0) > 0 && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle size={23} className="shrink-0 text-rose-600" />

                <div>
                  <h3 className="text-sm font-extrabold text-rose-900">
                    Pending Reassignment Needs Review
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-rose-800">
                    Some unavailable or disabled faculty still have pending
                    requests assigned to them. These requests have not all been
                    transferred successfully.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(data.attentionFaculty || []).map((item) => (
                      <span
                        key={item._id}
                        className="rounded-full bg-white px-3 py-2 text-xs font-bold text-rose-700"
                      >
                        {item.name} · {item.pendingAssigned} Pending
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              FACULTY DIRECTORY
          ================================================== */}

          <section className="overflow-hidden rounded-[25px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                <div>
                  <h2 className="text-lg font-black text-[#101e36]">
                    Department Faculty
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Availability is based on saved faculty account status, not
                    login activity.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3.5 top-3 text-slate-400"
                    />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search faculty or scope..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-amber-400 sm:w-64"
                    />
                  </div>

                  <select
                    aria-label="Filter faculty availability"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-amber-400"
                  >
                    <option value="ALL">All Faculty</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="UNAVAILABLE">Unavailable</option>
                    <option value="DISABLED">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredFaculty.map((person) => (
                <article
                  key={person._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-amber-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <UserRound size={22} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-slate-900">
                          {person.name}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {person.designation || "Faculty"}
                        </p>
                      </div>
                    </div>

                    <AvailabilityBadge status={person.status} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(person.roles || []).map((role) => (
                      <span
                        key={role}
                        className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] font-extrabold text-amber-700"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <p className="break-all">{person.email}</p>

                    <p>
                      Faculty ID: <strong>{person.employeeId || "—"}</strong>
                    </p>

                    <p>
                      Last availability update:{" "}
                      <strong>
                        {formatDate(person.availabilityUpdatedAt)}
                      </strong>
                    </p>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] font-bold text-slate-500">
                      Assigned Pending Requests
                    </p>

                    <p
                      className={`mt-1 text-2xl font-black ${
                        person.status !== "AVAILABLE" &&
                        person.pendingAssigned > 0
                          ? "text-rose-600"
                          : "text-[#101e36]"
                      }`}
                    >
                      {person.pendingAssigned}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-bold text-slate-500">
                      Authorized Sections / Groups
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(person.scopes || []).map((scope) => (
                        <span
                          key={scope}
                          className="max-w-full break-all rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-medium text-slate-600"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}

              {filteredFaculty.length === 0 && (
                <div className="col-span-full px-4 py-14 text-center">
                  <Users size={37} className="mx-auto text-slate-300" />
                  <h3 className="mt-4 text-sm font-extrabold text-slate-900">
                    No Matching Faculty
                  </h3>
                  <p className="mt-2 text-xs text-slate-500">
                    No authorized faculty match the selected filters.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ==================================================
              HOD ASSIGNED / TRANSFERRED REQUESTS
          ================================================== */}

          <section className="overflow-hidden rounded-[25px] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <div className="flex items-center gap-2">
                  <ArrowRightLeft size={20} className="text-amber-600" />
                  <h2 className="text-lg font-black text-[#101e36]">
                    HOD Assigned Requests
                  </h2>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Pending outpasses currently assigned to your HOD account.
                  Transfer history distinguishes reassigned requests.
                </p>
              </div>

              <Link
                to="/hod/pending"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#091b31] px-5 py-3 text-xs font-bold text-white hover:bg-slate-700"
              >
                Review Pending
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-3 p-4 sm:p-6">
              {escalations.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">
                        {item.studentName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.enrollmentNumber} · {item.outpassId}
                      </p>
                    </div>

                    <span
                      className={`self-start rounded-full px-3 py-1.5 text-[11px] font-extrabold ${
                        item.isTransferred
                          ? "bg-amber-50 text-amber-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {item.isTransferred
                        ? "TRANSFERRED TO HOD"
                        : "HOD ASSIGNED"}
                    </span>
                  </div>

                  {item.transfer ? (
                    <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
                      <p>
                        <strong>From:</strong> {item.transfer.fromFacultyName} (
                        {item.transfer.fromRole || "Faculty"})
                      </p>
                      <p className="mt-1">
                        <strong>Reason:</strong> {item.transfer.reason || "—"}
                      </p>
                      <p className="mt-1">
                        <strong>Transferred:</strong>{" "}
                        {formatDate(item.transfer.transferredAt)}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      No recorded transfer into HOD. This request is currently
                      assigned to the HOD authority.
                    </p>
                  )}
                </div>
              ))}

              {escalations.length === 0 && (
                <div className="py-12 text-center">
                  <ClipboardList size={36} className="mx-auto text-slate-300" />
                  <p className="mt-4 text-sm font-bold text-slate-700">
                    No pending requests assigned to HOD
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Escalated requests will appear here when they are actually
                    assigned.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ==================================================
              POLICY NOTE
          ================================================== */}

          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <ShieldCheck size={23} className="shrink-0 text-amber-700" />

            <div>
              <h3 className="text-sm font-extrabold text-amber-900">
                How Faculty Escalation Works
              </h3>

              <p className="mt-2 text-xs leading-6 text-amber-900">
                Primary Mentor → authorized Backup Mentor (if available) →
                Coordinator → HOD → HOI. Faculty unavailability may trigger
                pending request reassignment. The HOD may also directly approve
                requests in their authorized department. Direct approval and
                recorded transfer are different actions.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
