import { Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../../../routes/ProtectedRoute";

import AuthorityLayout from "../../facultyAuthority/components/AuthorityLayout";

import AuthorityDashboard from "../../facultyAuthority/components/AuthorityDashboard";

import HOIDashboard from "../pages/HOIDashboard";

import InstituteStudents from "../pages/InstituteStudents";

import FacultyAvailability from "../pages/FacultyAvailability.jsx";

import HOIProfile from "../pages/Profile";

// ============================================================
// AMIOUT ENTERPRISE - HOI PROTECTED ROUTES
// ============================================================

const HOIRoutes = (
  <Route
    path="/hoi"
    element={
      <ProtectedRoute roles={["HOI"]}>
        <AuthorityLayout role="HOI" />
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

    <Route path="students" element={<InstituteStudents />} />

    <Route path="faculty-availability" element={<FacultyAvailability />} />

    <Route path="profile" element={<HOIProfile />} />
  </Route>
);

export default HOIRoutes;
