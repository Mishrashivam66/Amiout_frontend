import { Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../../../routes/ProtectedRoute";
import StudentLayout from "../components/layout/StudentLayout";

import StudentDashboard from "../pages/Dashboard";
import StudentProfile from "../pages/Profile";
import CompleteProfile from "../pages/CompleteProfile";
import ActiveOutpass from "../pages/ActiveOutpass";
import ApplyOutpass from "../pages/ApplyOutpass";
import OutpassHistory from "../pages/OutpassHistory";
import OutpassDetails from "../pages/OutpassDetails";
import Notifications from "../pages/Notifications";
import Activities from "../pages/Activities";

const StudentRoutes = (
  <Route
    path="/student"
    element={
      <ProtectedRoute roles={["STUDENT"]}>
        <StudentLayout />
      </ProtectedRoute>
    }
  >
    {/* Default */}
    <Route index element={<Navigate to="/student/dashboard" replace />} />

    {/* Dashboard */}
    <Route path="dashboard" element={<StudentDashboard />} />

    {/* Profile */}
    <Route path="profile" element={<StudentProfile />} />
    <Route path="complete-profile" element={<CompleteProfile />} />

    {/* Outpass */}
    <Route path="apply-outpass" element={<ApplyOutpass />} />
    <Route path="active-outpass" element={<ActiveOutpass />} />
    <Route path="outpass/history" element={<OutpassHistory />} />
    <Route path="outpass/:outpassId" element={<OutpassDetails />} />

    {/* Activities */}
    <Route path="activities" element={<Activities />} />

    {/* Notifications */}
    <Route path="notifications" element={<Notifications />} />

    {/* Invalid Route - Prevent redirect loop */}
    <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
  </Route>
);

export default StudentRoutes;
