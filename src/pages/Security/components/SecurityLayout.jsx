import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import api from "../../../services/api";

import SecuritySidebar from "./SecuritySidebar";
import SecurityNavbar from "./SecurityNavbar";

export default function SecurityLayout({ onLogout }) {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  // ==========================================================
  // LOGOUT
  //
  // Prefer the application's existing auth-context
  // logout function through onLogout.
  //
  // Fallback handles common local token storage.
  // Align this with your real authentication service.
  // ==========================================================

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      if (typeof onLogout === "function") {
        await onLogout();
        return;
      }

      // Best-effort server-side logout.
      // Adjust route if your backend uses another path.
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.warn("Server logout unavailable:", error?.message);
      }

      // Common local authentication keys.
      // Add keys used by your auth service if different.
      const keys = [
        "accessToken",
        "refreshToken",
        "token",
        "user",
        "authUser",
        "activeRole",
      ];

      keys.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <SecuritySidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <SecurityNavbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="min-w-0 flex-1 overflow-x-hidden">
            <Outlet />
          </main>

          <footer className="border-t border-slate-800 px-5 py-4 text-center text-xs text-slate-500">
            © AMIOUT Enterprise Edition · University Security Portal
          </footer>
        </div>
      </div>
    </div>
  );
}
