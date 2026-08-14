// ==========================================
// Project : AMIOUT
// Module  : Student
// File    : Dashboard.jsx
// ==========================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Clock3,
  CheckCircle2,
  XCircle,
  FileText,
  Bell,
  Activity,
  AlertTriangle,
  ArrowRight,
  Plus,
  UserCircle,
} from "lucide-react";

import api from "../../../services/api";
import PageHeader from "../components/layout/PageHeader";
import { useAuth } from "../../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/student/dashboard");

      setDashboard(response.data.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 rounded-3xl bg-slate-200 animate-pulse" />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-36 rounded-3xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>

        <div className="h-72 rounded-3xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-300 bg-red-50 p-10 text-center">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />

        <h2 className="text-xl font-bold text-red-700">Something went wrong</h2>

        <p className="mt-2 text-red-600">{error}</p>

        <button
          onClick={fetchDashboard}
          className="mt-6 rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const statistics = dashboard?.statistics || {};

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Dashboard"
        subtitle="Manage your outpass requests, approvals and activities"
        actionText="Apply Outpass"
        onAction={() => navigate("/student/apply-outpass")}
      />
      {/* Welcome Banner */}

      <div
        className="
          rounded-3xl
          bg-gradient-to-r
          from-green-600
          via-emerald-500
          to-green-700
          p-8
          shadow-xl
          text-white
          flex
          flex-col
          md:flex-row
          justify-between
          items-center
          gap-6
        "
      >
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name || "Student"} 👋
          </h1>

          <p className="mt-2 text-green-100">
            Manage hostel outpasses quickly and securely.
          </p>

          <div
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-white/20
              px-4
              py-2
              text-sm
            "
          >
            <UserCircle size={18} />
            Enrollment :
            <span className="font-semibold">{user?.enrollmentNo || "N/A"}</span>
          </div>
        </div>

        <div
          className="
            hidden
            md:flex
            h-24
            w-24
            rounded-full
            bg-white/20
            items-center
            justify-center
          "
        >
          <UserCircle size={55} />
        </div>
      </div>

      {/* Profile Warning */}

      {!dashboard?.profile?.profileCompleted && (
        <div
          className="
            rounded-3xl
            border
            border-amber-300
            bg-amber-50
            p-6
            flex
            items-start
            gap-4
          "
        >
          <AlertTriangle className="text-amber-500 mt-1" size={32} />

          <div className="flex-1">
            <h3 className="font-bold text-lg text-amber-800">
              Complete Your Profile
            </h3>

            <p className="mt-2 text-sm text-amber-700">
              Complete your profile before applying for an outpass.
            </p>

            <button
              onClick={() => navigate("/student/complete-profile")}
              className="
                mt-4
                rounded-xl
                bg-amber-500
                px-5
                py-2
                font-semibold
                text-white
                hover:bg-amber-600
              "
            >
              Complete Now
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Requests"
          value={statistics.totalRequests || 0}
          icon={FileText}
        />

        <StatCard
          title="Pending"
          value={statistics.pendingRequests || 0}
          icon={Clock3}
        />

        <StatCard
          title="Approved"
          value={statistics.approvedRequests || 0}
          icon={CheckCircle2}
        />

        <StatCard
          title="Rejected"
          value={statistics.rejectedRequests || 0}
          icon={XCircle}
        />

        <StatCard
          title="Exited"
          value={statistics.exitedRequests || 0}
          icon={ArrowRight}
        />

        <StatCard
          title="Returned"
          value={statistics.returnedRequests || 0}
          icon={Activity}
        />
      </div>

      {/* Quick Actions */}

      <div className="grid gap-6 md:grid-cols-3">
        <ActionCard
          title="Apply New Outpass"
          icon={Plus}
          onClick={() => navigate("/student/apply-outpass")}
        />

        <ActionCard
          title="View History"
          icon={FileText}
          onClick={() => navigate("/student/history")}
        />

        <ActionCard
          title="Notifications"
          icon={Bell}
          onClick={() => navigate("/student/notifications")}
        />
      </div>
      {/* Current Outpass */}

      <SectionCard title="Current Outpass">
        {dashboard?.currentOutpass ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-green-700">
                  Active Outpass
                </h3>

                <p className="mt-1 text-sm text-green-600">
                  Your current approved outpass
                </p>
              </div>

              <span className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                {dashboard.currentOutpass.status}
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Destination</p>

                <h4 className="font-semibold text-slate-800">
                  {dashboard.currentOutpass.destination || "N/A"}
                </h4>
              </div>

              <div>
                <p className="text-sm text-slate-500">Purpose</p>

                <h4 className="font-semibold text-slate-800">
                  {dashboard.currentOutpass.reason || "N/A"}
                </h4>
              </div>

              <div>
                <p className="text-sm text-slate-500">Out Date</p>

                <h4 className="font-semibold text-slate-800">
                  {dashboard.currentOutpass.outDate
                    ? new Date(
                        dashboard.currentOutpass.outDate,
                      ).toLocaleDateString()
                    : "N/A"}
                </h4>
              </div>

              <div>
                <p className="text-sm text-slate-500">Return Date</p>

                <h4 className="font-semibold text-slate-800">
                  {dashboard.currentOutpass.returnDate
                    ? new Date(
                        dashboard.currentOutpass.returnDate,
                      ).toLocaleDateString()
                    : "N/A"}
                </h4>
              </div>
            </div>

            <button
              onClick={() =>
                navigate(`/student/outpass/${dashboard.currentOutpass._id}`)
              }
              className="
                mt-6
                rounded-xl
                bg-green-600
                px-5
                py-3
                font-semibold
                text-white
                hover:bg-green-700
              "
            >
              View Details
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <FileText className="mx-auto mb-4 text-slate-400" size={50} />

            <h3 className="text-lg font-bold text-slate-700">
              No Active Outpass
            </h3>

            <p className="mt-2 text-slate-500">
              You don't have any active outpass request.
            </p>

            <button
              onClick={() => navigate("/student/apply-outpass")}
              className="
                mt-5
                rounded-xl
                bg-green-600
                px-5
                py-3
                text-white
                hover:bg-green-700
              "
            >
              Apply Now
            </button>
          </div>
        )}
      </SectionCard>

      {/* Recent Activities */}

      <SectionCard title="Recent Activities">
        {dashboard?.recentActivities?.length ? (
          <div className="space-y-4">
            {dashboard.recentActivities.map((item) => (
              <div
                key={item._id}
                className="
                  flex
                  items-start
                  gap-4
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-4
                "
              >
                <div className="rounded-full bg-green-100 p-3">
                  <Activity className="text-green-600" size={20} />
                </div>

                <div className="flex-1">
                  <p className="font-medium text-slate-800">
                    {item.message || item.description || "Activity"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <Activity className="mx-auto mb-4 text-slate-400" size={48} />

            <p className="text-slate-500">No recent activities available.</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};
const StatCard = ({ title, value, icon: Icon }) => (
  <div
    className="
      rounded-3xl
      bg-white
      border
      border-slate-200
      shadow-lg
      p-6
      hover:shadow-xl
      transition
    "
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>

        <h2 className="mt-3 text-4xl font-bold text-slate-900">{value}</h2>
      </div>

      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-green-100
        "
      >
        <Icon className="h-7 w-7 text-green-600" />
      </div>
    </div>
  </div>
);

const ActionCard = ({ title, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="
      flex
      items-center
      justify-between
      rounded-3xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-lg
      transition
      hover:-translate-y-1
      hover:shadow-xl
    "
  >
    <div className="flex items-center gap-4">
      <div
        className="
          rounded-xl
          bg-green-100
          p-3
        "
      >
        <Icon className="h-6 w-6 text-green-600" />
      </div>

      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>

    <ArrowRight className="h-5 w-5 text-slate-400" />
  </button>
);

const SectionCard = ({ title, children }) => (
  <div
    className="
      rounded-3xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-lg
    "
  >
    <h2 className="mb-6 text-xl font-bold text-slate-800">{title}</h2>

    {children}
  </div>
);

export default Dashboard;
