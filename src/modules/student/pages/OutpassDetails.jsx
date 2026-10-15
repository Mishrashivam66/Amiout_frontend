import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  RefreshCw,
  ShieldCheck,
  UserRound,
  UsersRound,
  XCircle,
  AlertCircle,
  ClipboardList,
  Phone,
  Mail,
  GraduationCap,
  Hash,
} from "lucide-react";
import Swal from "sweetalert2";

import DigitalOutpassQR from "../components/DigitalOutpassQR";
import PageHeader from "../components/layout/PageHeader";
import useOutpass from "../hooks/useOutpass";

const showValue = (value, fallback = "Not available") => {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
};

const formatDate = (value) => {
  if (!value) return "Not available";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    )
      return "Not available";
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
};

const formatTime = (value) => {
  if (!value) return "Not available";
  const text = String(value).trim();
  const match = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) return "Not available";
    return `${String(hours % 12 || 12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
  }
  const date = new Date(text);
  if (!Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(date);
  }
  // Keep an already formatted value rather than displaying Invalid Date.
  return text;
};

const formatExpectedReturn = (outpass) => {
  // inTime is the planned return time, not the actual gate ENTRY timestamp.
  const value = outpass?.inTime || outpass?.expectedReturn;
  if (!value) return "Not specified";
  const text = String(value).trim();
  if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(text)) return formatTime(text);
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(date);
  }
  return text || "Not specified";
};

const formatDateTime = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);
};

const STATUS_STYLES = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
  CANCELLED: "border-slate-200 bg-slate-100 text-slate-600",
  CANCELED: "border-slate-200 bg-slate-100 text-slate-600",
  EXITED: "border-blue-200 bg-blue-50 text-blue-700",
  RETURNED: "border-violet-200 bg-violet-50 text-violet-700",
  COMPLETED: "border-violet-200 bg-violet-50 text-violet-700",
};

const StatusBadge = ({ status }) => {
  const value = showValue(status, "UNKNOWN").toUpperCase();
  return (
    <span
      className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-wide ${STATUS_STYLES[value] || "border-slate-200 bg-slate-100 text-slate-600"}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
        {value.replaceAll("_", " ")}
      </span>
    </span>
  );
};

const SectionCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
  tone = "emerald",
}) => (
  <section className="min-w-0 overflow-hidden rounded-[24px] border border-slate-200/90 bg-white shadow-[0_10px_36px_-24px_rgba(15,23,42,0.45)] sm:rounded-[28px]">
    <div className="flex min-w-0 items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone === "blue" ? "bg-blue-50 text-blue-700" : tone === "violet" ? "bg-violet-50 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}
      >
        <Icon size={21} />
      </div>
      <div className="min-w-0">
        <h2 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <div className="min-w-0 p-4 sm:p-6">{children}</div>
  </section>
);

const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
  <div
    className={`min-w-0 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 sm:p-4 ${className}`}
  >
    <div className="flex min-w-0 items-start gap-3">
      {Icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
          <Icon size={17} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 min-w-0 max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm font-semibold leading-6 text-slate-800 sm:text-[15px]">
          {showValue(value)}
        </p>
      </div>
    </div>
  </div>
);

const OutpassDetails = () => {
  const { outpassId } = useParams();
  const navigate = useNavigate();
  const { fetchOutpassDetails, cancelOutpass } = useOutpass();
  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Some useOutpass implementations recreate functions on every render.
  // Keep the latest function in a ref so the initial effect cannot loop.
  const fetchRef = useRef(fetchOutpassDetails);

  useEffect(() => {
    fetchRef.current = fetchOutpassDetails;
  }, [fetchOutpassDetails]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setOutpass(null);
    setError("");
    const load = async () => {
      try {
        const response = await fetchRef.current(outpassId);
        if (!mounted) return;
        if (response?.success === false || !response?.data) {
          throw new Error(response?.message || "Outpass details not found.");
        }
        setOutpass(response.data);
      } catch (requestError) {
        if (mounted) {
          setError(
            requestError?.response?.data?.message ||
              requestError?.message ||
              "Unable to load outpass details.",
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (outpassId) load();
    else {
      setError("Missing outpass ID.");
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [outpassId]);

  const refresh = useCallback(async () => {
    if (!outpassId) return;
    setRefreshing(true);
    setError("");
    try {
      const response = await fetchRef.current(outpassId);
      if (response?.success === false || !response?.data) {
        throw new Error(response?.message || "Outpass details not found.");
      }
      setOutpass(response.data);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to refresh outpass.",
      );
    } finally {
      setRefreshing(false);
    }
  }, [outpassId]);

  const handleCancel = async () => {
    const confirmation = await Swal.fire({
      title: "Cancel Outpass?",
      text: "Are you sure you want to cancel this outpass?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
      reverseButtons: true,
    });
    if (!confirmation.isConfirmed) return;
    setCancelling(true);
    try {
      const response = await cancelOutpass(outpassId);
      if (response?.success) {
        await Swal.fire({
          icon: "success",
          title: "Cancelled!",
          text: "Your outpass has been cancelled successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/student/outpass/history");
      } else {
        throw new Error(response?.message || "Failed to cancel outpass.");
      }
    } catch (requestError) {
      await Swal.fire({
        icon: "error",
        title: "Unable to cancel",
        text:
          requestError?.response?.data?.message ||
          requestError?.message ||
          "Please try again.",
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5 px-1 py-3 sm:px-2">
        <div className="h-12 w-48 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-40 animate-pulse rounded-3xl bg-slate-200" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
        </div>
        <div className="h-60 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (!outpass) {
    return (
      <div className="mx-auto max-w-4xl space-y-5 py-4">
        <PageHeader
          title="Outpass Details"
          subtitle="View complete outpass information"
        />
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto text-rose-500" size={38} />
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load this outpass
          </h2>
          <p className="mt-2 break-words text-sm text-slate-600">
            {error || "No outpass details available."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const student = outpass.student || {};
  const parent = outpass.parent || {};
  const parentDecision = outpass.parentDecision || {};
  const timeline = Array.isArray(outpass.timeline) ? outpass.timeline : [];

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-5 overflow-x-hidden pb-8 sm:space-y-6">
      <PageHeader
        title="Outpass Details"
        subtitle="View complete outpass information"
      />

      <header className="relative min-w-0 overflow-hidden rounded-[24px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-5 py-7 text-white shadow-xl sm:rounded-[30px] sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex min-w-0 flex-wrap items-start justify-between gap-5">
          <div className="min-w-0 flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
              <ShieldCheck size={14} /> AMIOUT · Digital Permission
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
              Outpass reference
            </p>
            <h1 className="mt-2 min-w-0 break-words [overflow-wrap:anywhere] text-xl font-extrabold tracking-tight sm:text-3xl">
              {showValue(outpass.outpassId, outpassId)}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Your request, family details and campus movement information.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <StatusBadge status={outpass.status} />
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-white/20 disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />{" "}
              Refresh
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="flex min-w-0 items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          <AlertCircle size={18} className="shrink-0" />
          <span className="min-w-0 break-words [overflow-wrap:anywhere]">
            {error}
          </span>
        </div>
      )}

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <SectionCard
          icon={UserRound}
          title="Student Information"
          subtitle="Details recorded for this request"
        >
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <InfoItem
              icon={UserRound}
              label="Full Name"
              value={outpass.studentName || student.name}
            />
            <InfoItem
              icon={Hash}
              label="Enrollment Number"
              value={outpass.enrollmentNumber || student.enrollmentNumber}
            />
            <InfoItem
              icon={GraduationCap}
              label="Branch"
              value={outpass.branch || student.branch}
            />
            <InfoItem
              icon={CalendarDays}
              label="Semester"
              value={outpass.semester ?? student.semester}
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={UsersRound}
          title="Parent Information"
          subtitle="Registered parent details"
          tone="blue"
        >
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <InfoItem
              icon={UserRound}
              label="Parent Name"
              value={outpass.parentName || parent.name}
            />
            <InfoItem
              icon={Phone}
              label="Mobile Number"
              value={outpass.parentMobileNumber || parent.mobileNumber}
            />
            <InfoItem
              icon={Mail}
              label="Email Address"
              value={outpass.parentEmail || parent.email}
            />
            <InfoItem
              icon={ShieldCheck}
              label="Parent Consent"
              value={
                parentDecision.status ||
                outpass.parentApprovalStatus ||
                "Not available"
              }
            />
          </div>
        </SectionCard>
      </div>

      <SectionCard
        icon={MapPin}
        title="Leave Details"
        subtitle="Destination, reason and planned travel time"
      >
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <InfoItem
            icon={MapPin}
            label="Destination"
            value={outpass.destination}
          />
          <InfoItem
            icon={CalendarDays}
            label="Out Date"
            value={formatDate(outpass.outDate)}
          />
          <InfoItem
            icon={Clock3}
            label="Out Time"
            value={formatTime(outpass.outTime)}
          />
          <InfoItem
            icon={Clock3}
            label="Expected Return"
            value={formatExpectedReturn(outpass)}
          />
          <InfoItem
            icon={ClipboardList}
            label="Request Status"
            value={outpass.status}
          />
        </div>
        <div className="mt-4 min-w-0 max-w-full overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <FileText size={18} className="text-emerald-700" /> Reason for
            Outpass
          </div>
          <p className="mt-3 min-w-0 max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-xl bg-white p-4 text-sm leading-7 text-slate-700 shadow-sm sm:text-[15px]">
            {showValue(outpass.reason)}
          </p>
        </div>
      </SectionCard>

      <SectionCard
        icon={ShieldCheck}
        title="Digital Outpass"
        subtitle="Approved QR pass and verification details"
      >
        <div className="min-w-0 max-w-full overflow-hidden">
          <DigitalOutpassQR outpass={outpass} />
        </div>
      </SectionCard>

      <SectionCard
        icon={ClipboardList}
        title="Request Timeline"
        subtitle="Updates from your outpass journey"
        tone="violet"
      >
        {timeline.length ? (
          <div className="relative space-y-3">
            {timeline.map((item, index) => (
              <div
                key={item?._id || `${index}-${item?.createdAt || ""}`}
                className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5"
              >
                <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-2">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <h3 className="min-w-0 break-words [overflow-wrap:anywhere] text-sm font-bold text-slate-800">
                      {showValue(item?.title, "Status Update")}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    {formatDateTime(item?.createdAt)}
                  </span>
                </div>
                {item?.description && (
                  <p className="mt-2 min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] pl-6 text-sm leading-6 text-slate-600">
                    {showValue(item.description)}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-9 text-center text-sm text-slate-500">
            No timeline available yet.
          </div>
        )}
      </SectionCard>

      <div className="flex flex-wrap gap-3 pb-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={17} /> Back
        </button>
        {outpass.status === "PENDING" && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <XCircle size={17} />{" "}
            {cancelling ? "Cancelling..." : "Cancel Outpass"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OutpassDetails;
