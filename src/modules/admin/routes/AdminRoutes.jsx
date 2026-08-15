import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import Outpasses from "../pages/Outpasses";
import AdminDashboard from "../pages/AdminDashboard";
import Users from "../pages/Users";
import Imports from "../pages/Imports";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import MentorList from "../pages/Mentors/MentorList";
import Notifications from "../pages/Notifications";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="imports" element={<Imports />} />
        <Route path="mentors" element={<MentorList />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="outpasses" element={<Outpasses />} />

        {/* Notifications */}
        <Route path="notifications" element={<Notifications />} />

        <Route path="test" element={<h1 className="text-5xl">TEST PAGE</h1>} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
