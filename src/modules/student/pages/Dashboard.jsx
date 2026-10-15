import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCircle,
  XCircle,
  LogOut,
  LogIn,
  MapPin,
  ChevronRight,
  ClipboardList,
  Timer,
} from "lucide-react";

import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

// Keep existing response format and API endpoints unchanged.
const unwrap = (response) => {
  const body = response?.data;
  return body?.data ?? body ?? {};
};

const safeNumber = (value) =>
  Number.isFinite(Number(value)) ? Number(value) : 0;

const display = (value, fallback = "N/A") =>
  value !== null && value !== undefined && String(value).trim()
    ? String(value)
    : fallback;

const formatDate = (value) => {
  if (!value) return "N/A";

  // A date-only value is a calendar day, not a UTC timestamp.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return "N/A";
    }
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "UTC",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTime = (value, fallback = "N/A") => {
  if (value === null || value === undefined || !String(value).trim()) {
    return fallback;
  }

  const raw = String(value).trim();

  // Already formatted as 04:05 PM.
  if (/^\d{1,2}:\d{2}(?::\d{2})?\s*(AM|PM)$/i.test(raw)) {
    return raw.toUpperCase().replace(/\s*(AM|PM)$/i, " $1");
  }

  // Backend can send HH:mm or HH:mm:ss without a date.
  const clock = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (clock) {
    const hour = Number(clock[1]);
    const minute = Number(clock[2]);
    if (hour > 23 || minute > 59) return fallback;
    return `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
  }

  // Only parse complete ISO-style date-times as timestamps.
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) {
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return fallback;
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  return raw; // Keep unknown but meaningful backend values visible.
};

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getApiError = (error, fallback) =>
  error?.response?.data?.message ||
  (Array.isArray(error?.response?.data?.errors)
    ? error.response.data.errors.join(", ")
    : "") ||
  error?.message ||
  fallback;

const STAT_THEMES = {
  blue: {
    icon: "bg-blue-50 text-blue-600 ring-blue-100",
    line: "bg-blue-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 ring-amber-100",
    line: "bg-amber-500",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    line: "bg-emerald-500",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600 ring-rose-100",
    line: "bg-rose-500",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 ring-violet-100",
    line: "bg-violet-500",
  },
  teal: {
    icon: "bg-teal-50 text-teal-600 ring-teal-100",
    line: "bg-teal-500",
  },
};

const StatCard = ({ title, value, icon: Icon, tone = "emerald" }) => {
  const theme = STAT_THEMES[tone] || STAT_THEMES.emerald;
  return (
    <div className="group relative min-w-0 overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_5px_20px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_16px_35px_rgba(15,23,42,0.09)] sm:p-5">
      <div
        className={`absolute left-0 top-5 h-10 w-1 rounded-r-full ${theme.line}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 sm:text-sm">
            {title}
          </p>
          <p className="mt-3 text-[28px] font-extrabold leading-none tracking-tight text-slate-900 sm:text-[32px]">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${theme.icon} sm:h-12 sm:w-12`}
        >
          <Icon size={22} strokeWidth={2} />
        </div>
      </div>
      <div className="mt-5 h-px w-full bg-gradient-to-r from-slate-100 via-slate-100 to-transparent" />
      <p className="mt-3 text-[11px] font-medium text-slate-400">
        Outpass activity
      </p>
    </div>
  );
};

const ActionCard = ({ title, description, icon: Icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex min-w-0 w-full items-center gap-3.5 rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_4px_16px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:p-5"
  >
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
      <Icon size={21} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
    <ChevronRight
      size={18}
      className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600"
    />
  </button>
);

const SectionCard = ({ title, subtitle, children, icon: Icon, extra }) => (
  <section className="min-w-0 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.04)]">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          {Icon && <Icon size={21} />}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {extra}
    </div>
    <div className="min-w-0 p-4 sm:p-6">{children}</div>
  </section>
);

const Detail = ({ label, value, icon: Icon, wide = false }) => (
  <div
    className={`min-w-0 rounded-2xl border border-slate-200/70 bg-white/90 p-3.5 sm:p-4 ${wide ? "sm:col-span-2" : ""}`}
  >
    <div className="flex items-center gap-2 text-slate-500">
      {Icon && <Icon size={15} className="shrink-0 text-emerald-600" />}
      <p className="text-xs font-semibold">{label}</p>
    </div>
    <p
      className="mt-2 max-w-full whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-800 sm:text-[15px]"
      style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
    >
      {display(value)}
    </p>
  </div>
);

const StatusPill = ({ value }) => {
  const status = display(value, "PENDING").toUpperCase();
  const style =
    status === "APPROVED" || status === "RETURNED" || status === "COMPLETED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "REJECTED" || status === "CANCELLED" || status === "EXPIRED"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : status === "EXITED"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-extrabold tracking-wide ${style}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      <span className="truncate">{status.replace(/_/g, " ")}</span>
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);
    setError("");

    try {
      const [dashboardResult, profileResult] = await Promise.allSettled([
        api.get("/student/dashboard"),
        api.get("/student/profile"),
      ]);

      if (dashboardResult.status === "fulfilled") {
        const body = dashboardResult.value.data;
        if (body?.success === false) {
          setError(body.message || "Unable to load dashboard data.");
        } else {
          setDashboard(unwrap(dashboardResult.value));
        }
      } else {
        console.error("Student Dashboard API Error:", dashboardResult.reason);
        setError(
          getApiError(dashboardResult.reason, "Unable to load dashboard data."),
        );
      }

      if (profileResult.status === "fulfilled") {
        const body = profileResult.value.data;
        if (body?.success !== false) setProfile(unwrap(profileResult.value));
      } else {
        console.warn("Student Profile API Error:", profileResult.reason);
      }
    } catch (requestError) {
      console.error("Student Dashboard Error:", requestError);
      setError(getApiError(requestError, "Unable to load dashboard."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const student = profile?.student || {};
  const studentName = display(student.name || user?.name, "Student");
  const enrollment = display(
    student.enrollmentNumber || user?.enrollmentNo || user?.enrollmentNumber,
  );
  const statistics = dashboard?.statistics || null;
  const recentActivities = Array.isArray(dashboard?.recentActivities)
    ? dashboard.recentActivities
    : [];
  const currentOutpass = dashboard?.currentOutpass || null;
  const currentOutpassIdentifier =
    currentOutpass?._id || currentOutpass?.outpassId;

  const stats = [
    {
      title: "Total Requests",
      value: statistics ? safeNumber(statistics.totalRequests) : "—",
      icon: FileText,
      tone: "blue",
    },
    {
      title: "Pending",
      value: statistics ? safeNumber(statistics.pendingRequests) : "—",
      icon: Clock3,
      tone: "amber",
    },
    {
      title: "Approved",
      value: statistics ? safeNumber(statistics.approvedRequests) : "—",
      icon: CheckCircle2,
      tone: "emerald",
    },
    {
      title: "Rejected",
      value: statistics ? safeNumber(statistics.rejectedRequests) : "—",
      icon: XCircle,
      tone: "rose",
    },
    {
      title: "Exited",
      value: statistics ? safeNumber(statistics.exitedRequests) : "—",
      icon: LogOut,
      tone: "violet",
    },
    {
      title: "Returned",
      value: statistics ? safeNumber(statistics.returnedRequests) : "—",
      icon: LogIn,
      tone: "teal",
    },
  ];

  return (
    <div className="min-h-screen min-w-0 bg-[#f5f8fc] pb-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-6 px-3 pt-3 sm:gap-7 sm:px-5 sm:pt-5 lg:px-7 lg:pt-7">
        {/* Premium hero */}
        <div className="relative isolate min-w-0 overflow-hidden rounded-[26px] bg-[#071529] px-5 py-7 text-white shadow-[0_18px_38px_rgba(5,18,39,0.15)] sm:rounded-[30px] sm:px-8 sm:py-9 lg:px-10">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-160px] left-1/3 h-64 w-96 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="pointer-events-none absolute right-14 top-10 hidden h-40 w-40 rounded-full border border-white/10 lg:block" />
          <div className="pointer-events-none absolute right-20 top-16 hidden h-28 w-28 rounded-full border border-white/10 lg:block" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="min-w-0 flex-1">
              <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-bold tracking-wide text-emerald-200 sm:text-xs">
                <Sparkles size={14} className="shrink-0" />
                AMIOUT <span className="text-emerald-300/40">/</span> STUDENT
                PORTAL
              </div>
              <h1 className="max-w-3xl text-[25px] font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-[35px]">
                Welcome back,{" "}
                <span
                  className="text-emerald-300"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {studentName}
                </span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-[15px]">
                Your campus outpass, approvals and gate movement — everything in
                one place.
              </p>
              <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200 sm:px-4">
                <UserCircle size={16} className="shrink-0 text-emerald-300" />
                <span className="min-w-0 break-all">
                  Enrollment: {enrollment}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => fetchDashboard(false)}
                disabled={loading || refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
              <div className="hidden h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-200 sm:flex">
                <QrCode size={34} />
              </div>
            </div>
          </div>
        </div>

        {/* Non-blocking API error */}
        {error && (
          <div
            role="alert"
            className="flex flex-col items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:p-5"
          >
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <AlertTriangle
                size={21}
                className="mt-0.5 shrink-0 text-rose-600"
              />
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-rose-900">
                  Dashboard data could not be fully loaded
                </p>
                <p
                  className="mt-1 text-sm text-rose-700"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {error}
                </p>
                <p className="mt-1.5 text-xs text-rose-600">
                  You can still access Apply Outpass, History and My Profile.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fetchDashboard(false)}
              disabled={refreshing}
              className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-50"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Overview */}
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                Overview
              </p>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Your outpass at a glance
              </h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500">
              Live account overview
            </span>
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-36 animate-pulse rounded-[22px] bg-slate-200/70"
                  />
                ))
              : stats.map((item) => <StatCard key={item.title} {...item} />)}
          </div>
        </section>

        {/* Quick actions */}
        <section className="min-w-0">
          <div className="mb-4">
            <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              Shortcuts
            </p>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Quick actions
            </h2>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ActionCard
              icon={Plus}
              title="Apply Outpass"
              description="Submit a new request"
              onClick={() => navigate("/student/apply-outpass")}
            />
            <ActionCard
              icon={FileText}
              title="Outpass History"
              description="Track all your requests"
              onClick={() => navigate("/student/history")}
            />
            <ActionCard
              icon={UserCircle}
              title="My Profile"
              description="View verified academic details"
              onClick={() => navigate("/student/profile")}
            />
            <ActionCard
              icon={Bell}
              title="Notifications"
              description="View important updates"
              onClick={() => navigate("/student/notifications")}
            />
          </div>
        </section>

        {/* Current outpass */}
        <SectionCard
          title="Current Outpass"
          subtitle="Your most recent active request and its approval details"
          icon={ShieldCheck}
        >
          {loading ? (
            <div className="h-56 animate-pulse rounded-2xl bg-slate-100" />
          ) : currentOutpass ? (
            <div className="min-w-0 overflow-hidden rounded-[22px] border border-emerald-100 bg-gradient-to-br from-emerald-50/75 via-white to-slate-50 p-3.5 sm:p-5">
              <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 rounded-2xl border border-white bg-white/90 p-3.5 sm:p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ClipboardList size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Outpass reference
                    </p>
                    <h3
                      className="mt-1 text-sm font-extrabold text-slate-900 sm:text-base"
                      style={{ overflowWrap: "anywhere" }}
                    >
                      {display(currentOutpass.outpassId, "Current Request")}
                    </h3>
                  </div>
                </div>
                <StatusPill value={currentOutpass.status} />
              </div>

              <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                <Detail
                  label="Destination"
                  icon={MapPin}
                  value={currentOutpass.destination}
                  wide
                />
                <Detail
                  label="Reason"
                  icon={FileText}
                  value={currentOutpass.reason}
                  wide
                />
                <Detail
                  label="Out Date"
                  icon={CalendarDays}
                  value={formatDate(currentOutpass.outDate)}
                />
                <Detail
                  label="Out Time"
                  icon={Clock3}
                  value={formatTime(currentOutpass.outTime)}
                />
                <Detail
                  label="Expected In Time"
                  icon={Timer}
                  value={formatTime(currentOutpass.inTime, "No planned return")}
                />
                <Detail
                  label="Parent Approval"
                  icon={ShieldCheck}
                  value={display(
                    currentOutpass.parentDecision?.status,
                    "Pending",
                  ).replace(/_/g, " ")}
                />
              </div>

              <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <p className="text-xs leading-5 text-slate-500">
                  Outpass details update as your request progresses.
                </p>
                {currentOutpassIdentifier && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/student/outpass/${currentOutpassIdentifier}`)
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(5,150,105,0.16)] transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:w-auto"
                  >
                    View Outpass <ArrowRight size={17} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-[22px] border border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 text-center sm:py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <FileText size={30} />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-slate-900">
                No Current Outpass
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                You have no current outpass to display. Create a request
                whenever you need permission.
              </p>
              <button
                type="button"
                onClick={() => navigate("/student/apply-outpass")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <Plus size={16} /> Apply Now
              </button>
            </div>
          )}
        </SectionCard>

        {/* Recent activity */}
        <SectionCard
          title="Recent Activities"
          subtitle="Latest updates from your outpass activity"
          icon={Activity}
        >
          {loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          ) : recentActivities.length ? (
            <div className="min-w-0 space-y-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity._id || index}
                  className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-emerald-100 hover:bg-white sm:p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
                    <Activity size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-bold leading-6 text-slate-800"
                      style={{ overflowWrap: "anywhere" }}
                    >
                      {display(
                        activity.title ||
                          activity.message ||
                          activity.description,
                        "Activity",
                      )}
                    </p>
                    {activity.title && activity.description && (
                      <p
                        className="mt-1 whitespace-pre-wrap text-xs leading-5 text-slate-500"
                        style={{ overflowWrap: "anywhere" }}
                      >
                        {activity.description}
                      </p>
                    )}
                    {activity.createdAt && (
                      <p className="mt-2 text-[11px] font-medium text-slate-400">
                        {formatDateTime(activity.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <Activity size={23} />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-500">
                No recent activities available.
              </p>
            </div>
          )}
        </SectionCard>

        <p className="pb-1 text-center text-xs font-medium text-slate-400">
          AMIOUT · Smart Campus Outpass Management
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
