
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Users, ClipboardList, CheckCircle2, XCircle } from "lucide-react";

import mentorService from "../services/mentor.service";

import DashboardHeader from "../components/DashboardHeader";
import WelcomeCard from "../components/WelcomeCard";
import StatsCards from "../components/StatsCards";
import TodaySummary from "../components/TodaySummary";
import DashboardChart from "../components/DashboardChart";
import RecentRequests from "../components/RecentRequests";
import PendingOutpassTable from "../components/PendingOutpassTable";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";
import EmptyState from "../components/EmptyState";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    totalStudents: 0,
    pendingOutpasses: 0,
    approvedToday: 0,
    rejectedToday: 0,
    recentRequests: [],
    recentActivities: [],
  });

  // =====================================================
  // Load Dashboard
  // =====================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await mentorService.getDashboard();

      if (response.success) {
        setDashboard(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =====================================================
  // Loader
  // =====================================================

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <WelcomeCard />

      {/* ================= Statistics ================= */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCards
          title="Students"
          value={dashboard.totalStudents}
          subtitle="Assigned Students"
          icon={Users}
          color="blue"
        />

        <StatsCards
          title="Pending"
          value={dashboard.pendingOutpasses}
          subtitle="Waiting Approval"
          icon={ClipboardList}
          color="yellow"
        />

        <StatsCards
          title="Approved"
          value={dashboard.approvedToday}
          subtitle="Approved Requests"
          icon={CheckCircle2}
          color="green"
        />

        <StatsCards
          title="Rejected"
          value={dashboard.rejectedToday}
          subtitle="Rejected Requests"
          icon={XCircle}
          color="red"
        />
      </div>

      {/* ================= Summary ================= */}

      <TodaySummary data={dashboard} />

      {/* ================= Main Grid ================= */}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left */}

        <div className="space-y-6 xl:col-span-2">
          <RecentRequests
            requests={dashboard.recentRequests || []}
            onRefresh={loadDashboard}
          />

          <PendingOutpassTable onRefresh={loadDashboard} />

          <DashboardChart data={dashboard} />
        </div>

        {/* Right */}

        <div className="space-y-6">
          <RecentActivity activities={dashboard.recentActivities || []} />

          <QuickActions />
        </div>
      </div>

      {/* Empty */}

      {dashboard.totalStudents === 0 &&
        dashboard.pendingOutpasses === 0 &&
        dashboard.approvedToday === 0 &&
        dashboard.rejectedToday === 0 && <EmptyState />}
    </div>
  );
};

export default Dashboard;
