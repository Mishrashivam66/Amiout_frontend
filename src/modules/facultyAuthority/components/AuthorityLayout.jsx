import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import AuthoritySidebar from "./AuthoritySidebar";
import AuthorityNavbar from "./AuthorityNavbar";

const AUTH_STORAGE_KEYS = [
  "token",
  "authToken",
  "accessToken",
  "refreshToken",
  "access_token",
  "refresh_token",
  "user",
  "authUser",
  "currentUser",
  "userData",
];

export default function AuthorityLayout({ role = "HOD" }) {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setSidebarOpen(false);

    // Clear only known application auth keys.
    for (const key of AUTH_STORAGE_KEYS) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }

    toast.success("Signing out...", {
      id: "authority-logout",
      duration: 1000,
    });

    // Full reload also resets in-memory auth state.
    window.setTimeout(() => {
      window.location.replace("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="flex min-h-screen">
        <AuthoritySidebar
          role={role}
          isOpen={sidebarOpen}
          collapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AuthorityNavbar
            role={role}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 xl:px-8">
            <div className="mx-auto max-w-[1500px]">
              <Outlet />
            </div>
          </main>

          <footer className="border-t border-slate-200/80 bg-white px-5 py-4">
            <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-2 text-[11px] text-slate-400 sm:flex-row">
              <span>© 2026 AMIOUT Enterprise Edition</span>
              <span>Amity University · Academic Authority Workspace</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
