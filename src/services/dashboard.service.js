
import api from "./api";

// ============================================================================
// Dashboard Service
// ============================================================================

class DashboardService {
  // ============================================================================
// Get Dashboard Statistics
// ============================================================================
  async getDashboard() {
    const response = await api.get("/admin/dashboard");

    return response;
  }

  // ============================================================================
// Refresh Dashboard
// ============================================================================
  async refreshDashboard() {
    const response = await api.get("/admin/dashboard");

    return response;
  }

  // ============================================================================
// Get Recent Activities
// ============================================================================
  async getRecentActivities() {
    const response = await api.get("/admin/dashboard/recent-activities");

    return response;
  }

  // ============================================================================
// Get Dashboard Analytics
// ============================================================================
  async getAnalytics() {
    const response = await api.get("/admin/dashboard/analytics");

    return response;
  }

  // ============================================================================
// Get Dashboard Summary
// ============================================================================
  async getSummary() {
    const response = await api.get("/admin/dashboard/summary");

    return response;
  }
}

export default new DashboardService();
