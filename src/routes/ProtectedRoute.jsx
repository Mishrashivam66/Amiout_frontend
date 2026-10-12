import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

// ==========================================
// ROLE DASHBOARD ROUTES
// ==========================================

const DASHBOARD_ROUTES = Object.freeze({
  STUDENT: "/student/dashboard",
  MENTOR: "/mentor/dashboard",
  COORDINATOR: "/coordinator/dashboard",
  HOD: "/hod/dashboard",
  HOI: "/hoi/dashboard",
  ADMIN: "/admin/dashboard",
  SECURITY: "/security/dashboard",
  SUPER_ADMIN: "/super-admin/dashboard",
});

// ==========================================
// HELPERS
// ==========================================

const normalizeRole = (role) =>
  String(role || "")
    .trim()
    .toUpperCase();

// ==========================================
// LOADING SCREEN
// ==========================================

const AuthLoadingScreen = () => (
  <main className="flex min-h-screen items-center justify-center bg-[#020817] px-4 text-white">
    <div className="text-center">
      <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />

      <h2 className="text-lg font-semibold">Verifying Your Session</h2>

      <p className="mt-2 text-sm text-slate-400">
        Please wait while we securely verify your account.
      </p>
    </div>
  </main>
);

// ==========================================
// PROTECTED ROUTE
// ==========================================

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, isAuthenticated, activeRole } = useAuth();

  const location = useLocation();

  // ========================================
  // WAIT FOR AUTH INITIALIZATION
  // ========================================

  if (loading) {
    return <AuthLoadingScreen />;
  }

  // ========================================
  // REQUIRE LOGIN
  // ========================================

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // ========================================
  // RESOLVE ACTIVE ROLE
  // ========================================

  const currentRole = normalizeRole(activeRole || user.role);

  // ========================================
  // MANDATORY PASSWORD CHANGE
  // ========================================

  const mustChangePassword = user.mustChangePassword === true;

  const isPasswordChangeRoute = location.pathname === "/change-password";

  // A temporary-password user cannot
  // access any other protected page.

  if (mustChangePassword && !isPasswordChangeRoute) {
    return <Navigate to="/change-password" replace />;
  }

  // ========================================
  // PASSWORD CHANGE PAGE ACCESS
  // ========================================

  // If password setup is already complete,
  // redirect away from the mandatory
  // first-login page.

  if (isPasswordChangeRoute && !mustChangePassword) {
    return <Navigate to={DASHBOARD_ROUTES[currentRole] || "/login"} replace />;
  }

  // ========================================
  // ROLE AUTHORIZATION
  // ========================================

  const allowedRoles = roles.map(normalizeRole);

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to={DASHBOARD_ROUTES[currentRole] || "/login"} replace />;
  }

  // ========================================
  // AUTHORIZED ACCESS
  // ========================================

  return children;
};

export default ProtectedRoute;
