import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
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
} from "lucide-react";

import {
  getPendingRequests,
  approveOutpass,
  rejectOutpass,
} from "../services/mentor.service";

// =============================================
// HELPERS
// =============================================

const getInitials = (name = "") =>
  String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "ST";

const formatDate = (value) => {
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

const unwrapRequests = (response) => {
  const data = response?.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.requests)) return data.requests;
  if (Array.isArray(data?.data?.requests)) {
    return data.data.requests;
  }

  return [];
};

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

// =============================================
// PARENT STATUS
// =============================================

const getParentStatus = (item) => {
  const raw =
    item?.parentDecision?.status ??
    item?.parentApproval?.status ??
    item?.parentConsentStatus ??
    item?.parentApprovalStatus ??
    item?.parentStatus ??
    item?.parentDecisionStatus;

  if (raw == null || raw === "") {
    return "NOT AVAILABLE";
  }

  const status = String(raw).trim().toUpperCase();

  if (["APPROVED", "ACCEPTED", "CONSENTED"].includes(status)) {
    return "APPROVED";
  }

  if (["REJECTED", "DECLINED"].includes(status)) {
    return "REJECTED";
  }

  if (["PENDING", "AWAITING", "NOT_RESPONDED"].includes(status)) {
    return "PENDING";
  }

  return "NOT AVAILABLE";
};

// Parent PENDING does not block faculty decision.
// Backend must separately enforce approval permissions
// and QR generation requirements.

const canApproveRequest = (item) =>
  String(item?.status || "PENDING").toUpperCase() === "PENDING" &&
  ["PENDING", "APPROVED"].includes(getParentStatus(item)) &&
  item?.canCurrentFacultyApprove !== false;

// =============================================
// STATUS BADGE
// =============================================

const StatusBadge = ({ status = "PENDING", small = false }) => {
  const value = String(status).toUpperCase();

  const Icon =
    value === "APPROVED"
      ? CheckCircle2
      : value === "REJECTED"
        ? XCircle
        : Clock3;

  const color =
    value === "APPROVED"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : value === "REJECTED"
        ? "bg-red-50 text-red-700 ring-red-200"
        : value === "NOT AVAILABLE"
          ? "bg-slate-100 text-slate-600 ring-slate-200"
          : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ring-1 ring-inset ${color} ${
        small ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs"
      }`}
    >
      <Icon size={13} />
      {value}
    </span>
  );
};

// =============================================
// PARENT APPROVAL BADGE
// =============================================

const ParentBadge = ({ item }) => (
  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
    <ShieldCheck size={17} className="text-emerald-600" />

    <span className="text-xs font-semibold text-slate-700">
      Parent Approval
    </span>

    <StatusBadge status={getParentStatus(item)} small />
  </div>
);

// =============================================
// STAT CARD
// =============================================

const StatCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}
      >
        <Icon size={21} />
      </div>

      <p className="mt-5 text-3xl font-extrabold text-slate-900">{value}</p>

      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
};

// =============================================
// ACTION MODAL
// =============================================

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

  const approving = action === "approve";
  const parentStatus = getParentStatus(request);
  const allowed = canApproveRequest(request);

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
        aria-labelledby="mentor-modal-title"
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2
              id="mentor-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              {approving ? "Approve Outpass" : "Reject Outpass"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Review before confirming
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
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

          <ParentBadge item={request} />

          {approving ? (
            <div
              className={`rounded-xl border p-4 ${
                parentStatus === "APPROVED"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : parentStatus === "PENDING"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <p className="text-sm font-semibold">
                {parentStatus === "APPROVED"
                  ? "Parent consent received"
                  : parentStatus === "PENDING"
                    ? "Parent response pending"
                    : "Faculty approval unavailable"}
              </p>

              <p className="mt-2 text-xs leading-5">
                {parentStatus === "APPROVED"
                  ? "You can record your faculty approval."
                  : parentStatus === "PENDING"
                    ? "Faculty approval may be recorded now. Parent status remains PENDING. QR must wait for valid parent consent."
                    : parentStatus === "REJECTED"
                      ? "Parent rejected this request. Approval is blocked."
                      : "Parent status is unavailable. Refresh or check Details."}
              </p>
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
                disabled={loading}
                rows={4}
                maxLength={500}
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
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={
                loading ||
                (approving && !allowed) ||
                (!approving && !remark.trim())
              }
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                approving
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : approving ? (
                <Check size={17} />
              ) : (
                <X size={17} />
              )}

              {loading
                ? "Processing..."
                : approving
                  ? "Confirm Approval"
                  : "Reject Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================
// MAIN PAGE
// =============================================

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

      setRequests(unwrapRequests(response));
    } catch (err) {
      const msg = errorMessage(err, "Failed to load pending outpasses.");

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  // ===========================================
  // SEARCH / FILTER
  // ===========================================

  const filteredRequests = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return requests.filter((item) => {
      const text = [
        item.studentName,
        item.enrollmentNumber,
        item.student?.name,
        item.destination,
        item.reason,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const status = String(item.status || "PENDING").toUpperCase();

      return (
        (!keyword || text.includes(keyword)) &&
        (filter === "ALL" || status === filter)
      );
    });
  }, [requests, search, filter]);

  const pendingCount = requests.filter(
    (item) => String(item.status || "PENDING").toUpperCase() === "PENDING",
  ).length;

  // ===========================================
  // ACTION HANDLERS
  // ===========================================

  const openAction = (item, action) => {
    if (action === "approve" && !canApproveRequest(item)) {
      toast.warning(
        getParentStatus(item) === "REJECTED"
          ? "Parent rejected this request. Faculty approval is blocked."
          : "Request not eligible for approval. Check details or refresh.",
      );

      return;
    }

    setSelectedRequest(item);
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

    if (selectedAction === "approve" && !canApproveRequest(selectedRequest)) {
      toast.error("Request cannot currently be approved. Refresh the list.");
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
            ? "Faculty approval recorded."
            : "Outpass rejected."),
      );

      setSelectedRequest(null);
      setSelectedAction(null);
      setRemark("");

      await loadRequests(true);
    } catch (err) {
      toast.error(errorMessage(err, `Failed to ${selectedAction} outpass.`));
    } finally {
      setActionLoading(false);
    }
  };

  // ===========================================
  // ACTION BUTTONS
  // ===========================================

  const renderActions = (item, compact = false) => {
    const allowed = canApproveRequest(item);

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
          disabled={actionLoading || !allowed}
          title={
            allowed ? "Record faculty approval" : "Not eligible for approval"
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
  // PAGE UI
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
              Review students and record faculty decisions. Pending parent
              response does not block faculty approval.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadRequests(true)}
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

      {/* REQUESTS */}
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
              <div className="relative sm:min-w-64">
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
          <div className="m-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}

            <button
              type="button"
              onClick={() => void loadRequests()}
              className="ml-2 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}
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
                void loadRequests(true);
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
                    ].map((title) => (
                      <th
                        key={title}
                        className="px-5 py-4 text-xs font-bold tracking-wider text-slate-500"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((item) => (
                    <tr key={item._id} className="hover:bg-emerald-50/40">
                      <td className="px-5 py-5">
                        <div className="flex min-w-44 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                            {getInitials(
                              item.studentName || item.student?.name,
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {item.studentName ||
                                item.student?.name ||
                                "Unknown Student"}
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

                      <td className="max-w-56 px-5 py-5 text-sm text-slate-600">
                        <p className="truncate" title={item.reason || ""}>
                          {item.reason || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <StatusBadge status={getParentStatus(item)} small />
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-600">
                        {formatDate(item.createdAt)}
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
                          {getInitials(item.studentName || item.student?.name)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-slate-900">
                            {item.studentName ||
                              item.student?.name ||
                              "Unknown Student"}
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

                      <p className="wrap-break-word text-sm font-semibold text-slate-800">
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

                    <ParentBadge item={item} />

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays size={15} />
                      {formatDate(item.createdAt)}
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

              <div className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
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

// =============================================
// DEFAULT EXPORT — LAST LINE
// =============================================

export default PendingOutpasses;
