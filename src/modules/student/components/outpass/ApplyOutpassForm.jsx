import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Info,
  MapPin,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  UserRoundCheck,
  QrCode,
  LogIn,
  LogOut,
  House,
  Check,
  LockKeyhole,
} from "lucide-react";

// ============================================================
// CONFIGURATION
// Keep limits aligned with backend outpassConstants.js
// ============================================================

const REASON_MIN = 10;
const REASON_MAX = 100;

const DESTINATION_MIN = 2;
const DESTINATION_MAX = 100;

// Testing only — production mein false rakho
const OUTPASS_TEST_MODE =
  import.meta.env.DEV && import.meta.env.VITE_OUTPASS_TEST_MODE === "true";

const START_MINUTES = OUTPASS_TEST_MODE ? 0 : 9 * 60 + 15;
const END_MINUTES = OUTPASS_TEST_MODE ? 24 * 60 : 17 * 60 + 15;
const SLOT_INTERVAL = 10;

// ============================================================
// TIME HELPERS
// ============================================================

const formatTime = (totalMinutes) => {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hours12 = hours24 % 12 || 12;
  const period = hours24 >= 12 ? "PM" : "AM";

  return (
    `${String(hours12).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")} ${period}`
  );
};

const TIME_SLOTS = Array.from(
  {
    length: Math.ceil((END_MINUTES - START_MINUTES) / SLOT_INTERVAL),
  },
  (_, index) => {
    const minutes = START_MINUTES + index * SLOT_INTERVAL;

    return {
      value: formatTime(minutes),
      minutes,
    };
  },
);

const getISTParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type) => parts.find((part) => part.type === type)?.value;

  return {
    dayKey: `${get("year")}-${get("month")}-${get("day")}`,
    minutes:
      Number(get("hour")) * 60 +
      Number(get("minute")) +
      Number(get("second")) / 60,
  };
};

const getDateObject = (dateString) => {
  if (
    typeof dateString !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    return null;
  }

  const date = new Date(`${dateString}T12:00:00+05:30`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (getISTParts(date).dayKey !== dateString) {
    return null;
  }

  return date;
};

const isSunday = (dateString) => {
  const date = getDateObject(dateString);

  return date ? date.getUTCDay() === 0 : false;
};

const formatDisplayDate = (dateString) => {
  const date = getDateObject(dateString);

  if (!date) return "Not selected";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

// ============================================================
// STYLES
// ============================================================

const inputClass =
  "w-full min-w-0 rounded-2xl border " +
  "border-slate-200 bg-slate-50/70 " +
  "px-4 py-3.5 text-sm text-slate-800 " +
  "outline-none transition-all duration-200 " +
  "placeholder:text-slate-400 " +
  "hover:border-slate-300 " +
  "focus:border-emerald-500 focus:bg-white " +
  "focus:ring-4 focus:ring-emerald-500/10 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const cardClass =
  "overflow-hidden rounded-[26px] border " +
  "border-slate-200/80 bg-white " +
  "shadow-[0_12px_45px_-20px_rgba(15,23,42,0.18)]";

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

const FieldLabel = ({ icon: Icon, title, required = true }) => (
  <div className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
    <Icon size={17} className="text-emerald-600" />

    <span>{title}</span>

    {required && <span className="text-rose-500">*</span>}

    {!required && (
      <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
        Optional
      </span>
    )}
  </div>
);

const SummaryItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3 border-b border-slate-100 py-3.5 last:border-0">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
      <Icon size={17} />
    </div>

    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-400">{label}</p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const ApplyOutpassForm = ({
  onSubmit,
  loading = false,
  defaultValues = {},
}) => {
  const todayIST = getISTParts().dayKey;

  const [formData, setFormData] = useState({
    reason: defaultValues.reason || "",
    destination: defaultValues.destination || "",
    outDate: defaultValues.outDate || todayIST,
    outTime: defaultValues.outTime || "",
    inTime: defaultValues.inTime || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const busy = loading || isSubmitting;

  // ==========================================================
  // LIVE CHARACTER STATUS
  // ==========================================================

  const reasonLength = formData.reason.trim().length;

  const reasonIsValid =
    reasonLength >= REASON_MIN && reasonLength <= REASON_MAX;

  // ==========================================================
  // OUT TIME OPTIONS
  // ==========================================================

  const availableOutSlots = useMemo(() => {
    const now = getISTParts();

    return TIME_SLOTS.filter((slot) => {
      if (formData.outDate !== now.dayKey) {
        return true;
      }

      return slot.minutes > now.minutes;
    });
  }, [formData.outDate, todayIST]);

  // ==========================================================
  // IN TIME OPTIONS
  // ==========================================================

  const availableInSlots = useMemo(() => {
    const outSlot = TIME_SLOTS.find((slot) => slot.value === formData.outTime);

    if (!outSlot) return [];

    return TIME_SLOTS.filter((slot) => slot.minutes > outSlot.minutes);
  }, [formData.outTime]);

  // ==========================================================
  // INPUT HANDLER
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "outDate") {
      if (value && !getDateObject(value)) {
        toast.error("Please select a valid date.");
        return;
      }

      if (value && value < getISTParts().dayKey) {
        toast.error("Outpass cannot be requested for a past date.");
        return;
      }

      if (value && isSunday(value)) {
        toast.error("Outpass is not allowed on Sunday.");
        return;
      }

      setFormData((previous) => ({
        ...previous,
        outDate: value,
        outTime: "",
        inTime: "",
      }));

      return;
    }

    if (name === "outTime") {
      setFormData((previous) => ({
        ...previous,
        outTime: value,
        inTime: "",
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // CUSTOM TOAST VALIDATION
  // ==========================================================

  const validateForm = () => {
    const reason = formData.reason.trim();
    const destination = formData.destination.trim();

    // ----------------------------
    // REASON
    // ----------------------------

    if (!reason) {
      toast.error("Please enter your reason for leaving.");
      return false;
    }

    if (reason.length < REASON_MIN) {
      toast.error(
        `Reason must be at least ${REASON_MIN} characters. You entered ${reason.length}.`,
      );
      return false;
    }

    if (reason.length > REASON_MAX) {
      toast.error(`Reason cannot exceed ${REASON_MAX} characters.`);
      return false;
    }

    // ----------------------------
    // DESTINATION
    // ----------------------------

    if (!destination) {
      toast.error("Please enter your destination.");
      return false;
    }

    if (destination.length < DESTINATION_MIN) {
      toast.error(
        `Destination must be at least ${DESTINATION_MIN} characters.`,
      );
      return false;
    }

    if (destination.length > DESTINATION_MAX) {
      toast.error(`Destination cannot exceed ${DESTINATION_MAX} characters.`);
      return false;
    }

    // ----------------------------
    // DATE
    // ----------------------------

    if (!formData.outDate) {
      toast.error("Please select an Out Date.");
      return false;
    }

    if (!getDateObject(formData.outDate)) {
      toast.error("Invalid Out Date selected.");
      return false;
    }

    const now = getISTParts();

    if (formData.outDate < now.dayKey) {
      toast.error("Outpass cannot be requested for a past date.");
      return false;
    }

    if (isSunday(formData.outDate)) {
      toast.error("Outpass is not allowed on Sunday.");
      return false;
    }

    // ----------------------------
    // OUT TIME
    // ----------------------------

    if (!formData.outTime) {
      toast.error("Please select an Out Time.");
      return false;
    }

    const outSlot = TIME_SLOTS.find((slot) => slot.value === formData.outTime);

    if (!outSlot) {
      toast.error("Invalid Out Time selected.");
      return false;
    }

    if (formData.outDate === now.dayKey && outSlot.minutes <= now.minutes) {
      toast.error(
        "Selected Out Time has already passed. Please choose a future slot.",
      );
      return false;
    }

    // ----------------------------
    // OPTIONAL IN TIME
    // ----------------------------

    if (formData.inTime) {
      const inSlot = TIME_SLOTS.find((slot) => slot.value === formData.inTime);

      if (!inSlot) {
        toast.error("Invalid Expected In Time selected.");
        return false;
      }

      if (inSlot.minutes <= outSlot.minutes) {
        toast.error("Expected In Time must be later than Out Time.");
        return false;
      }
    }

    return true;
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (busy) return;
    if (!validateForm()) return;

    const payload = {
      reason: formData.reason.trim(),
      destination: formData.destination.trim(),
      outDate: formData.outDate,
      outTime: formData.outTime,
      inTime: formData.inTime || null,
    };

    setIsSubmitting(true);

    try {
      await onSubmit(payload);

      // Keep form data if confirmation is cancelled.
      // Parent handles success and navigation.
    } catch (error) {
      console.error("Apply Outpass Error:", error);

      const serverErrors = error?.response?.data?.errors;

      const message =
        (Array.isArray(serverErrors) && serverErrors.join(", ")) ||
        error?.response?.data?.message ||
        error?.message ||
        "Unable to submit outpass.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================================
  // APPROVAL STEPS
  // ==========================================================

  const approvalSteps = [
    {
      icon: FileText,
      title: "Submit Request",
      description: "Your request is safely recorded.",
    },
    {
      icon: UserRoundCheck,
      title: "Parent Consent",
      description: "Parent reviews the secure SMS link.",
    },
    {
      icon: ShieldCheck,
      title: "Faculty Approval",
      description: "An authorized faculty reviews your request.",
    },
    {
      icon: QrCode,
      title: "QR Pass Generated",
      description: "Show your approved QR at the campus gate.",
    },
  ];

  const rules = [
    "QR gate access is valid from 09:15 AM until 05:15 PM IST.",
    "Out Time and In Time use 10-minute intervals.",
    "Expected In Time is optional for day scholars.",
    "Expected In Time must be later than Out Time.",
    "Maximum two approved outpasses per IST day.",
    "The second trip requires verified EXIT and ENTRY for the first.",
    "Sunday outpass applications are restricted.",
  ];

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/60 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* PREMIUM HEADER */}
        <div className="relative mb-7 overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 px-6 py-8 text-white shadow-xl sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-14 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-24 right-28 h-48 w-48 rounded-full bg-teal-300/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
              <Sparkles size={14} />
              AMIOUT · Smart Campus Mobility
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                  Apply for Outpass
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Request permission to leave campus. Your academic and parent
                  details are automatically verified from university records.
                </p>
              </div>

              <div className="hidden rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm md:block">
                <QrCode
                  size={44}
                  className="text-emerald-300"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                "No Profile Lock",
                "Automatic Mentor Assignment",
                "Secure QR Approval",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-slate-100"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          {/* LEFT FORM CARD */}
          <div className={cardClass}>
            <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <FileText size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Outpass Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter your travel details. Fields marked * are required.
                  </p>
                </div>
              </div>
            </div>

            {/* noValidate enables Toast-only validation */}
            <form
              noValidate
              onSubmit={handleSubmit}
              className="space-y-7 px-6 py-7 sm:px-8"
            >
              {/* REASON */}
              <div>
                <FieldLabel icon={FileText} title="Reason for Leaving" />

                <textarea
                  name="reason"
                  rows={4}
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Example: I need to visit the bank for urgent personal work..."
                  maxLength={REASON_MAX}
                  disabled={busy}
                  aria-label="Reason for Leaving"
                  className={`${inputClass} resize-none`}
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  {/* LIVE VALIDATION */}
                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium ${
                      reasonIsValid
                        ? "text-emerald-600"
                        : reasonLength > 0
                          ? "text-amber-600"
                          : "text-slate-500"
                    }`}
                  >
                    {reasonIsValid ? (
                      <>
                        <CheckCircle2 size={15} />
                        Valid reason
                      </>
                    ) : reasonLength > 0 ? (
                      <>
                        <AlertCircle size={15} />
                        {REASON_MIN - reasonLength} more characters needed
                      </>
                    ) : (
                      <>
                        <Info size={15} />
                        Minimum {REASON_MIN} characters
                      </>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      reasonIsValid
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {reasonLength}/{REASON_MAX}
                  </span>
                </div>

                {/* CHARACTER PROGRESS */}
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      reasonIsValid ? "bg-emerald-500" : "bg-amber-400"
                    }`}
                    style={{
                      width: `${(reasonLength / REASON_MAX) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* DESTINATION */}
              <div>
                <FieldLabel icon={MapPin} title="Destination" />

                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  maxLength={DESTINATION_MAX}
                  placeholder="Where are you going?"
                  disabled={busy}
                  aria-label="Destination"
                  className={inputClass}
                />
              </div>

              {/* DATE */}
              <div>
                <FieldLabel icon={CalendarDays} title="Out Date" />

                <input
                  type="date"
                  name="outDate"
                  value={formData.outDate}
                  min={todayIST}
                  onChange={handleChange}
                  disabled={busy}
                  aria-label="Out Date"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-slate-500">
                  Select today or a future working day. Sunday is restricted.
                </p>
              </div>

              {/* TIME SECTION */}
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-white p-4 sm:p-5">
                <div className="mb-5 flex items-center gap-2">
                  <Clock3 size={19} className="text-emerald-700" />

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Select Your Travel Timing
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      10-minute slots · Indian Standard Time
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* OUT TIME */}
                  <div>
                    <FieldLabel icon={LogOut} title="Out Time" />

                    <select
                      name="outTime"
                      value={formData.outTime}
                      onChange={handleChange}
                      disabled={busy || !formData.outDate}
                      aria-label="Out Time"
                      className={inputClass}
                    >
                      <option value="">Select Out Time</option>

                      {availableOutSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.value}
                        </option>
                      ))}
                    </select>

                    <p className="mt-2 text-xs text-slate-500">
                      Planned campus departure
                    </p>
                  </div>

                  {/* IN TIME */}
                  <div>
                    <FieldLabel
                      icon={LogIn}
                      title="Expected In Time"
                      required={false}
                    />

                    <select
                      name="inTime"
                      value={formData.inTime}
                      onChange={handleChange}
                      disabled={busy || !formData.outTime}
                      aria-label="Expected In Time"
                      className={inputClass}
                    >
                      <option value="">No planned return</option>

                      {availableInSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.value}
                        </option>
                      ))}
                    </select>

                    <p className="mt-2 text-xs text-slate-500">
                      Optional · Must be after Out Time
                    </p>
                  </div>
                </div>

                {/* SELECTED TIMING */}
                {formData.outTime && (
                  <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-xs font-semibold text-slate-700">
                    <LogOut size={15} className="text-emerald-600" />

                    {formData.outTime}

                    <ArrowRight size={15} className="text-slate-400" />

                    {formData.inTime || "No planned return"}
                  </div>
                )}
              </div>

              {/* RETURN INFORMATION */}
              <div className="flex gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
                <House size={21} className="mt-0.5 shrink-0 text-sky-700" />

                <div>
                  <p className="text-sm font-semibold text-sky-900">
                    Going home?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-sky-800">
                    Leave Expected In Time blank if you are not planning to
                    return to campus today. Same-day return is not compulsory
                    for day scholars.
                  </p>
                </div>
              </div>

              {/* AUTOMATIC VERIFICATION */}
              <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <LockKeyhole
                  size={21}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />

                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    Secure automatic verification
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-800/80">
                    Student identity, parent mobile number and mentor mapping
                    are retrieved from university records. No manual profile
                    completion is required.
                  </p>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={busy}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {busy ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    Submit Outpass Request
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-slate-400">
                A QR pass is issued only after parent consent and authorized
                faculty approval.
              </p>
            </form>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5">
            {/* LIVE SUMMARY */}
            <div className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 size={19} className="text-emerald-600" />

                <h3 className="font-bold text-slate-900">Request Summary</h3>
              </div>

              <div className="space-y-0">
                <SummaryItem
                  icon={CalendarDays}
                  label="Travel Date"
                  value={formatDisplayDate(formData.outDate)}
                />

                <SummaryItem
                  icon={LogOut}
                  label="Out Time"
                  value={formData.outTime || "Not selected"}
                />

                <SummaryItem
                  icon={LogIn}
                  label="Expected In Time"
                  value={formData.inTime || "No planned return"}
                />

                <SummaryItem
                  icon={MapPin}
                  label="Destination"
                  value={formData.destination.trim() || "Not entered"}
                />
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs text-slate-400">Request Status</p>

                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Pending on submission
                </span>
              </div>
            </div>

            {/* APPROVAL FLOW */}
            <div className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm">
              <h3 className="mb-5 font-bold text-slate-900">
                How Approval Works
              </h3>

              <div className="space-y-5">
                {approvalSteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <div key={step.title} className="flex gap-3">
                      <div className="flex shrink-0 flex-col items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                          <Icon size={18} />
                        </div>

                        {index < approvalSteps.length - 1 && (
                          <div className="mt-2 h-7 w-px bg-slate-200" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {step.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RULES */}
            <div className="rounded-[26px] border border-amber-200 bg-amber-50/70 p-6">
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle size={19} className="text-amber-700" />

                <h3 className="font-bold text-amber-900">Important Rules</h3>
              </div>

              <ul className="space-y-3 text-sm leading-6 text-amber-900/85">
                {rules.map((rule) => (
                  <li key={rule} className="flex gap-2">
                    <Info size={15} className="mt-1 shrink-0" />

                    <span>{rule}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-2 border-t border-amber-200 pt-4 text-xs font-semibold text-amber-800">
                <Check size={16} />
                University outpass policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyOutpassForm;
