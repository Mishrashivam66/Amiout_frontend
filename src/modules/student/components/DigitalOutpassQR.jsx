import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  Clock3,
  ShieldCheck,
  RefreshCw,
  Download,
  LockKeyhole,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../../services/api";

const ALLOWED_STATUSES = ["APPROVED", "EXITED"];
const AUTHORIZED_ROLES = new Set([
  "MENTOR",
  "BACKUP_MENTOR",
  "COORDINATOR",
  "HOD",
  "HOI",
]);

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase();

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
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

const getParentInfo = (outpass) => {
  const decision = outpass?.parentDecision || {};
  const status = normalize(
    decision.status || outpass?.parentApprovalStatus || "PENDING",
  );
  const method = normalize(decision.method);

  if (status === "REJECTED") {
    return {
      status,
      label: "Rejected",
      color: "text-red-700",
      icon: "rejected",
    };
  }
  if (status === "PENDING") {
    return {
      status,
      label: "Pending",
      color: "text-amber-700",
      icon: "pending",
    };
  }
  if (status === "APPROVED") {
    const label =
      method === "PHONE_CALL"
        ? "Phone Consent Recorded"
        : method === "SMS_LINK"
          ? "Approved via SMS"
          : "Approved (method unavailable)";
    return { status, label, color: "text-emerald-700", icon: "approved" };
  }
  return {
    status,
    label: "Not Available",
    color: "text-slate-500",
    icon: "pending",
  };
};

const getFacultyInfo = (outpass, qrData) => {
  const status = normalize(qrData?.status || outpass?.status);
  const role = normalize(
    qrData?.approvedAuthorityRole || outpass?.approvedAuthorityRole,
  );
  // A successful secure QR response is authoritative. Otherwise display
  // the latest recorded university-approval fields.
  const approved =
    Boolean(qrData?.qrToken) ||
    (ALLOWED_STATUSES.includes(status) &&
      Boolean(outpass?.approvedAt) &&
      Boolean(outpass?.approvedByFaculty) &&
      AUTHORIZED_ROLES.has(role));

  if (approved) {
    return {
      approved: true,
      label: `Approved by ${role ? role.replaceAll("_", " ") : "Faculty"}`,
      color: "text-emerald-700",
    };
  }
  if (status === "REJECTED") {
    return { approved: false, label: "Rejected", color: "text-red-700" };
  }
  return {
    approved: false,
    label: status === "PENDING" ? "Pending" : "Approval Incomplete",
    color: "text-amber-700",
  };
};

function StatusIcon({ type }) {
  if (type === "approved") return <CheckCircle2 size={16} />;
  if (type === "rejected") return <XCircle size={16} />;
  return <Clock3 size={16} />;
}

export default function DigitalOutpassQR({ outpass }) {
  const qrRef = useRef(null);
  const [currentOutpass, setCurrentOutpass] = useState(outpass || null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsWarning, setDetailsWarning] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  const outpassId = outpass?._id || outpass?.id || outpass?.outpassId;

  useEffect(() => {
    let cancelled = false;

    const loadLatestOutpass = async () => {
      setLoading(true);
      setQrData(null);
      setError("");
      setDetailsWarning("");
      setCurrentOutpass(outpass || null);

      if (!outpassId) {
        setError("Outpass ID is unavailable.");
        setLoading(false);
        return;
      }

      try {
        // Step 1: refresh real approval statuses (display only).
        let latestOutpass = outpass;
        try {
          const response = await api.get(
            `/outpass/${encodeURIComponent(outpassId)}`,
            {
              params: { refresh: Date.now() },
            },
          );
          if (cancelled) return;
          if (response.data?.success === true && response.data?.data) {
            latestOutpass = response.data.data;
            setCurrentOutpass(latestOutpass);
          } else {
            setDetailsWarning("Unable to refresh approval details.");
          }
        } catch (err) {
          if (cancelled) return;
          setDetailsWarning("Latest approval details could not be loaded.");
          console.warn(
            "AMIOUT details refresh failed:",
            err?.response?.status || err?.message,
          );
        }

        // Step 2: only approved/exited requests can have active QR.
        if (!ALLOWED_STATUSES.includes(normalize(latestOutpass?.status)))
          return;

        // Step 3: backend is the only authority allowed to issue a QR token.
        // Parent PENDING is not a frontend blocker. Backend independently
        // checks university approval, signed token, revocation and expiry.
        const response = await api.get(
          `/outpass/${encodeURIComponent(outpassId)}/qr`,
          {
            params: { refresh: Date.now() },
          },
        );
        if (cancelled) return;
        if (response.data?.success === true && response.data?.data?.qrToken) {
          setQrData(response.data.data);
        } else {
          setError(response.data?.message || "QR is not available yet.");
        }
      } catch (err) {
        if (!cancelled) {
          setQrData(null);
          setError(
            getErrorMessage(err, "Unable to load secure QR. Please try again."),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadLatestOutpass();
    return () => {
      cancelled = true;
    };
  }, [outpassId, refreshCount]);

  const details = currentOutpass || outpass || {};
  const status = normalize(details.status);
  const parentInfo = getParentInfo(details);
  const facultyInfo = getFacultyInfo(details, qrData);
  const latestParentStatus = normalize(
    qrData?.parentStatus || parentInfo.status,
  );

  // Do not require parent SMS/call consent locally: Parent PENDING is allowed.
  // QR is displayed only when the secure backend endpoint actually returned it.
  const qrReady =
    Boolean(qrData?.qrToken) &&
    ALLOWED_STATUSES.includes(normalize(qrData?.status)) &&
    latestParentStatus !== "REJECTED" &&
    parentInfo.status !== "REJECTED";

  const refreshStatus = () => {
    if (!loading) setRefreshCount((count) => count + 1);
  };

  const downloadQR = () => {
    if (!qrReady) return;
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const serialized = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([serialized], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AMIOUT-${details.outpassId || "QR"}.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const getLockedMessage = () => {
    if (parentInfo.status === "REJECTED" || latestParentStatus === "REJECTED") {
      return "Parent has rejected this outpass. QR issuance is blocked.";
    }
    if (status === "REJECTED") return "University has rejected this outpass.";
    if (!ALLOWED_STATUSES.includes(status)) {
      return "Waiting for authorized University Approval (Mentor/Coordinator/HOD/HOI).";
    }
    if (error) return error;
    if (!facultyInfo.approved) return "University approval is incomplete.";
    return "Secure QR is not available yet. Refresh to check the latest status.";
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 px-6 py-6 text-center text-white">
        <p className="text-xl font-extrabold tracking-wider">AMIOUT</p>
        <p className="mt-1 text-xs text-slate-300">
          Amity University Madhya Pradesh
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-200">
          <ShieldCheck size={15} /> DIGITAL DAY SCHOLAR OUTPASS
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="text-center">
          <p className="text-xs font-medium text-slate-500">Outpass Number</p>
          <p className="mt-1 break-all text-lg font-extrabold text-slate-900">
            {details.outpassId || "N/A"}
          </p>
          <p
            className={`mt-2 font-bold ${ALLOWED_STATUSES.includes(status) ? "text-emerald-700" : status === "REJECTED" ? "text-red-700" : "text-amber-700"}`}
          >
            {status || "UNKNOWN"}
          </p>
          <button
            type="button"
            onClick={refreshStatus}
            disabled={loading || !outpassId}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            {loading ? "Checking Status..." : "Refresh Status & QR"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
          <div>
            <p className="text-xs text-slate-500">Student</p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {details.studentName || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Enrollment</p>
            <p className="mt-1 break-all text-sm font-bold text-slate-800">
              {details.enrollmentNumber || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Parent Consent</p>
            <p
              className={`mt-1 flex items-center gap-1 text-sm font-semibold ${parentInfo.color}`}
            >
              <StatusIcon type={parentInfo.icon} />{" "}
              <span>{parentInfo.label}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">University Approval</p>
            <p
              className={`mt-1 flex items-center gap-1 text-sm font-semibold ${facultyInfo.color}`}
            >
              <StatusIcon
                type={
                  facultyInfo.approved
                    ? "approved"
                    : status === "REJECTED"
                      ? "rejected"
                      : "pending"
                }
              />
              <span>{facultyInfo.label}</span>
            </p>
          </div>
        </div>

        {detailsWarning && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <AlertCircle size={17} className="shrink-0" />{" "}
            <span>{detailsWarning}</span>
          </div>
        )}

        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-5">
          {loading ? (
            <>
              <RefreshCw size={35} className="animate-spin text-emerald-600" />
              <p className="mt-4 text-sm text-slate-500">
                Checking approvals and secure QR...
              </p>
            </>
          ) : qrReady ? (
            <>
              <div ref={qrRef} className="rounded-xl bg-white p-4 shadow-sm">
                <QRCodeSVG
                  value={qrData.qrToken}
                  size={220}
                  level="M"
                  marginSize={2}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-700">
                <QrCode size={18} /> Static Secure QR
              </p>
              <div className="mt-4 text-center text-xs text-slate-600">
                <p>Valid From: {formatDateTime(qrData.validFrom)}</p>
                <p className="mt-2">
                  Expires: {formatDateTime(qrData.expiresAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={downloadQR}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <Download size={17} /> Save QR
              </button>
            </>
          ) : (
            <div className="text-center">
              {parentInfo.status === "REJECTED" || status === "REJECTED" ? (
                <XCircle size={40} className="mx-auto text-red-500" />
              ) : (
                <LockKeyhole size={40} className="mx-auto text-amber-500" />
              )}
              <p className="mt-4 text-sm font-semibold text-slate-700">
                {getLockedMessage()}
              </p>
              {error && error !== getLockedMessage() && (
                <p className="mt-3 text-xs text-red-600">Backend: {error}</p>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs leading-5 text-slate-500">
          A valid digital QR requires approval from the authorized Mentor,
          Coordinator, HOD or HOI. Parent consent status is recorded separately.
          Security must verify the signed QR and confirm EXIT or ENTRY.
          Displaying or saving the QR does not record campus movement.
        </p>
      </div>
    </section>
  );
}

