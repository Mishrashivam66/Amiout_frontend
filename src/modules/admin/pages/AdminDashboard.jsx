import { useEffect, useState } from "react";

import { toast } from "react-hot-toast";

import { FaArrowTrendUp, FaCalendarDays } from "react-icons/fa6";

import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardChart from "../components/dashboard/DashboardChart";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";

import dashboardService from "../../../services/dashboard.service";

const AdminDashboard = () => {
  // ============================================================================
  // States
  // ============================================================================

  const [dashboard, setDashboard] = useState({});

  const [loading, setLoading] = useState(true);

  // ============================================================================
  // Fetch Dashboard
  // ============================================================================

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

  // ============================================================================
  // Life Cycle
  // ============================================================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ============================================================================
  // Loading
  // ============================================================================

  if (loading) {
    return (
      <div
        className="
          flex
          h-[70vh]
          items-center
          justify-center
        "
      >
        <div
          className="
            h-16
            w-16
            animate-spin
            rounded-full
            border-4
            border-green-500
            border-t-transparent
          "
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ====================================================== */}
      {/* Welcome Banner */}
      {/* ====================================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-[#223447]
          bg-gradient-to-r
          from-[#0F172A]
          via-[#122131]
          to-[#163525]
          p-8
        "
      >
        {/* Background Glow */}

        <div
          className="
            absolute
            -right-20
            -top-20
            h-72
            w-72
            rounded-full
            bg-green-500/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* Left */}

          <div>
            <p className="text-sm uppercase tracking-widest text-green-400">
              Welcome Back
            </p>

            <h1
              className="
                mt-3
                text-4xl
                font-extrabold
                text-white
              "
            >
              AMIOUT Admin Dashboard
            </h1>

            <p
              className="
                mt-4
                max-w-2xl
                leading-7
                text-slate-300
              "
            >
              Monitor student movement, mentor approvals, security verification
              and administrative activities from one centralized control panel.
            </p>
          </div>

          {/* Right */}

          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
            "
          >
            <div
              className="
                rounded-2xl
                border
                border-[#223447]
                bg-[#081018]/70
                p-5
              "
            >
              <div className="flex items-center gap-3">
                <FaArrowTrendUp className="text-2xl text-green-400" />

                <div>
                  <p className="text-sm text-slate-400">System Status</p>

                  <h3 className="font-bold text-green-400">Operational</h3>
                </div>
              </div>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-[#223447]
                bg-[#081018]/70
                p-5
              "
            >
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

      {/* ====================================================== */}
      {/* Statistics */}
      {/* ====================================================== */}

      <DashboardStats dashboard={dashboard} />

      {/* ====================================================== */}
      {/* Charts */}
      {/* ====================================================== */}

      <DashboardChart />
      {/* ====================================================== */}
      {/* Bottom Section */}
      {/* ====================================================== */}

      <section
        className="
          grid
          grid-cols-1
          gap-8
          xl:grid-cols-3
        "
      >
        {/* ============================================== */}
        {/* Recent Activity */}
        {/* ============================================== */}

        <div className="xl:col-span-2">
          <RecentActivity />
        </div>

        {/* ============================================== */}
        {/* Quick Actions */}
        {/* ============================================== */}

        <div>
          <QuickActions />
        </div>
      </section>

      {/* ====================================================== */}
      {/* Footer */}
      {/* ====================================================== */}

      <footer
        className="
          mt-10
          rounded-2xl
          border
          border-[#223447]
          bg-[#122131]
          px-6
          py-5
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            text-center
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div>
            <h3 className="font-semibold text-white">
              AMIOUT Smart Outpass Management System
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Secure • Reliable • Enterprise Ready
            </p>
          </div>

          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-3
            "
          >
            <span
              className="
                rounded-full
                bg-green-500/10
                px-4
                py-2
                text-sm
                font-semibold
                text-green-400
              "
            >
              System Online
            </span>

            <span className="text-sm text-slate-500">Version 1.0.0</span>
          </div>
        </div>
      </footer>

      {/* ====================================================== */}
      {/* Floating Refresh Button */}
      {/* ====================================================== */}

      <button
        onClick={fetchDashboard}
        className="
          fixed
          bottom-6
          right-6
          z-40
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-green-600
          text-white
          shadow-2xl
          transition-all
          duration-300
          hover:scale-110
          hover:bg-green-700
        "
        title="Refresh Dashboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v6h6M20 20v-6h-6M20 9A8 8 0 005.3 5.3M4 15a8 8 0 0014.7 3.7"
          />
        </svg>
      </button>
    </div>
  );
};

export default AdminDashboard;
