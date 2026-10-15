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
} from "lucide-react";

import api from "../../services/api";

// ============================================================
// QR FORMAT READER
// Local decoding is NOT security verification.
// Signature, approval, and validity must be checked by backend.
// ============================================================

const readQRPayload = (rawValue) => {
  try {
    const token = String(rawValue || "").trim();
    const parts = token.split(".");

    if (parts.length !== 2) {
      return null;
    }

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
// RESPONSE HELPERS
// Support flat and nested response structures.
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
  if (value === null || value === undefined) {
    return "Not available";
  }

  if (typeof value === "object") {
    return "Not available";
  }

  const formatted = String(value).trim();

  return formatted || "Not available";
};

const formatDate = (value) => {
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
  }).format(date);
};

const normalizeVerifiedData = (rawData) => {
  const data = rawData?.outpass || rawData || {};

  const student =
    typeof data.student === "object" && data.student !== null
      ? data.student
      : {};

  const studentInfo = data.studentInfo || data.studentDetails || {};

  const identity = data.identity || {};

  const approvals = data.approvals || {};

  return {
    studentName: firstValue(
      data.studentName,
      data.name,
      student.name,
      student.studentName,
      studentInfo.name,
      studentInfo.studentName,
      identity.name,
    ),

    enrollmentNumber: firstValue(
      data.enrollmentNumber,
      data.enrollmentNo,
      student.enrollmentNumber,
      student.enrollmentNo,
      studentInfo.enrollmentNumber,
      studentInfo.enrollmentNo,
      identity.enrollmentNumber,
    ),

    outpassId: firstValue(data.outpassId, data.passNumber),

    status: firstValue(data.status, data.movementStatus, rawData?.status),

    destination: firstValue(data.destination, data.leaveDetails?.destination),

    reason: firstValue(data.reason, data.leaveDetails?.reason),

    outDate: firstValue(data.outDate, data.leaveDetails?.outDate),

    outTime: firstValue(data.outTime, data.leaveDetails?.outTime),

    parentStatus: firstValue(
      data.parentDecision?.status,
      data.parentApprovalStatus,
      approvals.parentStatus,
      approvals.parent,
    ),

    qrValidFrom: firstValue(data.qrValidFrom),

    qrExpiresAt: firstValue(data.qrExpiresAt),
  };
};

// ============================================================
// COMPONENTS
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

// ============================================================
// SECURITY DASHBOARD
// ============================================================

const SecurityDashboard = () => {
  const scannerRef = useRef(null);
  const scanLockRef = useRef(false);
  const mountedRef = useRef(true);
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
  // STOP CAMERA
  // ==========================================================

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;

    scannerRef.current = null;
    scanLockRef.current = true;

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
      console.warn("Scanner cleanup:", err);
    }

    if (mountedRef.current) {
      setScanning(false);
    }

    scanLockRef.current = false;
  }, []);

  // ==========================================================
  // CAMERA CLEANUP
  // ==========================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      const scanner = scannerRef.current;
      scannerRef.current = null;

      if (scanner) {
        const cleanup = async () => {
          try {
            if (scanner.isScanning) {
              await scanner.stop();
            }

            await scanner.clear();
          } catch (err) {
            console.warn("Camera cleanup:", err);
          }
        };

        void cleanup();
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
  // SCAN RESULT
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
      "QR scanned. Review the request and confirm to verify with the server.",
    );
  };

  // ==========================================================
  // START CAMERA
  // ==========================================================

  const startScanner = async () => {
    if (scannerRef.current || scanLockRef.current || loading) {
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
      console.error("QR Camera Start Error:", err);

      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }

      scanLockRef.current = false;
      setScanning(false);

      setError(
        "Unable to start camera. Check permissions and HTTPS connection.",
      );
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

    // A token scanned in one mode must not be
    // silently reused after changing the mode.
    setQrToken("");
    setOutpassId("");
    setVerifiedData(null);
    setMessage("");
    setError("");
  };

  // ==========================================================
  // VERIFY EXIT / ENTRY
  // Backend performs all authorization and security checks.
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
        response.data.message || `Student ${scanMode} verified successfully.`,
      );

      // Token is cleared after successful movement
      // so the guard cannot accidentally resubmit.
      setQrToken("");
      setOutpassId("");
    } catch (err) {
      console.error("Security QR Verification Error:", err);

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
            Scan an approved student outpass and confirm EXIT or ENTRY at the
            security gate.
          </p>
        </div>

        {/* MODE */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => changeMode("EXIT")}
            disabled={scanning || loading}
            className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-4 text-sm font-bold transition sm:text-base ${
              scanMode === "EXIT"
                ? "bg-cyan-500 text-slate-950"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            <LogOut size={20} />
            Verify EXIT
          </button>

          <button
            type="button"
            onClick={() => changeMode("ENTRY")}
            disabled={scanning || loading}
            className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-4 text-sm font-bold transition sm:text-base ${
              scanMode === "ENTRY"
                ? "bg-cyan-500 text-slate-950"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            <LogIn size={20} />
            Verify ENTRY
          </button>
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

              <p className="text-sm leading-6 text-slate-400">
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
              QR format has been read successfully. Its signature, approval,
              expiry and permissions have not yet been verified.
            </p>

            <div className="mt-4 rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-400">Internal Outpass ID</p>

              <p className="mt-2 break-all font-mono text-sm text-white">
                {outpassId}
              </p>
            </div>

            <p className="mt-4 text-xs text-amber-200">
              Confirming will record a gate movement if the backend accepts the
              QR. Student identity preview requires a separate read-only
              verification API.
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

        {/* VERIFIED OUTPASS DATA */}
        {verifiedData && (
          <section className="overflow-hidden rounded-[26px] border border-slate-800 bg-slate-900 shadow-xl">
            <div className="border-b border-slate-800 bg-emerald-950/60 px-6 py-5">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={22} />

                <h3 className="text-lg font-bold">Verified Student Outpass</h3>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Movement accepted by AMIOUT backend
              </p>
            </div>

            {!verifiedData.studentName || !verifiedData.enrollmentNumber ? (
              <div className="mx-5 mt-5 flex items-start gap-3 rounded-xl border border-amber-700/40 bg-amber-950/30 p-4 text-sm text-amber-200">
                <AlertCircle size={19} className="shrink-0" />

                <p>
                  Movement was recorded, but the API did not provide complete
                  student identity details. Backend response needs to be
                  checked.
                </p>
              </div>
            ) : null}

            <div className="grid gap-3 p-5 sm:grid-cols-2">
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
                icon={FileText}
                label="Outpass Number"
                value={verifiedData.outpassId}
              />

              <DetailItem
                icon={ShieldCheck}
                label="Movement Status"
                value={verifiedData.status}
              />

              {verifiedData.destination && (
                <DetailItem
                  icon={MapPin}
                  label="Destination"
                  value={verifiedData.destination}
                />
              )}

              {verifiedData.outDate && (
                <DetailItem
                  icon={CalendarDays}
                  label="Out Date"
                  value={formatDate(verifiedData.outDate)}
                />
              )}

              {verifiedData.outTime && (
                <DetailItem
                  icon={Clock3}
                  label="Out Time"
                  value={verifiedData.outTime}
                />
              )}

              {verifiedData.parentStatus && (
                <DetailItem
                  icon={ShieldCheck}
                  label="Parent Consent"
                  value={verifiedData.parentStatus}
                />
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default SecurityDashboard;
