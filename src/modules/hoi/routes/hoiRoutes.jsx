import { Route, Navigate, Outlet } from "react-router-dom";

import ProtectedRoute from "../../../routes/ProtectedRoute";

import HOIDashboard from "../pages/HOIDashboard";

import AuthorityDashboard from "../../facultyAuthority/components/AuthorityDashboard";

// ============================================================
// AMIOUT ENTERPRISE - HOI ROUTES
// ============================================================

const HOIRoutes = (
  <Route
    path="/hoi"
    element={
      <ProtectedRoute roles={["HOI"]}>
        <Outlet />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="dashboard" replace />} />

    <Route path="dashboard" element={<HOIDashboard />} />

    <Route
      path="outpasses"
      element={<AuthorityDashboard role="HOI" initialStatus="ALL" />}
    />

    <Route
      path="pending"
      element={<AuthorityDashboard role="HOI" initialStatus="PENDING" />}
    />

    <Route
      path="approved"
      element={<AuthorityDashboard role="HOI" initialStatus="APPROVED" />}
    />

    <Route
      path="rejected"
      element={<AuthorityDashboard role="HOI" initialStatus="REJECTED" />}
    />
  </Route>
);

export default HOIRoutes;
