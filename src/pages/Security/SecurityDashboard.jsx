"use strict";

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
  Info,
  Users,
  Phone,
  BadgeCheck,
  UserCheck,
  Building2,
} from "lucide-react";

import api from "../../services/api";

// ============================================================
// QR FORMAT READER
// This only reads QR format.
// Actual validation happens on the backend.
// ============================================================

const readQRPayload = (rawValue) => {
  try {
    const token = String(rawValue || "").trim();
    const parts = token.split(".");

    if (parts.length !== 2) return null;

    const encoded = parts[0].replace(/-/g, "+").replace(/_/g, "/");

    const padded = encoded.padEnd(Math.ceil(encoded.length / 4) * 4, "=");

    const payload = JSON.parse(atob(padded));

    if (
      payload?.type !== "AMIOUT_OUTPASS" ||
      payload?.version !== 1 ||
      !/^[a-f0-9]{24}$/i.test(String(payload.outpassId || ""))
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
};

// ============================================================
// FORMAT HELPERS
// ============================================================

const firstValue = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return null;
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  if (typeof value === "object") {
    return firstValue(value.name, value.title, value.code) || "Not available";
  }

  return String(value);
};

const formatDate = (value, withTime = false) => {
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
};

const formatConsentMethod = (method) => {
  if (method === "SMS_LINK") {
    return "Parent SMS Approval Link";
  }

  if (method === "PHONE_CALL") {
    return "Verified Phone Call";
  }

  return formatValue(method);
};

// ============================================================
// NORMALIZE BACKEND RESPONSE
// ============================================================

const normalizeVerifiedData = (rawData) => {
  const data = rawData?.outpass || rawData || {};

  const student =
    data.student && typeof data.student === "object" ? data.student : {};

  const parent =
    data.parent && typeof data.parent === "object" ? data.parent : {};

  const parentDecision = data.parentDecision || data.parentApproval || {};

  const universityApproval =
    data.universityApproval || data.facultyApproval || {};

  const approvingFaculty = firstValue(
    universityApproval.approvedBy,
    data.approvedByFaculty,
  );

  const phoneVerifier = firstValue(
    parentDecision.verifiedByFaculty,
    parentDecision.verifiedBy,
  );

  return {
    studentName: firstValue(
      data.studentName,
      student.name,
      data.studentInfo?.name,
    ),

    enrollmentNumber: firstValue(
      data.enrollmentNumber,
      data.enrollmentNo,
      student.enrollmentNumber,
      student.enrollmentNo,
    ),

    course: firstValue(student.course, data.course, data.academic?.program),

    semester: firstValue(student.semester, data.semester),

    section: firstValue(student.section, data.section),

    group: firstValue(student.group, data.group),

    institute: firstValue(data.academic?.institute, data.institute),

    outpassId: firstValue(data.outpassId, data.passNumber),

    status: firstValue(data.status, data.movementStatus, rawData?.status),

    destination: data.destination,
    reason: data.reason,
    outDate: data.outDate,
    outTime: data.outTime,
    inTime: data.inTime,

    parentName: parent.name,

    parentMobile: parent.mobileNumber,

    parentStatus: firstValue(parentDecision.status, data.parentApprovalStatus),

    parentMethod: parentDecision.method,

    parentDecidedAt: firstValue(
      parentDecision.decidedAt,
      parentDecision.approvedAt,
    ),

    parentVerifiedBy: phoneVerifier,

    parentVerifiedByRole: parentDecision.verifiedByRole,

    parentCallVerifiedAt: parentDecision.callVerifiedAt,

    universityStatus: universityApproval.status,

    universityApprovedBy: approvingFaculty,

    universityRole: firstValue(
      universityApproval.role,
      universityApproval.approvedAuthorityRole,
      data.approvedAuthorityRole,
    ),

    universityApprovedAt: firstValue(
      universityApproval.approvedAt,
      data.approvedAt,
    ),

    universityRemark: firstValue(universityApproval.remark, ""),

    qrValidFrom: data.qrValidFrom,
    qrExpiresAt: data.qrExpiresAt,

    exitVerified: data.exitVerified === true,

    exitVerifiedAt: data.exitVerifiedAt,

    entryVerified: data.entryVerified === true,

    entryVerifiedAt: data.entryVerifiedAt,
  };
};

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="mt-1 break-words text-sm font-semibold text-white">
          {formatValue(value)}
        </p>
      </div>
    </div>
  </div>
);

const InfoSection = ({ title, icon: Icon, children }) => (
  <section className="overflow-hidden rounded-[24px] border border-slate-700 bg-slate-900">
    <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-800/70 px-5 py-4">
      <Icon size={21} className="text-cyan-400" />

      <h3 className="font-bold text-white">{title}</h3>
    </div>

    <div className="grid gap-3 p-4 sm:grid-cols-2">{children}</div>
  </section>
);

const StatusBadge = ({ value }) => {
  const status = String(value || "").toUpperCase();

  const style =
    status === "APPROVED" || status === "RETURNED" || status === "EXITED"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : status === "REJECTED"
        ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
        : "bg-amber-500/15 text-amber-300 border-amber-500/30";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${style}`}
    >
      {formatValue(value)}
    </span>
  );
};

// ============================================================
// SECURITY DASHBOARD
// ============================================================

const SecurityDashboard = () => {
  const scannerRef = useRef(null);

  const scanLockRef = useRef(false);
  const mountedRef = useRef(false);
  const requestLockRef = useRef(false);

  const [scanMode, setScanMode] = useState("EXIT");
  const [scanning, setScanning] = useState(false);

  const [qrToken, setQrToken] = useState("");
  const [outpassId, setOutpassId] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [verifiedData, setVerifiedData] = useState(null);

  // ==========================================================
  // STOP SCANNER
  // ==========================================================

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;

    scannerRef.current = null;

    if (!scanner) {
      scanLockRef.current = false;

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

    scanLockRef.current = false;

    if (mountedRef.current) {
      setScanning(false);
    }
  }, []);

  // ==========================================================
  // UNMOUNT CLEANUP
  // ==========================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      const scanner = scannerRef.current;
      scannerRef.current = null;

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
  // RESET
  // ==========================================================

  const reset = async () => {
    if (requestLockRef.current) return;

    await stopScanner();

    setQrToken("");
    setOutpassId("");
    setVerifiedData(null);
    setMessage("");
    setError("");
  };

  // ==========================================================
  // QR SCANNED
  // ==========================================================

  const handleScannedToken = (rawToken) => {
    const payload = readQRPayload(rawToken);

    setVerifiedData(null);
    setMessage("");
    setError("");

    if (!payload) {
      setQrToken("");
      setOutpassId("");

      setError("Invalid AMIOUT QR format. Scan an approved digital outpass.");

      return;
    }

    setQrToken(payload.token);
    setOutpassId(payload.outpassId);

    setMessage(
      "QR scanned. Confirm verification to validate the QR with AMIOUT backend.",
    );
  };

  // ==========================================================
  // START CAMERA
  // ==========================================================

  const startScanner = async () => {
    if (
      scannerRef.current ||
      scanLockRef.current ||
      loading ||
      requestLockRef.current
    ) {
      return;
    }

    scanLockRef.current = true;

    setQrToken("");
    setOutpassId("");
    setVerifiedData(null);
    setMessage("");
    setError("");

    let scanner = null;

    try {
      scanner = new Html5Qrcode("amiout-qr-reader");

      scannerRef.current = scanner;

      const viewportWidth =
        typeof window !== "undefined" ? window.innerWidth : 360;

      const qrSize = Math.min(240, Math.max(150, viewportWidth - 100));

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
          if (!scanLockRef.current) {
            return;
          }

          scanLockRef.current = false;

          handleScannedToken(decodedText);

          void stopScanner();
        },
        () => {},
      );

      if (mountedRef.current) {
        setScanning(true);
      }
    } catch (err) {
      console.error("QR camera error:", err);

      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }

      scanLockRef.current = false;

      if (scanner) {
        try {
          if (scanner.isScanning) {
            await scanner.stop();
          }

          await scanner.clear();
        } catch (cleanupError) {
          console.warn("Camera cleanup:", cleanupError);
        }
      }

      if (mountedRef.current) {
        setScanning(false);

        setError(
          "Unable to start camera. Check camera permission and HTTPS connection.",
        );
      }
    }
  };

  // ==========================================================
  // CHANGE MODE
  // ==========================================================

  const changeMode = (mode) => {
    if (scanning || loading || requestLockRef.current) {
      return;
    }

    setScanMode(mode);
    setQrToken("");
    setOutpassId("");
    setVerifiedData(null);
    setMessage("");
    setError("");
  };

  // ==========================================================
  // VERIFY EXIT / ENTRY
  // Backend validates token, approvals, permissions and time.
  // ==========================================================

  const verifyOutpass = async () => {
    if (!qrToken || !outpassId || requestLockRef.current) {
      if (!requestLockRef.current) {
        setError("Please scan a valid AMIOUT QR first.");
      }

      return;
    }

    requestLockRef.current = true;

    setLoading(true);
    setError("");
    setMessage("");
    setVerifiedData(null);

    try {
      const endpoint = scanMode === "EXIT" ? "verify-exit" : "verify-entry";

      const response = await api.patch(
        `/outpass/security/${outpassId}/${endpoint}`,
        {
          qrToken,
        },
      );

      if (response.data?.success !== true) {
        throw new Error(response.data?.message || "Verification failed.");
      }

      const rawData = response.data?.data || {};

      const formatted = normalizeVerifiedData(rawData);

      setVerifiedData({
        ...formatted,
        outpassId: formatted.outpassId || outpassId,
      });

      setMessage(
        response.data?.message || `Student ${scanMode} verified successfully.`,
      );

      // Avoid accidental duplicate request.
      setQrToken("");
      setOutpassId("");
    } catch (err) {
      console.error("Security verification error:", err);

      setError(
        err.response?.data?.message || err.message || "QR verification failed.",
      );
    } finally {
      requestLockRef.current = false;
      setLoading(false);
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
        {/* INTRO */}
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            QR Verification
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Scan an approved outpass and verify student EXIT or ENTRY.
          </p>
        </div>

        {/* MODE */}
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
          ].map((mode) => {
            const Icon = mode.icon;

            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => changeMode(mode.value)}
                disabled={scanning || loading}
                className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-4 text-sm font-bold transition disabled:opacity-50 sm:text-base ${
                  scanMode === mode.value
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <Icon size={20} />
                {mode.label}
              </button>
            );
          })}
        </div>

        {/* SCANNER */}
        <section className="rounded-[26px] border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-3">
              <ScanLine size={24} className="text-cyan-400" />
            </div>

            <div>
              <h3 className="font-bold">Scan Student QR</h3>

              <p className="mt-1 text-xs text-slate-400">
                {scanMode} verification mode
              </p>
            </div>
          </div>

          <div
            id="amiout-qr-reader"
            className="mx-auto max-w-md overflow-hidden rounded-2xl"
          />

          {!scanning && !qrToken && (
            <div className="py-7 text-center">
              <ScanLine size={58} className="mx-auto mb-4 text-slate-600" />

              <p className="text-sm text-slate-400">
                Position the student's approved QR code in front of the camera.
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {!scanning ? (
              <button
                type="button"
                onClick={startScanner}
                disabled={loading || Boolean(qrToken)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-50"
              >
                <ScanLine size={19} />
                Start Camera
              </button>
            ) : (
              <button
                type="button"
                onClick={stopScanner}
                className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold"
              >
                Stop Camera
              </button>
            )}

            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-5 py-3 text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Reset
            </button>
          </div>
        </section>

        {/* SCANNED QR */}
        {qrToken && (
          <section className="rounded-[24px] border border-amber-500/40 bg-slate-900 p-5">
            <div className="mb-4 flex items-center gap-3 text-amber-300">
              <Info size={21} />

              <h3 className="font-bold">QR Scanned</h3>
            </div>

            <p className="text-sm leading-6 text-slate-300">
              QR format is recognized, but the server has not verified its
              signature, validity or approvals.
            </p>

            <div className="mt-4 rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-400">Internal Outpass ID</p>

              <p className="mt-2 break-all font-mono text-sm text-white">
                {outpassId}
              </p>
            </div>

            <p className="mt-4 text-xs text-amber-200">
              Confirming will record a gate movement if backend validation
              succeeds. Student identity and approval details will appear after
              verification.
            </p>

            <button
              type="button"
              onClick={verifyOutpass}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-4 font-bold text-slate-950 disabled:opacity-50"
            >
              <ShieldCheck size={20} />

              {loading
                ? "Verifying with Server..."
                : `Confirm ${scanMode} Verification`}
            </button>
          </section>
        )}

        {/* SUCCESS */}
        {message && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-2xl border border-emerald-700/70 bg-emerald-950 p-4 text-sm text-emerald-200"
          >
            <CheckCircle2 size={21} className="shrink-0" />

            <span>{message}</span>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-rose-700/70 bg-rose-950 p-4 text-sm text-rose-200"
          >
            <AlertCircle size={21} className="shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* VERIFIED DATA */}
        {verifiedData && (
          <div className="space-y-5">
            <div className="rounded-[24px] border border-emerald-700/50 bg-gradient-to-r from-slate-900 to-emerald-950 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 size={24} />

                    <h3 className="text-lg font-bold">
                      Verified Student Outpass
                    </h3>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Gate movement accepted by AMIOUT
                  </p>
                </div>

                <StatusBadge value={verifiedData.status} />
              </div>
            </div>

            {/* STUDENT INFORMATION */}
            <InfoSection title="Student Information" icon={UserRound}>
              <DetailItem
                icon={UserRound}
                label="Student Name"
                value={verifiedData.studentName}
              />

              <DetailItem
                icon={IdCard}
                label="Enrollment Number"
                value={verifiedData.enrollmentNumber}
              />

              <DetailItem
                icon={Building2}
                label="Course / Program"
                value={verifiedData.course}
              />

              <DetailItem
                icon={Users}
                label="Semester / Section / Group"
                value={[
                  verifiedData.semester && `Semester ${verifiedData.semester}`,
                  verifiedData.section && `Section ${verifiedData.section}`,
                  verifiedData.group && `Group ${verifiedData.group}`,
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
                value={verifiedData.outpassId}
              />

              <DetailItem
                icon={MapPin}
                label="Destination"
                value={verifiedData.destination}
              />

              <DetailItem
                icon={FileText}
                label="Reason"
                value={verifiedData.reason}
              />

              <DetailItem
                icon={CalendarDays}
                label="Out Date"
                value={formatDate(verifiedData.outDate)}
              />

              <DetailItem
                icon={Clock3}
                label="Out Time"
                value={verifiedData.outTime}
              />

              <DetailItem
                icon={Clock3}
                label="Expected In Time"
                value={verifiedData.inTime || "No planned return"}
              />
            </InfoSection>

            {/* PARENT APPROVAL */}
            <InfoSection title="Parent Approval" icon={Phone}>
              <DetailItem
                icon={UserRound}
                label="Parent Name"
                value={verifiedData.parentName}
              />

              <DetailItem
                icon={Phone}
                label="Registered Mobile (Masked)"
                value={verifiedData.parentMobile}
              />

              <DetailItem
                icon={BadgeCheck}
                label="Parent Consent Status"
                value={verifiedData.parentStatus}
              />

              <DetailItem
                icon={ShieldCheck}
                label="Approval Method"
                value={formatConsentMethod(verifiedData.parentMethod)}
              />

              <DetailItem
                icon={CalendarDays}
                label="Parent Decision Time"
                value={formatDate(verifiedData.parentDecidedAt, true)}
              />

              {verifiedData.parentMethod === "PHONE_CALL" && (
                <>
                  <DetailItem
                    icon={UserCheck}
                    label="Phone Consent Verified By"
                    value={verifiedData.parentVerifiedBy}
                  />

                  <DetailItem
                    icon={Users}
                    label="Verifier Role"
                    value={verifiedData.parentVerifiedByRole}
                  />

                  <DetailItem
                    icon={Clock3}
                    label="Phone Verified At"
                    value={formatDate(verifiedData.parentCallVerifiedAt, true)}
                  />
                </>
              )}
            </InfoSection>

            {/* UNIVERSITY APPROVAL */}
            <InfoSection title="University Approval" icon={ShieldCheck}>
              <DetailItem
                icon={BadgeCheck}
                label="Approval Status"
                value={verifiedData.universityStatus}
              />

              <DetailItem
                icon={UserCheck}
                label="Approved By"
                value={verifiedData.universityApprovedBy}
              />

              <DetailItem
                icon={Users}
                label="Authority Role"
                value={verifiedData.universityRole}
              />

              <DetailItem
                icon={CalendarDays}
                label="University Approval Time"
                value={formatDate(verifiedData.universityApprovedAt, true)}
              />
            </InfoSection>

            {/* SECURITY */}
            <InfoSection title="Security Gate Verification" icon={ScanLine}>
              <DetailItem
                icon={LogOut}
                label="EXIT Verification"
                value={verifiedData.exitVerified ? "VERIFIED" : "NOT VERIFIED"}
              />

              <DetailItem
                icon={Clock3}
                label="EXIT Verified At"
                value={formatDate(verifiedData.exitVerifiedAt, true)}
              />

              <DetailItem
                icon={LogIn}
                label="ENTRY Verification"
                value={verifiedData.entryVerified ? "VERIFIED" : "NOT VERIFIED"}
              />

              <DetailItem
                icon={Clock3}
                label="ENTRY Verified At"
                value={formatDate(verifiedData.entryVerifiedAt, true)}
              />

              <DetailItem
                icon={CalendarDays}
                label="QR Valid From"
                value={formatDate(verifiedData.qrValidFrom, true)}
              />

              <DetailItem
                icon={CalendarDays}
                label="QR Expires At"
                value={formatDate(verifiedData.qrExpiresAt, true)}
              />
            </InfoSection>
          </div>
        )}
      </main>
    </div>
  );
};

export default SecurityDashboard;
