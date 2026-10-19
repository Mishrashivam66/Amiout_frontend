import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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

import api from "../../../services/api";
import {
  getPendingRequests,
  approveOutpass,
  rejectOutpass,
} from "../services/mentor.service";

const PAGE_SIZE = 10;
const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase();

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

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const getParentStatus = (item) => {
  const value =
    item?.parentDecision?.status ??
    item?.parentApproval?.status ??
    item?.parentConsentStatus ??
    item?.parentApprovalStatus ??
    item?.parentStatus ??
    item?.parentDecisionStatus;

  if (value === null || value === undefined || value === "") {
    return "NOT AVAILABLE";
  }
  const status = normalize(value);
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

// Coordinator MUST have an explicit action flag from its scoped backend.
// Mentor keeps its existing behavior; both actions are checked by backend.

const canApproveRequest = (request, isCoordinator) => {
  const parentStatus = getParentStatus(request);

  const eligible =
    normalize(request?.status) === "PENDING" &&
    ["PENDING", "APPROVED"].includes(parentStatus) &&
    request?.parentDecision?.callOutcome !== "REJECTED";

  if (!eligible) return false;

  // Coordinator can directly approve requests
  // within their authorized section.
  // Backend independently validates academic scope.
  if (isCoordinator) {
    return true;
  }

  // Mentor must be authorized for this request.
  return request?.canCurrentFacultyApprove !== false;
};

const unwrapList = (response) => {
  // Mentor service returns response.data; axios.get returns full response.
  const payload =
    response?.data?.success !== undefined
      ? response.data
      : response?.success !== undefined
        ? response
        : (response?.data ?? response);

  if (payload?.success === false) {
    throw new Error(payload.message || "Could not load requests.");
  }

  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.requests)
        ? payload.data.requests
        : Array.isArray(payload?.requests)
          ? payload.requests
          : [];

  const pagination = payload?.pagination || payload?.data?.pagination || null;
  return { rows, pagination };
};

function StatusBadge({ status = "PENDING", small = false }) {
  const value = normalize(status) || "NOT AVAILABLE";
  const Icon =
    value === "APPROVED"
      ? CheckCircle2
      : value === "REJECTED"
        ? XCircle
        : Clock3;
  const colors =
    value === "APPROVED"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : value === "REJECTED"
        ? "bg-red-50 text-red-700 ring-red-200"
        : value === "NOT AVAILABLE"
          ? "bg-slate-100 text-slate-600 ring-slate-200"
          : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ring-1 ring-inset ${colors} ${small ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs"}`}
    >
      <Icon size={13} />
      {value}
    </span>
  );
}

function ParentBadge({ item }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <ShieldCheck size={17} className="text-emerald-600" />
      <span className="text-xs font-semibold text-slate-700">
        Parent Approval
      </span>
      <StatusBadge status={getParentStatus(item)} small />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = "blue" }) {
  const palette = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${palette[color]}`}
      >
        <Icon size={21} />
      </div>
      <p className="mt-5 text-3xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

function ActionModal({
  request,
  action,
  isCoordinator,
  loading,
  remark,
  setRemark,
  onClose,
  onConfirm,
}) {
  if (!request || !action) return null;

  const approving = action === "approve";
  const parentStatus = getParentStatus(request);
  const allowed = canApproveRequest(request, isCoordinator);

  const requiresApprovalReason =
    approving && (parentStatus === "PENDING" || isCoordinator);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="faculty-outpass-modal-title"
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2
              id="faculty-outpass-modal-title"
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
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
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
                  ? "Authorized faculty approval can be recorded."
                  : parentStatus === "PENDING"
                    ? "Parent status remains PENDING. Authorized faculty approval can still issue the secure QR subject to backend checks."
                    : parentStatus === "REJECTED"
                      ? "Parent rejected this request; approval is blocked."
                      : "Parent status unavailable. Refresh before deciding."}
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

          {/* FACULTY APPROVAL / PARENT BYPASS REASON */}
          {approving && (
            <div className="space-y-2">
              <label
                htmlFor="faculty-approval-remark"
                className="block text-sm font-semibold text-slate-800"
              >
                {parentStatus === "PENDING"
                  ? "Faculty-Authorized Parent Bypass Reason *"
                  : isCoordinator
                    ? "Direct Approval Reason *"
                    : "Approval Remark (Optional)"}
              </label>

              <textarea
                id="faculty-approval-remark"
                value={remark}
                onChange={(event) => setRemark(event.target.value)}
                disabled={loading}
                rows={4}
                maxLength={500}
                placeholder={
                  parentStatus === "PENDING"
                    ? "Explain why you are authorizing this outpass while parent consent is pending..."
                    : "Enter your approval remarks..."
                }
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
              />

              {parentStatus === "PENDING" && (
                <p className="text-xs leading-5 text-amber-700">
                  Parent consent remains PENDING. Your decision will be recorded
                  as a faculty-authorized parent bypass, not parent approval.
                </p>
              )}

              <div className="flex justify-between gap-3">
                <p className="text-xs text-slate-500">
                  {requiresApprovalReason
                    ? "Minimum 10 characters required."
                    : "Optional approval remark."}
                </p>

                <p className="text-xs text-slate-400">
                  {remark.trim().length}/500
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={
                loading ||
                (approving && !allowed) ||
                (requiresApprovalReason && remark.trim().length < 10) ||
                (!approving && (isCoordinator || !remark.trim()))
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
}

export default function PendingOutpasses() {
  const location = useLocation();
  const isCoordinator =
    location.pathname === "/coordinator" ||
    location.pathname.startsWith("/coordinator/");
  const basePath = isCoordinator ? "/coordinator" : "/mentor";

  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [parentFilter, setParentFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [remark, setRemark] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const requestVersion = useRef(0);

  // Debounced server search, so searching works across every page.
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearchQuery(search.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const loadRequests = useCallback(
    async (silent = false) => {
      const version = ++requestVersion.current;
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError("");

      try {
        const response = isCoordinator
          ? await api.get("/coordinator/outpass/pending", {
              params: { page, limit: PAGE_SIZE, search: searchQuery },
            })
          : await getPendingRequests(page, PAGE_SIZE, searchQuery);

        if (version !== requestVersion.current) return;
        const { rows, pagination: paging } = unwrapList(response);
        setRequests(rows);
        setPagination(paging);
      } catch (err) {
        if (version !== requestVersion.current) return;
        const message = getErrorMessage(
          err,
          "Failed to load pending outpasses.",
        );
        setError(message);
        setRequests([]);
        setPagination(null);
        toast.error(message);
      } finally {
        if (version === requestVersion.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [isCoordinator, page, searchQuery],
  );

  useEffect(() => {
    void loadRequests(false);
    return () => {
      requestVersion.current += 1;
    };
  }, [loadRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter(
      (item) =>
        parentFilter === "ALL" || getParentStatus(item) === parentFilter,
    );
  }, [requests, parentFilter]);

  const pendingCount = requests.filter(
    (item) => normalize(item.status) === "PENDING",
  ).length;

  const total = Number.isFinite(Number(pagination?.total))
    ? Number(pagination.total)
    : requests.length;
  const totalPages = Number.isFinite(Number(pagination?.totalPages))
    ? Number(pagination.totalPages)
    : 1;

  const openAction = (item, action) => {
    if (action === "reject" && isCoordinator) {
      toast.info(
        "Coordinator rejection will be available after backend authorization is verified.",
      );
      return;
    }
    if (action === "approve" && !canApproveRequest(item, isCoordinator)) {
      toast.warning(
        getParentStatus(item) === "REJECTED"
          ? "Parent rejected this request; approval is blocked."
          : isCoordinator
            ? "Only requests officially assigned to you after escalation can be approved."
            : "Request not eligible for approval. Please refresh.",
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
    const id = selectedRequest?._id || selectedRequest?.id;
    if (!id || !selectedAction || actionLoading) return;
    if (
      selectedAction === "approve" &&
      !canApproveRequest(selectedRequest, isCoordinator)
    ) {
      toast.error(
        "Approval not permitted for this request. Refresh and retry.",
      );
      return;
    }
    if (isCoordinator && selectedAction === "reject") return;

    if (selectedAction === "approve") {
      const parentStatus = getParentStatus(selectedRequest);

      const requiresReason = parentStatus === "PENDING" || isCoordinator;

      if (requiresReason && remark.trim().length < 10) {
        toast.error(
          "Please enter an approval/bypass reason of at least 10 characters.",
        );
        return;
      }

      if (remark.trim().length > 500) {
        toast.error("Approval reason cannot exceed 500 characters.");
        return;
      }
    }

    if (selectedAction === "reject" && !remark.trim()) {
      toast.error("Rejection remark is required.");
      return;
    }

    try {
      setActionLoading(true);
      const response =
        selectedAction === "approve"
          ? isCoordinator
            ? await api.patch(
                `/coordinator/outpass/${encodeURIComponent(id)}/approve`,
                {
                  remark: remark.trim(),
                },
              )
            : await approveOutpass(id, remark.trim())
          : await rejectOutpass(id, remark.trim());

      const payload =
        response?.data?.success !== undefined ? response.data : response;
      if (payload?.success === false) {
        throw new Error(payload.message || "Action could not be completed.");
      }

      toast.success(
        payload?.message ||
          (selectedAction === "approve"
            ? "Faculty approval recorded."
            : "Outpass rejected."),
      );
      closeAction();
      // closeAction is guarded by actionLoading; clear explicitly during mutation.
      setSelectedRequest(null);
      setSelectedAction(null);
      setRemark("");
      await loadRequests(true);
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to process outpass request."));
      await loadRequests(true);
    } finally {
      setActionLoading(false);
    }
  };

  const renderActions = (item, compact = false) => {
    const allowed = canApproveRequest(item, isCoordinator);
    const id = item._id || item.id;
    const actionStyle = compact ? "flex-1" : "";

    return (
      <div
        className={`flex flex-wrap items-center gap-2 ${compact ? "w-full" : "justify-end"}`}
      >
        {id && (
          <Link
            to={`${basePath}/outpass/${encodeURIComponent(id)}`}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 ${actionStyle}`}
          >
            <ArrowUpRight size={15} /> Details
          </Link>
        )}

        <button
          type="button"
          onClick={() => openAction(item, "approve")}
          disabled={actionLoading || !allowed}
          title={
            allowed
              ? "Approve assigned outpass"
              : isCoordinator
                ? "Monitoring only: approval belongs to the currently assigned authority"
                : "Not eligible for approval"
          }
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 ${actionStyle}`}
        >
          <Check size={15} /> Approve
        </button>

        {!isCoordinator && (
          <button
            type="button"
            onClick={() => openAction(item, "reject")}
            disabled={actionLoading}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50 ${actionStyle}`}
          >
            <X size={15} /> Reject
          </button>
        )}

        {isCoordinator && !allowed && (
          <span className="text-xs font-semibold text-slate-500">
            Monitoring only
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen space-y-7 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-emerald-950 p-6 text-white shadow-xl sm:p-8">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
              <ShieldCheck size={14} />{" "}
              {isCoordinator
                ? "Coordinator Monitoring & Escalation"
                : "Faculty Approval Center"}
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Pending Outpasses
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              {isCoordinator
                ? "Monitor students in your authorized academic groups. Approve only when a request is officially escalated and assigned to you."
                : "Review assigned student requests and record authorized decisions. Parent PENDING does not by itself block faculty approval."}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={ClipboardCheck}
          label="Total Pending Requests"
          value={total}
          color="blue"
        />
        <StatCard
          icon={Clock3}
          label="Pending on This Page"
          value={pendingCount}
          color="amber"
        />
        <StatCard
          icon={UserRound}
          label="Matching Parent Filter"
          value={filteredRequests.length}
          color="emerald"
        />
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <FileText size={20} className="text-emerald-600" /> Requests
                Queue
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {isCoordinator
                  ? "Authorized academic scope only"
                  : "Requests awaiting your decision"}
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
                  value={parentFilter}
                  onChange={(event) => setParentFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Parent Statuses</option>
                  <option value="PENDING">Parent Pending</option>
                  <option value="APPROVED">Parent Approved</option>
                  <option value="REJECTED">Parent Rejected</option>
                  <option value="NOT AVAILABLE">Parent Unavailable</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="m-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            <div>
              {error}
              <button
                type="button"
                onClick={() => void loadRequests(false)}
                className="ml-2 font-bold underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 p-16 text-slate-500">
            <Loader2 size={20} className="animate-spin" /> Loading pending
            requests...
          </div>
        ) : !error && filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <Inbox size={45} className="mb-4 text-slate-400" />
            <h3 className="text-xl font-bold text-slate-900">
              No Matching Requests
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {isCoordinator
                ? "No pending requests in your authorized academic groups match the current filters."
                : "No pending requests match your search or parent-status filter."}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchQuery("");
                setParentFilter("ALL");
                setPage(1);
                void loadRequests(true);
              }}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Clear Filters / Refresh
            </button>
          </div>
        ) : !error ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {[
                      "STUDENT",
                      "DESTINATION",
                      "REASON",
                      "PARENT",
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
                    <tr
                      key={item._id || item.id}
                      className="hover:bg-emerald-50/40"
                    >
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

            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:hidden">
              {filteredRequests.map((item) => (
                <article
                  key={item._id || item.id}
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
                        <MapPin size={13} /> Destination
                      </p>
                      <p className="break-words text-sm font-semibold text-slate-800">
                        {item.destination || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <FileText size={13} /> Reason
                      </p>
                      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                        {item.reason || "—"}
                      </p>
                    </div>
                    <ParentBadge item={item} />
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays size={15} /> {formatDate(item.createdAt)}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 bg-slate-50/70 p-3">
                    {renderActions(item, true)}
                  </div>
                </article>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4">
              <p className="text-xs text-slate-500">
                Showing <strong>{filteredRequests.length}</strong> on page{" "}
                {page} · <strong>{total}</strong> total matching pending
                requests
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={loading || refreshing || page <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <span className="px-2 text-xs font-semibold text-slate-600">
                  {page} / {Math.max(1, totalPages)}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={
                    loading || refreshing || page >= Math.max(1, totalPages)
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </section>

      <ActionModal
        request={selectedRequest}
        action={selectedAction}
        isCoordinator={isCoordinator}
        loading={actionLoading}
        remark={remark}
        setRemark={setRemark}
        onClose={closeAction}
        onConfirm={confirmAction}
      />
    </div>
  );
}
