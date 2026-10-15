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
} from "lucide-react";

import api from "../../../services/api";

const ALLOWED_STATUSES = ["APPROVED", "EXITED"];

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

const DigitalOutpassQR = ({ outpass }) => {
  const qrRef = useRef(null);

  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const outpassId = outpass?._id || outpass?.id || outpass?.outpassId;

  const status = outpass?.status;

  const canFetchQR = Boolean(outpassId) && ALLOWED_STATUSES.includes(status);

  useEffect(() => {
    let cancelled = false;

    const loadQR = async () => {
      setQrData(null);
      setError("");

      if (!canFetchQR) return;

      setLoading(true);

      try {
        const response = await api.get(
          `/outpass/${encodeURIComponent(outpassId)}/qr`,
        );

        if (!cancelled) {
          if (response.data?.success && response.data?.data?.qrToken) {
            setQrData(response.data.data);
          } else {
            setError("QR is not available.");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message || "Unable to load digital QR pass.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadQR();

    return () => {
      cancelled = true;
    };
  }, [outpassId, canFetchQR]);

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");

    if (!svg || !qrData) return;

    const serialized = new XMLSerializer().serializeToString(svg);

    const blob = new Blob([serialized], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `AMIOUT-${outpass?.outpassId || "QR"}.svg`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const parentStatus = outpass?.parentDecision?.status || "PENDING";

  const parentMethod = outpass?.parentDecision?.method;

  if (status === "PENDING") {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 text-center">
        <Clock3 size={42} className="mx-auto text-amber-500" />

        <h3 className="mt-4 text-xl font-bold text-slate-900">
          Digital Outpass Pending
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          Your QR code will be issued after Parent Consent and University
          Approval.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-amber-700">
            Parent: {parentStatus}
          </span>

          <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700">
            Faculty: PENDING
          </span>
        </div>
      </div>
    );
  }

  if (!canFetchQR) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 text-center">
        <XCircle size={42} className="mx-auto text-slate-400" />

        <h3 className="mt-4 text-lg font-bold text-slate-800">
          QR Not Available
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Current outpass status: {status || "UNKNOWN"}
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
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
        <div className="text-center">
          <p className="text-xs font-medium text-slate-500">Outpass Number</p>

          <p className="mt-1 break-all text-lg font-extrabold text-slate-900">
            {outpass?.outpassId || "N/A"}
          </p>

          <p className="mt-2 font-bold text-emerald-700">{status}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
          <div>
            <p className="text-xs text-slate-500">Student</p>

            <p className="mt-1 text-sm font-bold text-slate-800">
              {outpass?.studentName || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Enrollment</p>

            <p className="mt-1 break-all text-sm font-bold text-slate-800">
              {outpass?.enrollmentNumber || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Parent Consent</p>

            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={15} />
              {parentMethod === "PHONE_CALL" ? "Verified by Call" : "Approved"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">University Approval</p>

            <p className="mt-1 text-sm font-semibold text-emerald-700">
              Approved
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-5">
          {loading ? (
            <>
              <RefreshCw size={35} className="animate-spin text-emerald-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading your secure QR...
              </p>
            </>
          ) : qrData?.qrToken ? (
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
                <QrCode size={18} />
                Static Secure QR
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
                <Download size={17} />
                Save QR
              </button>
            </>
          ) : (
            <div className="text-center">
              <LockKeyhole size={40} className="mx-auto text-amber-500" />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                {error || "QR currently unavailable."}
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs leading-5 text-slate-500">
          Present this QR at the security gate. The security guard must verify
          your identity and confirm EXIT or ENTRY. Saving or displaying QR does
          not verify movement.
        </p>
      </div>
    </section>
  );
};

export default DigitalOutpassQR;
