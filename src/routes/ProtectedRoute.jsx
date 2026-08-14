import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>

          <h2 className="text-lg font-semibold text-slate-800">Loading...</h2>

          <p className="mt-2 text-slate-500">
            Please wait while we verify your session.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    let loginPath = "/login";

    if (location.pathname.startsWith("/mentor")) {
      loginPath = "/mentor/login";
    }

    if (location.pathname.startsWith("/admin")) {
      loginPath = "/admin/login";
    }

    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
