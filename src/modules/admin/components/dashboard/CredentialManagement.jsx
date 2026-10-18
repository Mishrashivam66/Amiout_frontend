import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import {
  Users,
  GraduationCap,
  KeyRound,
  Send,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Mail,
  ShieldCheck,
  UserCheck,
  UserX,
  LockKeyhole,
  Info,
} from "lucide-react";

import {
  sendStudentCredentials,
  sendFacultyCredentials,
  getCredentialStatuses,
  getCredentialCandidates,
} from "../../services/credential.service";

// ============================================================
// CONFIGURATION
// ============================================================

const PAGE_SIZE = 20;

const ACCOUNT_TYPES = {
  STUDENT: {
    label: "Students",
    subtitle: "Imported StudentMaster records",
    icon: GraduationCap,
  },
  FACULTY: {
    label: "Faculty",
    subtitle: "Mentor / Coordinator / HOD / HOI",
    icon: Users,
  },
};

const FILTERS = [
  { value: "NOT_SENT", label: "Not Sent" },
  { value: "SENT", label: "Sent" },
  { value: "FAILED", label: "Failed" },
  { value: "SENDING", label: "Sending" },
  { value: "EXISTING_ACCOUNT", label: "Existing Account" },
  { value: "INCOMPLETE", label: "Incomplete" },
  { value: "ALL", label: "All Records" },
];

const STATUS_STYLES = {
  NOT_SENT: {
    label: "Not Sent",
    className: "border-amber-500/25 bg-amber-500/10 text-amber-400",
  },
  SENT: {
    label: "Sent",
    className: "border-green-500/25 bg-green-500/10 text-green-400",
  },
  FAILED: {
    label: "Failed",
    className: "border-red-500/25 bg-red-500/10 text-red-400",
  },
  SENDING: {
    label: "Sending",
    className: "border-blue-500/25 bg-blue-500/10 text-blue-400",
  },
  EXISTING_ACCOUNT: {
    label: "Existing Account",
    className: "border-purple-500/25 bg-purple-500/10 text-purple-300",
  },
  INCOMPLETE: {
    label: "Incomplete",
    className: "border-orange-500/25 bg-orange-500/10 text-orange-300",
  },
};

const EMPTY_SUMMARY = {
  total: 0,
  sent: 0,
  notSent: 0,
  failed: 0,
  sending: 0,
  existingAccount: 0,
  incomplete: 0,
};

const EMPTY_PAGINATION = {
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

// ============================================================
// HELPERS
// ============================================================

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to process credential request.";

const getRecordId = (record) => String(record?._id || "").trim();

const isValidMasterId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

const isEligible = (record) =>
  record?.canSend === true &&
  ["NOT_SENT", "FAILED"].includes(record.status) &&
  isValidMasterId(getRecordId(record));

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// ============================================================
// STATUS BADGE
// ============================================================

const StatusBadge = ({ status }) => {
  const config = STATUS_STYLES[status] || STATUS_STYLES.NOT_SENT;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      {status === "SENT" ? (
        <CheckCircle2 size={14} />
      ) : status === "FAILED" ? (
        <AlertTriangle size={14} />
      ) : (
        <Clock3 size={14} />
      )}
      {config.label}
    </span>
  );
};

// ============================================================
// SUMMARY CARD
// ============================================================

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  color = "text-slate-200",
}) => (
  <div className="rounded-2xl border border-[#223447] bg-[#122131] p-4 sm:p-5">
    <Icon size={21} className={color} />

    <h3 className={`mt-3 text-2xl font-bold ${color}`}>{value ?? 0}</h3>

    <p className="mt-1 text-xs text-slate-400">{title}</p>
  </div>
);

// ============================================================
// CONFIRMATION TOAST
// ============================================================

const showConfirmToast = ({ title, description, onConfirm }) => {
  return toast.custom(
    (t) => (
      <div
        role="alertdialog"
        aria-label={title}
        className="w-[min(420px,calc(100vw-32px))] rounded-2xl border border-[#345065] bg-[#122131] p-5 text-white shadow-2xl"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck size={22} className="text-green-400" />
          <h3 className="font-bold">{title}</h3>
        </div>

        <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-slate-300">
          {description}
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="rounded-xl border border-[#345065] px-4 py-2 text-sm font-medium text-slate-200 hover:bg-[#1A2A3D]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-center",
    },
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const CredentialManagement = () => {
  // ==========================================================
  // STATE
  // ==========================================================

  const [accountType, setAccountType] = useState("STUDENT");

  const [statusFilter, setStatusFilter] = useState("NOT_SENT");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [candidates, setCandidates] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);

  const [pagination, setPagination] = useState(EMPTY_PAGINATION);

  const [statuses, setStatuses] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // SELECT ALL / MULTIPLE SELECTION
  const [selectedIds, setSelectedIds] = useState([]);

  // SEND PROGRESS
  const [sendingId, setSendingId] = useState(null);
  const [batchSending, setBatchSending] = useState(false);
  const [batchProgress, setBatchProgress] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const sendingRef = useRef(false);

  const busy = !!sendingId || batchSending;

  // ==========================================================
  // SEARCH DEBOUNCE
  // ==========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // ==========================================================
  // LOAD CANDIDATES
  // ==========================================================

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setListError("");

        const response = await getCredentialCandidates({
          type: accountType,
          status: statusFilter,
          search: debouncedSearch,
          page,
          limit: PAGE_SIZE,
        });

        if (!active) return;

        if (response?.success !== true || !response?.data) {
          throw new Error(response?.message || "Invalid candidate response.");
        }

        const data = response.data;

        setCandidates(Array.isArray(data.items) ? data.items : []);

        setSummary({
          ...EMPTY_SUMMARY,
          ...(data.summary || {}),
        });

        setPagination({
          ...EMPTY_PAGINATION,
          ...(data.pagination || {}),
        });
      } catch (error) {
        if (!active) return;

        setListError(getErrorMessage(error));
        setCandidates([]);
        setSummary(EMPTY_SUMMARY);
        setPagination(EMPTY_PAGINATION);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [accountType, statusFilter, debouncedSearch, page, refreshKey]);

  // ==========================================================
  // LOAD DELIVERY HISTORY
  // ==========================================================

  const fetchStatuses = useCallback(async () => {
    try {
      setHistoryLoading(true);

      const response = await getCredentialStatuses();

      if (response?.success !== true) {
        throw new Error("Could not load delivery history.");
      }

      setStatuses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  // ==========================================================
  // CURRENT PAGE ELIGIBLE IDS
  // ==========================================================

  const eligibleCandidates = candidates.filter(isEligible);

  const eligibleIds = eligibleCandidates.map(getRecordId);

  const allSelected =
    eligibleIds.length > 0 &&
    eligibleIds.every((id) => selectedIds.includes(id));

  const selectedCandidates = candidates.filter(
    (candidate) =>
      isEligible(candidate) && selectedIds.includes(getRecordId(candidate)),
  );

  const selectedCount = selectedCandidates.length;

  // ==========================================================
  // RESET SELECTION
  // ==========================================================

  const resetSelection = () => {
    setSelectedIds([]);
  };

  const changeAccountType = (type) => {
    if (busy) return;

    setAccountType(type);
    setStatusFilter("NOT_SENT");
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
    setLastResult(null);
    resetSelection();
  };

  const changeFilter = (value) => {
    if (busy) return;

    setStatusFilter(value);
    setPage(1);
    resetSelection();
  };

  const changeSearch = (value) => {
    if (busy) return;

    setSearch(value);
    setPage(1);
    resetSelection();
  };

  const changePage = (nextPage) => {
    if (busy) return;

    setPage(nextPage);
    resetSelection();
  };

  const refreshAll = () => {
    if (busy) return;

    resetSelection();
    setRefreshKey((current) => current + 1);
    fetchStatuses();
  };

  // ==========================================================
  // CHECKBOX - SINGLE
  // ==========================================================

  const toggleOne = (record) => {
    if (busy || !isEligible(record)) return;

    const id = getRecordId(record);

    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  // ==========================================================
  // CHECKBOX - SELECT ALL CURRENT PAGE
  // ==========================================================

  const toggleSelectAll = () => {
    if (busy || loading || !eligibleIds.length) {
      return;
    }

    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(eligibleIds);
  };

  // ==========================================================
  // REQUEST HELPER
  // ==========================================================

  const sendOne = async (masterId, type) => {
    return type === "STUDENT"
      ? sendStudentCredentials(masterId)
      : sendFacultyCredentials(masterId);
  };

  // ==========================================================
  // SEND ONE USER
  // ==========================================================

  const runSendSingle = async (candidate) => {
    if (sendingRef.current) return;
    if (!isEligible(candidate)) return;

    const id = getRecordId(candidate);
    const type = accountType;

    sendingRef.current = true;
    setSendingId(id);
    setLastResult(null);

    const loadingToast = toast.loading(
      `Sending credentials to ${candidate.name}...`,
    );

    try {
      const response = await sendOne(id, type);

      if (response?.success !== true) {
        throw new Error(response?.message || "Credential sending failed.");
      }

      setLastResult({
        name: candidate.name,
        email: response.email || candidate.email,
        message: response.message,
      });

      toast.success(`Credentials sent to ${candidate.name}.`, {
        id: loadingToast,
        duration: 4000,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: loadingToast,
        duration: 5000,
      });
    } finally {
      sendingRef.current = false;
      setSendingId(null);
      resetSelection();
      setRefreshKey((current) => current + 1);
      await fetchStatuses();
    }
  };

  const handleSendSingle = (candidate) => {
    if (busy || !isEligible(candidate)) return;

    showConfirmToast({
      title: "Send AMIOUT Credentials?",
      description:
        `Name: ${candidate.name}\n` +
        `Email: ${candidate.email}\n` +
        `Account: ${accountType}\n\n` +
        "A temporary password will be emailed. Existing passwords will not be reset.",
      onConfirm: () => runSendSingle(candidate),
    });
  };

  // ==========================================================
  // SEND SELECTED USERS SEQUENTIALLY
  // ==========================================================

  const runSendSelected = async (records, type) => {
    if (sendingRef.current) return;
    if (!records.length) return;

    sendingRef.current = true;
    setBatchSending(true);
    setLastResult(null);

    const progress = {
      total: records.length,
      completed: 0,
      sent: 0,
      failed: 0,
    };

    setBatchProgress({ ...progress });

    const loadingToast = toast.loading(
      `Sending credentials: 0/${records.length}`,
    );

    const failedRecords = [];

    try {
      for (const record of records) {
        const id = getRecordId(record);

        try {
          const response = await sendOne(id, type);

          if (response?.success !== true) {
            throw new Error(response?.message || "Credential sending failed.");
          }

          progress.sent += 1;
        } catch (error) {
          progress.failed += 1;

          failedRecords.push({
            name: record.name,
            error: getErrorMessage(error),
          });
        }

        progress.completed += 1;
        setBatchProgress({ ...progress });

        toast.loading(
          `Sending credentials: ${progress.completed}/${progress.total}`,
          { id: loadingToast },
        );
      }

      const message =
        `Completed: ${progress.total} | ` +
        `Sent: ${progress.sent} | ` +
        `Failed: ${progress.failed}`;

      if (progress.failed === 0) {
        toast.success(message, {
          id: loadingToast,
          duration: 5000,
        });
      } else {
        toast.error(message, {
          id: loadingToast,
          duration: 7000,
        });
      }

      if (failedRecords.length) {
        setLastResult({
          name: "Batch completed with failures",
          email: failedRecords
            .slice(0, 3)
            .map((item) => `${item.name}: ${item.error}`)
            .join(" | "),
          message,
        });
      } else {
        setLastResult({
          name: "Selected Credentials",
          email: "",
          message,
        });
      }
    } finally {
      sendingRef.current = false;
      setBatchSending(false);
      resetSelection();
      setRefreshKey((current) => current + 1);
      await fetchStatuses();
    }
  };

  const handleSendSelected = () => {
    if (busy || loading) return;

    // Snapshot only the current page's eligible
    // selected records. Never include SENT or
    // EXISTING_ACCOUNT records.

    const records = [...selectedCandidates];
    const type = accountType;

    if (!records.length) {
      toast.error("Please select at least one eligible record.");
      return;
    }

    showConfirmToast({
      title: "Send Credentials to Selected?",
      description:
        `Account type: ${type}\n` +
        `Selected: ${records.length} user(s)\n\n` +
        "Temporary passwords will be emailed one-by-one.\n" +
        "Already Sent and Existing Accounts are excluded.",
      onConfirm: () => runSendSelected(records, type),
    });
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="overflow-hidden rounded-3xl border border-[#223447] bg-[#0F172A]">
      {/* HEADER */}
      <div className="flex flex-col gap-5 border-b border-[#223447] p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-green-500/10 p-3">
            <KeyRound size={26} className="text-green-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Login Credentials Management
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage imported Students and Faculty, select eligible accounts and
              send login credentials securely.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refreshAll}
          disabled={loading || busy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#223447] bg-[#122131] px-5 py-3 text-sm font-semibold text-white hover:border-green-500 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      <div className="space-y-7 p-6">
        {/* INFORMATION */}
        <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
          <Info size={20} className="mt-0.5 shrink-0 text-blue-400" />
          <p className="text-sm leading-6 text-slate-300">
            Imported Students and Faculty load automatically. Select All applies
            only to eligible records on the current page. No MongoDB ID entry is
            required.
          </p>
        </div>

        {/* ACCOUNT TYPE */}
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(ACCOUNT_TYPES).map(([type, config]) => {
            const Icon = config.icon;

            return (
              <button
                key={type}
                type="button"
                disabled={busy}
                onClick={() => changeAccountType(type)}
                className={`rounded-2xl border p-5 text-left transition disabled:opacity-50 ${
                  accountType === type
                    ? "border-green-500 bg-green-500/10"
                    : "border-[#223447] bg-[#122131] hover:border-green-500/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={25} className="text-green-400" />

                  <div>
                    <h3 className="font-bold text-white">{config.label}</h3>

                    <p className="mt-1 text-xs text-slate-400">
                      {config.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* COUNTERS */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          <SummaryCard
            title="Total Imported"
            value={summary.total}
            icon={Users}
            color="text-cyan-400"
          />

          <SummaryCard
            title="Credentials Sent"
            value={summary.sent}
            icon={CheckCircle2}
            color="text-green-400"
          />

          <SummaryCard
            title="Not Sent"
            value={summary.notSent}
            icon={Clock3}
            color="text-amber-400"
          />

          <SummaryCard
            title="Failed"
            value={summary.failed}
            icon={AlertTriangle}
            color="text-red-400"
          />

          <SummaryCard
            title="Sending"
            value={summary.sending}
            icon={Mail}
            color="text-blue-400"
          />

          <SummaryCard
            title="Existing Accounts"
            value={summary.existingAccount}
            icon={UserCheck}
            color="text-purple-300"
          />

          <SummaryCard
            title="Incomplete Records"
            value={summary.incomplete}
            icon={UserX}
            color="text-orange-300"
          />
        </div>

        <p className="text-xs leading-5 text-slate-500">
          Counts cover active imported records. Faculty records are grouped by
          email. Existing login accounts are excluded from credential
          provisioning.
        </p>

        {/* SEND PROGRESS */}
        {batchProgress && batchSending && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="animate-spin text-blue-400" />

              <span className="font-semibold text-white">
                Sending Credentials
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-300">
              {batchProgress.completed} / {batchProgress.total} processed
              {" · "}
              {batchProgress.sent} sent
              {" · "}
              {batchProgress.failed} failed
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#081018]">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width: `${
                    (batchProgress.completed /
                      Math.max(1, batchProgress.total)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        )}

        {/* RESULT */}
        {lastResult && (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-400" />
              <h3 className="font-semibold text-green-300">
                Credential Request Completed
              </h3>
            </div>

            <p className="mt-2 text-sm text-slate-300">{lastResult.message}</p>

            <p className="mt-2 text-sm text-white">{lastResult.name}</p>

            {lastResult.email && (
              <p className="mt-1 break-words text-xs text-slate-300">
                {lastResult.email}
              </p>
            )}
          </div>
        )}

        {/* RECORDS */}
        <div className="overflow-hidden rounded-2xl border border-[#223447]">
          {/* SEARCH / FILTER */}
          <div className="border-b border-[#223447] bg-[#122131] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {ACCOUNT_TYPES[accountType].label} Credential Records
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Search imported users and send credentials without entering
                  IDs.
                </p>
              </div>

              <span className="text-xs text-slate-400">
                {pagination.total} matching records
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="search"
                  value={search}
                  disabled={busy}
                  onChange={(event) => changeSearch(event.target.value)}
                  placeholder={
                    accountType === "STUDENT"
                      ? "Search name, enrollment or email..."
                      : "Search name, faculty ID, role or email..."
                  }
                  className="w-full rounded-xl border border-[#223447] bg-[#0F172A] py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-green-500 disabled:opacity-50"
                />
              </div>

              <select
                value={statusFilter}
                disabled={busy}
                onChange={(event) => changeFilter(event.target.value)}
                className="rounded-xl border border-[#223447] bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-green-500 disabled:opacity-50"
              >
                {FILTERS.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ============================================
                SELECT ALL / SEND SELECTED
            ============================================ */}

            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-[#345065] bg-[#0F172A] p-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-white">
                <input
                  type="checkbox"
                  checked={allSelected}
                  disabled={loading || busy || !eligibleIds.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 accent-green-500"
                />
                Select All Eligible
                <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">
                  {eligibleIds.length} on this page
                </span>
              </label>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  {selectedCount} selected
                </span>

                <button
                  type="button"
                  disabled={loading || busy || selectedCount === 0}
                  onClick={handleSendSelected}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {batchSending ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Send size={17} />
                  )}
                  Send Selected ({selectedCount})
                </button>
              </div>
            </div>
          </div>

          {/* ERROR */}
          {listError && (
            <div className="m-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {listError}
            </div>
          )}

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#081018] text-slate-400">
                <tr>
                  <th className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      disabled={loading || busy || !eligibleIds.length}
                      onChange={toggleSelectAll}
                      aria-label="Select all eligible records on this page"
                      className="h-4 w-4 accent-green-500"
                    />
                  </th>

                  <th className="px-5 py-4">Name / Email</th>

                  <th className="px-5 py-4">
                    {accountType === "STUDENT"
                      ? "Enrollment No."
                      : "Faculty ID / Roles"}
                  </th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Attempts</th>

                  <th className="px-5 py-4">Sent At</th>

                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-14 text-center text-slate-400"
                    >
                      <Loader2
                        size={22}
                        className="mx-auto mb-3 animate-spin"
                      />
                      Loading records...
                    </td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-14 text-center text-slate-400"
                    >
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  candidates.map((candidate) => {
                    const id = getRecordId(candidate);
                    const canSend = isEligible(candidate);
                    const checked = selectedIds.includes(id);

                    return (
                      <tr
                        key={id}
                        className="border-t border-[#223447] hover:bg-[#1A2A3D]"
                      >
                        {/* SELECT ROW */}
                        <td className="px-4 py-4">
                          {canSend ? (
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={busy}
                              onChange={() => toggleOne(candidate)}
                              aria-label={`Select ${candidate.name}`}
                              className="h-4 w-4 accent-green-500"
                            />
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>

                        {/* IDENTITY */}
                        <td className="px-5 py-4">
                          <p className="font-semibold text-white">
                            {candidate.name || "—"}
                          </p>

                          <p className="mt-1 max-w-[260px] break-all text-xs text-slate-400">
                            {candidate.email || "Email missing"}
                          </p>
                        </td>

                        {/* ENROLLMENT / FACULTY */}
                        <td className="px-5 py-4 text-slate-300">
                          {accountType === "STUDENT" ? (
                            <span className="font-mono text-xs">
                              {candidate.enrollmentNumber || "—"}
                            </span>
                          ) : (
                            <div className="space-y-2">
                              <p className="font-mono text-xs">
                                {candidate.facultyId || "—"}
                              </p>

                              <div className="flex max-w-[220px] flex-wrap gap-1">
                                {(candidate.roles || []).map((role) => (
                                  <span
                                    key={role}
                                    className="rounded-md bg-purple-500/10 px-2 py-1 text-[10px] font-semibold text-purple-300"
                                  >
                                    {role}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          <StatusBadge status={candidate.status} />

                          {candidate.lastError && (
                            <p className="mt-2 max-w-[220px] break-words text-xs text-red-300">
                              {candidate.lastError}
                            </p>
                          )}
                        </td>

                        {/* ATTEMPTS */}
                        <td className="px-5 py-4 text-slate-300">
                          {candidate.attempts ?? 0}
                        </td>

                        {/* SENT DATE */}
                        <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-400">
                          {formatDate(candidate.sentAt)}
                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4 text-right">
                          {canSend ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleSendSingle(candidate)}
                              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-green-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-40"
                            >
                              {sendingId === id ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <Send size={15} />
                              )}

                              {candidate.status === "FAILED"
                                ? "Retry Send"
                                : "Send Credentials"}
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-slate-500">
                              {candidate.status === "SENT" ? (
                                <>
                                  <CheckCircle2
                                    size={15}
                                    className="text-green-400"
                                  />
                                  Already Sent
                                </>
                              ) : (
                                <>
                                  <LockKeyhole size={15} />
                                  Not Eligible
                                </>
                              )}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between gap-3 border-t border-[#223447] bg-[#122131] p-4">
            <p className="text-xs text-slate-400">
              Page {pagination.page} of {Math.max(1, pagination.totalPages)}
              {" · "}
              {pagination.total} records
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={loading || busy || !pagination.hasPreviousPage}
                onClick={() => changePage(Math.max(1, page - 1))}
                className="rounded-lg border border-[#223447] px-3 py-2 text-xs text-white disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                disabled={loading || busy || !pagination.hasNextPage}
                onClick={() => changePage(page + 1)}
                className="rounded-lg border border-[#223447] px-3 py-2 text-xs text-white disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* DELIVERY HISTORY */}
        <details className="overflow-hidden rounded-2xl border border-[#223447]">
          <summary className="cursor-pointer bg-[#122131] px-5 py-4 font-semibold text-white">
            Credential Delivery History ({statuses.length})
          </summary>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#081018] text-slate-400">
                <tr>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Attempts</th>
                  <th className="px-5 py-3">Sent At</th>
                  <th className="px-5 py-3">Error</th>
                </tr>
              </thead>

              <tbody>
                {historyLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      Loading history...
                    </td>
                  </tr>
                ) : statuses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      No delivery records.
                    </td>
                  </tr>
                ) : (
                  statuses.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className="border-t border-[#223447]"
                    >
                      <td className="px-5 py-3 text-white">
                        {item.accountType}
                      </td>

                      <td className="break-all px-5 py-3 text-slate-300">
                        {item.email}
                      </td>

                      <td className="px-5 py-3">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-5 py-3 text-slate-300">
                        {item.attempts ?? 0}
                      </td>

                      <td className="whitespace-nowrap px-5 py-3 text-slate-400">
                        {formatDate(item.sentAt)}
                      </td>

                      <td className="break-words px-5 py-3 text-xs text-red-300">
                        {item.lastError || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </details>

        {/* SAFETY */}
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-amber-400" />

          <p className="text-xs leading-6 text-slate-300">
            Credentials are sent only to eligible accounts. Select All covers
            only the current page. Sending is sequential, using the existing
            protected backend APIs. Existing passwords are never intentionally
            reset. Sent means the email provider accepted the message, not
            guaranteed inbox delivery.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CredentialManagement;

