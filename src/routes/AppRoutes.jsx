// ==========================================
// IMPORTS
// ==========================================

import { Routes, Route, Navigate } from "react-router-dom";

// ==========================================
// AUTH PAGES
// ==========================================
import MentorRoutes from "../modules/mentor/routes/mentorRoutes";
import LandingPage from "../modules/auth/pages/LandingPage";
import Login from "../modules/auth/pages/Login";
import Register from "../modules/auth/pages/Register";
import VerifyOTP from "../modules/auth/pages/VerifyOTP";
import ForgotPassword from "../modules/auth/pages/ForgotPassword";
import VerifyResetOTP from "../modules/auth/pages/VerifyResetOTP";
import ResetPassword from "../modules/auth/pages/ResetPassword";
import AdminLogin from "../modules/auth/admin-login/AdminLogin";
import AdminRegister from "../modules/auth/pages/AdminRegister";
// ==========================================
// ROUTE GUARD
// ==========================================

import ProtectedRoute from "./ProtectedRoute";

// ==========================================
// COMMON
// ==========================================

import NotFound from "../components/common/NotFound";

// ==========================================
// ADMIN MODULE
// ==========================================

import DashboardLayout from "../modules/admin/components/layout/DashboardLayout";

import AdminDashboard from "../modules/admin/pages/AdminDashboard";
import Users from "../modules/admin/pages/Users";
import Imports from "../modules/admin/pages/Imports";
import Reports from "../modules/admin/pages/Reports";
import Settings from "../modules/admin/pages/Settings";
import MentorList from "../modules/admin/pages/Mentors/MentorList";
import MentorRegister from "../modules/auth/pages/MentorRegister";
import MentorLogin from "../modules/auth/mentor-login/MentorLogin";
import MentorDashboard from "../modules/mentor/pages/Dashboard";
import StudentRoutes from "../modules/student/routes/studentRoutes";
import Outpasses from "../modules/admin/pages/Outpasses";
import Notifications from "../modules/admin/pages/Notifications";
// ==========================================

// ROUTES
// ==========================================

const AppRoutes = () => {
  return (
    <Routes>
      {/* ====================================== */}
      {/* PUBLIC ROUTES */}
      {/* ====================================== */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
      <Route path="/mentor/register" element={<MentorRegister />} />

      <Route path="/mentor/login" element={<MentorLogin />} />

      <Route path="/verify-otp" element={<VerifyOTP />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin/register" element={<AdminRegister />} />

      {/* ====================================== */}
      {/* ADMIN ROUTES */}
      {/* ====================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="imports" element={<Imports />} />
        <Route path="mentors" element={<MentorList />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="outpasses" element={<Outpasses />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {MentorRoutes}
      {/* Student Routes */}

      {StudentRoutes}

      {/* ====================================== */}
      {/* 404 */}
      {/* ====================================== */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
