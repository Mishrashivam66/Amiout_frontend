import { useCallback, useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowRightLeft,
  CheckCircle2,
  ClipboardList,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  UserRoundX,
  Users,
} from "lucide-react";

import api from "../../../services/api";

// ============================================================
// AMIOUT ENTERPRISE - HOI FACULTY AVAILABILITY
//
// Institute-wide read-only monitoring.
// Includes:
// 1. Faculty availability
// 2. Faculty role and academic scope
// 3. Pending assigned requests
// 4. Pending reassignment warnings
// 5. Directly assigned vs transferred HOI requests
//
// API: GET /hoi/faculty-availability
// ============================================================

const TOAST_DURATION = 1000;

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to load institute faculty.";

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

const statusStyles = {
  AVAILABLE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  UNAVAILABLE: "border-rose-200 bg-rose-50 text-rose-700",
  DISABLED: "border-slate-200 bg-slate-100 text-slate-600",
};

function StatusBadge({ status }) {
  const value = status || "UNKNOWN";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-extrabold ${
        statusStyles[value] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
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

function MetricCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className={`inline-flex rounded-xl p-3 ${color}`}>
        <Icon size={23} />
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-500">{title}</p>

      <h2 className="mt-2 text-3xl font-black text-[#091b31]">{value}</h2>

      <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

export default function FacultyAvailability() {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  // ==========================================================
  // GET REAL FACULTY STATUS
  // ==========================================================

  const loadData = useCallback(async ({ notify = false } = {}) => {
    if (notify) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await api.get("/hoi/faculty-availability");

      const payload = response.data;

      if (
        payload?.success === false ||
        !Array.isArray(payload?.data?.faculty) ||
        !Array.isArray(payload?.data?.assignedRequests)
      ) {
        throw new Error(
          payload?.message || "Invalid faculty monitoring response.",
        );
      }

      setData(payload.data);

      if (notify) {
        toast.success("Faculty status refreshed", {
          duration: TOAST_DURATION,
          id: "hoi-faculty-refresh",
        });
      }
    } catch (err) {
      const message = getError(err);

      setError(message);

      if (notify) {
        toast.error(message, {
          duration: TOAST_DURATION,
          id: "hoi-faculty-refresh",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const faculty = data?.faculty || [];
  const assignedRequests = data?.assignedRequests || [];
  const stats = data?.stats || {};

  // ==========================================================
  // FACULTY SEARCH AND STATUS FILTER
  // ==========================================================

  const filteredFaculty = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return faculty.filter((person) => {
      if (filter !== "ALL" && person.status !== filter) {
        return false;
      }

      if (!keyword) return true;

      const searchable = [
        person.name,
        person.email,
        person.employeeId,
        person.designation,
        ...(person.roles || []),
        ...(person.scopes || []),
      ];

      return searchable
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [faculty, search, filter]);

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-7 pb-8">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-[28px] bg-[#091b31] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-xs font-extrabold text-amber-300">
              <Activity size={17} />
              AMIOUT · HOI MONITORING
            </span>

            <h1 className="mt-6 text-2xl font-black sm:text-3xl">
              Faculty Availability
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Monitor Mentors, Coordinators, HODs and HOI authorities across
              your assigned institute. Identify unavailable faculty and pending
              outpass escalations.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs">
                Institute-wide Access
              </span>

              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs">
                Live Faculty Status
              </span>

              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs">
                Read-only Monitoring
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={loading || refreshing}
            onClick={() => void loadData({ notify: true })}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-[#091b31] transition hover:bg-amber-300 disabled:opacity-50"
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

      {/* ERROR */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <AlertCircle size={20} className="shrink-0" />

          <div>
            <p className="font-extrabold">Faculty monitoring unavailable</p>

            <p className="mt-2">{error}</p>
          </div>
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-14 text-sm text-slate-500">
          <Loader2 size={21} className="animate-spin" />
          Loading institute faculty...
        </div>
      )}

      {!loading && data && (
        <>
          {/* STATISTICS */}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Total Faculty"
              value={stats.totalFaculty ?? 0}
              icon={Users}
              color="bg-blue-50 text-blue-600"
              subtitle="Authorized institute faculty"
            />

            <MetricCard
              title="Available"
              value={stats.available ?? 0}
              icon={CheckCircle2}
              color="bg-emerald-50 text-emerald-600"
              subtitle="Eligible for new assignments"
            />

            <MetricCard
              title="Unavailable"
              value={stats.unavailable ?? 0}
              icon={UserRoundX}
              color="bg-rose-50 text-rose-600"
              subtitle="Faculty marked unavailable"
            />

            <MetricCard
              title="HOI Pending Queue"
              value={stats.pendingAssignedToHOI ?? 0}
              icon={ArrowRightLeft}
              color="bg-amber-50 text-amber-600"
              subtitle="Currently assigned to HOI"
            />
          </section>

          {/* UNRESOLVED ASSIGNMENTS */}

          {(stats.attentionRequired || 0) > 0 && (
            <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle size={23} className="shrink-0 text-rose-600" />

                <div>
                  <h2 className="text-sm font-black text-rose-900">
                    Pending Reassignment Needs Attention
                  </h2>

                  <p className="mt-2 text-xs leading-6 text-rose-800">
                    Some unavailable or disabled faculty still have pending
                    requests assigned to them. Verify their reassignment status
                    before considering them resolved.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(data.attentionFaculty || []).map((person) => (
                      <span
                        key={person._id}
                        className="rounded-full bg-white px-3 py-2 text-xs font-bold text-rose-700"
                      >
                        {person.name} · {person.pendingAssigned} Pending
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* FACULTY DIRECTORY */}

          <section className="overflow-hidden rounded-[25px] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Institute Faculty
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                  Availability comes from the saved faculty account status, not
                  login activity.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-3 text-slate-400"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search faculty or role..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-amber-400 sm:w-64"
                  />
                </div>

                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  aria-label="Filter availability"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400"
                >
                  <option value="ALL">All Faculty</option>

                  <option value="AVAILABLE">Available</option>

                  <option value="UNAVAILABLE">Unavailable</option>

                  <option value="DISABLED">Disabled</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredFaculty.map((person) => (
                <article
                  key={person._id}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:border-amber-200 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <UserRound size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-black text-slate-900">
                          {person.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {person.designation || "Faculty"}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={person.status} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(person.roles || []).map((role) => (
                      <span
                        key={role}
                        className="rounded-lg bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-800"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <p className="break-all">{person.email || "No email"}</p>

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

                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      Assigned Pending Requests
                    </p>

                    <p
                      className={`mt-2 text-3xl font-black ${
                        person.status !== "AVAILABLE" &&
                        person.pendingAssigned > 0
                          ? "text-rose-600"
                          : "text-slate-900"
                      }`}
                    >
                      {person.pendingAssigned ?? 0}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-500">
                      Authorized Academic Scopes
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(person.scopes || []).map((scope) => (
                        <span
                          key={scope}
                          className="max-w-full break-all rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-medium text-slate-600"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}

              {filteredFaculty.length === 0 && (
                <div className="col-span-full py-14 text-center">
                  <Users size={37} className="mx-auto text-slate-300" />

                  <h3 className="mt-4 font-bold text-slate-900">
                    No Matching Faculty
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    No faculty match the selected filters.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* HOI ASSIGNED REQUESTS */}

          <section className="overflow-hidden rounded-[25px] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <ArrowRightLeft size={21} className="text-amber-600" />

                  <h2 className="text-lg font-black text-slate-900">
                    HOI Assigned Requests
                  </h2>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Pending requests currently assigned to your HOI account,
                  including actual transfers.
                </p>
              </div>

              <Link
                to="/hoi/pending"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#091b31] px-5 py-3 text-xs font-bold text-white hover:bg-slate-700"
              >
                Review Pending
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="space-y-3 p-5">
              {assignedRequests.map((request) => (
                <article
                  key={request._id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        {request.studentName || "Student"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {request.enrollmentNumber} · {request.outpassId}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-2 text-[10px] font-extrabold ${
                        request.isTransferred
                          ? "bg-amber-50 text-amber-800"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {request.isTransferred
                        ? "TRANSFERRED TO HOI"
                        : "ASSIGNED TO HOI"}
                    </span>
                  </div>

                  {request.transfer && (
                    <div className="mt-4 space-y-2 rounded-xl bg-amber-50 p-4 text-xs text-amber-900">
                      <p>
                        From:{" "}
                        <strong>
                          {request.transfer.fromFacultyName ||
                            "Previous authority"}
                        </strong>
                      </p>

                      <p>Previous Role: {request.transfer.fromRole || "—"}</p>

                      <p>Reason: {request.transfer.reason || "—"}</p>

                      <p>
                        Transferred:{" "}
                        {formatDate(request.transfer.transferredAt)}
                      </p>
                    </div>
                  )}
                </article>
              ))}

              {assignedRequests.length === 0 && (
                <div className="py-12 text-center">
                  <ClipboardList size={36} className="mx-auto text-slate-300" />

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    No pending requests assigned to HOI
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ESCALATION POLICY */}

          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <ShieldCheck size={23} className="shrink-0 text-amber-700" />

            <div>
              <h3 className="text-sm font-black text-amber-900">
                Automatic Authority Escalation
              </h3>

              <p className="mt-2 text-xs leading-6 text-amber-900">
                Primary Mentor → optional Backup Mentor → Coordinator → HOD →
                HOI. New requests are routed to available authorized faculty.
                Existing pending requests may be reassigned on unavailability.
                Directly assigned requests are kept separate from actual
                transfers.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
