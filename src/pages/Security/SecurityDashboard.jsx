import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

import {
  ShieldCheck,
  ScanLine,
  LogOut,
  LogIn,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  UserRound,
  IdCard,
  FileText,
  MapPin,
  CalendarDays,
  Clock3,
  Users,
  Phone,
  BadgeCheck,
  UserCheck,
  Building2,
  Loader2,
} from "lucide-react";

import api from "../../services/api";

// ============================================================
// QR FORMAT READER
// Actual security validation happens on the backend.
// ============================================================

function readQRPayload(raw) {
  try {
    const token = String(raw ?? "").trim();
    const parts = token.split(".");

    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return null;
    }

    const base64 = parts[0].replace(/-/g, "+").replace(/_/g, "/");

    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

    const payload = JSON.parse(atob(padded));

    if (
      payload?.type !== "AMIOUT_OUTPASS" ||
      payload?.version !== 1 ||
      !/^[0-9a-f]{24}$/i.test(String(payload.outpassId ?? ""))
    ) {
      return null;
    }

    return {
      token,
      outpassId: payload.outpassId,
    };
  } catch {
    return null;
  }
}

// ============================================================
// FORMAT HELPERS
// ============================================================

const first = (...values) =>
  values.find(
    (value) => value !== undefined && value !== null && value !== "",
  ) ?? null;

function asText(value) {
  if (value === undefined || value === null || value === "") {
    return "Not available";
  }

  if (typeof value === "object") {
    return String(
      first(value.name, value.title, value.code, value.email) ??
        "Not available",
    );
  }

  return String(value);
}

function asDate(value, withTime = false) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      : {}),
  }).format(date);
}

function maskMobile(value) {
  const digits = String(value ?? "").replace(/\D/g, "");

  if (digits.length < 10) {
    return "Not available";
  }

  return `******${digits.slice(-4)}`;
}

function consentMethod(value) {
  if (value === "SMS_LINK") {
    return "Parent SMS Approval Link";
  }

  if (value === "PHONE_CALL") {
    return "Verified Phone Call";
  }

  return asText(value);
}

// ============================================================
// NORMALIZE BACKEND RESPONSE
// Works with preview and verification responses.
// ============================================================

function normalizeOutpass(raw) {
  const data = raw?.outpass ?? raw ?? {};

  const student =
    data.student && typeof data.student === "object" ? data.student : {};

  const parent =
    data.parent && typeof data.parent === "object" ? data.parent : {};

  const decision = data.parentDecision ?? data.parentApproval ?? {};

  const approval = data.universityApproval ?? data.facultyApproval ?? {};

  return {
    studentName: first(data.studentName, student.name, data.studentInfo?.name),

    enrollment: first(
      data.enrollmentNumber,
      data.enrollmentNo,
      student.enrollmentNumber,
      student.enrollmentNo,
    ),

    course: first(student.course, data.course, data.academic?.program),

    semester: first(student.semester, data.semester),

    section: first(student.section, data.section),

    group: first(student.group, data.group),

    outpassId: first(data.outpassId, data.passNumber),

    status: first(data.status, data.movementStatus),

    destination: data.destination,
    reason: data.reason,
    outDate: data.outDate,
    outTime: data.outTime,
    inTime: data.inTime,

    parentName: first(parent.name, data.parentName),

    parentMobile: first(parent.mobileNumber, data.parentMobileNumber),

    parentStatus: first(decision.status, data.parentApprovalStatus, "PENDING"),

    parentMethod: decision.method,

    parentDecidedAt: first(decision.decidedAt, decision.approvedAt),

    parentVerifiedBy: first(decision.verifiedByFaculty, decision.verifiedBy),

    parentVerifiedByRole: decision.verifiedByRole,

    parentCallVerifiedAt: decision.callVerifiedAt,

    universityStatus: first(approval.status, data.universityApprovalStatus),

    universityApprovedBy: first(approval.approvedBy, data.approvedByFaculty),

    universityRole: first(
      approval.role,
      approval.approvedAuthorityRole,
      data.approvedAuthorityRole,
    ),

    universityApprovedAt: first(approval.approvedAt, data.approvedAt),

    exitVerified: data.exitVerified === true,
    exitVerifiedAt: data.exitVerifiedAt,

    entryVerified: data.entryVerified === true,
    entryVerifiedAt: data.entryVerifiedAt,

    qrValidFrom: data.qrValidFrom,
    qrExpiresAt: data.qrExpiresAt,
  };
}

// ============================================================
// REUSABLE DETAIL CARD
// ============================================================

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400">
          <Icon size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-400">{label}</p>

          <p className="mt-1 wrap-break-word text-sm font-semibold text-white">
            {asText(value)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REUSABLE SECTION
// ============================================================

function InfoSection({ title, icon: Icon, children }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-800/70 px-5 py-4">
        <Icon size={21} className="text-cyan-400" />

        <h3 className="font-bold text-white">{title}</h3>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({ value }) {
  const status = String(value ?? "").toUpperCase();

  const colors = ["APPROVED", "RETURNED", "EXITED"].includes(status)
    ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
    : status === "REJECTED"
      ? "border-rose-500/30 bg-rose-500/15 text-rose-300"
      : "border-amber-500/30 bg-amber-500/15 text-amber-300";

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-xs font-bold ${colors}`}
    >
      {asText(value)}
    </span>
  );
}

// ============================================================
// SECURITY DASHBOARD
// ============================================================

export default function SecurityDashboard() {
  const scannerRef = useRef(null);
  const scanHandledRef = useRef(false);
  const requestLockRef = useRef(false);
  const mountedRef = useRef(false);
  const sequenceRef = useRef(0);

  // ==========================================================
  // STATE
  // ==========================================================

  const [mode, setMode] = useState("EXIT");

  const [cameraStarting, setCameraStarting] = useState(false);

  const [scanning, setScanning] = useState(false);

  const [previewLoading, setPreviewLoading] = useState(false);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const [token, setToken] = useState("");
  const [outpassId, setOutpassId] = useState("");

  const [details, setDetails] = useState(null);

  const [confirmed, setConfirmed] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Derived values avoid reading refs during JSX render.
  const busy = cameraStarting || previewLoading || confirmLoading;

  const hasPreview = Boolean(details && token && outpassId && !confirmed);

  // ==========================================================
  // STOP CAMERA
  // ==========================================================

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;

    scannerRef.current = null;
    scanHandledRef.current = true;

    if (!scanner) {
      if (mountedRef.current) {
        setScanning(false);
      }

      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch (err) {
      console.warn("Scanner stop:", err);
    }

    try {
      await scanner.clear();
    } catch (err) {
      console.warn("Scanner clear:", err);
    }

    if (mountedRef.current) {
      setScanning(false);
    }
  }, []);

  // ==========================================================
  // COMPONENT LIFECYCLE
  // ==========================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      sequenceRef.current += 1;

      const scanner = scannerRef.current;

      scannerRef.current = null;
      scanHandledRef.current = true;

      if (scanner) {
        void (async () => {
          try {
            if (scanner.isScanning) {
              await scanner.stop();
            }

            await scanner.clear();
          } catch (err) {
            console.warn("Scanner cleanup:", err);
          }
        })();
      }
    };
  }, []);

  // ==========================================================
  // CLEAR RESULT
  // ==========================================================

  const clearResult = () => {
    sequenceRef.current += 1;

    setToken("");
    setOutpassId("");

    setDetails(null);
    setConfirmed(false);

    setMessage("");
    setError("");
  };

  // ==========================================================
  // RESET
  // ==========================================================

  const reset = async () => {
    if (busy || requestLockRef.current) {
      return;
    }

    await stopScanner();

    clearResult();
  };

  // ==========================================================
  // CHANGE MODE
  // ==========================================================

  const changeMode = (nextMode) => {
    if (busy || scanning || requestLockRef.current) {
      return;
    }

    clearResult();
    setMode(nextMode);
  };

  // ==========================================================
  // QR SCANNED -> AUTOMATIC STUDENT DETAILS PREVIEW
  // ==========================================================

  const loadPreview = async (raw, scanMode) => {
    clearResult();

    const qr = readQRPayload(raw);

    if (!qr) {
      setError(
        "Invalid AMIOUT QR format. Please scan a valid digital outpass.",
      );
      return;
    }

    const sequence = ++sequenceRef.current;

    setToken(qr.token);
    setOutpassId(qr.outpassId);
    setPreviewLoading(true);

    try {
      // READ-ONLY API
      // Does NOT mark EXIT or ENTRY.
      const response = await api.post(
        `/outpass/security/${qr.outpassId}/preview`,
        {
          qrToken: qr.token,
          mode: scanMode,
        },
      );

      if (response.data?.success !== true) {
        throw new Error(response.data?.message || "QR preview failed.");
      }

      if (!mountedRef.current || sequence !== sequenceRef.current) {
        return;
      }

      setDetails(normalizeOutpass(response.data?.data));

      setMessage(
        "QR validated. Review student details, then confirm gate movement.",
      );
    } catch (err) {
      if (!mountedRef.current || sequence !== sequenceRef.current) {
        return;
      }

      setToken("");
      setOutpassId("");
      setDetails(null);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load student details.",
      );
    } finally {
      if (mountedRef.current && sequence === sequenceRef.current) {
        setPreviewLoading(false);
      }
    }
  };

  // ==========================================================
  // START CAMERA
  // ==========================================================

  const startScanner = async () => {
    if (busy || scannerRef.current || requestLockRef.current || hasPreview) {
      return;
    }

    clearResult();

    setCameraStarting(true);
    scanHandledRef.current = false;

    let scanner;

    try {
      scanner = new Html5Qrcode("amiout-qr-reader");

      scannerRef.current = scanner;

      const width = typeof window !== "undefined" ? window.innerWidth : 360;

      const qrSize = Math.min(240, Math.max(150, width - 100));

      const scanMode = mode;

      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: {
            width: qrSize,
            height: qrSize,
          },
        },
        (decodedText) => {
          if (scannerRef.current !== scanner || scanHandledRef.current) {
            return;
          }

          // Process the first scan only.
          scanHandledRef.current = true;

          void loadPreview(decodedText, scanMode);

          void stopScanner();
        },
        () => {},
      );

      if (mountedRef.current && scannerRef.current === scanner) {
        setScanning(true);
      }
    } catch (err) {
      console.error("Camera error:", err);

      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }

      scanHandledRef.current = true;

      try {
        if (scanner?.isScanning) {
          await scanner.stop();
        }

        if (scanner) {
          await scanner.clear();
        }
      } catch (cleanupErr) {
        console.warn("Camera cleanup:", cleanupErr);
      }

      if (mountedRef.current) {
        setScanning(false);

        setError(
          "Unable to open camera. Allow camera permission and use HTTPS.",
        );
      }
    } finally {
      if (mountedRef.current) {
        setCameraStarting(false);
      }
    }
  };

  // ==========================================================
  // CONFIRM EXIT / ENTRY
  // ONLY THIS FUNCTION RECORDS GATE MOVEMENT
  // ==========================================================

  const confirmMovement = async () => {
    if (!hasPreview || busy || requestLockRef.current) {
      return;
    }

    requestLockRef.current = true;

    setConfirmLoading(true);
    setMessage("");
    setError("");

    try {
      const endpoint = mode === "EXIT" ? "verify-exit" : "verify-entry";

      const response = await api.patch(
        `/outpass/security/${outpassId}/${endpoint}`,
        {
          qrToken: token,
        },
      );

      if (response.data?.success !== true) {
        throw new Error(response.data?.message || "Gate verification failed.");
      }

      if (!mountedRef.current) {
        return;
      }

      setDetails(normalizeOutpass(response.data?.data));

      setConfirmed(true);

      setToken("");
      setOutpassId("");

      setMessage(
        response.data?.message || `Student ${mode} verified successfully.`,
      );
    } catch (err) {
      console.error("Security verification error:", err);

      if (mountedRef.current) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Gate verification failed.",
        );
      }
    } finally {
      requestLockRef.current = false;

      if (mountedRef.current) {
        setConfirmLoading(false);
      }
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-950 pb-10 text-white">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-6">
          <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
            <ShieldCheck size={27} />
          </div>

          <div>
            <h1 className="text-lg font-bold sm:text-xl">
              AMIOUT Security Dashboard
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Secure Digital Outpass Verification
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-7">
        {/* PAGE TITLE */}
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            QR Verification
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Scan student QR, review the details, then confirm EXIT or ENTRY.
          </p>
        </div>

        {/* EXIT / ENTRY MODE */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              value: "EXIT",
              label: "Verify EXIT",
              icon: LogOut,
            },
            {
              value: "ENTRY",
              label: "Verify ENTRY",
              icon: LogIn,
            },
          ].map((option) => {
            const Icon = option.icon;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => changeMode(option.value)}
                disabled={busy || scanning}
                className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-4 text-sm font-bold transition disabled:opacity-50 sm:text-base ${
                  mode === option.value
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <Icon size={20} />

                {option.label}
              </button>
            );
          })}
        </div>

        {/* CAMERA SECTION */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-3">
              <ScanLine size={24} className="text-cyan-400" />
            </div>

            <div>
              <h3 className="font-bold">Scan Student QR</h3>

              <p className="mt-1 text-xs text-slate-400">
                {mode} verification mode
              </p>
            </div>
          </div>

          <div
            id="amiout-qr-reader"
            className="mx-auto max-w-md overflow-hidden rounded-2xl"
          />

          {!scanning && !cameraStarting && !details && !previewLoading && (
            <div className="py-7 text-center">
              <ScanLine size={58} className="mx-auto mb-4 text-slate-600" />

              <p className="text-sm text-slate-400">
                Position the student's approved QR code in front of the camera.
              </p>
            </div>
          )}

          {/* CAMERA BUTTONS */}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {!scanning ? (
              <button
                type="button"
                onClick={startScanner}
                disabled={busy || Boolean(token) || Boolean(details)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-50"
              >
                {cameraStarting ? (
                  <Loader2 size={19} className="animate-spin" />
                ) : (
                  <ScanLine size={19} />
                )}

                {cameraStarting ? "Starting Camera..." : "Start Camera"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void stopScanner()}
                disabled={busy}
                className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold disabled:opacity-50"
              >
                Stop Camera
              </button>
            )}

            <button
              type="button"
              onClick={reset}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-5 py-3 text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Reset
            </button>
          </div>
        </section>

        {/* PREVIEW LOADING */}
        {previewLoading && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl border border-cyan-700 bg-slate-900 p-5 text-cyan-200"
          >
            <Loader2 size={21} className="animate-spin" />

            <span>Validating QR and loading student details...</span>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-rose-700 bg-rose-950 p-4 text-sm text-rose-200"
          >
            <AlertCircle size={21} className="shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {message && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-2xl border border-emerald-700 bg-emerald-950 p-4 text-sm text-emerald-200"
          >
            <CheckCircle2 size={21} className="shrink-0" />

            <span>{message}</span>
          </div>
        )}

        {/* ALL STUDENT DETAILS */}
        {details && (
          <div className="space-y-5">
            {/* STATUS HEADER */}
            <div className="rounded-3xl border border-emerald-700/50 bg-gradient-to-r from-slate-900 to-emerald-950 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    {confirmed ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <UserCheck size={24} />
                    )}

                    <h3 className="text-lg font-bold">
                      {confirmed
                        ? "Verified Student Outpass"
                        : "Student Outpass Preview"}
                    </h3>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    {confirmed
                      ? "Gate movement recorded successfully"
                      : "QR checked. Gate movement not yet recorded."}
                  </p>
                </div>

                <StatusBadge value={details.status} />
              </div>
            </div>

            {/* STUDENT INFORMATION */}
            <InfoSection title="Student Information" icon={UserRound}>
              <DetailItem
                icon={UserRound}
                label="Student Name"
                value={details.studentName}
              />

              <DetailItem
                icon={IdCard}
                label="Enrollment Number"
                value={details.enrollment}
              />

              <DetailItem
                icon={Building2}
                label="Course / Program"
                value={details.course}
              />

              <DetailItem
                icon={Users}
                label="Semester / Section / Group"
                value={[
                  details.semester && `Semester ${details.semester}`,
                  details.section && `Section ${details.section}`,
                  details.group && `Group ${details.group}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            </InfoSection>

            {/* OUTPASS DETAILS */}
            <InfoSection title="Outpass Details" icon={FileText}>
              <DetailItem
                icon={FileText}
                label="Outpass Number"
                value={details.outpassId}
              />

              <DetailItem
                icon={MapPin}
                label="Destination"
                value={details.destination}
              />

              <DetailItem
                icon={FileText}
                label="Reason"
                value={details.reason}
              />

              <DetailItem
                icon={CalendarDays}
                label="Out Date"
                value={asDate(details.outDate)}
              />

              <DetailItem
                icon={Clock3}
                label="Out Time"
                value={details.outTime}
              />

              <DetailItem
                icon={Clock3}
                label="Expected In Time"
                value={details.inTime || "No planned return"}
              />
            </InfoSection>

            {/* PARENT APPROVAL */}
            <InfoSection title="Parent Approval" icon={Phone}>
              <DetailItem
                icon={UserRound}
                label="Parent Name"
                value={details.parentName}
              />

              <DetailItem
                icon={Phone}
                label="Registered Mobile (Masked)"
                value={maskMobile(details.parentMobile)}
              />

              <DetailItem
                icon={BadgeCheck}
                label="Parent Consent Status"
                value={details.parentStatus}
              />

              <DetailItem
                icon={ShieldCheck}
                label="Approval Method"
                value={consentMethod(details.parentMethod)}
              />

              <DetailItem
                icon={CalendarDays}
                label="Parent Decision Time"
                value={asDate(details.parentDecidedAt, true)}
              />

              {details.parentMethod === "PHONE_CALL" && (
                <>
                  <DetailItem
                    icon={UserCheck}
                    label="Phone Consent Verified By"
                    value={details.parentVerifiedBy}
                  />

                  <DetailItem
                    icon={Users}
                    label="Verifier Role"
                    value={details.parentVerifiedByRole}
                  />

                  <DetailItem
                    icon={Clock3}
                    label="Phone Verified At"
                    value={asDate(details.parentCallVerifiedAt, true)}
                  />
                </>
              )}
            </InfoSection>

            {/* UNIVERSITY APPROVAL */}
            <InfoSection title="University Approval" icon={ShieldCheck}>
              <DetailItem
                icon={BadgeCheck}
                label="Approval Status"
                value={details.universityStatus}
              />

              <DetailItem
                icon={UserCheck}
                label="Approved By"
                value={details.universityApprovedBy}
              />

              <DetailItem
                icon={Users}
                label="Authority Role"
                value={details.universityRole}
              />

              <DetailItem
                icon={CalendarDays}
                label="University Approval Time"
                value={asDate(details.universityApprovedAt, true)}
              />
            </InfoSection>

            {/* SECURITY GATE VERIFICATION */}
            <InfoSection title="Security Gate Verification" icon={ScanLine}>
              <DetailItem
                icon={LogOut}
                label="EXIT Verification"
                value={details.exitVerified ? "VERIFIED" : "NOT VERIFIED"}
              />

              <DetailItem
                icon={Clock3}
                label="EXIT Verified At"
                value={asDate(details.exitVerifiedAt, true)}
              />

              <DetailItem
                icon={LogIn}
                label="ENTRY Verification"
                value={details.entryVerified ? "VERIFIED" : "NOT VERIFIED"}
              />

              <DetailItem
                icon={Clock3}
                label="ENTRY Verified At"
                value={asDate(details.entryVerifiedAt, true)}
              />

              <DetailItem
                icon={CalendarDays}
                label="QR Valid From"
                value={asDate(details.qrValidFrom, true)}
              />

              <DetailItem
                icon={CalendarDays}
                label="QR Expires At"
                value={asDate(details.qrExpiresAt, true)}
              />
            </InfoSection>

            {/* CONFIRM MOVEMENT */}
            {hasPreview && (
              <section className="rounded-3xl border border-amber-500/40 bg-slate-900 p-5">
                <h3 className="flex items-center gap-2 font-bold text-amber-300">
                  <ShieldCheck size={22} />
                  Confirm Student {mode}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Verify student identity and all details above. Only pressing
                  Confirm will record gate movement.
                </p>

                <button
                  type="button"
                  onClick={confirmMovement}
                  disabled={busy}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-4 font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                >
                  {confirmLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <ShieldCheck size={20} />
                  )}

                  {confirmLoading ? "Confirming..." : `Confirm ${mode}`}
                </button>
              </section>
            )}

            {/* FINAL SUCCESS */}
            {confirmed && (
              <div className="rounded-3xl border border-emerald-600/50 bg-emerald-950/60 p-5 text-center">
                <CheckCircle2 size={43} className="mx-auto text-emerald-400" />

                <h3 className="mt-3 text-lg font-bold text-emerald-300">
                  {mode} Verified Successfully
                </h3>

                <p className="mt-2 text-sm text-slate-300">
                  Gate movement recorded in AMIOUT.
                </p>

                <button
                  type="button"
                  onClick={reset}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950"
                >
                  <RefreshCw size={18} />
                  Scan Next Outpass
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
