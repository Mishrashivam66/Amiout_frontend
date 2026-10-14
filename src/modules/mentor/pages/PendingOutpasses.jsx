import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  Inbox,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  X,
  XCircle,
  CalendarDays,
  ClipboardCheck,
} from "lucide-react";

import {
  getPendingRequests,
  approveOutpass,
  rejectOutpass,
} from "../services/mentor.service";

// ======================================================
// HELPERS
// ======================================================

const getInitials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "ST";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
};

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);
};

const unwrapRequests = (response) => {
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.requests)) return payload.requests;
  if (Array.isArray(payload?.data?.requests)) {
    return payload.data.requests;
  }

  return [];
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

// ======================================================
// REUSABLE STATUS BADGE
// ======================================================

const StatusBadge = ({ status = "PENDING" }) => {
  const normalized = String(status).toUpperCase();

  const approved = normalized === "APPROVED";
  const rejected = normalized === "REJECTED";

  const Icon = approved ? CheckCircle2 : rejected ? XCircle : Clock3;

  const style = approved
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : rejected
      ? "bg-red-50 text-red-700 ring-red-200"
      : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${style}`}
    >
      <Icon size={13} />
      {normalized}
    </span>
  );
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({ icon: Icon, label, value, color }) => {
  const variants = {
    blue: {
      box: "bg-blue-50 text-blue-600",
      ring: "border-blue-100",
    },
    amber: {
      box: "bg-amber-50 text-amber-600",
      ring: "border-amber-100",
    },
    emerald: {
      box: "bg-emerald-50 text-emerald-600",
      ring: "border-emerald-100",
    },
  };

  const variant = variants[color] || variants.blue;

  return (
    <div
      className={`rounded-2xl border ${variant.ring} bg-white p-5 shadow-sm`}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${variant.box}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
};

// ======================================================
// CONFIRMATION MODAL
// ======================================================

const ActionModal = ({
  request,
  action,
  loading,
  remark,
  setRemark,
  onClose,
  onConfirm,
}) => {
  if (!request || !action) return null;

  const isApprove = action === "approve";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="outpass-action-title"
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                isApprove
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {isApprove ? <CheckCircle2 size={25} /> : <XCircle size={25} />}
            </div>

            <div>
              <h2
                id="outpass-action-title"
                className="text-lg font-bold text-slate-900"
              >
                {isApprove ? "Approve Outpass" : "Reject Outpass"}
              </h2>

              <p className="text-xs text-slate-500">Review before confirming</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close dialog"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">Student</p>

            <p className="mt-1 font-bold text-slate-900">
              {request.studentName || "Unknown Student"}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Destination: {request.destination || "—"}
            </p>
          </div>

          {isApprove ? (
            <p className="text-sm leading-6 text-slate-600">
              Are you sure you want to approve this outpass? The backend will
              verify the student's eligibility and required approvals.
            </p>
          ) : (
            <div>
              <label
                htmlFor="rejection-remark"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Rejection Remark <span className="text-red-500">*</span>
              </label>

              <textarea
                id="rejection-remark"
                value={remark}
                onChange={(event) => setRemark(event.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Explain why the outpass is being rejected..."
                disabled={loading}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {remark.length}/500
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading || (!isApprove && !remark.trim())}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isApprove
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : isApprove ? (
                <Check size={17} />
              ) : (
                <X size={17} />
              )}

              {loading
                ? "Processing..."
                : isApprove
                  ? "Confirm Approval"
                  : "Reject Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const PendingOutpasses = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [remark, setRemark] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  // --------------------------------------------------
  // FETCH PENDING REQUESTS
  // --------------------------------------------------

  const loadRequests = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getPendingRequests();
      const items = unwrapRequests(response);

      setRequests(items);
    } catch (err) {
      console.error("Pending Outpasses Error:", err);

      const message = getErrorMessage(err, "Failed to load pending outpasses.");

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // --------------------------------------------------
  // FILTERS
  // --------------------------------------------------

  const filteredRequests = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return requests.filter((item) => {
      const values = [
        item.studentName,
        item.enrollmentNumber,
        item.destination,
        item.reason,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !keyword || values.includes(keyword);

      const status = String(item.status || "PENDING").toUpperCase();

      const matchesFilter = filter === "ALL" || status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [requests, search, filter]);

  const pendingCount = requests.filter(
    (item) => String(item.status || "PENDING").toUpperCase() === "PENDING",
  ).length;

  const openAction = (request, action) => {
    setSelectedRequest(request);
    setSelectedAction(action);
    setRemark("");
  };

  const closeAction = () => {
    if (actionLoading) return;

    setSelectedRequest(null);
    setSelectedAction(null);
    setRemark("");
  };

  // --------------------------------------------------
  // APPROVE / REJECT
  // --------------------------------------------------

  const confirmAction = async () => {
    if (!selectedRequest?._id || !selectedAction || actionLoading) return;

    if (selectedAction === "reject" && !remark.trim()) {
      toast.error("Rejection remark is required.");
      return;
    }

    try {
      setActionLoading(true);

      const response =
        selectedAction === "approve"
          ? await approveOutpass(selectedRequest._id)
          : await rejectOutpass(selectedRequest._id, remark.trim());

      toast.success(
        response?.message ||
          response?.data?.message ||
          (selectedAction === "approve"
            ? "Outpass approved successfully."
            : "Outpass rejected successfully."),
      );

      setSelectedRequest(null);
      setSelectedAction(null);
      setRemark("");

      await loadRequests(true);
    } catch (err) {
      toast.error(getErrorMessage(err, `Failed to ${selectedAction} outpass.`));
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // ACTION BUTTONS
  // --------------------------------------------------

  const ActionButtons = ({ item, compact = false }) => (
    <div
      className={`flex flex-wrap items-center gap-2 ${
        compact ? "w-full" : "justify-end"
      }`}
    >
      <Link
        to={`/mentor/outpass/${item._id}`}
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 ${
          compact ? "flex-1" : ""
        }`}
      >
        <ArrowUpRight size={15} />
        Details
      </Link>

      <button
        type="button"
        onClick={() => openAction(item, "approve")}
        disabled={actionLoading}
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 ${
          compact ? "flex-1" : ""
        }`}
      >
        <Check size={15} />
        Approve
      </button>

      <button
        type="button"
        onClick={() => openAction(item, "reject")}
        disabled={actionLoading}
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50 ${
          compact ? "flex-1" : ""
        }`}
      >
        <X size={15} />
        Reject
      </button>
    </div>
  );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen space-y-7 pb-10">
      {/* PAGE HEADER */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-32 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              <ShieldCheck size={14} />
              Faculty Approval Center
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Pending Outpasses
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Review student requests, verify travel details and manage
              authorized outpass approvals.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadRequests(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh Requests"}
          </button>
        </div>
      </section>

      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={ClipboardCheck}
          label="Total Loaded Requests"
          value={requests.length}
          color="blue"
        />

        <StatCard
          icon={Clock3}
          label="Pending Approval"
          value={pendingCount}
          color="amber"
        />

        <StatCard
          icon={UserRound}
          label="Matching Your Search"
          value={filteredRequests.length}
          color="emerald"
        />
      </div>

      {/* MAIN CARD */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_-20px_rgba(15,23,42,0.2)]">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <FileText size={20} className="text-blue-600" />
                Requests Queue
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Pending requests awaiting faculty review
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div className="relative sm:min-w-[260px]">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search student, enrollment..."
                  aria-label="Search pending outpasses"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="relative">
                <Filter
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  aria-label="Filter by request status"
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Loaded</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* API ERROR */}

        {error && (
          <div className="m-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => loadRequests()}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
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
        ) : filteredRequests.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
              <Inbox size={38} strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              {search || filter !== "ALL"
                ? "No Matching Requests"
                : "No Pending Requests"}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search || filter !== "ALL"
                ? "No requests match your current search or filter."
                : "There are currently no outpass requests waiting for your review."}
            </p>

            {(search || filter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("ALL");
                }}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    {[
                      "STUDENT",
                      "DESTINATION",
                      "REASON",
                      "APPLIED ON",
                      "STATUS",
                      "ACTIONS",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className={`px-5 py-4 text-[11px] font-bold tracking-wider text-slate-500 ${
                          heading === "ACTIONS" ? "text-right" : ""
                        }`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((item) => (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-5">
                        <div className="flex min-w-[175px] items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                            {getInitials(item.studentName)}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[190px] truncate text-sm font-bold text-slate-900">
                              {item.studentName || "Unknown Student"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {item.enrollmentNumber || "Student"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex max-w-[160px] items-center gap-1.5 text-sm font-medium text-slate-700">
                          <MapPin
                            size={15}
                            className="shrink-0 text-blue-500"
                          />
                          <span className="truncate">
                            {item.destination || "—"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <p
                          title={item.reason || ""}
                          className="max-w-[210px] truncate text-sm text-slate-600"
                        >
                          {item.reason || "—"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5">
                        <div className="flex items-start gap-2">
                          <CalendarDays
                            size={16}
                            className="mt-0.5 text-slate-400"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {formatDate(item.createdAt)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatTime(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-5 py-5">
                        <ActionButtons item={item} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE / TABLET CARDS */}
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:hidden">
              {filteredRequests.map((item) => (
                <article
                  key={item._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="border-b border-slate-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white">
                          {getInitials(item.studentName)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-slate-900">
                            {item.studentName || "Unknown Student"}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.enrollmentNumber || "—"}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={item.status} />
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <div>
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <MapPin size={13} />
                        Destination
                      </p>

                      <p className="break-words text-sm font-semibold text-slate-800">
                        {item.destination || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <FileText size={13} />
                        Reason
                      </p>

                      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                        {item.reason || "—"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays size={15} />
                      {formatDate(item.createdAt)}
                      {formatTime(item.createdAt) && (
                        <>· {formatTime(item.createdAt)}</>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50/70 p-3">
                    <ActionButtons item={item} compact />
                  </div>
                </article>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-800">
                  {filteredRequests.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-800">
                  {requests.length}
                </span>{" "}
                loaded requests
              </p>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck size={14} />
                Authorized faculty review
              </div>
            </div>
          </>
        )}
      </section>

      {/* CONFIRM / REJECT MODAL */}
      <ActionModal
        request={selectedRequest}
        action={selectedAction}
        loading={actionLoading}
        remark={remark}
        setRemark={setRemark}
        onClose={closeAction}
        onConfirm={confirmAction}
      />
    </div>
  );
};

export default PendingOutpasses;
