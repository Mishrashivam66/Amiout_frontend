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

const FACULTY_ROLES = new Set(["MENTOR", "COORDINATOR", "HOD", "HOI"]);

// ==========================================
// HELPERS
// ==========================================

const normalizeRole = (role) =>
  String(role || "")
    .trim()
    .toUpperCase();

const isAssignmentActive = (assignment) => {
  if (!assignment || assignment.isActive !== true) {
    return false;
  }

  const now = Date.now();

  if (assignment.startsAt) {
    const start = new Date(assignment.startsAt).getTime();

    if (!Number.isFinite(start) || start > now) {
      return false;
    }
  }

  if (assignment.expiresAt) {
    const expiry = new Date(assignment.expiresAt).getTime();

    if (!Number.isFinite(expiry) || expiry <= now) {
      return false;
    }
  }

  return true;
};

// ==========================================
// RESOLVE SERVER-GRANTED ROLES
// ==========================================

const getGrantedRoles = (user) => {
  if (!user) return [];

  const declared = new Set();

  if (Array.isArray(user.roles)) {
    user.roles.forEach((role) => {
      const value = normalizeRole(role);

      if (value) {
        declared.add(value);
      }
    });
  }

  const primaryRole = normalizeRole(user.role);

  if (primaryRole) {
    declared.add(primaryRole);
  }

  // When assignments are included in the
  // API profile, filter inactive faculty roles.
  //
  // The backend remains the final authority.

  if (Array.isArray(user.roleAssignments)) {
    const activeFacultyRoles = new Set(
      user.roleAssignments
        .filter(isAssignmentActive)
        .map((assignment) => normalizeRole(assignment.role)),
    );

    return [...declared].filter(
      (role) => !FACULTY_ROLES.has(role) || activeFacultyRoles.has(role),
    );
  }

  // The existing /auth/me endpoint returns
  // server-authorized roles without assignments.

  return [...declared];
};

// ==========================================
// FALLBACK DASHBOARD
// ==========================================

const getFallbackRoute = (grantedRoles, selectedRole) => {
  const role = normalizeRole(selectedRole);

  if (grantedRoles.includes(role) && DASHBOARD_ROUTES[role]) {
    return DASHBOARD_ROUTES[role];
  }

  const firstValidRole = grantedRoles.find((item) => DASHBOARD_ROUTES[item]);

  return firstValidRole ? DASHBOARD_ROUTES[firstValidRole] : "/login";
};

// ==========================================
// AUTH LOADING SCREEN
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
// ACCESS DENIED SCREEN
// ==========================================

const AccessDeniedScreen = () => (
  <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-white">
    <div className="max-w-md">
      <div className="mb-5 text-5xl">🔒</div>

      <h1 className="text-2xl font-bold">Access Denied</h1>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        Your account does not have permission to access this portal with the
        currently selected role.
      </p>
    </div>
  </main>
);

// ==========================================
// PROTECTED ROUTE
// ==========================================

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  const location = useLocation();

  // ========================================
  // 1. WAIT FOR AUTHENTICATION
  // ========================================

  if (loading) {
    return <AuthLoadingScreen />;
  }

  // ========================================
  // 2. REQUIRE AUTHENTICATION
  // ========================================

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ========================================
  // 3. RESOLVE CURRENT AUTHORIZED ROLES
  // ========================================

  const grantedRoles = getGrantedRoles(user);

  // Backend-issued role is authoritative.
  // AuthContext updates user.role after
  // successful backend role switching.

  const selectedRole = normalizeRole(user.role);

  const fallbackRoute = getFallbackRoute(grantedRoles, selectedRole);

  // ========================================
  // 4. FIRST-LOGIN PASSWORD CHANGE
  // ========================================

  const mustChangePassword = user.mustChangePassword === true;

  const isPasswordChangeRoute = location.pathname === "/change-password";

  if (mustChangePassword && !isPasswordChangeRoute) {
    return <Navigate to="/change-password" replace />;
  }

  // ========================================
  // 5. PREVENT UNNECESSARY PASSWORD CHANGE
  // ========================================

  if (isPasswordChangeRoute && !mustChangePassword) {
    if (fallbackRoute === "/login") {
      return <AccessDeniedScreen />;
    }

    return <Navigate to={fallbackRoute} replace />;
  }

  // ========================================
  // 6. VALIDATE REQUESTED ROUTE ROLE
  // ========================================

  const allowedRoles = Array.isArray(roles)
    ? roles.map(normalizeRole).filter(Boolean)
    : [];

  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(
      (role) => grantedRoles.includes(role) && selectedRole === role,
    );

    if (!hasRequiredRole) {
      // Prevent redirect loops when the
      // current route is already the fallback.

      if (fallbackRoute === "/login" || location.pathname === fallbackRoute) {
        return <AccessDeniedScreen />;
      }

      return <Navigate to={fallbackRoute} replace />;
    }
  }

  // ========================================
  // 7. AUTHORIZED PAGE
  // ========================================

  return children;
};

export default ProtectedRoute;
