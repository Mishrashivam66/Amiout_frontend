import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  GraduationCap,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  XCircle,
  AlertTriangle,
  Layers3,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

const themes = {
  HOD: {
    title: "Department Command Center",
    subtitle: "Academic oversight, student movement and outpass approvals.",
    badge: "HEAD OF DEPARTMENT",
    gradient: "from-[#16122f] via-[#30205c] to-[#5330a1]",
    accent: "text-violet-300",
    icon: GraduationCap,
    scope: "Department",
  },
  HOI: {
    title: "Institute Command Center",
    subtitle: "Institute-wide visibility, governance and approval control.",
    badge: "HEAD OF INSTITUTE",
    gradient: "from-[#061c2b] via-[#0b4352] to-[#087c88]",
    accent: "text-cyan-300",
    icon: Building2,
    scope: "Institute",
  },
};

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
  CANCELLED: "bg-slate-100 text-slate-600 ring-slate-200",
  EXPIRED: "bg-slate-100 text-slate-600 ring-slate-200",
};

const getError = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong.";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
  }).format(date);
};

const MetricCard = ({ icon: Icon, title, value, detail, color }) => (
  <div className="group rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-start justify-between">
      <div className={`rounded-2xl p-3 ${color}`}>
        <Icon size={22} />
      </div>
      <Activity size={16} className="text-slate-300" />
    </div>
    <p className="mt-5 text-sm font-medium text-slate-500">{title}</p>
    <h3 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
      {value}
    </h3>
    <p className="mt-2 text-xs text-slate-400">{detail}</p>
  </div>
);

export default function AuthorityDashboard({ role = "HOD" }) {
  const config = themes[role] || themes.HOD;
  const Icon = config.icon;
  const base = role === "HOI" ? "/hoi" : "/hod";
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch, role]);

  const loadRequests = useCallback(
    async (silent = false) => {
      if (silent) setRefreshing(true);
      else setLoading(true);

      setError("");

      try {
        const response = await api.get(`${base}/outpasses`, {
          params: {
            page,
            limit: 10,
            status,
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
          },
        });

        const payload = response.data;

        if (payload?.success === false) {
          throw new Error(payload.message || "Unable to load outpasses.");
        }

        if (!Array.isArray(payload?.data)) {
          throw new Error("Invalid outpass listing response.");
        }

        setRequests(payload.data);
        setPagination(payload.pagination || {});
      } catch (err) {
        setRequests([]);
        setPagination({});
        setError(getError(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [base, page, status, debouncedSearch],
  );

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const openDetails = async (id) => {
    try {
      const response = await api.get(`${base}/outpass/${id}`);

      if (response.data?.success === false) {
        throw new Error(response.data.message);
      }

      setSelected(response.data?.data);
      setRemark("");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const approve = async () => {
    if (!selected?._id || approving) return;

    setApproving(true);

    try {
      const response = await api.patch(
        `${base}/outpass/${selected._id}/approve`,
        { remark: remark.trim() },
      );

      if (response.data?.success === false) {
        throw new Error(response.data.message);
      }

      toast.success(response.data?.message || "Outpass approved.");
      setSelected(null);
      setRemark("");
      await loadRequests(true);
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setApproving(false);
    }
  };

  // These metrics represent only the currently loaded page.
  // Institute/department-wide metrics need a separate stats API.
  const counts = {
    pending: requests.filter((r) => r.status === "PENDING").length,
    approved: requests.filter((r) => r.status === "APPROVED").length,
    rejected: requests.filter((r) => r.status === "REJECTED").length,
  };

  const metrics = [
    {
      title: "Visible Requests",
      value: requests.length,
      detail: "Current page",
      icon: Layers3,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Pending",
      value: counts.pending,
      detail: "Current page",
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Approved",
      value: counts.approved,
      detail: "Current page",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Rejected",
      value: counts.rejected,
      detail: "Current page",
      icon: XCircle,
      color: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* PREMIUM HERO */}
      <section
        className={`relative overflow-hidden rounded-[32px] bg-gradient-to-br ${config.gradient} p-7 text-white shadow-2xl sm:p-10`}
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest">
              <Sparkles size={15} className={config.accent} />
              AMIOUT · {config.badge}
            </div>

            <div className="mt-7 flex items-center gap-4">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
                <Icon size={30} />
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                {config.title}
              </h1>
            </div>

            <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
              {config.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold">
                <ShieldCheck size={14} className="mr-2 inline" />
                Role-scoped Access
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold">
                {config.scope} Authority
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadRequests(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            Refresh Workspace
          </button>
        </div>
      </section>

      {/* OVERVIEW */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">
              Operational Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Metrics for the currently displayed requests
            </p>
          </div>
          <span className="hidden rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 sm:block">
            Page {page}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </section>

      {/* REQUEST WORKSPACE */}
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">
                Outpass Control Desk
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review requests within your authorized{" "}
                {config.scope.toLowerCase()}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-3 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search enrollment or pass..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 sm:w-64"
                />
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="m-5 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertTriangle size={19} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Enrollment</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Parent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-slate-500"
                  >
                    Loading authorized requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-slate-500"
                  >
                    No matching outpasses found.
                  </td>
                </tr>
              ) : (
                requests.map((item) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {item.enrollmentNumber || "—"}
                    </td>
                    <td className="max-w-[220px] truncate px-6 py-4 text-sm text-slate-600">
                      {item.reason || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(item.outDate)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {item.parentDecision?.status || "PENDING"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${statusStyles[item.status] || "bg-slate-100 text-slate-600 ring-slate-200"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openDetails(item._id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                      >
                        <Eye size={15} />
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-5">
          <p className="text-xs font-medium text-slate-500">
            {pagination.total ?? 0} matching requests
          </p>

          <div className="flex items-center gap-3">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-slate-200 p-2 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold text-slate-700">
              {page} / {Math.max(1, pagination.totalPages || 1)}
            </span>
            <button
              disabled={page >= (pagination.totalPages || 1) || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border border-slate-200 p-2 disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* AUTHORITY FOOTER */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-slate-950 p-6 text-white sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <ShieldCheck size={28} className="text-cyan-300" />
          <div>
            <h3 className="font-bold">Academic Authority Workspace</h3>
            <p className="mt-1 text-xs text-slate-400">
              All approvals require backend authorization and audit logging.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300">
          AMIOUT Enterprise <ArrowRight size={15} />
        </span>
      </div>

      {/* OUTPASS REVIEW MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div
              className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">Outpass Review</h2>
                <button onClick={() => setSelected(null)} aria-label="Close">
                  <XCircle size={23} />
                </button>
              </div>
              <p className="mt-2 text-sm text-white/70">
                {selected.enrollmentNumber || "Student request"}
              </p>
            </div>

            <div className="space-y-4 p-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400">Status</p>
                  <p className="mt-1 font-bold">{selected.status}</p>
                </div>
                <div>
                  <p className="text-slate-400">Parent Decision</p>
                  <p className="mt-1 font-bold">
                    {selected.parentDecision?.status || "PENDING"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Outpass Date</p>
                  <p className="mt-1 font-bold">
                    {formatDate(selected.outDate)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">QR Status</p>
                  <p className="mt-1 font-bold">
                    {selected.qrGenerated ? "Generated" : "Not Generated"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-slate-400">Reason</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {selected.reason || "—"}
                </p>
              </div>

              {selected.status === "PENDING" &&
                selected.parentDecision?.status !== "REJECTED" && (
                  <>
                    <textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      maxLength={500}
                      rows={3}
                      placeholder="Approval remark (optional)"
                      className="w-full resize-none rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-400"
                    />
                    <button
                      disabled={approving}
                      onClick={approve}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white transition hover:bg-indigo-800 disabled:opacity-50"
                    >
                      <CheckCircle2 size={18} />
                      {approving ? "Processing..." : `Approve as ${role}`}
                    </button>
                  </>
                )}

              <button
                onClick={() => setSelected(null)}
                className="w-full rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-600 hover:bg-slate-50"
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
