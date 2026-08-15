// ==========================================
// AMIOUT Enterprise Edition
// AuthContext.jsx
// ==========================================
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile as getStudentProfile } from "../modules/auth/services/auth.service";
import { getAdminProfile } from "../modules/auth/services/adminAuth.service";
import { getProfile as getMentorProfile } from "../modules/mentor/services/mentor.service";
import toast from "react-hot-toast";
// ==========================================
// CONTEXT
// ==========================================

const AuthContext = createContext();

// ==========================================
// PROVIDER
// ==========================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // ==========================================
  // AUTO LOGIN
  // ==========================================

  // ==========================================
  // AUTO LOGIN
  // ==========================================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const role = localStorage.getItem("role");

        if (!accessToken) {
          setLoading(false);
          return;
        }

        setToken(accessToken);

        let response;

        switch (role) {
          case "ADMIN":
            response = await getAdminProfile();
            break;

          case "MENTOR":
            response = await getMentorProfile();
            break;

          case "STUDENT":
          default:
            response = await getStudentProfile();
            break;
        }

        const userData = response.user || response.data || response;

        setUser(userData);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Session expired. Please login again.",
        );

        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");

        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);
  // ==========================================
  // LOGIN
  // ==========================================

  const login = (userData, accessToken) => {
    localStorage.setItem("accessToken", accessToken);

    localStorage.setItem("role", userData.role);

    localStorage.setItem("user", JSON.stringify(userData));

    setToken(accessToken);

    setUser(userData);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);

    toast.success("Logged out successfully");

    navigate("/login", { replace: true });
  };
  // ==========================================
  // UPDATE USER
  // ==========================================

  const updateUser = (userData) => {
    setUser(userData);
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useAuth = () => useContext(AuthContext);
