import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileText,
  Filter,
  History as HistoryIcon,
  Inbox,
  Loader2,
  LogOut,
  MapPin,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import api from "../../../services/api";
import { getHistory } from "../services/mentor.service";

const PAGE_SIZE = 20;
const STATUS_OPTIONS = ["ALL", "APPROVED", "REJECTED", "RETURNED", "EXITED"];

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase();
const studentName = (item) =>
  item?.studentName ||
  item?.student?.name ||
  item?.student?.fullName ||
  "Unknown Student";
const enrollment = (item) =>
  item?.enrollmentNumber || item?.student?.enrollmentNumber || "—";
const initials = (name) =>
  String(name || "ST")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const dateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
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

const outpassDate = (value) => {
  if (!value) return "—";
  const raw = String(value);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(raw)
    ? new Date(`${raw}T00:00:00+05:30`)
    : new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
};

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Failed to load outpass history.";

const unwrapHistory = (response) => {
  // Axios requests return {data: payload}, mentor.service returns payload.
  const payload =
    response?.data?.success !== undefined
      ? response.data
      : response?.success !== undefined
        ? response
        : (response?.data ?? response);

  if (payload?.success === false) {
    throw new Error(payload.message || "Unable to fetch outpass history.");
  }

  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.data)
        ? payload.data.data
        : Array.isArray(payload?.data?.history)
          ? payload.data.history
          : Array.isArray(payload?.history)
            ? payload.history
            : null;

  if (!items) {
    throw new Error("Unexpected history response from the server.");
  }

  const totalValue =
    payload?.pagination?.total ??
    payload?.data?.pagination?.total ??
    payload?.total ??
    payload?.data?.total;
  const total =
    Number.isFinite(Number(totalValue)) && totalValue != null
      ? Number(totalValue)
      : null;
  return { items, total };
};

const statusConfig = {
  APPROVED: {
    icon: CheckCircle2,
    label: "Approved",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  REJECTED: {
    icon: XCircle,
    label: "Rejected",
    style: "bg-red-50 text-red-700 border-red-200",
  },
  RETURNED: {
    icon: RotateCcw,
    label: "Returned",
    style: "bg-blue-50 text-blue-700 border-blue-200",
  },
  EXITED: {
    icon: LogOut,
    label: "Exited",
    style: "bg-violet-50 text-violet-700 border-violet-200",
  },
  PENDING: {
    icon: Clock3,
    label: "Pending",
    style: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

const StatusBadge = ({ status }) => {
  const key = normalize(status);
  const config = statusConfig[key] || {
    icon: Clock3,
    label: key.replaceAll("_", " ") || "Unknown",
    style: "bg-slate-100 text-slate-700 border-slate-200",
  };
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${config.style}`}
    >
      <Icon size={13} /> {config.label}
    </span>
  );
};

const SummaryCard = ({ title, value, icon: Icon, color }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className={`inline-flex rounded-xl p-3 ${color}`}>
      <Icon size={21} />
    </div>
    <div className="mt-4 text-3xl font-extrabold text-slate-900">{value}</div>
    <div className="mt-1 text-sm text-slate-500">{title}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="min-w-0 rounded-xl bg-slate-50 p-3">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
      {value ?? "—"}
    </p>
  </div>
);

const History = () => {
  const { pathname } = useLocation();
  const isCoordinator =
    pathname === "/coordinator" || pathname.startsWith("/coordinator/");
  const basePath = isCoordinator ? "/coordinator" : "/mentor";

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const requestRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const loadHistory = useCallback(
    async (silent = false) => {
      const currentRequest = ++requestRef.current;
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        const response = isCoordinator
          ? await api.get("/coordinator/history", {
              params: { page, limit: PAGE_SIZE, search: debouncedSearch },
            })
          : await getHistory(page, PAGE_SIZE, debouncedSearch);
        if (currentRequest !== requestRef.current) return;
        const result = unwrapHistory(response);
        setHistory(result.items);
        setTotal(result.total);
        setSelectedItem(null);
      } catch (err) {
        if (currentRequest !== requestRef.current) return;
        const message = getError(err);
        setError(message);
        setHistory([]);
        setTotal(null);
        toast.error(message);
      } finally {
        if (currentRequest === requestRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [isCoordinator, page, debouncedSearch],
  );

  useEffect(() => {
    void loadHistory();
    return () => {
      requestRef.current += 1;
    };
  }, [loadHistory]);

  useEffect(() => {
    if (!selectedItem) return undefined;
    const onEscape = (event) => {
      if (event.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [selectedItem]);

  const filteredHistory = useMemo(
    () =>
      history.filter(
        (item) =>
          statusFilter === "ALL" || normalize(item.status) === statusFilter,
      ),
    [history, statusFilter],
  );

  const stats = useMemo(
    () => ({
      total: history.length,
      approved: history.filter((item) => normalize(item.status) === "APPROVED")
        .length,
      rejected: history.filter((item) => normalize(item.status) === "REJECTED")
        .length,
      other: history.filter(
        (item) => !["APPROVED", "REJECTED"].includes(normalize(item.status)),
      ).length,
    }),
    [history],
  );

  const hasNext =
    total == null ? history.length === PAGE_SIZE : page * PAGE_SIZE < total;

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("ALL");
    setPage(1);
  };

  return (
    <div className="min-h-screen space-y-6 pb-10">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              <ShieldCheck size={14} />{" "}
              {isCoordinator
                ? "Coordinator · Section History"
                : "Mentor · Group History"}
            </span>
            <h1 className="mt-4 flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
              <HistoryIcon size={27} /> Outpass History
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              {isCoordinator
                ? "Monitor previous outpasses for students in your authorized section."
                : "Review previous outpasses of your assigned students."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadHistory(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/20 disabled:opacity-50"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh History"}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          title="Loaded Records"
          value={stats.total}
          icon={ClipboardList}
          color="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle2}
          color="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          color="bg-red-50 text-red-600"
        />
        <SummaryCard
          title="Other Statuses"
          value={stats.other}
          icon={Clock3}
          color="bg-amber-50 text-amber-600"
        />
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
              <HistoryIcon size={20} className="text-blue-600" /> History
              Records
            </h2>
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              Page {page}
              {total != null ? ` · ${total} total` : ""}
            </span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <label className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student, enrollment, outpass ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </label>
            <label className="relative">
              <Filter
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status === "ALL"
                      ? "All Statuses"
                      : status.charAt(0) + status.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>Showing {filteredHistory.length} records from this page</span>
            {(search || statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 font-bold text-blue-600"
              >
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="m-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={18} /> <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={() => void loadHistory()}
              className="font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-3 p-20 text-slate-500">
            <Loader2 size={29} className="animate-spin text-blue-600" /> Loading
            outpass history...
          </div>
        ) : !error && filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <Inbox size={43} className="text-slate-400" />
            <h3 className="mt-4 text-lg font-extrabold text-slate-900">
              No History Found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {statusFilter !== "ALL" || search
                ? "No records match your current filters."
                : "No outpass history records are available."}
            </p>
          </div>
        ) : !error ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    {[
                      "Outpass ID",
                      "Student",
                      "Destination",
                      "Reason",
                      "Status",
                      "Applied On",
                      "Details",
                    ].map((label) => (
                      <th key={label} className="whitespace-nowrap px-5 py-4">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((item) => (
                    <tr key={item._id} className="hover:bg-blue-50/40">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-slate-700">
                        {item.outpassId || item._id}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex min-w-44 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white">
                            {initials(studentName(item))}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {studentName(item)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {enrollment(item)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-44 truncate px-5 py-4 text-sm text-slate-700">
                        {item.destination || "—"}
                      </td>
                      <td
                        className="max-w-48 truncate px-5 py-4 text-sm text-slate-600"
                        title={item.reason}
                      >
                        {item.reason || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">
                        {dateTime(item.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                        >
                          <FileText size={15} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:hidden">
              {filteredHistory.map((item) => (
                <article
                  key={item._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
                    <div>
                      <p className="text-xs text-slate-400">Outpass ID</p>
                      <p className="mt-1 break-all font-mono text-xs font-bold text-slate-800">
                        {item.outpassId || item._id}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="space-y-3 p-4 text-sm">
                    <p className="flex items-center gap-2 font-bold text-slate-900">
                      <UserRound size={15} />
                      {studentName(item)}
                    </p>
                    <p className="text-xs text-slate-500">{enrollment(item)}</p>
                    <p className="flex gap-2 text-slate-700">
                      <MapPin size={16} className="shrink-0 text-blue-600" />
                      {item.destination || "—"}
                    </p>
                    <p className="line-clamp-2 text-slate-600">
                      {item.reason || "—"}
                    </p>
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays size={15} />
                      {dateTime(item.createdAt)}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 bg-slate-50 p-3">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      <FileText size={15} /> View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}

        {!loading && !error && (page > 1 || hasNext) && (
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">
              Page {page}
              {total != null
                ? ` of ${Math.max(1, Math.ceil(total / PAGE_SIZE))}`
                : ""}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold disabled:opacity-40"
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={!hasNext}
                className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-40"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </section>

      {selectedItem && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedItem(null);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-dialog-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <p className="text-xs font-bold text-blue-600">
                  AMIOUT · READ ONLY
                </p>
                <h2
                  id="history-dialog-title"
                  className="mt-1 text-xl font-extrabold text-slate-900"
                >
                  Outpass Details
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelectedItem(null)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-xl bg-slate-100 px-3 py-2 font-mono text-xs font-bold text-slate-700">
                  {selectedItem.outpassId || selectedItem._id}
                </span>
                <StatusBadge status={selectedItem.status} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Info label="Student" value={studentName(selectedItem)} />
                <Info label="Enrollment" value={enrollment(selectedItem)} />
                <Info
                  label="Destination"
                  value={selectedItem.destination || "—"}
                />
                <Info
                  label="Outpass Date"
                  value={outpassDate(selectedItem.outDate)}
                />
                <Info
                  label="Created At"
                  value={dateTime(selectedItem.createdAt)}
                />
                <Info
                  label="Assigned Authority"
                  value={
                    selectedItem.approvedAuthorityRole ||
                    selectedItem.assignedRole ||
                    "—"
                  }
                />
                <Info
                  label="Parent Status"
                  value={selectedItem.parentDecision?.status || "—"}
                />
                <Info
                  label="Faculty Approved At"
                  value={dateTime(selectedItem.approvedAt)}
                />
                <Info
                  label="Exit Verified"
                  value={dateTime(selectedItem.exitVerifiedAt)}
                />
                <Info
                  label="Entry Verified"
                  value={dateTime(selectedItem.entryVerifiedAt)}
                />
              </div>
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-bold text-blue-700">Reason</p>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-700">
                  {selectedItem.reason || "—"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 border-t border-slate-100 p-5">
              <Link
                to={`${basePath}/outpass/${selectedItem._id}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Full Details <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
