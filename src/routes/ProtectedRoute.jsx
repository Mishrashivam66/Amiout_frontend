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

const getGrantedRoles = (user) => {
  const declared = new Set();

  if (Array.isArray(user?.roles)) {
    user.roles.forEach((role) => {
      const value = normalizeRole(role);
      if (value) declared.add(value);
    });
  }

  const primary = normalizeRole(user?.role);

  if (primary) declared.add(primary);

  // If the API provides actual role assignments,
  // only active assignments can grant faculty roles.
  if (Array.isArray(user?.roleAssignments)) {
    const activeFacultyRoles = new Set(
      user.roleAssignments
        .filter(isAssignmentActive)
        .map((assignment) => normalizeRole(assignment.role)),
    );

    return [...declared].filter(
      (role) => !FACULTY_ROLES.has(role) || activeFacultyRoles.has(role),
    );
  }

  // For session payloads that do not include assignments,
  // this is a UI guard based on server-issued role claims.
  // Backend endpoints MUST enforce actual authorization.
  return [...declared];
};

const getFallbackRoute = (grantedRoles, preferredRole) => {
  const preferred = normalizeRole(preferredRole);

  if (grantedRoles.includes(preferred)) {
    return DASHBOARD_ROUTES[preferred] || "/login";
  }

  const firstRole = grantedRoles.find((role) => DASHBOARD_ROUTES[role]);

  return DASHBOARD_ROUTES[firstRole] || "/login";
};

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

  // 1. Wait for authentication
  if (loading) {
    return <AuthLoadingScreen />;
  }

  // 2. Require login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Resolve server-granted account roles
  const grantedRoles = getGrantedRoles(user);

  // activeRole is a UI preference, not an authorization grant.
  const fallbackRoute = getFallbackRoute(grantedRoles, activeRole || user.role);

  // 4. Mandatory first-login password change
  const mustChangePassword = user.mustChangePassword === true;

  const isPasswordChangeRoute = location.pathname === "/change-password";

  if (mustChangePassword && !isPasswordChangeRoute) {
    return <Navigate to="/change-password" replace />;
  }

  // 5. Prevent unnecessary password-change access
  if (isPasswordChangeRoute && !mustChangePassword) {
    return <Navigate to={fallbackRoute} replace />;
  }

  // 6. Validate requested route role
  const allowedRoles = roles.map(normalizeRole);

  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some((role) =>
      grantedRoles.includes(role),
    );

    if (!hasRequiredRole) {
      // Avoid repeatedly redirecting to the same route.
      if (location.pathname === fallbackRoute) {
        return (
          <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-white">
            <div>
              <h1 className="text-xl font-bold">Access Denied</h1>

              <p className="mt-2 text-sm text-slate-400">
                Your account is not authorized for this portal.
              </p>
            </div>
          </main>
        );
      }

      return <Navigate to={fallbackRoute} replace />;
    }
  }

  // 7. Authorized page
  return children;
};

export default ProtectedRoute;
