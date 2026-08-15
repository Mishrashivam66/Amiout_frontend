import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import mentorService from "../services/mentor.service";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import TodaySummary from "../components/TodaySummary";
import PendingOutpassTable from "../components/PendingOutpassTable";
import RecentActivity from "../components/RecentActivity";
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
    <div className="space-y-5 md:space-y-6">
      {/* Header */}
      <DashboardHeader onRefresh={loadDashboard} />

      {/* Statistics */}
      <DashboardStats data={dashboard} />

      {/* Today's Summary */}
      <TodaySummary data={dashboard} />

      {/* Pending Requests */}
      <PendingOutpassTable onRefresh={loadDashboard} />

      {/* Recent Activity */}
      {dashboard.recentActivities?.length > 0 && (
        <RecentActivity activities={dashboard.recentActivities} />
      )}

      {/* Empty State */}
      {dashboard.totalStudents === 0 &&
        dashboard.pendingOutpasses === 0 &&
        dashboard.approvedToday === 0 &&
        dashboard.rejectedToday === 0 && <EmptyState />}
    </div>
  );
};

export default Dashboard;
