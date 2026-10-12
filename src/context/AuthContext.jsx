/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  getProfile,
  logout as logoutService,
} from "../modules/auth/services/auth.service";

// ==========================================
// AUTH CONTEXT
// ==========================================

const AuthContext = createContext(null);

// ==========================================
// HELPERS
// ==========================================

const normalizeRole = (role) =>
  String(role || "")
    .trim()
    .toUpperCase();

const getUserRoles = (userData) => {
  if (!userData) return [];

  const roles = Array.isArray(userData.roles) ? userData.roles : [];

  return [
    ...new Set(
      [...roles, userData.role]
        .filter((role) => typeof role === "string" && role.trim())
        .map(normalizeRole),
    ),
  ];
};

const extractUser = (response) =>
  response?.user || response?.data?.user || response?.data || response;

const getStoredRole = () =>
  normalizeRole(
    localStorage.getItem("activeRole") || localStorage.getItem("role"),
  ) || null;

const clearStoredSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  localStorage.removeItem("activeRole");
  localStorage.removeItem("user");
};

const normalizeUser = (userData) => {
  if (
    !userData ||
    typeof userData !== "object" ||
    !userData.id ||
    !userData.accountType
  ) {
    throw new Error("Invalid authentication profile.");
  }

  const assignedRoles = getUserRoles(userData);

  const selectedRole = normalizeRole(userData.role);

  if (!selectedRole || !assignedRoles.includes(selectedRole)) {
    throw new Error("No authorized active role available.");
  }

  return {
    ...userData,

    role: selectedRole,
    roles: assignedRoles,

    mustChangePassword: userData.mustChangePassword === true,
  };
};

// ==========================================
// AUTH PROVIDER
// ==========================================

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

  const [activeRole, setActiveRole] = useState(getStoredRole);

  const [loading, setLoading] = useState(true);

  // Prevent an in-flight /me response
  // from restoring a session after logout.

  const sessionVersionRef = useRef(0);

  const roles = getUserRoles(user);

  // ========================================
  // CLEAR LOCAL SESSION
  // ========================================

  const clearSession = useCallback(() => {
    sessionVersionRef.current += 1;

    clearStoredSession();

    setUser(null);
    setToken(null);
    setActiveRole(null);
  }, []);

  // ========================================
  // SAVE AUTHENTICATED SESSION
  // ========================================

  const saveSession = useCallback((userData, accessToken) => {
    if (typeof accessToken !== "string" || !accessToken.trim()) {
      throw new Error("Invalid access token.");
    }

    const normalizedUser = normalizeUser(userData);

    sessionVersionRef.current += 1;

    localStorage.setItem("accessToken", accessToken);

    localStorage.setItem("user", JSON.stringify(normalizedUser));

    localStorage.setItem("role", normalizedUser.role);

    localStorage.setItem("activeRole", normalizedUser.role);

    setToken(accessToken);
    setUser(normalizedUser);

    setActiveRole(normalizedUser.role);

    setLoading(false);

    return normalizedUser;
  }, []);

  // ========================================
  // INITIALIZE AUTH
  // ========================================

  useEffect(() => {
    let mounted = true;

    const requestVersion = sessionVersionRef.current;

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");

      if (!storedToken) {
        if (mounted) {
          setUser(null);
          setToken(null);
          setActiveRole(null);
          setLoading(false);
        }

        return;
      }

      try {
        // /auth/me is allowed even when
        // mustChangePassword is true.

        const response = await getProfile();

        if (!mounted || requestVersion !== sessionVersionRef.current) {
          return;
        }

        const userData = extractUser(response);

        const normalizedUser = normalizeUser(userData);

        // The API interceptor may have
        // refreshed the access token
        // while /me was loading.

        const currentToken = localStorage.getItem("accessToken");

        if (!currentToken) {
          throw new Error("Session no longer exists.");
        }

        localStorage.setItem("user", JSON.stringify(normalizedUser));

        localStorage.setItem("role", normalizedUser.role);

        localStorage.setItem("activeRole", normalizedUser.role);

        setUser(normalizedUser);

        setToken(currentToken);

        setActiveRole(normalizedUser.role);
      } catch (error) {
        if (!mounted || requestVersion !== sessionVersionRef.current) {
          return;
        }

        console.error("Authentication initialization failed:", error);

        clearSession();

        toast.error("Session expired. Please login again.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [clearSession]);

  // ========================================
  // API SESSION EVENTS
  // ========================================

  useEffect(() => {
    const handleTokenRefreshed = (event) => {
      const refreshedToken =
        event?.detail?.accessToken || localStorage.getItem("accessToken");

      if (typeof refreshedToken === "string" && refreshedToken) {
        setToken(refreshedToken);
      }
    };

    const handleSessionExpired = () => {
      clearSession();

      navigate("/login", {
        replace: true,
      });

      toast.error("Your session has expired. Please login again.");
    };

    window.addEventListener(
      "amiout:access-token-refreshed",
      handleTokenRefreshed,
    );

    window.addEventListener("amiout:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener(
        "amiout:access-token-refreshed",
        handleTokenRefreshed,
      );

      window.removeEventListener(
        "amiout:session-expired",
        handleSessionExpired,
      );
    };
  }, [clearSession, navigate]);

  // ========================================
  // LOGIN
  // ========================================

  const login = (userData, accessToken) => {
    return saveSession(userData, accessToken);
  };

  // ========================================
  // SWITCH ROLE
  // ========================================

  const switchRole = (newRole) => {
    const normalizedRole = normalizeRole(newRole);

    if (!roles.includes(normalizedRole)) {
      toast.error("You are not authorized for this role.");

      return false;
    }

    if (normalizedRole === activeRole) {
      return true;
    }

    // A role switch must be authorized
    // by the backend and issue a token
    // for the selected active role.

    toast.error("Role switching requires a new authorized session.");

    return false;
  };

  // ========================================
  // LOGOUT
  // ========================================

  const logout = async (options = {}) => {
    const { skipServer = false, showToast = true } = options;

    // Revoke the refresh session
    // before removing the access token.
    //
    // skipServer is useful immediately
    // after a successful password change,
    // because the backend has already
    // revoked sessions and cleared
    // the refresh cookie.

    if (!skipServer) {
      try {
        await logoutService();
      } catch (error) {
        console.warn("Backend logout failed:", error);
      }
    }

    clearSession();

    navigate("/login", {
      replace: true,
    });

    if (showToast) {
      toast.success("Logged out successfully.");
    }
  };

  // ========================================
  // UPDATE USER
  // ========================================

  const updateUser = (userData) => {
    if (!userData) {
      return;
    }

    const mergedUser = {
      ...(user || {}),
      ...userData,
    };

    const normalizedUser = normalizeUser(mergedUser);

    setUser(normalizedUser);

    setActiveRole(normalizedUser.role);

    localStorage.setItem("user", JSON.stringify(normalizedUser));

    localStorage.setItem("role", normalizedUser.role);

    localStorage.setItem("activeRole", normalizedUser.role);
  };

  // ========================================
  // CONTEXT VALUE
  // ========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,

        roles,
        activeRole,

        login,
        logout,
        clearSession,
        updateUser,
        switchRole,

        mustChangePassword: user?.mustChangePassword === true,

        isAuthenticated: Boolean(token && user),

        hasRole: (role) => roles.includes(normalizeRole(role)),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// AUTH HOOK
// ==========================================

export const useAuth = () => useContext(AuthContext);
