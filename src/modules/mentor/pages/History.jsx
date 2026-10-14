import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-toastify";
import {
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock3,
  RefreshCw,
  History as HistoryIcon,
  CalendarDays,
  MapPin,
  FileText,
  ShieldCheck,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Inbox,
  AlertCircle,
  LogOut,
  ClipboardList,
  Loader2,
  X,
} from "lucide-react";

import { getHistory } from "../services/mentor.service";

// ============================================================
// CONFIGURATION
// ============================================================

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "RETURNED", label: "Returned" },
  { value: "EXITED", label: "Exited" },
  { value: "PENDING", label: "Pending" },
];

// ============================================================
// HELPERS
// ============================================================

const unwrapHistory = (response) => {
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) {
    return { items: payload, total: null };
  }

  if (Array.isArray(payload?.data)) {
    return {
      items: payload.data,
      total: payload.total ?? payload.pagination?.total ?? null,
    };
  }

  if (Array.isArray(payload?.data?.data)) {
    return {
      items: payload.data.data,
      total: payload.data.total ?? payload.data.pagination?.total ?? null,
    };
  }

  if (Array.isArray(payload?.history)) {
    return {
      items: payload.history,
      total: payload.total ?? null,
    };
  }

  if (Array.isArray(payload?.data?.history)) {
    return {
      items: payload.data.history,
      total: payload.data.total ?? null,
    };
  }

  return { items: [], total: null };
};

const getStudentName = (item) =>
  item?.studentName ||
  item?.student?.name ||
  item?.student?.fullName ||
  "Unknown Student";

const getEnrollment = (item) =>
  item?.enrollmentNumber || item?.student?.enrollmentNumber || "";

const getInitials = (name) => {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "ST";

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
};

const formatDateTime = (value) => {
  if (!value) return { date: "—", time: "" };

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { date: "—", time: "" };
  }

  return {
    date: new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date),

    time: new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date),
  };
};

const getStatusInfo = (value) => {
  const status = String(value || "PENDING").toUpperCase();

  const configs = {
    APPROVED: {
      label: "Approved",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    REJECTED: {
      label: "Rejected",
      icon: XCircle,
      className: "bg-red-50 text-red-700 border-red-200",
    },
    RETURNED: {
      label: "Returned",
      icon: RotateCcw,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    EXITED: {
      label: "Exited",
      icon: LogOut,
      className: "bg-violet-50 text-violet-700 border-violet-200",
    },
    PENDING: {
      label: "Pending",
      icon: Clock3,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
  };

  return (
    configs[status] || {
      label: status.replaceAll("_", " "),
      icon: Clock3,
      className: "bg-slate-100 text-slate-700 border-slate-200",
    }
  );
};

// ============================================================
// STATUS BADGE
// ============================================================

const StatusBadge = ({ status }) => {
  const config = getStatusInfo(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold ${config.className}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
};

// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({ title, value, icon: Icon, tone }) => {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            tones[tone] || tones.blue
          }`}
        >
          <Icon size={22} />
        </div>

        <ArrowUpRight size={17} className="text-slate-300" />
      </div>

      <h3 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
        {value}
      </h3>

      <p className="mt-1 text-sm font-medium text-slate-500">{title}</p>
    </div>
  );
};

// ============================================================
// HISTORY PAGE
// ============================================================

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);

  const [error, setError] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);

  // ------------------------------------------------------------
  // DEBOUNCE SEARCH
  // ------------------------------------------------------------

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  // ------------------------------------------------------------
  // FETCH HISTORY
  // ------------------------------------------------------------

  const loadHistory = useCallback(
    async (silent = false) => {
      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await getHistory(page, PAGE_SIZE, debouncedSearch);

        const result = unwrapHistory(response);

        setHistory(result.items);
        setTotal(result.total);
      } catch (err) {
        console.error("History API Error:", err);

        const message =
          err?.response?.data?.message || "Failed to load outpass history.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, debouncedSearch],
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ------------------------------------------------------------
  // FILTER LOADED DATA
  // ------------------------------------------------------------

  const filteredHistory = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return history.filter((item) => {
      const status = String(item.status || "").toUpperCase();

      const matchesStatus = statusFilter === "ALL" || status === statusFilter;

      const searchText = [
        item.outpassId,
        getStudentName(item),
        getEnrollment(item),
        item.destination,
        item.reason,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !keyword || searchText.includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [history, statusFilter, search]);

  // ------------------------------------------------------------
  // SUMMARY (LOADED PAGE)
  // ------------------------------------------------------------

  const stats = useMemo(() => {
    const statuses = history.map((item) =>
      String(item.status || "").toUpperCase(),
    );

    return {
      total: history.length,
      approved: statuses.filter((value) => value === "APPROVED").length,
      rejected: statuses.filter((value) => value === "REJECTED").length,
      other: statuses.filter(
        (value) => value !== "APPROVED" && value !== "REJECTED",
      ).length,
    };
  }, [history]);

  const hasNextPage =
    total !== null ? page * PAGE_SIZE < total : history.length === PAGE_SIZE;

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <div className="min-h-screen space-y-7 pb-10">
      {/* =====================================================
          PREMIUM HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-14 -top-20 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-24 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              <ShieldCheck size={15} />
              AMIOUT Faculty Portal
            </div>

            <h1 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
              <HistoryIcon
                className="hidden text-cyan-300 sm:block"
                size={32}
              />
              Outpass History
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Explore and review previous student outpass requests, approval
              decisions and movement history.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadHistory(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh History"}
          </button>
        </div>
      </section>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Loaded Records"
          value={stats.total}
          icon={ClipboardList}
          tone="blue"
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle2}
          tone="green"
        />

        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          tone="red"
        />

        <StatCard
          title="Other Statuses"
          value={stats.other}
          icon={Clock3}
          tone="amber"
        />
      </div>

      {/* =====================================================
          HISTORY CONTENT
      ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_-22px_rgba(15,23,42,0.22)]">
        {/* TOOLBAR */}

        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <HistoryIcon size={21} className="text-blue-600" />
                History Records
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search and filter previously recorded outpasses
              </p>
            </div>

            <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 sm:inline-flex">
              Page {page}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            {/* SEARCH */}

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student, enrollment, destination..."
                aria-label="Search outpass history"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* STATUS FILTER */}

            <div className="relative">
              <Filter
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter history status"
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-8 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FILTER SUMMARY */}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">
                {filteredHistory.length}
              </span>{" "}
              records from the current page
            </p>

            {(search || statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                  setStatusFilter("ALL");
                  setPage(1);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="m-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>

            <button
              type="button"
              onClick={() => loadHistory()}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((number) => (
              <div
                key={number}
                className="flex animate-pulse items-center gap-4 rounded-2xl bg-slate-50 p-5"
              >
                <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-200" />

                <div className="flex-1 space-y-3">
                  <div className="h-3 w-1/3 rounded bg-slate-200" />
                  <div className="h-3 w-2/3 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
          /* EMPTY STATE */

          <div className="flex flex-col items-center px-6 py-20 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
              <Inbox size={36} strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              No History Found
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search || statusFilter !== "ALL"
                ? "No records on this page match your current filters."
                : "No outpass history records are available for this page."}
            </p>

            {(search || statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                  setStatusFilter("ALL");
                }}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* =====================================================
                DESKTOP TABLE
            ===================================================== */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50/90">
                  <tr>
                    {[
                      "OUTPASS ID",
                      "STUDENT",
                      "DESTINATION",
                      "REASON",
                      "STATUS",
                      "DATE",
                      "DETAILS",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((item) => {
                    const studentName = getStudentName(item);
                    const date = formatDateTime(item.createdAt);

                    return (
                      <tr
                        key={item._id}
                        className="transition hover:bg-blue-50/40"
                      >
                        {/* ID */}

                        <td className="px-5 py-5">
                          <span className="inline-flex max-w-[165px] truncate rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs font-semibold text-slate-700">
                            {item.outpassId || item._id || "—"}
                          </span>
                        </td>

                        {/* STUDENT */}

                        <td className="px-5 py-5">
                          <div className="flex min-w-[170px] items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                              {getInitials(studentName)}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[175px] truncate text-sm font-bold text-slate-900">
                                {studentName}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {getEnrollment(item) || "Student"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* DESTINATION */}

                        <td className="px-5 py-5">
                          <div className="flex max-w-[160px] items-center gap-2">
                            <MapPin
                              size={15}
                              className="shrink-0 text-blue-500"
                            />

                            <span className="truncate text-sm font-medium text-slate-700">
                              {item.destination || "—"}
                            </span>
                          </div>
                        </td>

                        {/* REASON */}

                        <td className="px-5 py-5">
                          <p
                            title={item.reason || ""}
                            className="max-w-[190px] truncate text-sm text-slate-600"
                          >
                            {item.reason || "—"}
                          </p>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-5">
                          <StatusBadge status={item.status} />
                        </td>

                        {/* DATE */}

                        <td className="whitespace-nowrap px-5 py-5">
                          <div className="flex items-start gap-2">
                            <CalendarDays
                              size={16}
                              className="mt-0.5 text-slate-400"
                            />

                            <div>
                              <p className="text-sm font-semibold text-slate-700">
                                {date.date}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {date.time}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* DETAILS */}

                        <td className="px-5 py-5">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                          >
                            <FileText size={15} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* =====================================================
                MOBILE / TABLET CARDS
            ===================================================== */}

            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:hidden">
              {filteredHistory.map((item) => {
                const studentName = getStudentName(item);
                const date = formatDateTime(item.createdAt);

                return (
                  <article
                    key={item._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="border-b border-slate-100 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Outpass ID
                          </p>

                          <h3 className="mt-1 break-all font-mono text-xs font-bold text-slate-800">
                            {item.outpassId || item._id || "—"}
                          </h3>
                        </div>

                        <StatusBadge status={item.status} />
                      </div>
                    </div>

                    <div className="space-y-4 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white">
                          {getInitials(studentName)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {studentName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {getEnrollment(item) || "Student"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                          <MapPin size={14} />
                          Destination
                        </p>

                        <p className="break-words text-sm font-medium text-slate-800">
                          {item.destination || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                          <FileText size={14} />
                          Reason
                        </p>

                        <p className="line-clamp-3 break-words text-sm leading-6 text-slate-600">
                          {item.reason || "—"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays size={15} />
                        {date.date}
                        {date.time && <span>· {date.time}</span>}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 bg-slate-50/70 p-3">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-blue-700"
                      >
                        <FileText size={16} />
                        View Details
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        {!loading && (page > 1 || hasNextPage) && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
            <p className="text-xs font-medium text-slate-500">
              Page {page}
              {typeof total === "number" ? ` · ${total} total records` : ""}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={!hasNextPage}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedItem(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-details-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Outpass Record
                </p>

                <h2
                  id="history-details-title"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  Request Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close details"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="break-all rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs font-bold text-slate-700">
                  {selectedItem.outpassId || selectedItem._id || "—"}
                </span>

                <StatusBadge status={selectedItem.status} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Student
                  </p>

                  <p className="mt-1 break-words text-sm font-bold text-slate-900">
                    {getStudentName(selectedItem)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Enrollment
                  </p>

                  <p className="mt-1 break-words text-sm font-bold text-slate-900">
                    {getEnrollment(selectedItem) || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Destination
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {selectedItem.destination || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Applied On
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {formatDateTime(selectedItem.createdAt).date}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold text-slate-400">
                  Reason
                </p>

                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                  {selectedItem.reason || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                  <ShieldCheck size={16} />
                  AMIOUT History
                </p>

                <p className="mt-2 text-xs leading-5 text-blue-800/80">
                  This is a read-only record from the existing faculty history
                  response.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
