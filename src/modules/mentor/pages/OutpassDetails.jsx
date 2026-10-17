import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Loader2,
  RefreshCw,
  ShieldCheck,
  UserRound,
  XCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import api from "../../../services/api";

// This is a read-only details screen. All access checks stay on the backend.
const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase();
const display = (value) =>
  value === null || value === undefined || String(value).trim() === ""
    ? "Not available"
    : String(value);

const getParentStatus = (outpass) => {
  // The canonical parentDecision must take precedence over legacy fields.
  const value = normalize(
    outpass?.parentDecision?.status ??
      outpass?.parentApprovalStatus ??
      outpass?.parentConsentStatus ??
      outpass?.parentStatus ??
      "UNKNOWN",
  );
  if (["APPROVED", "ACCEPTED", "CONSENTED"].includes(value)) return "APPROVED";
  if (["REJECTED", "DECLINED"].includes(value)) return "REJECTED";
  if (["PENDING", "AWAITING", "NOT_RESPONDED"].includes(value))
    return "PENDING";
  return "UNKNOWN";
};

const dateTime = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
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

const dateOnly = (value) => {
  if (!value) return "Not available";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(value))
    ? new Date(`${value}T00:00:00+05:30`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const clock = (value) => {
  if (!value) return "Not provided";
  const raw = String(value).trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? "Not available"
      : new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(parsed);
  }
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (minutes > 59 || hours > 23) return "Not available";
  if (match[3]) {
    if (hours < 1 || hours > 12) return "Not available";
    hours = (hours % 12) + (normalize(match[3]) === "PM" ? 12 : 0);
  }
  return `${String(hours % 12 || 12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
};

const maskPhone = (value) => {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.length >= 4 ? `******${digits.slice(-4)}` : "Not available";
};

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to load outpass details.";

const unwrap = (response) => {
  // Axios response: {data: {success:true, data:{...}}}
  // Also tolerate older services that wrapped the data one extra time.
  const payload = response?.data;
  if (payload?.success === false)
    throw new Error(payload.message || "Request failed.");
  const first = payload?.data ?? payload;
  if (first?.success === false)
    throw new Error(first.message || "Request failed.");
  const record = first?.data ?? first;
  if (
    !record ||
    typeof record !== "object" ||
    Array.isArray(record) ||
    !record._id
  ) {
    throw new Error("Outpass record was not found.");
  }
  return record;
};

function Field({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
        {display(value)}
      </p>
    </div>
  );
}

function StatusPill({ status }) {
  const value = normalize(status);
  const good = ["APPROVED", "EXITED", "RETURNED", "COMPLETED"].includes(value);
  const bad = ["REJECTED", "CANCELLED"].includes(value);
  const Icon = good ? CheckCircle2 : bad ? XCircle : Clock3;
  const color = good
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : bad
      ? "bg-red-50 text-red-700 ring-red-200"
      : value === "PENDING"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-slate-100 text-slate-600 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${color}`}
    >
      <Icon size={14} />{" "}
      {value === "UNKNOWN" ? "NOT AVAILABLE" : value || "UNKNOWN"}
    </span>
  );
}

const Section = ({ title, icon: Icon, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
      <Icon size={21} className="text-emerald-600" /> {title}
    </h2>
    {children}
  </section>
);

export default function OutpassDetails() {
  const { outpassId } = useParams();
  const location = useLocation();
  const isCoordinator =
    location.pathname === "/coordinator" ||
    location.pathname.startsWith("/coordinator/");
  const basePath = isCoordinator ? "/coordinator" : "/mentor";
  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setOutpass(null); // Do not show a previous student's record during navigation.
      setError("");
      if (!outpassId) {
        setError("Outpass ID is missing.");
        setLoading(false);
        return;
      }
      try {
        const result = await api.get(
          `${basePath}/outpass/${encodeURIComponent(outpassId)}`,
          {
            params: { refresh: Date.now() },
          },
        );
        if (!cancelled) setOutpass(unwrap(result));
      } catch (err) {
        if (!cancelled) setError(getError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [outpassId, basePath, refreshKey]);

  const student =
    outpass?.student && typeof outpass.student === "object"
      ? outpass.student
      : {};
  const parentStatus = getParentStatus(outpass);
  const status = normalize(outpass?.status);
  const approvedRole = normalize(outpass?.approvedAuthorityRole);
  const universityApproved =
    ["APPROVED", "EXITED", "RETURNED", "COMPLETED"].includes(status) &&
    Boolean(outpass?.approvedAt) &&
    Boolean(outpass?.approvedByFaculty);
  const canCoordinatorApprove =
    isCoordinator && outpass?.canCurrentFacultyApprove === true;
  const universityStatus = universityApproved
    ? "APPROVED"
    : status === "REJECTED"
      ? "REJECTED"
      : status === "PENDING"
        ? "PENDING"
        : "UNKNOWN";

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            AMIOUT · {isCoordinator ? "Coordinator" : "Mentor"} Workspace
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Outpass Details
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            University approval, parent decision and campus movement details.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
          <Link
            to={`${basePath}/pending-outpasses`}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <ArrowLeft size={17} /> Back to Requests
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-slate-600">
          <Loader2 size={21} className="animate-spin" /> Loading outpass
          details...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle size={18} /> Unable to load outpass
          </div>
          <p className="mt-2 text-sm">{error}</p>
          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-red-200"
          >
            Retry
          </button>
        </div>
      ) : outpass ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div>
              <p className="text-xs text-slate-500">Outpass Number</p>
              <p className="mt-1 break-all text-lg font-extrabold text-slate-900">
                {display(outpass.outpassId)}
              </p>
            </div>
            <StatusPill status={status} />
          </div>

          {isCoordinator && (
            <div
              className={`rounded-xl border p-4 text-sm ${canCoordinatorApprove ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-blue-200 bg-blue-50 text-blue-800"}`}
            >
              <p className="font-bold">
                {canCoordinatorApprove
                  ? "Assigned to you for approval"
                  : "Coordinator monitoring access"}
              </p>
              <p className="mt-1">
                {canCoordinatorApprove
                  ? "This request is currently assigned to your Coordinator account. Use Pending Outpasses for any approval action; the backend checks your authorization again."
                  : "You can review this outpass within your academic scope. Approval is only available after authorized reassignment from an unavailable Mentor."}
              </p>
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-2">
            <Section title="Student Information" icon={UserRound}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Name"
                  value={outpass.studentName || student.name}
                />
                <Field
                  label="Enrollment"
                  value={
                    outpass.enrollmentNumber ||
                    student.enrollmentNumber ||
                    student.enrollmentNo
                  }
                />
                <Field
                  label="Email"
                  value={student.email || outpass.studentEmail}
                />
                <Field
                  label="Mobile"
                  value={student.mobileNumber || outpass.studentMobileNumber}
                />
              </div>
            </Section>

            <Section title="Outpass Information" icon={FileText}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Destination" value={outpass.destination} />
                <Field label="Reason" value={outpass.reason} />
                <Field
                  label="Out Date"
                  value={dateOnly(outpass.outDate || outpass.fromDate)}
                />
                <Field label="Out Time" value={clock(outpass.outTime)} />
                <Field label="Expected In Time" value={clock(outpass.inTime)} />
                <Field label="Submitted" value={dateTime(outpass.createdAt)} />
              </div>
            </Section>
          </div>

          <Section title="Academic Assignment" icon={GraduationCap}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Program"
                value={outpass.academicProgram || outpass.course}
              />
              <Field label="Semester" value={outpass.semester} />
              <Field label="Section" value={outpass.section} />
              <Field label="Group" value={outpass.group} />
            </div>
          </Section>

          <Section title="University Approval" icon={ShieldCheck}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">
                Decision recorded by authorized faculty
              </p>
              <StatusPill status={universityStatus} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Current Assigned Role"
                value={outpass.assignedRole?.replaceAll?.("_", " ")}
              />
              <Field
                label="Approved By Role"
                value={approvedRole ? approvedRole.replaceAll("_", " ") : null}
              />
              <Field label="Approved On" value={dateTime(outpass.approvedAt)} />
            </div>
            {!universityApproved &&
              status !== "PENDING" &&
              status !== "REJECTED" && (
                <p className="mt-3 text-xs text-amber-700">
                  Approval audit details are not available in this response; the
                  outpass status is shown separately.
                </p>
              )}
          </Section>

          <Section title="Parent Decision" icon={ShieldCheck}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                Parent status is recorded separately from university approval.
              </p>
              <StatusPill status={parentStatus} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Parent Name"
                value={outpass.parentName || outpass.parent?.name}
              />
              <Field
                label="Parent Mobile"
                value={maskPhone(
                  outpass.parentMobileNumber || outpass.parentMobile,
                )}
              />
              <Field
                label="Consent Status"
                value={
                  parentStatus === "UNKNOWN" ? "Not available" : parentStatus
                }
              />
              <Field
                label="Consent Method"
                value={
                  outpass.parentDecision?.method || outpass.parentApprovalMethod
                }
              />
              <Field
                label="Decision Time"
                value={dateTime(outpass.parentDecision?.decidedAt)}
              />
              <Field label="SMS Delivery" value={outpass.parentSMSStatus} />
            </div>
            {parentStatus === "PENDING" && (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Parent response is still pending. This does not automatically
                block an authorized faculty approval. Parent status remains
                PENDING unless an actual decision is recorded.
              </p>
            )}
            {parentStatus === "REJECTED" && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                Parent rejected this outpass. Faculty approval and gate EXIT
                must remain blocked.
              </p>
            )}
          </Section>

          {(outpass.exitVerifiedAt ||
            outpass.entryVerifiedAt ||
            ["EXITED", "RETURNED", "COMPLETED"].includes(status)) && (
            <Section title="Gate Verification" icon={MapPin}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="EXIT Verified At"
                  value={dateTime(outpass.exitVerifiedAt)}
                />
                <Field
                  label="ENTRY Verified At"
                  value={dateTime(outpass.entryVerifiedAt)}
                />
              </div>
              {["RETURNED", "COMPLETED"].includes(status) && (
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={17} /> Outpass completed. Active QR is no
                  longer required.
                </p>
              )}
            </Section>
          )}

          {(outpass.mentorRemark ||
            outpass.approvalRemark ||
            outpass.rejectionRemark) && (
            <Section title="Faculty Remarks" icon={CalendarDays}>
              <p className="whitespace-pre-wrap text-sm text-slate-700">
                {display(
                  outpass.mentorRemark ||
                    outpass.approvalRemark ||
                    outpass.rejectionRemark,
                )}
              </p>
            </Section>
          )}
        </>
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
          Outpass not found.
        </div>
      )}
    </div>
  );
}
