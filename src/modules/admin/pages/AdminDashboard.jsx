import { useCallback, useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  GitBranch,
  Loader2,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react";

import CredentialManagement from "../components/dashboard/CredentialManagement";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardChart from "../components/dashboard/DashboardChart";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";

import dashboardService from "../../../services/dashboard.service";
import api from "../../../services/api";

// ============================================================
// AMIOUT ENTERPRISE - LIVE ADMIN DASHBOARD
//
// Existing API:
// GET  /admin/dashboard
// GET  /admin/dashboard/analytics
// GET  /admin/dashboard/recent-activities
// POST /academic/mapping/generate
//
// No demo statistics, fake system health or fake activities.
// ============================================================

const getError = (error) =>
  error?.response?.data?.message || error?.message || "Request failed.";

const displayNumber = (value) => {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return "—";
  }

  return Number(value).toLocaleString("en-IN");
};

const todayIST = () =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

function MappingMetric({ title, value, icon: Icon, className }) {
  return (
    <div className="rounded-2xl border border-[#26394b] bg-[#081629] p-5">
      <div className="flex items-center justify-between">
        <Icon size={23} className={className} />

        <span className="text-xs text-slate-400">Mapping Result</span>
      </div>

      <p className="mt-5 text-3xl font-black text-white">
        {displayNumber(value)}
      </p>

      <p className="mt-2 text-xs font-semibold text-slate-400">{title}</p>
    </div>
  );
}

export default function AdminDashboard() {
  // ==========================================================
  // DASHBOARD STATE
  // ==========================================================

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // ==========================================================
  // MENTOR MAPPING STATE
  // ==========================================================

  const [showMappingConfirm, setShowMappingConfirm] = useState(false);

  const [mappingLoading, setMappingLoading] = useState(false);

  const [mappingResult, setMappingResult] = useState(null);

  const [mappingError, setMappingError] = useState("");

  // ==========================================================
  // LIVE DASHBOARD API
  // ==========================================================

  const fetchDashboard = useCallback(
    async ({ silent = false, notify = false } = {}) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setDashboardLoading(true);
      }

      setDashboardError("");

      try {
        const response = await dashboardService.getDashboard();

        if (response.data?.success === false) {
          throw new Error(
            response.data.message || "Dashboard API returned an error.",
          );
        }

        const payload = response.data?.data ?? response.data;

        if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
          throw new Error("Dashboard API returned an invalid response.");
        }

        setDashboard(payload);

        // Let child panels refetch during manual refresh.
        if (silent) {
          setRefreshKey((value) => value + 1);
        }

        if (notify) {
          toast.success("Dashboard updated", {
            duration: 1000,
          });
        }
      } catch (error) {
        const message = getError(error);

        setDashboardError(message);

        if (notify) {
          toast.error(message, {
            duration: 1000,
          });
        }
      } finally {
        setDashboardLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  // ==========================================================
  // GENERATE AUTOMATIC MENTOR MAPPING
  // ==========================================================

  const generateMentorMapping = async () => {
    if (mappingLoading) return;

    setShowMappingConfirm(false);
    setMappingLoading(true);
    setMappingError("");
    setMappingResult(null);

    try {
      const response = await api.post("/academic/mapping/generate");

      if (response.data?.success === false) {
        throw new Error(response.data.message || "Mentor mapping failed.");
      }

      const result = response.data?.data;

      if (!result || typeof result !== "object") {
        throw new Error("Mapping API returned an invalid response.");
      }

      setMappingResult(result);

      if (Number(result.failed) > 0) {
        toast.error(`${result.failed} mappings failed. Check report.`, {
          duration: 1000,
        });
      } else if (Number(result.mapped) > 0) {
        toast.success(`${result.mapped} students mapped`, { duration: 1000 });
      } else {
        toast("Mapping completed. Review the report.", { duration: 1000 });
      }

      await fetchDashboard({
        silent: true,
      });
    } catch (error) {
      const message = getError(error);

      setMappingError(message);

      toast.error(message, {
        duration: 1000,
      });
    } finally {
      setMappingLoading(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  const hasDashboard = dashboard !== null && !dashboardError;

  return (
    <div className="space-y-7 pb-10">
      {/* WELCOME HEADER */}

      <section className="relative overflow-hidden rounded-[28px] border border-amber-400/15 bg-gradient-to-r from-[#09172c] via-[#10243a] to-[#092e27] p-6 shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-bold text-amber-300">
              <ShieldCheck size={16} />
              AMIOUT ENTERPRISE ADMIN
            </span>

            <h1 className="mt-5 text-2xl font-black text-white sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Monitor student outpasses, faculty approvals, academic mentor
              mapping and security verification using backend records.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[330px]">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <Activity
                size={23}
                className={hasDashboard ? "text-emerald-400" : "text-amber-400"}
              />

              <p className="mt-3 text-xs text-slate-400">Dashboard API</p>

              <p className="mt-1 text-sm font-extrabold text-white">
                {dashboardLoading
                  ? "Checking..."
                  : hasDashboard
                    ? "Connected"
                    : "Unavailable"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <CalendarDays size={23} className="text-amber-400" />

              <p className="mt-3 text-xs text-slate-400">Today · IST</p>

              <p className="mt-1 text-sm font-extrabold text-white">
                {todayIST()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD LOAD ERROR */}

      {dashboardError && (
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={21} className="shrink-0 text-red-400" />

            <div>
              <h2 className="text-sm font-black text-red-200">
                Dashboard data unavailable
              </h2>

              <p className="mt-2 break-words text-xs text-red-200">
                {dashboardError}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void fetchDashboard({ silent: true, notify: true })}
            disabled={refreshing}
            className="rounded-xl bg-red-400/15 px-4 py-2 text-xs font-bold text-red-100 disabled:opacity-50"
          >
            Retry
          </button>
        </section>
      )}

      {/* LIVE COUNTS */}

      {dashboardLoading && !dashboard ? (
        <div className="flex h-48 items-center justify-center gap-3 rounded-2xl border border-[#223447] bg-[#122131] text-sm text-slate-300">
          <Loader2 size={22} className="animate-spin text-amber-400" />
          Loading dashboard statistics...
        </div>
      ) : (
        <DashboardStats dashboard={dashboard} />
      )}

      {/* EXISTING ADMIN CREDENTIAL MANAGEMENT */}

      <CredentialManagement />

      {/* MENTOR MAPPING */}

      <section className="overflow-hidden rounded-3xl border border-[#223447] bg-[#122131]">
        <div className="flex flex-col justify-between gap-5 border-b border-[#223447] p-6 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-amber-400/10 p-3 text-amber-400">
              <GitBranch size={25} />
            </div>

            <div>
              <h2 className="text-xl font-black text-white">
                Automatic Student–Mentor Mapping
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
                Map active StudentMaster records to authorized MentorMaster
                assignments using institute, program, batch, semester, section
                and group.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowMappingConfirm(true)}
            disabled={mappingLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-[#091b31] transition hover:bg-amber-300 disabled:opacity-50"
          >
            {mappingLoading ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <RefreshCw size={19} />
            )}

            {mappingLoading ? "Generating..." : "Generate Mentor Mapping"}
          </button>
        </div>

        <div className="p-6">
          {!mappingResult && !mappingError && (
            <div className="flex items-start gap-3 rounded-2xl border border-[#26394b] bg-[#081629] p-5">
              <Users size={22} className="shrink-0 text-cyan-400" />

              <div>
                <h3 className="font-bold text-white">Mapping Ready</h3>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Uses existing imported academic records. This operation may
                  change student mentor assignments, so verify master data and
                  back up the database beforehand.
                </p>
              </div>
            </div>
          )}

          {mappingError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-5">
              <AlertTriangle size={20} className="shrink-0 text-red-400" />

              <p className="text-sm text-red-200">{mappingError}</p>
            </div>
          )}

          {mappingResult && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <MappingMetric
                  title="Processed Students"
                  value={mappingResult.totalStudents}
                  icon={Users}
                  className="text-cyan-400"
                />

                <MappingMetric
                  title="Mapped Students"
                  value={mappingResult.mapped}
                  icon={UserCheck}
                  className="text-emerald-400"
                />

                <MappingMetric
                  title="Failed Mappings"
                  value={mappingResult.failed}
                  icon={UserX}
                  className="text-rose-400"
                />
              </div>

              {Number(mappingResult.failed) === 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-300">
                  <CheckCircle2 size={20} />
                  Mapping completed without reported failures.
                </div>
              )}

              {Array.isArray(mappingResult.errors) &&
                mappingResult.errors.length > 0 && (
                  <div className="overflow-hidden rounded-xl border border-[#26394b]">
                    <div className="bg-[#081629] p-4">
                      <h3 className="font-bold text-white">
                        Failed Mapping Report
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[620px] text-left text-sm">
                        <thead className="bg-[#0b1727] text-xs text-slate-400">
                          <tr>
                            <th className="px-4 py-3">Enrollment</th>
                            <th className="px-4 py-3">Student</th>
                            <th className="px-4 py-3">Reason</th>
                          </tr>
                        </thead>

                        <tbody>
                          {mappingResult.errors.map((item, index) => (
                            <tr
                              key={`${item.enrollmentNumber || index}`}
                              className="border-t border-[#26394b] text-slate-200"
                            >
                              <td className="px-4 py-3">
                                {item.enrollmentNumber || "—"}
                              </td>

                              <td className="px-4 py-3">
                                {item.studentName || "—"}
                              </td>

                              <td className="px-4 py-3 text-red-300">
                                {item.reason || "Not provided"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </section>

      {/* LIVE ANALYTICS */}

      <DashboardChart dashboard={dashboard} refreshKey={refreshKey} />

      {/* LIVE ACTIVITY AND QUICK ROUTES */}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <RecentActivity refreshKey={refreshKey} />
        </div>

        <div className="min-w-0">
          <QuickActions />
        </div>
      </section>

      {/* FOOTER */}

      <footer className="flex flex-col justify-between gap-3 rounded-2xl border border-[#223447] bg-[#122131] px-6 py-5 text-center sm:flex-row sm:items-center sm:text-left">
        <div>
          <p className="text-sm font-bold text-white">
            AMIOUT Smart Outpass Management System
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Amity University Madhya Pradesh
          </p>
        </div>

        <span className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <BarChart3 size={16} />
          Database-backed Admin Dashboard
        </span>
      </footer>

      {/* REFRESH ALL */}

      <button
        type="button"
        aria-label="Refresh dashboard"
        title="Refresh dashboard"
        disabled={dashboardLoading || refreshing}
        onClick={() =>
          void fetchDashboard({
            silent: true,
            notify: true,
          })
        }
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-[#091b31] shadow-2xl transition hover:scale-105 hover:bg-amber-300 disabled:opacity-50"
      >
        <RefreshCw size={23} className={refreshing ? "animate-spin" : ""} />
      </button>

      {/* IN-APP MAPPING CONFIRMATION */}

      {showMappingConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowMappingConfirm(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mapping-confirm-title"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-[#34475d] bg-[#122131] shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-[#34475d] p-6">
              <div>
                <h2
                  id="mapping-confirm-title"
                  className="text-lg font-black text-white"
                >
                  Generate Mentor Mapping?
                </h2>

                <p className="mt-2 text-xs text-slate-400">
                  Academic mapping operation
                </p>
              </div>

              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowMappingConfirm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4">
                <AlertTriangle size={22} className="shrink-0 text-amber-400" />

                <p className="text-sm leading-6 text-amber-100">
                  Existing StudentMaster mentor references may change. Verify
                  faculty master records and take a database backup before
                  proceeding.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowMappingConfirm(false)}
                  className="rounded-xl border border-[#34475d] px-4 py-3 text-sm font-bold text-white hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void generateMentorMapping()}
                  disabled={mappingLoading}
                  className="rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-[#091b31] hover:bg-amber-300 disabled:opacity-50"
                >
                  Confirm Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
