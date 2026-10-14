import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  GraduationCap,
  FileText,
  LockKeyhole,
  ArrowLeft,
  Check,
} from "lucide-react";

import api from "../../../services/api";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
};

const formatTime = (value) => {
  if (!value) return "—";

  // Outpass time is stored as a selected slot.
  // Display the original value without guessing its format.
  return String(value);
};

const DetailField = ({ icon: Icon, label, value, full = false }) => (
  <div
    className={`rounded-2xl border border-slate-100 bg-slate-50/80 p-4 ${
      full ? "sm:col-span-2" : ""
    }`}
  >
    <div className="mb-2 flex items-center gap-2 text-slate-500">
      <Icon size={16} className="text-blue-600" />
      <span className="text-xs font-semibold uppercase tracking-wide">
        {label}
      </span>
    </div>

    <p className="break-words text-sm font-semibold leading-6 text-slate-900">
      {value || "—"}
    </p>
  </div>
);

const ParentReview = () => {
  const { token } = useParams();

  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDecision, setSelectedDecision] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const loadOutpass = useCallback(async () => {
    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
      setError("This parent approval link is invalid.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/outpass/parent/review/${encodeURIComponent(token)}`,
      );

      const payload = response?.data;

      if (payload?.success === false) {
        throw new Error(payload?.message || "Unable to load outpass.");
      }

      const data = payload?.data ?? payload;

      if (!data?.outpassId) {
        throw new Error("Outpass information is unavailable.");
      }

      setOutpass(data);
    } catch (err) {
      setError(
        err?.message === "Outpass information is unavailable."
          ? err.message
          : getErrorMessage(
              err,
              "Unable to open this link. It may be expired or already used.",
            ),
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOutpass();
  }, [loadOutpass]);

  useEffect(() => {
    document.title = "Parent Outpass Review | AMIOUT";

    return () => {
      document.title = "AMIOUT";
    };
  }, []);

  const submitDecision = async () => {
    if (!selectedDecision || submitting || result) return;

    try {
      setSubmitting(true);
      setError("");

      const response = await api.post(
        `/outpass/parent/decision/${encodeURIComponent(token)}`,
        {
          decision: selectedDecision,
        },
      );

      const payload = response?.data;

      if (payload?.success === false) {
        throw new Error(payload?.message || "Unable to record your decision.");
      }

      setResult({
        decision: payload?.data?.parentStatus || selectedDecision,
        message:
          payload?.message ||
          payload?.data?.message ||
          "Your decision was recorded successfully.",
      });

      setSelectedDecision(null);
      setOutpass(null);
    } catch (err) {
      setSelectedDecision(null);

      setError(
        getErrorMessage(err, err?.message || "Unable to submit your decision."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50">
      {/* Background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900" />

      {/* Top Navigation */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg">
            <ShieldCheck size={26} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-wide">AMIOUT</h1>
            <p className="text-xs text-blue-200">Secure Parent Approval</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100 sm:flex">
          <LockKeyhole size={14} />
          Secure Review
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pb-12 pt-5 sm:px-6 sm:pt-8">
        {/* Title */}
        <div className="mb-8 text-center text-white">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
            <GraduationCap size={31} />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            Parent Outpass Review
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-blue-100">
            Review your student's outpass request and record your decision
            securely.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
          {/* Loading */}
          {loading && (
            <div
              role="status"
              className="flex flex-col items-center px-6 py-20 text-center"
            >
              <Loader2 size={39} className="animate-spin text-blue-600" />
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Verifying approval link
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Please wait while we load the outpass details.
              </p>
            </div>
          )}

          {/* Successful decision */}
          {!loading && result && (
            <div className="px-6 py-16 text-center sm:px-10">
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${
                  result.decision === "APPROVED"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {result.decision === "APPROVED" ? (
                  <CheckCircle2 size={43} />
                ) : (
                  <XCircle size={43} />
                )}
              </div>

              <h3 className="mt-6 text-2xl font-extrabold text-slate-900">
                {result.decision === "APPROVED"
                  ? "Permission Granted"
                  : "Permission Declined"}
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
                {result.message}
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-2xl border border-blue-100 bg-blue-50 p-5 text-left">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={21}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />
                  <p className="text-sm leading-6 text-blue-900">
                    Your decision has been saved. The university will process
                    the request according to its approval rules. Parent
                    permission alone does not authorize campus exit.
                  </p>
                </div>
              </div>

              <p className="mt-7 text-xs text-slate-400">
                You may safely close this page.
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && !result && error && !outpass && (
            <div className="px-6 py-16 text-center sm:px-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-600">
                <AlertCircle size={39} />
              </div>

              <h3 className="mt-6 text-xl font-extrabold text-slate-900">
                Unable to Review Outpass
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
                {error}
              </p>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                If the link has expired or has already been used, please contact
                the university for assistance.
              </p>
            </div>
          )}

          {/* Review Card */}
          {!loading && !result && outpass && (
            <>
              <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-5 py-6 sm:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Student Outpass Request
                    </p>

                    <h3 className="mt-2 break-all text-xl font-extrabold text-slate-900">
                      {outpass.outpassId}
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                    <Clock3 size={15} />
                    Awaiting Parent Decision
                  </span>
                </div>
              </div>

              <div className="space-y-7 p-5 sm:p-8">
                {/* Student */}
                <div>
                  <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                    <UserRound size={19} className="text-blue-600" />
                    Student Information
                  </h4>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <DetailField
                      icon={UserRound}
                      label="Student Name"
                      value={outpass.studentName}
                    />

                    <DetailField
                      icon={GraduationCap}
                      label="Enrollment Number"
                      value={outpass.enrollmentNumber}
                    />
                  </div>
                </div>

                {/* Outpass */}
                <div>
                  <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                    <FileText size={19} className="text-blue-600" />
                    Outpass Information
                  </h4>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <DetailField
                      icon={CalendarDays}
                      label="Outpass Date"
                      value={formatDate(outpass.outDate)}
                    />

                    <DetailField
                      icon={Clock3}
                      label="Requested Out Time"
                      value={formatTime(outpass.outTime)}
                    />

                    <DetailField
                      icon={MapPin}
                      label="Destination"
                      value={outpass.destination}
                      full
                    />

                    <DetailField
                      icon={FileText}
                      label="Reason for Outpass"
                      value={outpass.reason}
                      full
                    />
                  </div>
                </div>

                {/* Parent decision */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={21}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <h4 className="font-bold text-slate-900">
                        Parent Consent
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Please verify all the details before approving or
                        rejecting this request. Your response will be recorded
                        by AMIOUT.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submission error */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Decision buttons */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setSelectedDecision("REJECTED");
                    }}
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    <XCircle size={20} />
                    Reject Request
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setSelectedDecision("APPROVED");
                    }}
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-green-700 disabled:opacity-50"
                  >
                    <CheckCircle2 size={20} />
                    Approve Request
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <p className="mt-7 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <LockKeyhole size={14} />
          AMIOUT · University Outpass Management System
        </p>
      </main>

      {/* Confirmation modal */}
      {!result && selectedDecision && outpass && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="parent-confirm-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                selectedDecision === "APPROVED"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {selectedDecision === "APPROVED" ? (
                <CheckCircle2 size={29} />
              ) : (
                <XCircle size={29} />
              )}
            </div>

            <h3
              id="parent-confirm-title"
              className="mt-5 text-xl font-extrabold text-slate-900"
            >
              {selectedDecision === "APPROVED"
                ? "Confirm Parent Approval"
                : "Confirm Parent Rejection"}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Are you sure you want to{" "}
              <strong>
                {selectedDecision === "APPROVED" ? "approve" : "reject"}
              </strong>{" "}
              the outpass request for <strong>{outpass.studentName}</strong>?
            </p>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              This approval link is single-use. Once your decision is recorded,
              it cannot be submitted again using the same link.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedDecision(null)}
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <ArrowLeft size={16} />
                Go Back
              </button>

              <button
                type="button"
                onClick={submitDecision}
                disabled={submitting}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition disabled:opacity-50 ${
                  selectedDecision === "APPROVED"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {submitting ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Check size={17} />
                )}

                {submitting ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentReview;
