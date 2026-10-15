import { useCallback, useEffect, useState } from "react";
import api from "../../../services/api";
import {
  Clock3,
  MapPin,
  FileText,
  CalendarDays,
  RefreshCw,
  ShieldCheck,
  QrCode,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Display fallback for missing fields
const displayValue = (value, fallback = "Not available") => {
  if (value === null || value === undefined) return fallback;

  const text = String(value).trim();
  return text || fallback;
};

// Format date safely for Indian timezone
const formatDate = (value) => {
  if (!value) return "Not available";

  // Preserve calendar date if API sends YYYY-MM-DD
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
};

// Supports time-only values such as "16:05" or "16:05:00"
const formatTime = (value) => {
  if (!value) return "Not available";

  const text = String(value).trim();
  const timeMatch = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

  if (timeMatch) {
    const hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);

    if (hour < 0 || hour > 23 || minute > 59) {
      return "Not available";
    }

    const displayHour = hour % 12 || 12;
    const period = hour >= 12 ? "PM" : "AM";

    return `${String(displayHour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0",
    )} ${period}`;
  }

  // Preserve other existing time formats
  return text;
};

// Reusable detail card
const DetailCard = ({ icon: Icon, label, value, className = "" }) => (
  <div
    className={`min-w-0 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 sm:p-5 ${className}`}
  >
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm font-semibold leading-6 text-slate-900 sm:text-base">
          {displayValue(value)}
        </p>
      </div>
    </div>
  </div>
);

const ActiveOutpass = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [outpass, setOutpass] = useState(null);
  const [error, setError] = useState("");

  const fetchActiveOutpass = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");

    try {
      const { data } = await api.get("/outpass/active");

      if (data?.success === false) {
        throw new Error(data.message || "Failed to load active outpass.");
      }

      setOutpass(data?.data ?? null);
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Failed to load active outpass.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveOutpass(true);
  }, [fetchActiveOutpass]);

  const status = displayValue(outpass?.status, "UNKNOWN").toUpperCase();

  const statusStyle =
    status === "APPROVED" || status === "EXITED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "PENDING"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : status === "REJECTED"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-slate-200 bg-slate-100 text-slate-700";

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-5 px-3 py-5 sm:px-5">
        <div className="h-32 animate-pulse rounded-3xl bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 px-3 py-5 sm:px-5 lg:px-6">
      {/* Premium header */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-5 py-7 text-white shadow-lg sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full bg-emerald-400/10 blur-2xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
              <ShieldCheck size={14} />
              AMIOUT · Student Portal
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Active Outpass
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              View your current outpass details and digital gate pass.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchActiveOutpass(false)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="flex min-w-0 items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700"
        >
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p className="min-w-0 break-words [overflow-wrap:anywhere] text-sm">
            {error}
          </p>
        </div>
      )}

      {!outpass ? (
        <section className="rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <QrCode size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No Active Outpass Found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Your active digital outpass will appear here when available.
          </p>
        </section>
      ) : (
        <>
          <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <FileText size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      Current Request
                    </p>
                    <h2 className="mt-1 min-w-0 break-words [overflow-wrap:anywhere] text-base font-bold text-slate-900 sm:text-lg">
                      {displayValue(outpass.outpassId)}
                    </h2>
                  </div>
                </div>

                <span
                  className={`inline-flex shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyle}`}
                >
                  {status}
                </span>
              </div>
            </div>

            <div className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-7">
              <div className="grid min-w-0 gap-4 md:grid-cols-2">
                <DetailCard
                  icon={MapPin}
                  label="Destination"
                  value={outpass.destination}
                />

                <DetailCard
                  icon={CalendarDays}
                  label="Out Date"
                  value={formatDate(outpass.outDate)}
                />

                <DetailCard
                  icon={Clock3}
                  label="Out Time"
                  value={formatTime(outpass.outTime)}
                />

                <DetailCard
                  icon={Clock3}
                  label="Expected Return"
                  value={formatTime(outpass.inTime || outpass.expectedReturn)}
                />
              </div>

              {/* Long reason can wrap without breaking the card */}
              <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-slate-600">
                  <FileText size={18} className="shrink-0 text-emerald-600" />
                  <h3 className="text-sm font-bold">Reason for Outpass</h3>
                </div>

                <div className="mt-3 min-w-0 max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-xl bg-white p-4 text-sm leading-7 text-slate-700 sm:text-base">
                  {displayValue(outpass.reason)}
                </div>
              </div>
            </div>
          </section>

          {outpass.qrCode && (
            <section className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-8">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <QrCode size={24} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Digital Outpass
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Present this QR code to the authorized security guard for
                verification.
              </p>

              <div className="mx-auto mt-6 inline-flex max-w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <img
                  src={outpass.qrCode}
                  alt="Active Outpass QR Code"
                  className="h-auto w-44 max-w-full object-contain sm:w-52"
                />
              </div>

              <p className="mt-3 text-xs text-slate-400">
                QR verification is subject to the outpass validity and campus
                gate rules.
              </p>
            </section>
          )}
        </>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck size={15} />
        AMIOUT Secure Campus Movement
      </div>
    </div>
  );
};

export default ActiveOutpass;
