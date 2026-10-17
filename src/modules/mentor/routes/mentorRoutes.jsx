import { Fragment } from "react";
import { Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../../../routes/ProtectedRoute";

import MentorLayout from "../components/layout/MentorLayout";

// Shared pages
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import StudentDetails from "../pages/StudentDetails";
import PendingOutpasses from "../pages/PendingOutpasses";
import OutpassDetails from "../pages/OutpassDetails";
import History from "../pages/History";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";

import ComingSoon from "../../../components/common/ComingSoon";

// ============================================================
// MENTOR AND COORDINATOR ROUTES
// ============================================================

const MentorRoutes = (
  <Fragment>
    {/* =====================================================
        MENTOR PORTAL
        ===================================================== */}

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

    {/* =====================================================
        COORDINATOR PORTAL
        ===================================================== */}

    <Route
      path="/coordinator"
      element={
        <ProtectedRoute roles={["COORDINATOR"]}>
          <MentorLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />

      {/* Coordinator Dashboard */}
      <Route path="dashboard" element={<Dashboard />} />

      {/* Coordinator Students */}
      <Route path="students" element={<Students />} />

      {/* Keep disabled until coordinator-scoped
          student details API is implemented */}
      <Route path="students/:studentId" element={<ComingSoon />} />

      {/* Coordinator Pending Outpasses */}
      <Route path="pending-outpasses" element={<PendingOutpasses />} />

      {/* Coordinator Outpass Details */}
      <Route path="outpass/:outpassId" element={<OutpassDetails />} />

      {/* Coordinator History */}
      <Route path="history" element={<History />} />

      {/* Coordinator Notifications */}
      <Route path="notifications" element={<Notifications />} />

      {/* Shared Faculty Profile */}
      <Route path="profile" element={<Profile />} />
    </Route>
  </Fragment>
);

export default MentorRoutes;
