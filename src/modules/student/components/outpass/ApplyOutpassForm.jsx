import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Home,
  Info,
  LockKeyhole,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";

// University gate window in IST.
// Exit selections must leave time for security to scan before 17:15.
const FIRST_MINUTE = 9 * 60 + 15;
const GATE_CUTOFF_MINUTE = 17 * 60 + 15;
const INTERVAL_MINUTE = 10;
const LAST_EXIT_MINUTE = GATE_CUTOFF_MINUTE - INTERVAL_MINUTE; // 17:05

const toTimeLabel = (minuteOfDay) => {
  const hour = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  return `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
};

const makeTimeSlots = (lastMinute) =>
  Array.from(
    { length: Math.floor((lastMinute - FIRST_MINUTE) / INTERVAL_MINUTE) + 1 },
    (_, index) => {
      const minutes = FIRST_MINUTE + index * INTERVAL_MINUTE;
      return {
        value: toTimeLabel(minutes),
        label: toTimeLabel(minutes),
        minutes,
      };
    },
  );

// Backend OUT_TIME_SLOTS ke saath exact match
const EXIT_SLOTS = makeTimeSlots(LAST_EXIT_MINUTE);
const RETURN_SLOTS = makeTimeSlots(LAST_EXIT_MINUTE);

const getISTPart = (date, part) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return parts.find((item) => item.type === part)?.value || "00";
};

const getTodayIST = () => {
  const now = new Date();
  return `${getISTPart(now, "year")}-${getISTPart(now, "month")}-${getISTPart(now, "day")}`;
};

const getMinutesIST = () => {
  const now = new Date();
  return (
    Number(getISTPart(now, "hour")) * 60 + Number(getISTPart(now, "minute"))
  );
};

const isSunday = (isoDay) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDay || "")) return false;
  const date = new Date(`${isoDay}T12:00:00+05:30`);
  return !Number.isNaN(date.getTime()) && date.getUTCDay() === 0;
};

const formatDate = (isoDay) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDay || "")) return "Not selected";
  const date = new Date(`${isoDay}T12:00:00+05:30`);
  if (Number.isNaN(date.getTime())) return "Not selected";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short",
  }).format(date);
};

const inputClass =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

const FieldLabel = ({ icon: Icon, htmlFor, children, optional = false }) => (
  <label
    htmlFor={htmlFor}
    className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-800"
  >
    <Icon size={16} className="shrink-0 text-emerald-600" />
    <span>{children}</span>
    {optional ? (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
        Optional
      </span>
    ) : (
      <span className="text-rose-500" aria-label="required">
        *
      </span>
    )}
  </label>
);

const SummaryItem = ({ icon: Icon, title, value }) => (
  <div className="flex min-w-0 items-start gap-3 py-3">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
      <Icon size={17} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-medium text-slate-500">{title}</p>
      <p className="mt-0.5 min-w-0 break-words text-sm font-semibold text-slate-800 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  </div>
);

const ApplyOutpassForm = ({
  onSubmit,
  loading = false,
  defaultValues = {},
}) => {
  const [todayIST, setTodayIST] = useState(getTodayIST);
  const [currentMinuteIST, setCurrentMinuteIST] = useState(getMinutesIST);
  const [formData, setFormData] = useState(() => ({
    reason: defaultValues.reason || "",
    destination: defaultValues.destination || "",
    outDate: defaultValues.outDate || getTodayIST(),
    outTime: defaultValues.outTime || "",
    inTime: defaultValues.inTime || "",
  }));
  const [submitting, setSubmitting] = useState(false);
  const busy = loading || submitting;
  const isToday = formData.outDate === todayIST;

  // Refresh current IST time while page stays open; no stale past slots.
  useEffect(() => {
    const updateClock = () => {
      setTodayIST(getTodayIST());
      setCurrentMinuteIST(getMinutesIST());
    };
    const clockId = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(clockId);
  }, []);

  const exitChoices = useMemo(() => {
    return EXIT_SLOTS.filter(
      (slot) => !isToday || slot.minutes > currentMinuteIST,
    );
  }, [isToday, currentMinuteIST]);

  const returnChoices = useMemo(() => {
    const selectedMinutes = EXIT_SLOTS.find(
      (slot) => slot.value === formData.outTime,
    )?.minutes;
    return RETURN_SLOTS.filter(
      (slot) =>
        (!isToday || slot.minutes > currentMinuteIST) &&
        (selectedMinutes === undefined || slot.minutes > selectedMinutes),
    );
  }, [formData.outTime, isToday, currentMinuteIST]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "outDate") {
      if (value && value < getTodayIST()) {
        toast.error("Past dates are not allowed.");
        return;
      }
      if (isSunday(value)) {
        toast.error("Outpass applications are not allowed on Sunday.");
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
      // An earlier planned return is no longer valid after changing the exit time.
      setFormData((previous) => ({ ...previous, outTime: value, inTime: "" }));
      return;
    }
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const validate = () => {
    const reason = formData.reason.trim();
    const destination = formData.destination.trim();
    if (reason.length < 10 || reason.length > 100) {
      toast.error("Reason must contain 10 to 100 characters.");
      return false;
    }
    if (destination.length < 2 || destination.length > 100) {
      toast.error("Destination must contain 2 to 100 characters.");
      return false;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.outDate || "")) {
      toast.error("Please select an outpass date.");
      return false;
    }
    if (formData.outDate < getTodayIST() || isSunday(formData.outDate)) {
      toast.error("Choose today or a future working day (not Sunday).");
      return false;
    }
    const exit = EXIT_SLOTS.find((slot) => slot.value === formData.outTime);
    if (!exit) {
      toast.error("Choose an Out Time between 9:15 AM and 5:05 PM.");
      return false;
    }
    if (formData.outDate === getTodayIST() && exit.minutes <= getMinutesIST()) {
      toast.error(
        "Selected Out Time has already passed. Choose a later time or date.",
      );
      return false;
    }
    if (formData.inTime) {
      const plannedReturn = RETURN_SLOTS.find(
        (slot) => slot.value === formData.inTime,
      );
      if (!plannedReturn || plannedReturn.minutes <= exit.minutes) {
        toast.error(
          "Expected In Time must be after Out Time and no later than 5:05 PM.",
        );
        return false;
      }
      if (
        formData.outDate === getTodayIST() &&
        plannedReturn.minutes <= getMinutesIST()
      ) {
        toast.error("Expected In Time has already passed.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy || !validate()) return;
    const payload = {
      reason: formData.reason.trim(),
      destination: formData.destination.trim(),
      outDate: formData.outDate,
      outTime: formData.outTime,
      ...(formData.inTime ? { inTime: formData.inTime } : {}),
    };
    setSubmitting(true);
    try {
      // Parent page manages its existing SweetAlert confirmation, API and navigation.
      await onSubmit(payload);
    } catch (error) {
      console.error("Apply Outpass form error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to submit outpass.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-w-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 px-3 py-4 sm:px-5 sm:py-6">
      <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-5">
        {/* Compact premium header replaces tall empty hero. */}
        <header className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-5 py-5 text-white shadow-lg sm:px-7 sm:py-6">
          <span className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative flex min-w-0 flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-emerald-100">
                <Sparkles size={13} /> AMIOUT · Student Portal
              </span>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-[29px]">
                Apply for Outpass
              </h1>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-300 sm:text-sm">
                Request campus exit permission. University records automatically
                verify your identity and faculty mapping.
              </p>
            </div>
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300 sm:flex">
              <QrCode size={28} />
            </div>
          </div>
        </header>

        <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(270px,0.85fr)] lg:gap-5">
          <form
            onSubmit={handleSubmit}
            className="min-w-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex min-w-0 items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <FileText size={20} />
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900">
                  Outpass Details
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in the required fields marked with *.
                </p>
              </div>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="min-w-0">
                <FieldLabel icon={FileText} htmlFor="outpass-reason">
                  Reason for Leaving
                </FieldLabel>
                <textarea
                  id="outpass-reason"
                  name="reason"
                  rows={3}
                  minLength={10}
                  maxLength={100}
                  disabled={busy}
                  required
                  placeholder="Example: I need to visit the bank for urgent personal work..."
                  value={formData.reason}
                  onChange={handleChange}
                  className={`${inputClass} min-h-[94px] resize-y whitespace-pre-wrap break-words [overflow-wrap:anywhere]`}
                />
                <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                  <span>Minimum 10 characters</span>
                  <span className="tabular-nums">
                    {formData.reason.length}/100
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <FieldLabel icon={MapPin} htmlFor="outpass-destination">
                  Destination
                </FieldLabel>
                <input
                  id="outpass-destination"
                  type="text"
                  name="destination"
                  minLength={2}
                  maxLength={100}
                  required
                  disabled={busy}
                  placeholder="Where are you going?"
                  value={formData.destination}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <FieldLabel icon={CalendarDays} htmlFor="outpass-date">
                    Out Date
                  </FieldLabel>
                  <input
                    id="outpass-date"
                    name="outDate"
                    type="date"
                    min={todayIST}
                    required
                    disabled={busy}
                    value={formData.outDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Sunday applications are restricted.
                  </p>
                </div>
                <div className="min-w-0">
                  <FieldLabel icon={Clock3} htmlFor="outpass-time">
                    Out Time
                  </FieldLabel>
                  <div className="relative min-w-0">
                    <select
                      id="outpass-time"
                      name="outTime"
                      required
                      disabled={busy || exitChoices.length === 0}
                      value={formData.outTime}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="">
                        {exitChoices.length
                          ? "Select Out Time"
                          : "No slots left today"}
                      </option>
                      {exitChoices.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    9:15 AM – 5:05 PM · 10-minute intervals
                  </p>
                </div>
              </div>

              <div className="min-w-0 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3">
                <div className="min-w-0">
                  <FieldLabel icon={Clock3} htmlFor="outpass-in-time" optional>
                    Expected In Time
                  </FieldLabel>
                  <div className="relative min-w-0">
                    <select
                      id="outpass-in-time"
                      name="inTime"
                      disabled={busy || !formData.outTime}
                      value={formData.inTime}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="">No planned return (optional)</option>
                      {returnChoices.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-600">
                    Must be after Out Time. Latest option: 5:15 PM IST. Leave
                    blank if you are going home.
                  </p>
                </div>
              </div>

              {exitChoices.length === 0 && isToday && (
                <p
                  className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800"
                  role="status"
                >
                  <Info size={16} className="mt-0.5 shrink-0" /> Today's allowed
                  departure times have passed. Select a future working date.
                </p>
              )}

              <div className="flex min-w-0 items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-3 text-xs leading-5 text-emerald-800">
                <LockKeyhole size={16} className="mt-0.5 shrink-0" />
                <span>
                  Student identity, parent contact and mentor mapping are
                  checked from university records. No manual profile completion
                  required.
                </span>
              </div>

              <button
                type="submit"
                disabled={busy || exitChoices.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/15 transition hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Submitting Request..." : "Submit Outpass Request"}
                {!busy && <ArrowRight size={17} />}
              </button>
              <p className="text-center text-[11px] leading-5 text-slate-500">
                Final QR pass is issued only after parent consent and authorized
                faculty approval.
              </p>
            </div>
          </form>

          <aside className="min-w-0 space-y-4">
            <section className="min-w-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                <CheckCircle2 size={19} className="text-emerald-600" />
                <h2 className="font-bold text-slate-900">Request Summary</h2>
              </div>
              <div className="divide-y divide-slate-100 px-5">
                <SummaryItem
                  icon={CalendarDays}
                  title="Travel Date"
                  value={formatDate(formData.outDate)}
                />
                <SummaryItem
                  icon={Clock3}
                  title="Out Time"
                  value={formData.outTime || "Not selected"}
                />
                <SummaryItem
                  icon={Home}
                  title="Expected In Time"
                  value={formData.inTime || "No planned return"}
                />
                <SummaryItem
                  icon={MapPin}
                  title="Destination"
                  value={formData.destination.trim() || "Not entered"}
                />
              </div>
              <div className="border-t border-slate-100 px-5 py-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
                  Pending submission
                </span>
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                <h2 className="font-bold text-slate-900">How Approval Works</h2>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs leading-6 text-slate-600">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1">
                  <FileText size={13} /> Submit
                </span>
                <ArrowRight size={13} className="text-slate-400" />
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1">
                  <UserRoundCheck size={13} /> Parent
                </span>
                <ArrowRight size={13} className="text-slate-400" />
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1">
                  <ShieldCheck size={13} /> Faculty
                </span>
                <ArrowRight size={13} className="text-slate-400" />
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1">
                  <QrCode size={13} /> QR
                </span>
              </div>
            </section>

            <details className="group overflow-hidden rounded-[24px] border border-amber-200 bg-amber-50/65 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-bold text-amber-900 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <Info size={18} /> Important Rules
                </span>
                <ChevronDown
                  size={17}
                  className="transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="space-y-2 border-t border-amber-200/60 px-5 py-4 text-xs leading-5 text-amber-900/85">
                <p>Gate QR validity: 9:15 AM – 5:15 PM IST.</p>
                <p>
                  Exit time slots end at 5:05 PM; planned return cannot exceed
                  5:15 PM.
                </p>
                <p>Maximum two approved outpasses per IST day.</p>
                <p>
                  Second trip requires completed EXIT and ENTRY for the first.
                </p>
                <p>Same-day return is optional for day scholars.</p>
                <p>Sunday outpass applications are restricted.</p>
              </div>
            </details>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ApplyOutpassForm;
