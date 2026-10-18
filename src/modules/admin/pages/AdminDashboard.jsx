import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CredentialManagement from "../components/dashboard/CredentialManagement";
import { FaArrowTrendUp, FaCalendarDays } from "react-icons/fa6";

import {
  RefreshCw,
  GitBranch,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardChart from "../components/dashboard/DashboardChart";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";

import dashboardService from "../../../services/dashboard.service";
import api from "../../../services/api";

// ======================================================
// ADMIN DASHBOARD
// ======================================================

const AdminDashboard = () => {
  // ====================================================
  // DASHBOARD STATES
  // ====================================================

  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(true);

  // ====================================================
  // MENTOR MAPPING STATES
  // ====================================================

  const [mappingLoading, setMappingLoading] = useState(false);
  const [mappingResult, setMappingResult] = useState(null);
  const [mappingError, setMappingError] = useState("");

  // ====================================================
  // FETCH DASHBOARD
  // ====================================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await dashboardService.getDashboard();

      setDashboard(response.data.data);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // GENERATE AUTOMATIC MENTOR MAPPING
  // ====================================================

  const generateMentorMapping = async () => {
    if (mappingLoading) return;

    const confirmed = window.confirm(
      "Generate Student-Mentor Mapping?\n\n" +
        "This will process existing active StudentMaster records " +
        "and may update their assigned mentor references.\n\n" +
        "Ensure the database has been backed up before continuing.",
    );

    if (!confirmed) return;

    try {
      setMappingLoading(true);
      setMappingError("");
      setMappingResult(null);

      const response = await api.post("/academic/mapping/generate");

      const result = response.data?.data;

      if (!result) {
        throw new Error("Mapping API returned an invalid response.");
      }

      setMappingResult(result);

      if (result.failed === 0 && result.mapped > 0) {
        toast.success(`${result.mapped} students mapped successfully!`);
      } else if (result.failed > 0) {
        toast.error(`${result.failed} student mappings failed. Check report.`);
      } else {
        toast("Mapping completed. No students were mapped.");
      }

      await fetchDashboard();
    } catch (error) {
      console.error("Mentor Mapping Error:", error);

      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to generate mentor mapping.";

      setMappingError(message);
      toast.error(message);
    } finally {
      setMappingLoading(false);
    }
  };

  // ====================================================
  // LIFECYCLE
  // ====================================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ====================================================
  // LOADING SCREEN
  // ====================================================

  if (loading && !Object.keys(dashboard).length) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ================================================ */}
      {/* WELCOME BANNER */}
      {/* ================================================ */}

      <section className="relative overflow-hidden rounded-3xl border border-[#223447] bg-gradient-to-r from-[#0F172A] via-[#122131] to-[#163525] p-8">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-green-400">
              Welcome Back
            </p>

            <h1 className="mt-3 text-4xl font-extrabold text-white">
              AMIOUT Admin Dashboard
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Monitor student movement, mentor approvals, security verification
              and administrative activities from one centralized control panel.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#223447] bg-[#081018]/70 p-5">
              <div className="flex items-center gap-3">
                <FaArrowTrendUp className="text-2xl text-green-400" />

                <div>
                  <p className="text-sm text-slate-400">System Status</p>

                  <h3 className="font-bold text-green-400">Operational</h3>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#223447] bg-[#081018]/70 p-5">
              <div className="flex items-center gap-3">
                <FaCalendarDays className="text-2xl text-cyan-400" />

                <div>
                  <p className="text-sm text-slate-400">Today</p>

                  <h3 className="font-bold text-white">
                    {new Date().toLocaleDateString("en-IN")}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* STATISTICS */}
      {/* ================================================ */}

      <DashboardStats dashboard={dashboard} />

      {/* ======================================================
    ADMIN LOGIN CREDENTIAL MANAGEMENT
====================================================== */}

      <CredentialManagement />

      {/* ================================================ */}
      {/* AUTOMATIC STUDENT-MENTOR MAPPING */}
      {/* ================================================ */}

      <section className="overflow-hidden rounded-3xl border border-[#223447] bg-[#0F172A]">
        {/* HEADER */}

        <div className="flex flex-col gap-5 border-b border-[#223447] p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-green-500/10 p-3">
              <GitBranch size={26} className="text-green-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Student-Mentor Mapping
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Map existing StudentMaster academic records with authorized
                faculty from MentorMaster. Student and Mentor login is not
                required for mapping.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={generateMentorMapping}
            disabled={mappingLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mappingLoading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw size={19} />
                Generate Mentor Mapping
              </>
            )}
          </button>
        </div>

        {/* INFORMATION */}

        <div className="p-6">
          {!mappingResult && !mappingError && (
            <div className="rounded-2xl border border-[#223447] bg-[#122131] p-5">
              <div className="flex items-start gap-3">
                <Users size={23} className="mt-1 shrink-0 text-cyan-400" />

                <div>
                  <h3 className="font-semibold text-white">Mapping Ready</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Generate mapping using previously imported students and
                    faculty. Existing student login accounts, passwords, and
                    registration status will remain unchanged.
                  </p>

                  <p className="mt-2 text-xs text-amber-300">
                    This process can modify existing mentor assignments. Run
                    only after verifying the faculty master data and taking a
                    database backup.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ERROR */}

          {mappingError && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
              <AlertTriangle size={22} className="shrink-0 text-red-400" />

              <div>
                <h3 className="font-semibold text-red-400">
                  Mapping Request Failed
                </h3>

                <p className="mt-2 break-words text-sm text-red-200">
                  {mappingError}
                </p>
              </div>
            </div>
          )}

          {/* MAPPING RESULT */}

          {mappingResult && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {/* TOTAL STUDENTS */}

                <div className="rounded-2xl border border-[#223447] bg-[#122131] p-5">
                  <div className="flex items-center justify-between">
                    <Users className="text-cyan-400" />
                    <span className="text-xs text-slate-400">Processed</span>
                  </div>

                  <h3 className="mt-4 text-3xl font-bold text-white">
                    {mappingResult.totalStudents ?? 0}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">Total Students</p>
                </div>

                {/* MAPPED STUDENTS */}

                <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
                  <div className="flex items-center justify-between">
                    <UserCheck className="text-green-400" />
                    <span className="text-xs text-green-400">Successful</span>
                  </div>

                  <h3 className="mt-4 text-3xl font-bold text-green-400">
                    {mappingResult.mapped ?? 0}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">Mapped Students</p>
                </div>

                {/* FAILED STUDENTS */}

                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                  <div className="flex items-center justify-between">
                    <UserX className="text-red-400" />
                    <span className="text-xs text-red-400">Failed</span>
                  </div>

                  <h3 className="mt-4 text-3xl font-bold text-red-400">
                    {mappingResult.failed ?? 0}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">Failed Mappings</p>
                </div>
              </div>

              {/* SUCCESS MESSAGE */}

              {mappingResult.failed === 0 && (
                <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                  <CheckCircle2 className="shrink-0 text-green-400" />

                  <p className="text-sm text-green-300">
                    Mapping process completed without reported student-level
                    failures. Verify the saved references in MongoDB.
                  </p>
                </div>
              )}

              {/* FAILED RECORDS TABLE */}

              {mappingResult.errors?.length > 0 && (
                <div className="overflow-hidden rounded-2xl border border-[#223447]">
                  <div className="border-b border-[#223447] bg-[#122131] p-5">
                    <h3 className="flex items-center gap-2 font-bold text-white">
                      <AlertTriangle size={19} className="text-amber-400" />
                      Failed Mapping Report
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Review the academic details and assigned faculty for these
                      records.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#081018] text-slate-300">
                        <tr>
                          <th className="px-5 py-4">Enrollment No.</th>

                          <th className="px-5 py-4">Student Name</th>

                          <th className="px-5 py-4">Failure Reason</th>
                        </tr>
                      </thead>

                      <tbody>
                        {mappingResult.errors.map((error, index) => (
                          <tr
                            key={`${error.enrollmentNumber || "unknown"}-${index}`}
                            className="border-t border-[#223447] text-slate-300"
                          >
                            <td className="px-5 py-4">
                              {error.enrollmentNumber || "—"}
                            </td>

                            <td className="px-5 py-4">
                              {error.studentName || "—"}
                            </td>

                            <td className="px-5 py-4 text-red-300">
                              {error.reason || "Unknown error"}
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

      {/* ================================================ */}
      {/* CHARTS */}
      {/* ================================================ */}

      <DashboardChart />

      {/* ================================================ */}
      {/* RECENT ACTIVITY + QUICK ACTIONS */}
      {/* ================================================ */}

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>

        <div>
          <QuickActions />
        </div>
      </section>

      {/* ================================================ */}
      {/* FOOTER */}
      {/* ================================================ */}

      <footer className="mt-10 rounded-2xl border border-[#223447] bg-[#122131] px-6 py-5">
        <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold text-white">
              AMIOUT Smart Outpass Management System
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Secure • Reliable • Enterprise Ready
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
              System Online
            </span>

            <span className="text-sm text-slate-500">Version 1.0.0</span>
          </div>
        </div>
      </footer>

      {/* ================================================ */}
      {/* FLOATING REFRESH BUTTON */}
      {/* ================================================ */}

      <button
        type="button"
        onClick={fetchDashboard}
        disabled={loading}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-green-700 disabled:opacity-50"
        title="Refresh Dashboard"
        aria-label="Refresh Dashboard"
      >
        <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
      </button>
    </div>
  );
};

export default AdminDashboard;
