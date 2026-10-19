import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  Send,
  X,
} from "lucide-react";

import ApplyOutpassForm from "../components/outpass/ApplyOutpassForm";
import useOutpass from "../hooks/useOutpass";

// ============================================================
// AMIOUT ENTERPRISE - APPLY OUTPASS
//
// - react-hot-toast for success/error
// - Daily limit message
// - Modern confirmation modal
// - Existing backend submit logic preserved
// ============================================================

const LIMIT_MESSAGE =
  "You have already reached your daily outpass limit of 2 approved outpasses. Please apply again tomorrow.";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.data?.message ||
  error?.message ||
  "Unable to apply for an outpass. Please try again.";

const isDailyLimitError = (error, message) => {
  const code = String(
    error?.response?.data?.code || error?.code || "",
  ).toUpperCase();

  if (
    [
      "DAILY_LIMIT_REACHED",
      "OUTPASS_LIMIT_REACHED",
      "DAILY_OUTPASS_LIMIT_EXCEEDED",
    ].includes(code)
  ) {
    return true;
  }

  const text = String(message || "").toLowerCase();

  return (
    /(?:daily|today|per day|per calendar day).*(?:limit|quota|2 approved|two approved)/i.test(
      text,
    ) ||
    /(?:limit|quota).*(?:daily|today|2 approved|two approved)/i.test(text) ||
    /already reached.*outpass limit/i.test(text) ||
    /maximum (?:of )?2 approved outpass/i.test(text)
  );
};

const ApplyOutpass = () => {
  const navigate = useNavigate();

  const { loading, submitOutpass } = useOutpass();

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const submittingRef = useRef(false);

  // ==========================================================
  // TODAY'S DATE - IST
  // ==========================================================

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  // ==========================================================
  // OPEN CONFIRMATION
  // ==========================================================

  const handleSubmit = (payload) => {
    if (loading || submittingRef.current) return;

    setPendingPayload(payload);
    setShowConfirm(true);
  };

  // ==========================================================
  // CANCEL CONFIRMATION
  // ==========================================================

  const closeConfirmation = () => {
    if (submitting || loading) return;

    setShowConfirm(false);
    setPendingPayload(null);
  };

  // ==========================================================
  // CONFIRM AND SUBMIT OUTPASS
  // ==========================================================

  const confirmSubmit = async () => {
    if (!pendingPayload || submittingRef.current || loading) {
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);

    try {
      // Existing useOutpass hook
      const result = await submitOutpass(pendingPayload);

      // Handle hooks that return failed API responses
      // instead of throwing errors.
      if (
        result === false ||
        result?.success === false ||
        result?.data?.success === false
      ) {
        const failure = result?.data || result || {};

        const error = new Error(
          failure.message || "Outpass application failed.",
        );

        error.response = {
          data: failure,
        };

        throw error;
      }

      setShowConfirm(false);
      setPendingPayload(null);

      toast.success("Your outpass request has been submitted successfully!", {
        duration: 1500,
        icon: "✅",
      });

      navigate("/student/outpass/history", {
        replace: true,
      });
    } catch (error) {
      const message = getErrorMessage(error);

      if (isDailyLimitError(error, message)) {
        toast.error(LIMIT_MESSAGE, {
          duration: 4000,
          icon: "🚫",
          id: "daily-outpass-limit",
        });

        setShowConfirm(false);
        setPendingPayload(null);
      } else {
        toast.error(message, {
          duration: 2500,
        });

        // Close modal so student can correct
        // any invalid form details.
        setShowConfirm(false);
        setPendingPayload(null);
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <ApplyOutpassForm
        loading={loading || submitting}
        onSubmit={handleSubmit}
        defaultValues={{
          outDate: today,
        }}
      />

      {/* ================================================
          CONFIRMATION MODAL
      ================================================= */}

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-outpass-title"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-slate-100 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ClipboardCheck size={25} />
                </div>

                <div>
                  <h2
                    id="confirm-outpass-title"
                    className="text-xl font-bold text-slate-900"
                  >
                    Submit Outpass?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Please verify your request details before submitting.
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close confirmation"
                onClick={closeConfirmation}
                disabled={submitting || loading}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="space-y-4 p-6">
              <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <p className="text-sm leading-6 text-emerald-900">
                  Your outpass will be sent for authorization according to the
                  existing AMIOUT approval workflow.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <p className="text-xs leading-6 text-amber-900">
                  Maximum 2 approved outpasses are allowed per IST calendar day.
                  A new approved trip requires completion of the previous EXIT
                  and ENTRY cycle.
                </p>
              </div>

              {/* MODAL ACTIONS */}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={closeConfirmation}
                  disabled={submitting || loading}
                  className="flex-1 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Review Details
                </button>

                <button
                  type="button"
                  onClick={confirmSubmit}
                  disabled={submitting || loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting || loading ? (
                    <Loader2 size={19} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}

                  {submitting || loading ? "Submitting..." : "Yes, Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplyOutpass;
