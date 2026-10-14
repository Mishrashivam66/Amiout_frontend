import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  XCircle,
  AlertCircle,
  Activity,
} from "lucide-react";

import api from "../../../services/api";
import mentorService from "../services/mentor.service";

import PendingOutpassTable from "../components/PendingOutpassTable";
import RecentActivity from "../components/RecentActivity";

const EMPTY_DASHBOARD = {
  totalStudents: null,
  pendingOutpasses: null,
  approvedToday: null,
  rejectedToday: null,
  recentRequests: [],
  recentActivities: [],
};

const unwrap = (response) => response?.data ?? response;

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

const getStudentsCount = (response) => {
  const payload = unwrap(response);

  if (payload?.success === false) {
    throw new Error(payload.message || "Unable to load students.");
  }

  if (typeof payload?.total === "number") {
    return payload.total;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data.length;
  }

  if (Array.isArray(payload?.data?.students)) {
    return payload.data.students.length;
  }

  if (Array.isArray(payload?.students)) {
    return payload.students.length;
  }

  throw new Error("Student count is missing from the API response.");
};

const parseDashboard = (response) => {
  const payload = unwrap(response);

  if (payload?.success === false) {
    throw new Error(payload.message || "Dashboard request failed.");
  }

  const data = payload?.data ?? payload;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid dashboard response.");
  }

  return {
    totalStudents: toNumberOrNull(data.totalStudents),
    pendingOutpasses: toNumberOrNull(data.pendingOutpasses),
    approvedToday: toNumberOrNull(data.approvedToday),
    rejectedToday: toNumberOrNull(data.rejectedToday),
    recentRequests: Array.isArray(data.recentRequests)
      ? data.recentRequests
      : [],
    recentActivities: Array.isArray(data.recentActivities)
      ? data.recentActivities
      : [],
  };
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to load dashboard.";

const getTodayLabel = () =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  iconBackground,
  link,
}) => {
  const content = (
    <div className="group relative h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5 sm:p-6">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-50 transition-transform duration-500 group-hover:scale-125" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBackground}`}
          >
            <Icon size={23} className={iconClass} />
          </div>

          {link && (
            <ArrowUpRight
              size={19}
              className="text-slate-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-600"
            />
          )}
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {value === null ? (
              <span className="text-xl font-semibold text-slate-400">N/A</span>
            ) : (
              value.toLocaleString("en-IN")
            )}
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  return link ? (
    <Link to={link} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
};

const QuickLink = ({ to, icon: Icon, title, subtitle }) => (
  <Link
    to={to}
    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/50"
  >
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-blue-100 group-hover:text-blue-700">
      <Icon size={21} />
    </div>

    <div className="min-w-0 flex-1">
      <h4 className="text-sm font-bold text-slate-900">{title}</h4>

      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>

    <ArrowRight
      size={17}
      className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
    />
  </Link>
);

const Dashboard = () => {
  const location = useLocation();

  const isCoordinator =
    location.pathname === "/coordinator" ||
    location.pathname.startsWith("/coordinator/");

  const role = isCoordinator ? "COORDINATOR" : "MENTOR";
  const basePath = isCoordinator ? "/coordinator" : "/mentor";

  const requestIdRef = useRef(0);

  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [studentsError, setStudentsError] = useState("");

  const loadDashboard = useCallback(
    async (showFullLoader = false) => {
      const requestId = ++requestIdRef.current;

      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setDashboardError("");
      setStudentsError("");

      try {
        if (role === "MENTOR") {
          const response = await mentorService.getDashboard();

          if (requestId !== requestIdRef.current) return;

          const result = parseDashboard(response);

          setDashboard(result);
          setLastUpdated(new Date());
        } else {
          /*
           * Coordinator data is loaded using two separate APIs:
           *
           * 1. /coordinator/students
           *    Authorized section/group student count.
           *
           * 2. /coordinator/dashboard
           *    Authorized coordinator outpass statistics.
           *
           * If dashboard API is not implemented yet,
           * students can still load independently.
           */
          const [studentsResult, statsResult] = await Promise.allSettled([
            api.get("/coordinator/students"),
            api.get("/coordinator/dashboard"),
          ]);

          if (requestId !== requestIdRef.current) return;

          let totalStudents = null;

          if (studentsResult.status === "fulfilled") {
            try {
              totalStudents = getStudentsCount(studentsResult.value);
            } catch (error) {
              setStudentsError(getErrorMessage(error));
            }
          } else {
            setStudentsError(getErrorMessage(studentsResult.reason));
          }

          let coordinatorStats = { ...EMPTY_DASHBOARD };

          if (statsResult.status === "fulfilled") {
            try {
              coordinatorStats = parseDashboard(statsResult.value);
            } catch (error) {
              setDashboardError(getErrorMessage(error));
            }
          } else {
            setDashboardError(getErrorMessage(statsResult.reason));
          }

          setDashboard({
            ...coordinatorStats,

            // The scoped StudentMaster endpoint is
            // authoritative for Coordinator student count.
            totalStudents: totalStudents ?? coordinatorStats.totalStudents,
          });

          setLastUpdated(new Date());
        }
      } catch (error) {
        if (requestId !== requestIdRef.current) return;

        console.error("Dashboard error:", error);

        setDashboard({ ...EMPTY_DASHBOARD });
        setDashboardError(getErrorMessage(error));

        toast.error("Failed to load dashboard.");
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [role],
  );

  useEffect(() => {
    setDashboard({ ...EMPTY_DASHBOARD });
    setLastUpdated(null);

    loadDashboard(true);

    return () => {
      requestIdRef.current += 1;
    };
  }, [loadDashboard]);

  const stats = [
    {
      title: "Total Students",
      value: dashboard.totalStudents,
      subtitle: isCoordinator
        ? "Students in your authorized coordinator groups"
        : "Students assigned to your mentor group",
      icon: Users,
      iconClass: "text-blue-700",
      iconBackground: "bg-blue-50",
      link: `${basePath}/students`,
    },
    {
      title: "Pending Outpasses",
      value: dashboard.pendingOutpasses,
      subtitle: "Requests waiting for action",
      icon: Clock3,
      iconClass: "text-amber-700",
      iconBackground: "bg-amber-50",
      link: isCoordinator ? null : `${basePath}/pending-outpasses`,
    },
    {
      title: "Approved Today",
      value: dashboard.approvedToday,
      subtitle: "Approved requests today (IST)",
      icon: CheckCircle2,
      iconClass: "text-emerald-700",
      iconBackground: "bg-emerald-50",
      link: null,
    },
    {
      title: "Rejected Today",
      value: dashboard.rejectedToday,
      subtitle: "Rejected requests today (IST)",
      icon: XCircle,
      iconClass: "text-rose-700",
      iconBackground: "bg-rose-50",
      link: null,
    },
  ];

  const hasAnyData = [
    dashboard.totalStudents,
    dashboard.pendingOutpasses,
    dashboard.approvedToday,
    dashboard.rejectedToday,
  ].some((value) => value !== null);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-5 text-sm font-medium text-slate-500">
            Loading your {isCoordinator ? "Coordinator" : "Mentor"} dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* ========================================
          PREMIUM HERO
      ======================================== */}

      <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-6 text-white shadow-xl shadow-blue-950/10 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 right-24 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold tracking-wide text-cyan-200">
              <Sparkles size={15} />
              AMIOUT FACULTY WORKSPACE
            </div>

            <div className="mt-5 flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                {isCoordinator ? "Coordinator Dashboard" : "Mentor Dashboard"}
              </h1>

              <ShieldCheck
                size={27}
                className="hidden text-cyan-300 sm:block"
              />
            </div>

            <p className="mt-3 max-w-xl text-sm leading-7 text-blue-100/80 sm:text-base">
              {isCoordinator
                ? "Monitor students and outpass activity across your authorized academic groups."
                : "Manage your assigned students and track outpass activity from one secure workspace."}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                <GraduationCap size={15} />
                {role}
              </span>

              <span className="inline-flex items-center gap-2 text-xs text-blue-200">
                <CalendarDays size={15} />
                {getTodayLabel()}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadDashboard(false)}
            disabled={refreshing}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-2xl border border-white/20 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 lg:self-center"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh Dashboard"}
          </button>
        </div>
      </section>

      {/* ========================================
          STATUS BAR
      ======================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <LayoutDashboard size={18} className="text-blue-600" />

          <span className="font-semibold">
            {isCoordinator ? "Coordinator Overview" : "Mentor Overview"}
          </span>

          <span className="text-slate-300">/</span>

          <span className="text-slate-400">Live university data</span>
        </div>

        {lastUpdated && (
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Activity size={14} className="text-emerald-600" />
            Last refreshed{" "}
            {lastUpdated.toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            IST
          </p>
        )}
      </div>

      {/* ========================================
          API STATUS WARNINGS
      ======================================== */}

      {studentsError && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-700" />

          <div>
            <p className="text-sm font-bold text-amber-900">
              Student data unavailable
            </p>

            <p className="mt-1 text-sm text-amber-800">{studentsError}</p>
          </div>
        </div>
      )}

      {dashboardError && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-700" />

          <div>
            <p className="text-sm font-bold text-amber-900">
              Dashboard statistics unavailable
            </p>

            <p className="mt-1 text-sm text-amber-800">{dashboardError}</p>

            {isCoordinator && (
              <p className="mt-2 text-xs text-amber-700">
                Coordinator statistics require an authorized GET
                /api/v1/coordinator/dashboard endpoint.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================
          DYNAMIC STATS
      ======================================== */}

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-950 sm:text-xl">
              Dashboard Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Metrics for your current authorized role
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <TrendingUp size={14} />
            Role-specific data
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* ========================================
          QUICK ACTIONS
      ======================================== */}

      <section className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <ClipboardList size={21} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-950">
                Quick Access
              </h2>

              <p className="text-xs text-slate-500">
                Open your frequently used faculty modules
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <QuickLink
              to={`${basePath}/students`}
              icon={Users}
              title="My Students"
              subtitle={
                isCoordinator
                  ? "View authorized coordinator groups"
                  : "View your assigned student group"
              }
            />

            <QuickLink
              to={`${basePath}/profile`}
              icon={ShieldCheck}
              title="Faculty Profile"
              subtitle="Official academic role and details"
            />

            {!isCoordinator && (
              <>
                <QuickLink
                  to={`${basePath}/pending-outpasses`}
                  icon={Clock3}
                  title="Pending Outpasses"
                  subtitle="Review requests awaiting approval"
                />

                <QuickLink
                  to={`${basePath}/history`}
                  icon={Activity}
                  title="Request History"
                  subtitle="Review previous decisions"
                />
              </>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 p-6 text-white shadow-lg">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-2xl" />

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck size={25} className="text-cyan-300" />
            </div>

            <h3 className="mt-5 text-xl font-extrabold">Academic Access</h3>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              {isCoordinator
                ? "Your Coordinator view is limited to the academic section and groups assigned to your verified faculty account."
                : "Your Mentor view is limited to students and outpasses mapped to your verified mentor assignment."}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">
              <ShieldCheck size={15} />
              Role-scoped workspace
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          MENTOR OUTPASS MODULES
          Existing working components preserved.
      ======================================== */}

      {!isCoordinator && !dashboardError && (
        <>
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-extrabold text-slate-950">
                Pending Outpass Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Requests awaiting your Mentor action
              </p>
            </div>

            <PendingOutpassTable onRefresh={() => loadDashboard(false)} />
          </section>

          {dashboard.recentActivities.length > 0 && (
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-5 text-lg font-extrabold text-slate-950">
                Recent Activity
              </h2>

              <RecentActivity activities={dashboard.recentActivities} />
            </section>
          )}
        </>
      )}

      {/* ========================================
          COORDINATOR ACTIVITY
          Never use Mentor requests as a substitute.
      ======================================== */}

      {isCoordinator && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Activity size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold text-slate-950">
                Coordinator Activity
              </h2>

              {dashboard.recentActivities.length > 0 ? (
                <div className="mt-4">
                  <RecentActivity activities={dashboard.recentActivities} />
                </div>
              ) : (
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {dashboardError
                    ? "Coordinator activity will appear after the Coordinator Dashboard API is connected."
                    : "No recent coordinator activity available."}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================
          EMPTY STATE
      ======================================== */}

      {!dashboardError && !studentsError && !hasAnyData && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <GraduationCap size={37} className="mx-auto text-slate-400" />

          <h3 className="mt-4 text-lg font-bold text-slate-800">
            No dashboard data available
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Your authorized information will appear here when it becomes
            available.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
