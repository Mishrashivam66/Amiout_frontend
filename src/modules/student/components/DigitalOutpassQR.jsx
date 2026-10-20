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
  LogOut,
  LogIn,
} from "lucide-react";

import api from "../../../services/api";

// ============================================================
// CONSTANTS
// ============================================================

const QR_ACTIVE_STATUSES = ["APPROVED", "EXITED"];

const COMPLETED_STATUSES = ["RETURNED", "COMPLETED"];

const APPROVED_HISTORY_STATUSES = [
  ...QR_ACTIVE_STATUSES,
  ...COMPLETED_STATUSES,
];

const AUTHORIZED_ROLES = new Set([
  "MENTOR",
  "BACKUP_MENTOR",
  "COORDINATOR",
  "HOD",
  "HOI",
]);

// ============================================================
// HELPERS
// ============================================================

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

// ============================================================
// PARENT INFORMATION
// ============================================================

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
    return {
      status,

      label:
        method === "PHONE_CALL"
          ? "Phone Consent Recorded"
          : method === "SMS_LINK"
            ? "Approved via SMS"
            : "Approved (method unavailable)",

      color: "text-emerald-700",
      icon: "approved",
    };
  }

  return {
    status,
    label: "Not Available",
    color: "text-slate-500",
    icon: "pending",
  };
};

// ============================================================
// UNIVERSITY FACULTY APPROVAL
//
// Important:
// Approval history remains approved after:
// APPROVED -> EXITED -> RETURNED
//
// QR is NOT required to display historic approval.
// ============================================================

const getFacultyInfo = (outpass, qrData) => {
  const status = normalize(outpass?.status || qrData?.status);

  const role = normalize(
    outpass?.approvedAuthorityRole || qrData?.approvedAuthorityRole,
  );

  const approvalSaved =
    APPROVED_HISTORY_STATUSES.includes(status) &&
    Boolean(outpass?.approvedAt) &&
    Boolean(outpass?.approvedByFaculty) &&
    AUTHORIZED_ROLES.has(role);

  const validQrResponse =
    QR_ACTIVE_STATUSES.includes(status) &&
    Boolean(qrData?.qrToken) &&
    AUTHORIZED_ROLES.has(role);

  if (approvalSaved || validQrResponse) {
    return {
      approved: true,
      label: `Approved by ${role.replaceAll("_", " ")}`,
      color: "text-emerald-700",
    };
  }

  if (status === "REJECTED") {
    return {
      approved: false,
      label: "Rejected",
      color: "text-red-700",
    };
  }

  return {
    approved: false,

    label: status === "PENDING" ? "Pending" : "Approval details unavailable",

    color: "text-amber-700",
  };
};

// ============================================================
// STATUS ICON
// ============================================================

function StatusIcon({ type }) {
  if (type === "approved") {
    return <CheckCircle2 size={16} />;
  }

  if (type === "rejected") {
    return <XCircle size={16} />;
  }

  return <Clock3 size={16} />;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function DigitalOutpassQR({ outpass }) {
  const qrRef = useRef(null);

  const [currentOutpass, setCurrentOutpass] = useState(outpass || null);

  const [qrData, setQrData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [detailsWarning, setDetailsWarning] = useState("");

  const [refreshCount, setRefreshCount] = useState(0);

  // ==========================================================
  // OUTPASS IDENTIFIER
  // ==========================================================

  const outpassId = outpass?._id || outpass?.id || outpass?.outpassId;

  // ==========================================================
  // REFRESH OUTPASS AND SECURE QR
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    const loadLatestOutpass = async () => {
      setLoading(true);

      // Never reuse an old QR after a new refresh.
      setQrData(null);
      setError("");
      setDetailsWarning("");

      setCurrentOutpass(outpass || null);

      try {
        if (!outpassId) {
          setError("Outpass ID is unavailable.");
          return;
        }

        let latestOutpass = outpass;

        // ====================================================
        // STEP 1: FETCH LATEST OUTPASS DETAILS
        // ====================================================

        try {
          const response = await api.get(
            `/outpass/${encodeURIComponent(outpassId)}`,
            {
              params: {
                refresh: Date.now(),
              },
            },
          );

          if (cancelled) return;

          if (response.data?.success === true && response.data?.data) {
            latestOutpass = response.data.data;

            setCurrentOutpass(latestOutpass);
          } else {
            setDetailsWarning("Could not refresh the latest outpass details.");
          }
        } catch (err) {
          if (cancelled) return;

          setDetailsWarning("Latest outpass details could not be loaded.");

          console.warn(
            "AMIOUT details refresh failed:",
            err?.response?.status || err?.message,
          );
        }

        if (cancelled) return;

        // ====================================================
        // STEP 2: CHECK QR-ELIGIBLE STATUS
        //
        // APPROVED -> QR may be available
        // EXITED   -> QR may be available for ENTRY
        // RETURNED -> No QR request
        // COMPLETED -> No QR request
        // ====================================================

        const latestStatus = normalize(latestOutpass?.status);

        if (!QR_ACTIVE_STATUSES.includes(latestStatus)) {
          return;
        }

        // ====================================================
        // STEP 3: FETCH SECURE QR FROM BACKEND
        //
        // Parent PENDING is not a frontend blocker.
        // Backend verifies signed token, approval and expiry.
        // ====================================================

        const response = await api.get(
          `/outpass/${encodeURIComponent(outpassId)}/qr`,
          {
            params: {
              refresh: Date.now(),
            },
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

          setError(getErrorMessage(err, "Unable to load secure QR."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadLatestOutpass();

    return () => {
      cancelled = true;
    };
  }, [outpass, outpassId, refreshCount]);

  // ==========================================================
  // CURRENT OUTPASS STATE
  // ==========================================================

  const details = currentOutpass || outpass || {};

  const status = normalize(details.status);

  const isCompleted = COMPLETED_STATUSES.includes(status);

  const parentInfo = getParentInfo(details);

  const facultyInfo = getFacultyInfo(details, qrData);

  const latestParentStatus = normalize(
    qrData?.parentStatus || parentInfo.status,
  );

  // ==========================================================
  // ACTIVE QR DISPLAY CONDITION
  //
  // Parent PENDING  -> allowed
  // Parent APPROVED -> allowed
  // Parent REJECTED -> blocked
  //
  // RETURNED/COMPLETED can never display active QR.
  // ==========================================================

  const qrReady =
    Boolean(qrData?.qrToken) &&
    QR_ACTIVE_STATUSES.includes(status) &&
    QR_ACTIVE_STATUSES.includes(normalize(qrData?.status)) &&
    latestParentStatus !== "REJECTED" &&
    parentInfo.status !== "REJECTED" &&
    facultyInfo.approved;

  // ==========================================================
  // STATUS COLOR
  // ==========================================================

  const statusColor = APPROVED_HISTORY_STATUSES.includes(status)
    ? "text-emerald-700"
    : status === "REJECTED" || status === "CANCELLED"
      ? "text-red-700"
      : "text-amber-700";

  // ==========================================================
  // REFRESH
  // ==========================================================

  const refreshStatus = () => {
    if (!loading) {
      setRefreshCount((count) => count + 1);
    }
  };

  // ==========================================================
  // DOWNLOAD QR
  // ==========================================================

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

  // ==========================================================
  // LOCKED / UNAVAILABLE MESSAGE
  // ==========================================================

  const getLockedMessage = () => {
    if (isCompleted) {
      return "Outpass completed successfully. " + "No active QR is required.";
    }

    if (parentInfo.status === "REJECTED" || latestParentStatus === "REJECTED") {
      return "Parent has rejected this outpass. " + "QR access is blocked.";
    }

    if (status === "REJECTED") {
      return "University has rejected this outpass.";
    }

    if (status === "CANCELLED") {
      return "This outpass was cancelled.";
    }

    if (!QR_ACTIVE_STATUSES.includes(status)) {
      return (
        "Waiting for authorized University Approval " +
        "(Mentor/Coordinator/HOD/HOI)."
      );
    }

    if (error) return error;

    if (!facultyInfo.approved) {
      return "University approval details are incomplete.";
    }

    return (
      "Secure QR is not available. " + "Refresh to check the latest status."
    );
  };

  // ==========================================================
  // USER INTERFACE
  // ==========================================================

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 px-6 py-6 text-center text-white">
        <p className="text-xl font-extrabold tracking-wider">AMIOUT</p>

        <p className="mt-1 text-xs text-slate-300">
          Amity University Madhya Pradesh
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-200">
          <ShieldCheck size={15} />
          DIGITAL DAY SCHOLAR OUTPASS
        </div>
      </div>

      <div className="space-y-5 p-6">
        {/* ==================================================
            OUTPASS NUMBER AND STATUS
        ================================================== */}

        <div className="text-center">
          <p className="text-xs font-medium text-slate-500">Outpass Number</p>

          <p className="mt-1 break-all text-lg font-extrabold text-slate-900">
            {details.outpassId || "N/A"}
          </p>

          <p className={`mt-2 font-bold ${statusColor}`}>
            {status || "UNKNOWN"}
          </p>

          <button
            type="button"
            onClick={refreshStatus}
            disabled={loading || !outpassId}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />

            {loading
              ? "Checking Status..."
              : isCompleted
                ? "Refresh Details"
                : "Refresh Status & QR"}
          </button>
        </div>

        {/* ==================================================
            STUDENT INFORMATION + APPROVALS
        ================================================== */}

        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
          <div>
            <p className="text-xs text-slate-500">Student</p>

            <p className="mt-1 break-words text-sm font-bold text-slate-800">
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
              <StatusIcon type={parentInfo.icon} />
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

        {/* ==================================================
            DETAILS WARNING
        ================================================== */}

        {detailsWarning && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <AlertCircle size={17} className="shrink-0" />

            <span>{detailsWarning}</span>
          </div>
        )}

        {/* ==================================================
            COMPLETED / RETURNED OUTPASS
            NO ACTIVE QR
        ================================================== */}

        {isCompleted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <CheckCircle2 size={46} className="mx-auto text-emerald-600" />

            <p className="mt-3 text-lg font-extrabold text-emerald-800">
              Outpass Completed Successfully
            </p>

            <p className="mt-2 text-sm leading-6 text-emerald-900">
              {details.exitVerified && details.entryVerified
                ? "Security has verified both EXIT and ENTRY. This trip is closed."
                : "The outpass is marked as returned. No active QR is required."}
            </p>

            {(details.exitVerifiedAt || details.entryVerifiedAt) && (
              <div className="mt-5 grid gap-3 text-left text-xs text-slate-700 sm:grid-cols-2">
                {details.exitVerifiedAt && (
                  <div className="rounded-xl bg-white p-3">
                    <p className="flex items-center gap-2 font-semibold">
                      <LogOut size={15} />
                      EXIT Verified
                    </p>

                    <p className="mt-1">
                      {formatDateTime(details.exitVerifiedAt)}
                    </p>
                  </div>
                )}

                {details.entryVerifiedAt && (
                  <div className="rounded-xl bg-white p-3">
                    <p className="flex items-center gap-2 font-semibold">
                      <LogIn size={15} />
                      ENTRY Verified
                    </p>

                    <p className="mt-1">
                      {formatDateTime(details.entryVerifiedAt)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ==================================================
              ACTIVE QR / LOCKED QR
          ================================================== */

          <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-5">
            {loading ? (
              <div className="text-center">
                <RefreshCw
                  size={35}
                  className="mx-auto animate-spin text-emerald-600"
                />

                <p className="mt-4 text-sm text-slate-500">
                  Checking approval status and secure QR...
                </p>
              </div>
            ) : qrReady ? (
              <>
                {/* SECURE SIGNED QR */}

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
                  <QrCode size={18} />
                  Static Secure QR
                </p>

                {/* QR VALIDITY */}

                <div className="mt-4 text-center text-xs text-slate-600">
                  <p>Valid From: {formatDateTime(qrData.validFrom)}</p>

                  <p className="mt-2">
                    Expires: {formatDateTime(qrData.expiresAt)}
                  </p>
                </div>

                {/* DOWNLOAD */}

                <button
                  type="button"
                  onClick={downloadQR}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <Download size={17} />
                  Save QR
                </button>
              </>
            ) : (
              <>
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
                    <p className="mt-3 text-xs text-red-600">
                      Backend: {error}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ==================================================
            SECURITY NOTICE
        ================================================== */}

        <p className="text-center text-xs leading-5 text-slate-500">
          An active QR is issued by the backend after authorized university
          approval. Parent consent status is recorded separately. Campus
          Security must verify the signed QR and confirm EXIT and ENTRY.
          Completed outpasses do not require an active QR.
        </p>
      </div>
    </section>
  );
}
