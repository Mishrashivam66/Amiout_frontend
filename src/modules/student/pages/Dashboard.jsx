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
} from "lucide-react";

import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

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

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getApiError = (error, fallback) =>
  error?.response?.data?.message ||
  (Array.isArray(error?.response?.data?.errors)
    ? error.response.data.errors.join(", ")
    : "") ||
  error?.message ||
  fallback;

const StatCard = ({ title, value, icon: Icon, tone = "emerald" }) => {
  const themes = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
    teal: "bg-teal-50 text-teal-600",
  };

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-3 text-3xl font-extrabold text-slate-900">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-13 w-13 items-center justify-center rounded-2xl p-3 ${
            themes[tone] || themes.emerald
          }`}
        >
          <Icon size={25} />
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ title, description, icon: Icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex w-full items-center justify-between gap-4 rounded-[22px] border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg"
  >
    <div className="flex items-center gap-4">
      <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
        <Icon size={22} />
      </div>

      <div>
        <p className="font-bold text-slate-800">{title}</p>

        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
    </div>

    <ArrowRight
      size={19}
      className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600"
    />
  </button>
);

const SectionCard = ({ title, children, icon: Icon }) => (
  <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
    <div className="mb-5 flex items-center gap-2.5">
      {Icon && <Icon size={20} className="text-emerald-600" />}

      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>

    {children}
  </section>
);

const Detail = ({ label, value }) => (
  <div className="rounded-xl bg-white/80 p-3">
    <p className="text-xs text-slate-500">{label}</p>

    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
      {display(value)}
    </p>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");

    try {
      const results = await Promise.allSettled([
        api.get("/student/dashboard"),
        api.get("/student/profile"),
      ]);

      const [dashboardResult, profileResult] = results;

      if (dashboardResult.status === "fulfilled") {
        const body = dashboardResult.value.data;

        if (body?.success === false) {
          throw new Error(body.message || "Dashboard API failed.");
        }

        setDashboard(unwrap(dashboardResult.value));
      } else {
        console.error("Student Dashboard API Error:", dashboardResult.reason);

        setError(
          getApiError(dashboardResult.reason, "Unable to load dashboard data."),
        );
      }

      if (profileResult.status === "fulfilled") {
        const body = profileResult.value.data;

        if (body?.success !== false) {
          setProfile(unwrap(profileResult.value));
        }
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
    <div className="min-h-screen space-y-7 bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 pb-8">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 px-6 py-8 text-white shadow-xl sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-emerald-400/10 blur-2xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
              <Sparkles size={14} />
              AMIOUT · Student Portal
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Welcome back, {studentName}!
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Manage your campus outpasses, parent consent, faculty approvals
              and gate verification.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-emerald-100">
              <UserCircle size={17} />
              Enrollment: {enrollment}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchDashboard(false)}
              disabled={loading || refreshing}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/20 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <div className="hidden rounded-2xl bg-white/10 p-4 md:block">
              <QrCode size={43} className="text-emerald-300" />
            </div>
          </div>
        </div>
      </div>

      {/* BACKEND ERROR */}
      {error && (
        <div className="flex flex-wrap items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <AlertTriangle size={21} className="mt-0.5 text-rose-600" />

          <div className="min-w-0 flex-1">
            <p className="font-bold text-rose-800">
              Dashboard data could not be loaded
            </p>

            <p className="mt-1 break-words text-sm text-rose-700">{error}</p>

            <p className="mt-2 text-xs text-rose-600">
              You can still open Apply Outpass, History and My Profile.
              Statistics will appear after the API works.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchDashboard(false)}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* STATS */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Outpass Overview
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-[24px] bg-slate-200"
                />
              ))
            : stats.map((item) => <StatCard key={item.title} {...item} />)}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Quick Actions</h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ActionCard
            icon={Plus}
            title="Apply Outpass"
            description="Create a new request"
            onClick={() => navigate("/student/apply-outpass")}
          />

          <ActionCard
            icon={FileText}
            title="Outpass History"
            description="Track past requests"
            onClick={() => navigate("/student/history")}
          />

          <ActionCard
            icon={UserCircle}
            title="My Profile"
            description="View verified student records"
            onClick={() => navigate("/student/profile")}
          />

          <ActionCard
            icon={Bell}
            title="Notifications"
            description="Review important updates"
            onClick={() => navigate("/student/notifications")}
          />
        </div>
      </div>

      {/* CURRENT OUTPASS */}
      <SectionCard title="Current Outpass" icon={ShieldCheck}>
        {loading ? (
          <div className="h-44 animate-pulse rounded-2xl bg-slate-100" />
        ) : currentOutpass ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-emerald-900">
                {display(currentOutpass.outpassId, "Current Request")}
              </h3>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-700">
                {display(currentOutpass.status)}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Detail label="Destination" value={currentOutpass.destination} />

              <Detail label="Reason" value={currentOutpass.reason} />

              <Detail
                label="Out Date"
                value={formatDate(currentOutpass.outDate)}
              />

              <Detail label="Out Time" value={currentOutpass.outTime} />

              <Detail
                label="Expected In Time"
                value={display(currentOutpass.inTime, "No planned return")}
              />

              <Detail
                label="Parent Approval"
                value={currentOutpass.parentDecision?.status || "Pending"}
              />
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/student/outpass/${
                    currentOutpass._id || currentOutpass.outpassId
                  }`,
                )
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              View Outpass
              <ArrowRight size={17} />
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center">
            <FileText size={40} className="mx-auto text-slate-300" />

            <h3 className="mt-3 font-bold text-slate-800">
              No Current Outpass
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              You have no current outpass to display.
            </p>

            <button
              type="button"
              onClick={() => navigate("/student/apply-outpass")}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Apply Now
            </button>
          </div>
        )}
      </SectionCard>

      {/* ACTIVITIES */}
      <SectionCard title="Recent Activities" icon={Activity}>
        {loading ? (
          <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
        ) : recentActivities.length ? (
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={activity._id || index}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">
                  <Activity size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {display(
                      activity.title ||
                        activity.message ||
                        activity.description,
                      "Activity",
                    )}
                  </p>

                  {activity.title && activity.description && (
                    <p className="mt-1 text-xs text-slate-500">
                      {activity.description}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-400">
                    {activity.createdAt
                      ? new Date(activity.createdAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            No recent activities available.
          </p>
        )}
      </SectionCard>
    </div>
  );
};

export default Dashboard;
