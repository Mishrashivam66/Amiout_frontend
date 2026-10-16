import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  FileText,
  Phone,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  CalendarDays,
} from "lucide-react";
import mentorService from "../services/mentor.service";
import { toast } from "react-toastify";

const fallback = (value) =>
  value !== undefined && value !== null && value !== ""
    ? value
    : "Not available";

const getParentStatus = (outpass) => {
  const direct =
    outpass?.parentApprovalStatus ??
    outpass?.parentConsentStatus ??
    outpass?.parentDecision?.status ??
    outpass?.parentDecision?.decision ??
    outpass?.parentApproval?.status ??
    outpass?.parentConsent?.status ??
    outpass?.parentStatus;
  if (!direct) return "UNKNOWN";
  const status = String(direct).toUpperCase();
  if (["APPROVED", "ACCEPTED", "CONSENTED"].includes(status)) return "APPROVED";
  if (["REJECTED", "DECLINED"].includes(status)) return "REJECTED";
  if (["PENDING", "NOT_RESPONDED", "NOT_REQUESTED"].includes(status))
    return "PENDING";
  return "UNKNOWN";
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

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(value))
    ? new Date(`${value}T00:00:00+05:30`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
};

const formatClock = (value) => {
  if (!value) return "Not provided";
  const raw = String(value).trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (match) {
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) return "Not available";
    if (match[3]) {
      if (hours < 1 || hours > 12) return "Not available";
      hours = (hours % 12) + (match[3].toUpperCase() === "PM" ? 12 : 0);
    }
    return `${String(hours % 12 || 12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime()))
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(parsed);
  return "Not available";
};

const maskMobile = (value) => {
  if (!value) return "Not available";
  const digits = String(value).replace(/\D/g, "");
  return digits.length >= 4 ? `******${digits.slice(-4)}` : "******";
};

const Field = ({ label, value }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mt-1 break-words text-sm font-semibold text-slate-900">
      {fallback(value)}
    </p>
  </div>
);

const StatusPill = ({ status }) => {
  const classes =
    status === "APPROVED"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "REJECTED"
        ? "bg-red-50 text-red-700 ring-red-200"
        : status === "PENDING"
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-slate-100 text-slate-600 ring-slate-200";
  const Icon =
    status === "APPROVED"
      ? CheckCircle2
      : status === "REJECTED"
        ? XCircle
        : Clock3;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${classes}`}
    >
      <Icon size={14} />
      {status === "UNKNOWN" ? "NOT AVAILABLE" : status}
    </span>
  );
};

const OutpassDetails = () => {
  const { outpassId } = useParams();
  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOutpass = useCallback(async () => {
    try {
      setLoading(true);
      const response = await mentorService.getOutpassDetails(outpassId);
      setOutpass(response?.data?.data ?? response?.data ?? response);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load outpass details.",
      );
    } finally {
      setLoading(false);
    }
  }, [outpassId]);

  useEffect(() => {
    loadOutpass();
  }, [loadOutpass]);

  if (loading)
    return (
      <div className="py-20 text-center text-slate-500">
        Loading outpass details...
      </div>
    );
  if (!outpass)
    return (
      <div className="py-20 text-center font-medium text-red-500">
        Outpass not found.
      </div>
    );

  const parentStatus = getParentStatus(outpass);
  const parentName =
    outpass.parentName ?? outpass.parent?.name ?? outpass.student?.parentName;
  const parentMobile =
    outpass.parentMobileNumber ??
    outpass.parentMobile ??
    outpass.parent?.mobileNumber ??
    outpass.student?.parentMobileNumber;
  const consentMethod =
    outpass.parentApprovalMethod ??
    outpass.parentDecision?.method ??
    outpass.parentApproval?.method ??
    outpass.parentConsentMethod;
  const consentAt =
    outpass.parentDecision?.decidedAt ??
    outpass.parentDecision?.decisionAt ??
    outpass.parentApproval?.approvedAt ??
    outpass.parentDecisionAt ??
    outpass.parentApprovedAt;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Outpass Details
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review student, parent consent and travel information.
          </p>
        </div>
        <Link
          to="/mentor/pending-outpasses"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <UserRound className="text-emerald-600" size={21} />
            Student Information
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Name"
              value={outpass.student?.name ?? outpass.studentName}
            />
            <Field
              label="Enrollment"
              value={outpass.student?.enrollmentNo ?? outpass.enrollmentNumber}
            />
            <Field
              label="Email"
              value={outpass.student?.email ?? outpass.studentEmail}
            />
            <Field
              label="Mobile"
              value={
                outpass.student?.mobileNumber ?? outpass.studentMobileNumber
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <FileText className="text-emerald-600" size={21} />
            Outpass Information
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Outpass ID" value={outpass.outpassId} />
            <Field label="Status" value={outpass.status} />
            <Field label="Destination" value={outpass.destination} />
            <Field label="Reason" value={outpass.reason} />
            <Field
              label="Out Date"
              value={formatDate(outpass.outDate ?? outpass.fromDate)}
            />
            <Field label="Out Time" value={formatClock(outpass.outTime)} />
            <Field
              label="Expected In Time"
              value={
                outpass.inTime ? formatClock(outpass.inTime) : "Not provided"
              }
            />
            <Field label="Created" value={formatDateTime(outpass.createdAt)} />
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 bg-emerald-50/60 px-5 py-4 sm:px-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <ShieldCheck className="text-emerald-600" size={22} />
            Parent Approval Verification
          </h2>
          <StatusPill status={parentStatus} />
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
          <Field label="Parent Name" value={parentName} />
          <Field
            label="Registered Parent Mobile"
            value={maskMobile(parentMobile)}
          />
          <Field
            label="Consent Status"
            value={parentStatus === "UNKNOWN" ? "Not available" : parentStatus}
          />
          <Field label="Approval Method" value={consentMethod} />
          <Field label="Decision Time" value={formatDateTime(consentAt)} />
        </div>
        {parentStatus !== "APPROVED" && (
          <p className="mx-5 mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 sm:mx-6">
            Parent consent is not confirmed on this page. Verify the current
            consent record before approving an outpass.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
          <CalendarDays className="text-emerald-600" size={21} />
          Mentor Remark
        </h2>
        <p className="text-sm text-slate-700">
          {outpass.mentorRemark || "No remark available."}
        </p>
      </section>
    </div>
  );
};

export default OutpassDetails;
