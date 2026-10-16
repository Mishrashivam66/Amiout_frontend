import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ArrowUpRight,
  CalendarDays,
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
  ClipboardCheck,
  Phone,
} from "lucide-react";

import {
  getPendingRequests,
  approveOutpass,
  rejectOutpass,
} from "../services/mentor.service";

// ===========================================
// HELPERS
// ===========================================

const getInitials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);

  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "ST"
  );
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

// Parent consent MUST come from the backend.
// Never treat a missing value as APPROVED.
const getParentStatus = (item) => {
  const decision =
    item?.parentDecision?.status ??
    item?.parentApproval?.status ??
    item?.parentConsentStatus ??
    item?.parentApprovalStatus ??
    item?.parentStatus ??
    item?.parentDecisionStatus;

  if (decision == null || decision === "") {
    return "NOT AVAILABLE";
  }

  const normalized = String(decision).trim().toUpperCase();

  if (["APPROVED", "ACCEPTED", "CONSENTED"].includes(normalized)) {
    return "APPROVED";
  }

  if (["REJECTED", "DECLINED"].includes(normalized)) {
    return "REJECTED";
  }

  if (["PENDING", "AWAITING", "NOT_RESPONDED"].includes(normalized)) {
    return "PENDING";
  }

  return "NOT AVAILABLE";
};

// ===========================================
// STATUS BADGE
// ===========================================

const StatusBadge = ({ status = "PENDING", small = false }) => {
  const normalized = String(status).toUpperCase();

  const approved = normalized === "APPROVED";
  const rejected = normalized === "REJECTED";

  const Icon = approved ? CheckCircle2 : rejected ? XCircle : Clock3;

  const style = approved
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : rejected
      ? "bg-red-50 text-red-700 ring-red-200"
      : normalized === "NOT AVAILABLE"
        ? "bg-slate-100 text-slate-600 ring-slate-200"
        : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ring-1 ring-inset ${style} ${
        small ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
      }`}
    >
      <Icon size={13} />
      {normalized}
    </span>
  );
};

// ===========================================
// STAT CARD
// ===========================================

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          colors[color] || colors.blue
        }`}
      >
        <Icon size={21} />
      </div>

      <p className="mt-5 text-3xl font-extrabold text-slate-900">{value}</p>

      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
};

// ===========================================
// PARENT APPROVAL INDICATOR
// ===========================================

const ParentApprovalIndicator = ({ item }) => {
  const parentStatus = getParentStatus(item);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <ShieldCheck
        size={17}
        className={
          parentStatus === "APPROVED"
            ? "text-emerald-600"
            : parentStatus === "REJECTED"
              ? "text-red-600"
              : "text-amber-600"
        }
      />

      <span className="text-xs font-semibold text-slate-700">
        Parent Approval
      </span>

      <StatusBadge status={parentStatus} small />
    </div>
  );
};

// ===========================================
// ACTION MODAL
// ===========================================

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
  const parentStatus = getParentStatus(request);

  const canApprove = parentStatus === "APPROVED";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="outpass-modal-title"
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2
              id="outpass-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              {isApprove ? "Approve Outpass" : "Reject Outpass"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Review before confirming
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Student</p>

            <p className="mt-1 font-bold text-slate-900">
              {request.studentName ||
                request.student?.name ||
                "Unknown Student"}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Destination: {request.destination || "—"}
            </p>
          </div>

          <ParentApprovalIndicator item={request} />

          {isApprove ? (
            <div>
              {canApprove ? (
                <p className="text-sm leading-6 text-slate-600">
                  Parent consent is approved. Confirming will submit this
                  outpass for university approval.
                </p>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">
                    Parent consent is not confirmed.
                  </p>

                  <p className="mt-2 text-xs leading-5 text-amber-700">
                    Approval cannot continue until the backend confirms explicit
                    parent consent. Open Details to review the parent
                    information.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label
                htmlFor="rejection-remark"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Rejection Remark *
              </label>

              <textarea
                id="rejection-remark"
                value={remark}
                onChange={(event) => setRemark(event.target.value)}
                rows={4}
                maxLength={500}
                disabled={loading}
                placeholder="Enter reason for rejection..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
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
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={
                loading ||
                (isApprove && !canApprove) ||
                (!isApprove && !remark.trim())
              }
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
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

// ===========================================
// MAIN COMPONENT
// ===========================================

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

  // ===========================================
  // LOAD REQUESTS
  // ===========================================

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

  // ===========================================
  // SEARCH AND FILTER
  // ===========================================

  const filteredRequests = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return requests.filter((item) => {
      const values = [
        item.studentName,
        item.enrollmentNumber,
        item.student?.name,
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

  // ===========================================
  // ACTION HANDLERS
  // ===========================================

  const openAction = (request, action) => {
    if (action === "approve" && getParentStatus(request) !== "APPROVED") {
      toast.warning(
        "Parent approval is not confirmed. Review the parent consent first.",
      );
      return;
    }

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

  const confirmAction = async () => {
    if (!selectedRequest?._id || !selectedAction || actionLoading) {
      return;
    }

    if (
      selectedAction === "approve" &&
      getParentStatus(selectedRequest) !== "APPROVED"
    ) {
      toast.error("Parent consent must be confirmed first.");
      return;
    }

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

  // ===========================================
  // ACTION BUTTONS
  // ===========================================

  const renderActions = (item, compact = false) => {
    const parentApproved = getParentStatus(item) === "APPROVED";

    return (
      <div
        className={`flex flex-wrap items-center gap-2 ${
          compact ? "w-full" : "justify-end"
        }`}
      >
        <Link
          to={`/mentor/outpass/${item._id}`}
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 ${
            compact ? "flex-1" : ""
          }`}
        >
          <ArrowUpRight size={15} />
          Details
        </Link>

        <button
          type="button"
          onClick={() => openAction(item, "approve")}
          disabled={actionLoading || !parentApproved}
          title={
            parentApproved
              ? "Approve this outpass"
              : "Parent consent must be confirmed first"
          }
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 ${
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
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50 ${
            compact ? "flex-1" : ""
          }`}
        >
          <X size={15} />
          Reject
        </button>
      </div>
    );
  };

  // ===========================================
  // UI
  // ===========================================

  return (
    <div className="min-h-screen space-y-7 pb-10">
      {/* HEADER */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-emerald-950 p-6 text-white shadow-xl sm:p-8">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
              <ShieldCheck size={14} />
              Faculty Approval Center
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Pending Outpasses
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Review student requests, verify parent consent and manage
              authorized outpass approvals.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadRequests(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 disabled:opacity-50"
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

      {/* REQUEST QUEUE */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <FileText size={20} className="text-emerald-600" />
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
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
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
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

        {/* ERROR */}

        {error && (
          <div className="m-5 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => loadRequests()}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* LOADING / EMPTY */}

        {loading ? (
          <div className="flex items-center justify-center gap-3 p-16 text-slate-500">
            <Loader2 size={20} className="animate-spin" />
            Loading pending requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <Inbox size={45} className="mb-4 text-slate-400" />

            <h3 className="text-xl font-bold text-slate-900">
              No Matching Requests
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No requests match your current search or filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("ALL");
                loadRequests(true);
              }}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Clear Filters / Refresh
            </button>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {[
                      "STUDENT",
                      "DESTINATION",
                      "REASON",
                      "PARENT APPROVAL",
                      "APPLIED ON",
                      "STATUS",
                      "ACTIONS",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-[11px] font-bold tracking-wider text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((item) => (
                    <tr key={item._id} className="hover:bg-emerald-50/40">
                      <td className="px-5 py-5">
                        <div className="flex min-w-[175px] items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                            {getInitials(item.studentName)}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {item.studentName || "Unknown Student"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {item.enrollmentNumber || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-700">
                        {item.destination || "—"}
                      </td>

                      <td className="max-w-[220px] px-5 py-5 text-sm text-slate-600">
                        <p className="truncate" title={item.reason || ""}>
                          {item.reason || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <StatusBadge status={getParentStatus(item)} small />
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-600">
                        {formatDate(item.createdAt)}

                        <p className="text-xs text-slate-400">
                          {formatTime(item.createdAt)}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-5 py-5">{renderActions(item)}</td>
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

                    {/* NEW PARENT APPROVAL SECTION */}

                    <ParentApprovalIndicator item={item} />

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays size={15} />

                      {formatDate(item.createdAt)}

                      {formatTime(item.createdAt) && (
                        <span>· {formatTime(item.createdAt)}</span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50/70 p-3">
                    {renderActions(item, true)}
                  </div>
                </article>
              ))}
            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4">
              <p className="text-xs text-slate-500">
                Showing <strong>{filteredRequests.length}</strong> of{" "}
                <strong>{requests.length}</strong> loaded requests
              </p>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck size={14} />
                Authorized faculty review
              </div>
            </div>
          </>
        )}
      </section>

      {/* CONFIRMATION MODAL */}

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
