import { useCallback, useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Eye,
  FileText,
  GraduationCap,
  Hash,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";

import api from "../../../services/api";

const PAGE_SIZE = 10;
const TOAST_DURATION = 1000;

const configurations = {
  HOD: {
    title: "Department Command Center",
    subtitle:
      "A smarter way to monitor departmental outpasses, review requests and manage authorized approvals.",
    scope: "Department",
    icon: GraduationCap,
    base: "/hod",
  },
  HOI: {
    title: "Institute Command Center",
    subtitle:
      "A complete institute-level view of student outpasses, academic decisions and movement history.",
    scope: "Institute",
    icon: Building2,
    base: "/hoi",
  },
};

const styles = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
  EXITED: "border-blue-200 bg-blue-50 text-blue-700",
  RETURNED: "border-teal-200 bg-teal-50 text-teal-700",
  COMPLETED: "border-teal-200 bg-teal-50 text-teal-700",
  EXPIRED: "border-slate-200 bg-slate-100 text-slate-600",
  CANCELLED: "border-slate-200 bg-slate-100 text-slate-600",
};

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase();

const errorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong.";

const formatDate = (value, withTime = false) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      : {}),
  }).format(date);
};

const getParentStatus = (item) => {
  if (normalize(item?.parentDecision?.callOutcome) === "REJECTED") {
    return "REJECTED";
  }

  return normalize(
    item?.parentDecision?.status ||
      item?.parentStatus ||
      item?.parentApprovalStatus ||
      "UNKNOWN",
  );
};

const canApproveRequest = (item) => {
  if (normalize(item?.status) !== "PENDING") {
    return false;
  }

  return ["PENDING", "APPROVED"].includes(getParentStatus(item));
};

const getStudentName = (item) =>
  item?.studentName ||
  item?.student?.name ||
  item?.studentMaster?.name ||
  "Student";

const extractList = (payload) => {
  const body = payload?.data;

  const rows = Array.isArray(body)
    ? body
    : Array.isArray(body?.outpasses)
      ? body.outpasses
      : Array.isArray(body?.requests)
        ? body.requests
        : Array.isArray(body?.items)
          ? body.items
          : null;

  if (!rows) {
    throw new Error("Invalid outpass listing response.");
  }

  return {
    rows,
    pagination: payload?.pagination || body?.pagination || {},
  };
};

function StatusBadge({ status }) {
  const value = normalize(status) || "UNKNOWN";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-extrabold tracking-wide ${
        styles[value] || "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {value}
    </span>
  );
}

function StatCard({ icon: Icon, title, value, subtitle, iconStyle }) {
  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_3px_14px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
      <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-slate-50 opacity-60" />

      <div className="relative flex items-center justify-between">
        <div className={`rounded-2xl p-3 ${iconStyle}`}>
          <Icon size={23} strokeWidth={2.1} />
        </div>
        <Activity size={17} className="text-slate-300" />
      </div>

      <p className="relative mt-5 text-sm font-semibold text-slate-500">
        {title}
      </p>
      <p className="relative mt-1 text-[32px] font-black tracking-tight text-[#101e36]">
        {value}
      </p>
      <p className="relative mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

function InfoField({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-2.5 text-amber-600 shadow-sm">
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-slate-500">{label}</p>
          <p className="mt-1 break-words text-sm font-extrabold text-slate-900">
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthorityDashboard({
  role = "HOD",
  initialStatus = "ALL",
}) {
  const currentRole = normalize(role) === "HOI" ? "HOI" : "HOD";

  const config = configurations[currentRole];
  const RoleIcon = config.icon;
  const base = config.base;

  const versionRef = useRef(0);

  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [detailsLoadingId, setDetailsLoadingId] = useState(null);
  const [remark, setRemark] = useState("");
  const [approving, setApproving] = useState(false);

  // ======================================================
  // SEARCH AND STATUS FILTER
  // ======================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearchQuery(search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setStatus(initialStatus);
    setPage(1);
  }, [initialStatus]);

  useEffect(() => {
    setPage(1);
  }, [status, currentRole]);

  // ======================================================
  // LOAD AUTHORIZED OUTPASSES
  // ======================================================

  const loadRequests = useCallback(
    async ({ silent = false, notify = false } = {}) => {
      const requestVersion = ++versionRef.current;

      if (silent) setRefreshing(true);
      else setLoading(true);

      setError("");

      try {
        const response = await api.get(`${base}/outpasses`, {
          params: {
            page,
            limit: PAGE_SIZE,
            status,
            ...(searchQuery ? { search: searchQuery } : {}),
          },
        });

        if (requestVersion !== versionRef.current) {
          return;
        }

        const payload = response.data;

        if (payload?.success === false) {
          throw new Error(
            payload.message || "Unable to load authorized outpasses.",
          );
        }

        const { rows, pagination: paging } = extractList(payload);

        setRequests(rows);
        setPagination(paging);

        if (notify) {
          toast.success("Dashboard refreshed", {
            duration: TOAST_DURATION,
            id: "authority-refresh",
          });
        }
      } catch (err) {
        if (requestVersion !== versionRef.current) {
          return;
        }

        const message = errorMessage(err);

        setRequests([]);
        setPagination({});
        setError(message);

        if (notify) {
          toast.error(message, {
            duration: TOAST_DURATION,
            id: "authority-refresh",
          });
        }
      } finally {
        if (requestVersion === versionRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [base, page, status, searchQuery],
  );

  useEffect(() => {
    void loadRequests();

    return () => {
      versionRef.current += 1;
    };
  }, [loadRequests]);

  const refreshDashboard = () =>
    loadRequests({
      silent: true,
      notify: true,
    });

  // ======================================================
  // OUTPASS DETAILS
  // ======================================================

  const openDetails = async (outpassId) => {
    if (!outpassId || detailsLoadingId) return;

    setDetailsLoadingId(outpassId);
    setRemark("");

    try {
      const response = await api.get(
        `${base}/outpass/${encodeURIComponent(outpassId)}`,
      );

      const payload = response.data;

      if (payload?.success === false) {
        throw new Error(payload.message || "Failed to load details.");
      }

      const data = payload?.data;
      const item =
        data?.outpass && typeof data.outpass === "object" ? data.outpass : data;

      if (!item || typeof item !== "object") {
        throw new Error("Invalid outpass details.");
      }

      setSelected(item);
    } catch (err) {
      toast.error(errorMessage(err), {
        duration: TOAST_DURATION,
      });
    } finally {
      setDetailsLoadingId(null);
    }
  };

  const closeDetails = () => {
    if (approving) return;
    setSelected(null);
    setRemark("");
  };

  // ======================================================
  // DIRECT FACULTY APPROVAL
  // ======================================================

  const approveOutpass = async () => {
    const id = selected?._id || selected?.id;
    if (!id || approving) return;

    if (!canApproveRequest(selected)) {
      toast.error("This outpass cannot be approved.", {
        duration: TOAST_DURATION,
      });
      return;
    }

    const reason = remark.trim();

    if (reason.length < 10) {
      toast.error("Reason must be at least 10 characters.", {
        duration: TOAST_DURATION,
      });
      return;
    }

    try {
      setApproving(true);

      const response = await api.patch(
        `${base}/outpass/${encodeURIComponent(id)}/approve`,
        { remark: reason },
      );

      if (response.data?.success === false) {
        throw new Error(response.data.message || "Approval failed.");
      }

      toast.success(
        response.data?.message || "Faculty approval recorded successfully.",
        { duration: TOAST_DURATION },
      );

      setSelected(null);
      setRemark("");

      await loadRequests({ silent: true });
    } catch (err) {
      toast.error(errorMessage(err), {
        duration: TOAST_DURATION,
      });
      await loadRequests({ silent: true });
    } finally {
      setApproving(false);
    }
  };

  // ======================================================
  // CURRENT PAGE STATISTICS
  // ======================================================

  const counts = {
    total: requests.length,
    pending: requests.filter((item) => normalize(item.status) === "PENDING")
      .length,
    approved: requests.filter((item) => normalize(item.status) === "APPROVED")
      .length,
    rejected: requests.filter((item) => normalize(item.status) === "REJECTED")
      .length,
  };

  const metrics = [
    {
      title: "Visible Outpasses",
      value: counts.total,
      subtitle: "Current page",
      icon: ClipboardList,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending Requests",
      value: counts.pending,
      subtitle: "Current page",
      icon: Clock3,
      iconStyle: "bg-amber-50 text-amber-600",
    },
    {
      title: "Approved",
      value: counts.approved,
      subtitle: "Current page",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Rejected",
      value: counts.rejected,
      subtitle: "Current page",
      icon: XCircle,
      iconStyle: "bg-rose-50 text-rose-600",
    },
  ];

  const totalPages = Math.max(1, Number(pagination.totalPages) || 1);

  const parentStatus = getParentStatus(selected);
  const approvalAllowed = canApproveRequest(selected);

  const canSubmitApproval =
    approvalAllowed &&
    remark.trim().length >= 10 &&
    remark.trim().length <= 500 &&
    !approving;

  const filterLabels = {
    ALL: "All Outpasses",
    PENDING: "Pending Approvals",
    APPROVED: "Approved Outpasses",
    REJECTED: "Rejected Outpasses",
  };

  const activeFilterLabel =
    filterLabels[normalize(status)] || `${status} Outpasses`;

  return (
    <div className="space-y-7 pb-8">
      {/* ==================================================
          PREMIUM HERO
      ================================================== */}

      <section className="relative overflow-hidden rounded-[28px] bg-[#091b31] p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8 xl:p-9">
        <div className="pointer-events-none absolute -right-28 -top-44 h-[400px] w-[400px] rounded-full bg-[#e5a83c]/15 blur-[85px]" />
        <div className="pointer-events-none absolute bottom-[-150px] right-[20%] h-[300px] w-[300px] rounded-full bg-sky-500/10 blur-[80px]" />

        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-400/10 px-3.5 py-2 text-[11px] font-extrabold tracking-wide text-amber-300">
              <Sparkles size={15} />
              AMIOUT ENTERPRISE · {currentRole}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffd477] to-[#f4ad2b] text-[#081629] shadow-lg shadow-amber-500/15">
                <RoleIcon size={29} strokeWidth={2.2} />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  {config.title}
                </h1>
                <p className="mt-1 text-xs font-bold text-amber-300">
                  {config.scope} Authority Workspace
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
              {config.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-[11px] font-semibold text-slate-200">
                Department-scoped Access
              </span>
              <span className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-[11px] font-semibold text-slate-200">
                Direct Faculty Approval
              </span>
              <span className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-[11px] font-semibold text-slate-200">
                Audited Decisions
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
            <button
              type="button"
              onClick={() => void refreshDashboard()}
              disabled={loading || refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f7b83c] px-5 py-3.5 text-sm font-extrabold text-[#091b31] shadow-lg shadow-amber-400/10 transition hover:bg-[#ffd16e] disabled:opacity-50"
            >
              {refreshing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <RefreshCw size={18} />
              )}
              {refreshing ? "Refreshing..." : "Refresh Dashboard"}
            </button>

            <Link
              to={`${base}/pending`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Review Pending
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          OVERVIEW
      ================================================== */}

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-600">
              Live Workspace
            </p>
            <h2 className="mt-1 text-xl font-black text-[#101e36]">
              Operational Overview
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Statistics for the currently loaded result page.
            </p>
          </div>

          <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500">
            Page {page} · {config.scope}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <StatCard
              key={metric.title}
              {...metric}
              value={loading ? "..." : metric.value}
            />
          ))}
        </div>
      </section>

      {/* ==================================================
          QUICK WORKSPACE INFORMATION
      ================================================== */}

      <section className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <div className="flex items-start gap-4 rounded-[22px] border border-[#e6eaf0] bg-white p-5 shadow-sm">
          <div className="rounded-2xl bg-[#fff2d8] p-3 text-[#b77917]">
            <ShieldCheck size={23} />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-slate-900">
              Academic Approval Control
            </h3>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              Review pending requests within your authorized
              {` ${config.scope.toLowerCase()} `}
              scope. Parent pending approvals require a documented faculty
              bypass reason. Explicit parent rejection always blocks approval.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-[22px] border border-[#e6eaf0] bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-500">Current View</p>
            <h3 className="mt-1 text-base font-black text-[#101e36]">
              {activeFilterLabel}
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              {pagination.total ?? requests.length} matching records
            </p>
          </div>

          <div className="rounded-2xl bg-amber-50 p-4 text-amber-600">
            <FileText size={25} />
          </div>
        </div>
      </section>

      {/* ==================================================
          OUTPASS CONTROL CENTER
      ================================================== */}

      <section className="overflow-hidden rounded-[25px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                  <ClipboardList size={19} />
                </div>

                <h2 className="text-lg font-black text-[#101e36]">
                  Outpass Control Center
                </h2>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {config.scope}-wide visibility is limited to your authorized
                academic scope.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-3 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Student, enrollment, outpass..."
                  className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-400 focus:bg-white sm:w-72"
                />
              </div>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                aria-label="Filter by status"
                className="rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-amber-400"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="EXITED">Exited</option>
                <option value="RETURNED">Returned</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="m-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle size={19} className="shrink-0" />
            <div>
              <p className="font-extrabold">
                Unable to load authorized outpasses
              </p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#f8fafc] text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Outpass</th>
                <th className="px-6 py-4">Parent</th>
                <th className="px-6 py-4">Applied</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {!loading &&
                !error &&
                requests.map((item) => {
                  const id = item._id || item.id;

                  return (
                    <tr key={id} className="transition hover:bg-amber-50/30">
                      <td className="px-6 py-5">
                        <div className="flex min-w-44 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf0fa] text-blue-700">
                            <UserRound size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-slate-900">
                              {getStudentName(item)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.enrollmentNumber || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-xs font-bold text-slate-700">
                        {item.outpassId || item.outpassNumber || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={getParentStatus(item)} />
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-xs text-slate-600">
                        {formatDate(item.createdAt || item.outDate, true)}
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          disabled={!id || detailsLoadingId !== null}
                          onClick={() => void openDetails(id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#101e36] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#223954] disabled:opacity-50"
                        >
                          {detailsLoadingId === id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Eye size={15} />
                          )}
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* MOBILE / TABLET CARDS */}
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:hidden">
          {!loading &&
            !error &&
            requests.map((item) => {
              const id = item._id || item.id;

              return (
                <article
                  key={id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <UserRound size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-slate-900">
                          {getStudentName(item)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.enrollmentNumber || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex justify-between gap-2 text-xs">
                      <span className="text-slate-500">Outpass</span>
                      <span className="font-bold text-slate-900">
                        {item.outpassId || item.outpassNumber || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500">Parent</span>
                      <StatusBadge status={getParentStatus(item)} />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500">
                        Outpass Status
                      </span>
                      <StatusBadge status={item.status} />
                    </div>

                    <p className="text-xs text-slate-500">
                      {formatDate(item.createdAt || item.outDate, true)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => void openDetails(id)}
                    disabled={!id || detailsLoadingId !== null}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#101e36] px-4 py-3 text-xs font-bold text-white disabled:opacity-50"
                  >
                    <Eye size={16} />
                    Review Outpass
                    <ArrowUpRight size={15} />
                  </button>
                </article>
              );
            })}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-3 p-14 text-sm text-slate-500">
            <Loader2 size={21} className="animate-spin" />
            Loading authorized requests...
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="rounded-2xl bg-amber-50 p-4 text-amber-600">
              <ClipboardList size={28} />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-slate-900">
              No Matching Outpasses
            </h3>
            <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">
              No requests match this filter in your accessible academic scope.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-[#fafbfe] px-5 py-4 sm:px-7">
          <p className="text-xs font-semibold text-slate-500">
            {pagination.total ?? requests.length} matching requests
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous page"
              disabled={loading || refreshing || page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="px-2 text-xs font-black text-slate-700">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              aria-label="Next page"
              disabled={loading || refreshing || page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          OUTPASS REVIEW MODAL
      ================================================== */}

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020c1c]/75 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDetails();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="authority-review-heading"
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[26px] bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between bg-[#091b31] px-5 py-5 text-white sm:px-7">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-amber-300">
                  AMIOUT · {currentRole} REVIEW
                </p>
                <h2
                  id="authority-review-heading"
                  className="mt-1 text-xl font-black"
                >
                  Outpass Verification
                </h2>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                disabled={approving}
                aria-label="Close review"
                className="rounded-xl p-2 hover:bg-white/10 disabled:opacity-50"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div>
                  <p className="text-xs text-slate-500">
                    Current Request Status
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={selected.status} />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Parent Decision</p>
                  <div className="mt-2">
                    <StatusBadge status={parentStatus} />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoField
                  icon={UserRound}
                  label="Student Name"
                  value={getStudentName(selected)}
                />
                <InfoField
                  icon={Hash}
                  label="Enrollment Number"
                  value={selected.enrollmentNumber}
                />
                <InfoField
                  icon={FileText}
                  label="Outpass Number"
                  value={selected.outpassId || selected.outpassNumber}
                />
                <InfoField
                  icon={CalendarDays}
                  label="Outpass Date"
                  value={formatDate(selected.outDate || selected.createdAt)}
                />
                <InfoField
                  icon={MapPin}
                  label="Destination"
                  value={selected.destination}
                />
                <InfoField
                  icon={ShieldCheck}
                  label="QR Status"
                  value={
                    selected.qrRevokedAt
                      ? "REVOKED"
                      : selected.qrGenerated
                        ? "GENERATED"
                        : "NOT GENERATED"
                  }
                />
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500">
                  Student's Outpass Reason
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
                  {selected.reason || "Not available"}
                </p>
              </div>

              {parentStatus === "REJECTED" && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <XCircle size={20} className="shrink-0 text-red-600" />
                  <p className="text-sm font-semibold leading-6 text-red-800">
                    Parent rejected this request. Faculty approval and QR
                    issuance are blocked.
                  </p>
                </div>
              )}

              {!approvalAllowed && parentStatus !== "REJECTED" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-600">
                  This request is not currently eligible for approval.
                </div>
              )}

              {approvalAllowed && (
                <div className="space-y-4 rounded-[20px] border border-amber-200 bg-amber-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
                      <ShieldCheck size={21} />
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Authorize as {currentRole}
                      </h3>
                      <p className="mt-2 text-xs leading-6 text-slate-700">
                        {parentStatus === "PENDING"
                          ? "Parent consent is still PENDING. A documented faculty-authorized bypass reason is mandatory. This action does not count as parent consent."
                          : "This direct institutional approval will be recorded with the authority, time and reason."}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="authority-approval-remark"
                      className="mb-2 block text-xs font-extrabold text-slate-800"
                    >
                      Approval / Bypass Reason *
                    </label>

                    <textarea
                      id="authority-approval-remark"
                      value={remark}
                      onChange={(event) => setRemark(event.target.value)}
                      rows={4}
                      maxLength={500}
                      disabled={approving}
                      placeholder="Write the official reason for authorizing this request..."
                      className="w-full resize-none rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500"
                    />

                    <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                      <span>Minimum 10 characters</span>
                      <span>{remark.trim().length}/500</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void approveOutpass()}
                    disabled={!canSubmitApproval}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f7b83c] px-4 py-3.5 text-sm font-black text-[#091b31] transition hover:bg-[#ffd16e] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {approving ? (
                      <Loader2 size={19} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={19} />
                    )}

                    {approving
                      ? "Processing..."
                      : `Confirm ${currentRole} Approval`}
                  </button>

                  <p className="text-center text-[11px] leading-5 text-slate-500">
                    Final academic scope, daily quota and QR generation checks
                    are performed by the backend.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={closeDetails}
                disabled={approving}
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
