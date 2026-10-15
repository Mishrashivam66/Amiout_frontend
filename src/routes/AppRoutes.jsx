import { Routes, Route, Navigate } from "react-router-dom";

// ==========================================
// COMMON PAGES
// ==========================================
import FacultyStudents from "../modules/mentor/pages/Students";
import LandingPage from "../modules/auth/pages/LandingPage";
import ComingSoon from "../components/common/ComingSoon";
import ActivateAccount from "../modules/auth/pages/ActivateAccount";
import SecurityDashboard from "../pages/Security/SecurityDashboard";
// ==========================================
// COMMON AUTH
// ==========================================
import ParentReview from "../modules/auth/pages/ParentReview";
import Login from "../modules/auth/pages/Login";
import VerifyOTP from "../modules/auth/pages/VerifyOTP";
import ForgotPassword from "../modules/auth/pages/ForgotPassword";
import VerifyResetOTP from "../modules/auth/pages/VerifyResetOTP";
import ResetPassword from "../modules/auth/pages/ResetPassword";
import ChangePassword from "../modules/auth/pages/ChangePassword";

// ==========================================
// LEGACY MENTOR PASSWORD RESET
// ==========================================

import MentorForgotPassword from "../modules/auth/pages/MentorForgotPassword";
import MentorVerifyResetOTP from "../modules/auth/pages/MentorVerifyResetOTP";
import MentorResetPassword from "../modules/auth/pages/MentorResetPassword";

// ==========================================
// ROUTE GUARD
// ==========================================

import ProtectedRoute from "./ProtectedRoute";

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
import Outpasses from "../modules/admin/pages/Outpasses";
import Notifications from "../modules/admin/pages/Notifications";
import SecurityGuards from "../modules/admin/pages/SecurityGuards";
// ==========================================
// MENTOR MODULE
// ==========================================

import MentorRoutes from "../modules/mentor/routes/mentorRoutes";

// ==========================================
// STUDENT MODULE
// ==========================================

import StudentRoutes from "../modules/student/routes/studentRoutes";

// ==========================================
// APP ROUTES
// ==========================================

const AppRoutes = () => {
  return (
    <Routes>
      {/* ====================================
          PUBLIC ROUTES
      ==================================== */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/activate-account" element={<ActivateAccount />} />
      <Route path="/parent/review/:token" element={<ParentReview />} />

      {/* ====================================
          LEGACY LOGIN REDIRECTS
      ==================================== */}

      <Route path="/mentor/login" element={<Navigate to="/login" replace />} />

      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      {/* ====================================
          DISABLE PUBLIC REGISTRATION
      ==================================== */}

      <Route path="/register" element={<Navigate to="/login" replace />} />

      <Route
        path="/student/register"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/mentor/register"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/admin/register"
        element={<Navigate to="/login" replace />}
      />

      {/* ====================================
          EMAIL OTP
      ==================================== */}

      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* ====================================
          COMMON PASSWORD RECOVERY
      ==================================== */}

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ====================================
          LEGACY MENTOR PASSWORD RESET
      ==================================== */}

      <Route
        path="/mentor/forgot-password"
        element={<MentorForgotPassword />}
      />

      <Route
        path="/mentor/verify-reset-otp"
        element={<MentorVerifyResetOTP />}
      />

      <Route path="/mentor/reset-password" element={<MentorResetPassword />} />

      {/* ====================================
          MANDATORY FIRST-LOGIN
          PASSWORD CHANGE
      ==================================== */}

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* ====================================
          ADMIN PROTECTED ROUTES
      ==================================== */}

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
        <Route path="security-guards" element={<SecurityGuards />} />
      </Route>

      {/* ====================================
          EXISTING MENTOR ROUTES
      ==================================== */}

      {MentorRoutes}

      {/* ====================================
          EXISTING STUDENT ROUTES
      ==================================== */}

      {StudentRoutes}

      {/* ====================================
          COORDINATOR DASHBOARD
      ==================================== */}

      {/* ====================================
          HOD DASHBOARD
      ==================================== */}

      <Route
        path="/hod/dashboard"
        element={
          <ProtectedRoute roles={["HOD"]}>
            <ComingSoon />
          </ProtectedRoute>
        }
      />

      {/* ====================================
          HOI DASHBOARD
      ==================================== */}

      <Route
        path="/hoi/dashboard"
        element={
          <ProtectedRoute roles={["HOI"]}>
            <ComingSoon />
          </ProtectedRoute>
        }
      />

      {/* ====================================
          SECURITY DASHBOARD
      ==================================== */}

      <Route
        path="/security/dashboard"
        element={
          <ProtectedRoute roles={["SECURITY"]}>
            <SecurityDashboard />
          </ProtectedRoute>
        }
      />

      {/* ====================================
          SUPER ADMIN DASHBOARD
      ==================================== */}

      <Route
        path="/super-admin/dashboard"
        element={
          <ProtectedRoute roles={["SUPER_ADMIN"]}>
            <ComingSoon />
          </ProtectedRoute>
        }
      />

      {/* ====================================
          OTHER ROUTES
      ==================================== */}

      <Route path="/terms" element={<ComingSoon />} />

      {/* ====================================
          UNKNOWN ROUTES
      ==================================== */}

      <Route path="*" element={<ComingSoon />} />
    </Routes>
  );
};

export default AppRoutes;
