import { Fragment } from "react";
import { Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../../../routes/ProtectedRoute";

import MentorLayout from "../components/layout/MentorLayout";

import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import StudentDetails from "../pages/StudentDetails";
import PendingOutpasses from "../pages/PendingOutpasses";
import OutpassDetails from "../pages/OutpassDetails";
import History from "../pages/History";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";

import ComingSoon from "../../../components/common/ComingSoon";

const MentorRoutes = (
  <Fragment>
    {/* ==========================================
        MENTOR PORTAL
    ========================================== */}

    <Route
      path="/mentor"
      element={
        <ProtectedRoute roles={["MENTOR"]}>
          <MentorLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />

      <Route path="dashboard" element={<Dashboard />} />

      <Route path="students" element={<Students />} />

      <Route path="students/:studentId" element={<StudentDetails />} />

      <Route path="pending-outpasses" element={<PendingOutpasses />} />

      <Route path="outpass/:outpassId" element={<OutpassDetails />} />

      <Route path="history" element={<History />} />

      <Route path="notifications" element={<Notifications />} />

      <Route path="profile" element={<Profile />} />
    </Route>

    {/* ==========================================
        COORDINATOR PORTAL
    ========================================== */}

    <Route
      path="/coordinator"
      element={
        <ProtectedRoute roles={["COORDINATOR"]}>
          <MentorLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />

      {/* Dashboard requires Coordinator-specific API */}
      {/* COORDINATOR DASHBOARD */}
      <Route path="dashboard" element={<Dashboard />} />

      {/* Uses COORDINATOR API based on URL */}
      <Route path="students" element={<Students />} />

      {/* Coordinator-specific details not yet verified */}
      <Route path="students/:studentId" element={<ComingSoon />} />

      {/* Do not reuse Mentor approval actions here */}
      <Route path="pending-outpasses" element={<ComingSoon />} />

      <Route path="outpass/:outpassId" element={<ComingSoon />} />

      <Route path="history" element={<ComingSoon />} />

      <Route path="notifications" element={<ComingSoon />} />

      {/* Shared faculty profile */}
      <Route path="profile" element={<Profile />} />
    </Route>
  </Fragment>
);

export default MentorRoutes;
