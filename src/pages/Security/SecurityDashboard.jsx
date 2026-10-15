import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  ShieldCheck,
  ScanLine,
  LogOut,
  LogIn,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const readQRPayload = (token) => {
  try {
    const parts = token.trim().split(".");

    if (parts.length !== 2) {
      throw new Error("Invalid QR format");
    }

    const base64 = parts[0].replace(/-/g, "+").replace(/_/g, "/");

    const decoded = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")),
    );

    if (
      decoded.type !== "AMIOUT_OUTPASS" ||
      decoded.version !== 1 ||
      !/^[a-f0-9]{24}$/i.test(decoded.outpassId)
    ) {
      throw new Error("Invalid AMIOUT QR");
    }

    return decoded;
  } catch {
    return null;
  }
};

const SecurityDashboard = () => {
  const scannerRef = useRef(null);
  const busyRef = useRef(false);

  const [scanMode, setScanMode] = useState("EXIT");
  const [scanning, setScanning] = useState(false);

  const [qrToken, setQrToken] = useState("");
  const [outpassId, setOutpassId] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [verifiedData, setVerifiedData] = useState(null);

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    busyRef.current = false;

    if (!scanner) {
      setScanning(false);
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch (err) {
      console.error("Scanner stop:", err);
    }

    try {
      scanner.clear();
    } catch (err) {
      console.error("Scanner cleanup:", err);
    }

    setScanning(false);
  };

  const handleScannedToken = (token) => {
    const payload = readQRPayload(token);

    setVerifiedData(null);
    setMessage("");
    setError("");

    if (!payload) {
      setQrToken("");
      setOutpassId("");
      setError("Invalid AMIOUT QR format.");
      return;
    }

    setQrToken(token);
    setOutpassId(payload.outpassId);
    setMessage(
      "QR scanned. Confirm verification to validate it with the server.",
    );
  };

  const startScanner = async () => {
    if (scannerRef.current || busyRef.current) {
      return;
    }

    busyRef.current = true;

    setQrToken("");
    setOutpassId("");
    setVerifiedData(null);
    setMessage("");
    setError("");

    try {
      const scanner = new Html5Qrcode("amiout-qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
        },
        (decodedText) => {
          if (!busyRef.current) return;

          busyRef.current = false;
          handleScannedToken(decodedText);
          void stopScanner();
        },
        () => {},
      );

      setScanning(true);
    } catch (err) {
      scannerRef.current = null;
      busyRef.current = false;
      setScanning(false);
      setError("Camera could not start. Check camera permission and HTTPS.");
    }
  };

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;

      if (scanner) {
        if (scanner.isScanning) {
          scanner.stop().catch(() => {});
        }
      }
    };
  }, []);

  const reset = async () => {
    await stopScanner();

    setQrToken("");
    setOutpassId("");
    setVerifiedData(null);
    setMessage("");
    setError("");
  };

  const verifyOutpass = async () => {
    if (!qrToken || !outpassId) {
      setError("Scan a valid AMIOUT QR first.");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const endpoint = scanMode === "EXIT" ? "verify-exit" : "verify-entry";

      const response = await api.patch(
        `/outpass/security/${outpassId}/${endpoint}`,
        { qrToken },
      );

      if (response.data?.success !== true) {
        throw new Error(response.data?.message || "Verification failed.");
      }

      setVerifiedData(response.data.data);
      setMessage(response.data.message || `${scanMode} successfully verified.`);

      // Prevent accidental repeat submission.
      setQrToken("");
      setOutpassId("");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "QR verification failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-5">
          <ShieldCheck className="text-cyan-400" size={30} />

          <div>
            <h1 className="text-xl font-bold">AMIOUT Security Dashboard</h1>
            <p className="text-sm text-slate-400">
              Digital Outpass Verification
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">QR Verification</h2>

          <p className="mt-2 text-slate-400">
            Scan a student's approved outpass and confirm the gate movement.
          </p>
        </div>

        {/* EXIT / ENTRY */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              if (scanning) return;
              setScanMode("EXIT");
              setVerifiedData(null);
              setMessage("");
              setError("");
            }}
            disabled={scanning || loading}
            className={`flex items-center justify-center gap-2 rounded-xl p-4 font-semibold ${
              scanMode === "EXIT"
                ? "bg-cyan-500 text-slate-950"
                : "bg-slate-800 text-white"
            }`}
          >
            <LogOut size={20} />
            Verify EXIT
          </button>

          <button
            type="button"
            onClick={() => {
              if (scanning) return;
              setScanMode("ENTRY");
              setVerifiedData(null);
              setMessage("");
              setError("");
            }}
            disabled={scanning || loading}
            className={`flex items-center justify-center gap-2 rounded-xl p-4 font-semibold ${
              scanMode === "ENTRY"
                ? "bg-cyan-500 text-slate-950"
                : "bg-slate-800 text-white"
            }`}
          >
            <LogIn size={20} />
            Verify ENTRY
          </button>
        </div>

        {/* SCANNER CARD */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex items-center gap-3">
            <ScanLine className="text-cyan-400" />

            <div>
              <h3 className="font-semibold">Scan Student QR</h3>
              <p className="text-xs text-slate-400">
                {scanMode} verification mode
              </p>
            </div>
          </div>

          <div
            id="amiout-qr-reader"
            className="mx-auto max-w-md overflow-hidden rounded-lg"
          />

          {!scanning && !qrToken && (
            <div className="py-8 text-center">
              <ScanLine size={60} className="mx-auto mb-4 text-slate-500" />

              <p className="mb-5 text-sm text-slate-400">
                Position the student's QR code in front of the camera.
              </p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            {!scanning ? (
              <button
                type="button"
                onClick={startScanner}
                disabled={loading}
                className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950"
              >
                <ScanLine size={18} className="mr-2 inline" />
                Start Camera
              </button>
            ) : (
              <button
                type="button"
                onClick={stopScanner}
                className="rounded-lg bg-rose-600 px-6 py-3 font-semibold"
              >
                Stop Camera
              </button>
            )}

            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="rounded-lg bg-slate-700 px-5 py-3"
            >
              <RefreshCw size={16} className="mr-2 inline" />
              Reset
            </button>
          </div>
        </div>

        {/* SCANNED TOKEN PREVIEW */}
        {qrToken && (
          <div className="mt-6 rounded-xl border border-amber-700 bg-slate-900 p-5">
            <p className="mb-2 text-sm text-amber-300">
              Scanned data — not yet verified by server
            </p>

            <p className="break-all text-sm text-slate-300">
              Outpass ID: {outpassId}
            </p>

            <button
              type="button"
              onClick={verifyOutpass}
              disabled={loading}
              className="mt-5 w-full rounded-lg bg-emerald-500 p-4 font-bold text-slate-950 disabled:opacity-60"
            >
              {loading ? "Verifying..." : `Confirm ${scanMode} Verification`}
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {message && (
          <div
            role="status"
            className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-800 bg-emerald-950 p-4 text-emerald-200"
          >
            <CheckCircle2 className="shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-xl border border-red-800 bg-red-950 p-4 text-red-200"
          >
            <AlertCircle className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* VERIFIED DATA */}
        {verifiedData && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-4 text-lg font-semibold text-emerald-400">
              Verified Student Outpass
            </h3>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p>
                Student: <strong>{verifiedData.studentName || "N/A"}</strong>
              </p>

              <p>
                Enrollment:{" "}
                <strong>{verifiedData.enrollmentNumber || "N/A"}</strong>
              </p>

              <p>
                Outpass: <strong>{verifiedData.outpassId || "N/A"}</strong>
              </p>

              <p>
                Status: <strong>{verifiedData.status || "N/A"}</strong>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SecurityDashboard;
