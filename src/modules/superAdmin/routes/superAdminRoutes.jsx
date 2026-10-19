import { Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../../../routes/ProtectedRoute";

import SuperAdminLayout from "../components/layout/SuperAdminLayout";

import Dashboard from "../pages/Dashboard";
import AdminManagement from "../pages/AdminManagement";
import CreateAdmin from "../pages/CreateAdmin";
import Students from "../pages/Students";
import AllOutpasses from "../pages/AllOutpasses";
import Reports from "../pages/Reports";

// ============================================================
// AMIOUT ENTERPRISE - SUPER ADMIN ROUTES
// ============================================================

const SuperAdminRoutes = (
  <Route
    path="/super-admin"
    element={
      <ProtectedRoute roles={["SUPER_ADMIN"]}>
        <SuperAdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="dashboard" replace />} />

    <Route path="dashboard" element={<Dashboard />} />

    <Route path="admins" element={<AdminManagement />} />

    <Route path="admins/create" element={<CreateAdmin />} />

    <Route path="students" element={<Students />} />

    {/* UNIVERSITY-WIDE OUTPASS MONITORING */}
    <Route path="outpasses" element={<AllOutpasses />} />

    {/* UNIVERSITY AUDIT REPORT DOWNLOADS */}
    <Route path="reports" element={<Reports />} />

    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Route>
);

export default SuperAdminRoutes;
