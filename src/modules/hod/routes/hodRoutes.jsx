import { Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../../../routes/ProtectedRoute";

import AuthorityLayout from "../../facultyAuthority/components/AuthorityLayout";

import AuthorityDashboard from "../../facultyAuthority/components/AuthorityDashboard";

import HODDashboard from "../pages/HODDashboard";

import DepartmentStudents from "../pages/DepartmentStudents";

import FacultyAvailability from "../pages/FacultyAvailability";

import HODProfile from "../pages/Profile";

// ============================================================
// AMIOUT ENTERPRISE - HOD ROUTES
// ============================================================

const HODRoutes = (
  <Route
    path="/hod"
    element={
      <ProtectedRoute roles={["HOD"]}>
        <AuthorityLayout role="HOD" />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="dashboard" replace />} />

    <Route path="dashboard" element={<HODDashboard />} />

    <Route
      path="outpasses"
      element={<AuthorityDashboard role="HOD" initialStatus="ALL" />}
    />

    <Route
      path="pending"
      element={<AuthorityDashboard role="HOD" initialStatus="PENDING" />}
    />

    <Route
      path="approved"
      element={<AuthorityDashboard role="HOD" initialStatus="APPROVED" />}
    />

    <Route
      path="rejected"
      element={<AuthorityDashboard role="HOD" initialStatus="REJECTED" />}
    />

    <Route path="students" element={<DepartmentStudents />} />

    <Route path="faculty-availability" element={<FacultyAvailability />} />

    <Route path="profile" element={<HODProfile />} />
  </Route>
);

export default HODRoutes;
