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

const MentorRoutes = (
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
);

export default MentorRoutes;
