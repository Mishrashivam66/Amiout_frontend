"use strict";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  Filter,
  History,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";

import api from "../../../services/api";

// This component intentionally keeps the existing endpoint, response data,
// filtering, and View navigation. No new dependencies or backend changes.
const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "EXITED", label: "Exited" },
  { value: "RETURNED", label: "Returned" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_THEME = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
  EXITED: "border-blue-200 bg-blue-50 text-blue-700",
  RETURNED: "border-violet-200 bg-violet-50 text-violet-700",
  CANCELLED: "border-slate-200 bg-slate-100 text-slate-600",
};

const show = (value, fallback = "—") => {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
};

const formatDate = (value) => {
  if (!value) return "—";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    )
      return "—";
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
};

const formatReturn = (value) => {
  if (!value) return "Not specified";
  const text = String(value).trim();
  // Planned return can be sent as HH:mm, not a JavaScript Date.
  const match = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour > 23 || minute > 59) return "Not specified";
    return `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return formatDate(text);
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return "Not specified";
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

const StatusBadge = ({ status }) => {
  const normalized = show(status, "UNKNOWN").toUpperCase();
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-wide ${STATUS_THEME[normalized] || "border-slate-200 bg-slate-50 text-slate-600"}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {normalized}
    </span>
  );
};

const MetricCard = ({ title, value, icon: Icon, color, description }) => (
  <div className="group relative min-w-0 overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-slate-500 sm:text-sm">
          {title}
        </p>
        <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {value}
        </p>
        <p className="mt-2 text-xs text-slate-400">{description}</p>
      </div>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${color}`}
      >
        <Icon size={22} strokeWidth={2} />
      </div>
    </div>
  </div>
);

const OutpassHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async ({ initial = false, signal } = {}) => {
    if (initial) setLoading(true);
    else setRefreshing(true);
    setError("");

    try {
      const response = await api.get("/outpass/history", { signal });
      if (response?.data?.success === false) {
        throw new Error(
          response.data.message || "Failed to load outpass history.",
        );
      }
      const data = response?.data?.data;
      // Original response shape: { data: [...] }.
      // Accept a nested results array too if the API supplies one later.
      const records = Array.isArray(data)
        ? data
        : Array.isArray(data?.outpasses)
          ? data.outpasses
          : Array.isArray(data?.history)
            ? data.history
            : [];
      setHistory(records);
    } catch (requestError) {
      if (
        requestError?.code === "ERR_CANCELED" ||
        requestError?.name === "CanceledError"
      )
        return;
      const message =
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Failed to load outpass history.";
      setError(message);
      if (initial) setHistory([]);
      else toast.error(message);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchHistory({ initial: true, signal: controller.signal });
    return () => controller.abort();
  }, [fetchHistory]);

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();
    return history.filter((item) => {
      const matchesSearch =
        !query ||
        [item?.destination, item?.reason, item?.outpassId].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        );
      const matchesStatus =
        status === "ALL" || String(item?.status ?? "").toUpperCase() === status;
      return matchesSearch && matchesStatus;
    });
  }, [history, search, status]);

  const filteredCounts = useMemo(
    () => ({
      approved: filteredHistory.filter((item) => item?.status === "APPROVED")
        .length,
      pending: filteredHistory.filter((item) => item?.status === "PENDING")
        .length,
    }),
    [filteredHistory],
  );

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
  };

  const hasFilters = Boolean(search.trim()) || status !== "ALL";

  const openOutpass = (item) => {
    const id = item?._id || item?.id || item?.outpassId;
    if (!id) {
      toast.error("Outpass ID is missing for this record.");
      return;
    }
    navigate(`/student/outpass/${encodeURIComponent(String(id))}`);
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1500px] space-y-6 pb-10 sm:space-y-7">
      {/* Premium header */}
      <header className="relative isolate overflow-hidden rounded-[26px] bg-gradient-to-br from-[#061528] via-[#10253b] to-[#064f40] px-5 py-7 text-white shadow-xl shadow-slate-950/10 sm:rounded-[30px] sm:px-8 sm:py-9 lg:px-10">
        <div className="pointer-events-none absolute -right-10 -top-24 h-60 w-60 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="min-w-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
              <Sparkles size={13} /> AMIOUT · Student Portal
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-[34px]">
              Outpass History
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-[15px]">
              View your requests, monitor decisions and access your digital
              outpass records.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2">
                <ShieldCheck size={15} className="text-emerald-300" /> Secure
                record history
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2">
                <History size={15} className="text-emerald-300" />{" "}
                {history.length} total records
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fetchHistory()}
            disabled={loading || refreshing}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh History"}
          </button>
        </div>
      </header>

      {/* Filter controls */}
      <section className="min-w-0 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <SlidersHorizontal size={18} />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Find an outpass
              </h2>
              <p className="text-xs text-slate-500">
                Search and filter your request history
              </p>
            </div>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={15} /> Clear filters
            </button>
          )}
        </div>
        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="relative block min-w-0">
            <span className="sr-only">
              Search by destination, reason or outpass ID
            </span>
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search destination, reason or outpass ID..."
              className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <label className="relative block min-w-0">
            <span className="sr-only">Filter by outpass status</span>
            <Filter
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-9 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </label>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Showing{" "}
          <span className="font-bold text-slate-800">
            {filteredHistory.length}
          </span>{" "}
          of {history.length} requests
        </p>
      </section>

      {/* Counts reflect the current search/filter, matching the original page. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <MetricCard
          title="Total Requests"
          value={loading ? "—" : filteredHistory.length}
          icon={FileText}
          color="bg-slate-100 text-slate-700"
          description="Matching your filters"
        />
        <MetricCard
          title="Approved"
          value={loading ? "—" : filteredCounts.approved}
          icon={CheckCircle2}
          color="bg-emerald-50 text-emerald-700"
          description="Approved requests"
        />
        <MetricCard
          title="Pending"
          value={loading ? "—" : filteredCounts.pending}
          icon={Clock3}
          color="bg-amber-50 text-amber-700"
          description="Awaiting decision"
        />
      </div>

      {/* History list */}
      <section className="min-w-0 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CalendarDays size={20} />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                Request Records
              </h2>
              <p className="text-xs text-slate-500">
                Open any request to see its complete details
              </p>
            </div>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {filteredHistory.length} Results
          </span>
        </div>

        {error && (
          <div
            role="alert"
            className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:mx-6"
          >
            <span className="min-w-0 break-words [overflow-wrap:anywhere]">
              {error}
            </span>
            <button
              type="button"
              onClick={() => fetchHistory()}
              className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div
            className="space-y-3 p-4 sm:p-6"
            aria-label="Loading outpass history"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={28} />
            </span>
            <h3 className="mt-5 text-lg font-bold text-slate-800">
              No outpass history found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {hasFilters
                ? "No requests match your search or selected status."
                : "Your outpass requests will appear here when available."}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile: stacked cards avoid horizontal scrolling. */}
            <div className="space-y-3 p-3 md:hidden sm:p-4">
              {filteredHistory.map((item, index) => (
                <article
                  key={item?._id || item?.outpassId || index}
                  className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <span className="min-w-0 break-words [overflow-wrap:anywhere] text-xs font-bold text-slate-500">
                      #{index + 1} · {show(item?.outpassId, "Outpass")}
                    </span>
                    <StatusBadge status={item?.status} />
                  </div>
                  <div className="mt-4 flex min-w-0 items-start gap-2.5">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <p className="min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm font-bold leading-6 text-slate-900">
                      {show(item?.destination)}
                    </p>
                  </div>
                  {item?.reason && (
                    <p className="mt-2 min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-xs leading-5 text-slate-500">
                      {show(item.reason)}
                    </p>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-500">Out Date</p>
                      <p className="mt-1 text-xs font-bold text-slate-800">
                        {formatDate(item?.outDate)}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-500">
                        Planned Return
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-800">
                        {formatReturn(item?.inTime || item?.expectedReturn)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openOutpass(item)}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-100"
                  >
                    <Eye size={16} /> View Details <ArrowRight size={15} />
                  </button>
                </article>
              ))}
            </div>

            {/* Desktop: responsive table, with bounded/wrapping text. */}
            <div className="hidden min-w-0 overflow-x-auto md:block">
              <table className="w-full min-w-[760px] table-fixed text-left">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="w-[7%] px-4 py-4 lg:px-6">#</th>
                    <th className="w-[27%] px-4 py-4 lg:px-6">Destination</th>
                    <th className="w-[16%] px-4 py-4">Out Date</th>
                    <th className="w-[20%] px-4 py-4">Planned Return</th>
                    <th className="w-[17%] px-4 py-4">Status</th>
                    <th className="w-[13%] px-4 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((item, index) => (
                    <tr
                      key={item?._id || item?.outpassId || index}
                      className="transition-colors hover:bg-emerald-50/40"
                    >
                      <td className="px-4 py-5 align-top text-sm font-bold text-slate-400 lg:px-6">
                        {index + 1}
                      </td>
                      <td className="min-w-0 px-4 py-5 align-top lg:px-6">
                        <div className="flex min-w-0 items-start gap-2">
                          <MapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-emerald-600"
                          />
                          <div className="min-w-0">
                            <p className="min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm font-bold leading-5 text-slate-800">
                              {show(item?.destination)}
                            </p>
                            <p className="mt-1 break-words [overflow-wrap:anywhere] text-[11px] text-slate-400">
                              {show(item?.outpassId, "Request")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 align-top text-sm font-medium text-slate-600">
                        {formatDate(item?.outDate)}
                      </td>
                      <td className="px-4 py-5 align-top text-sm font-medium text-slate-600">
                        {formatReturn(item?.inTime || item?.expectedReturn)}
                      </td>
                      <td className="px-4 py-5 align-top">
                        <StatusBadge status={item?.status} />
                      </td>
                      <td className="px-4 py-5 text-center align-top">
                        <button
                          type="button"
                          onClick={() => openOutpass(item)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        >
                          <Eye size={15} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <p className="flex flex-wrap items-center justify-center gap-2 text-center text-xs text-slate-400">
        <ShieldCheck size={14} /> AMIOUT · Secure Student Outpass Records
      </p>
    </div>
  );
};

export default OutpassHistory;
