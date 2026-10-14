import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  ClipboardCheck,
  History,
  Bell,
  User,
  ChevronLeft,
  ShieldCheck,
  GraduationCap,
  Menu,
  X,
  LogOut,
  Users,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";

const MENTOR_MENUS = [
  {
    title: "Dashboard",
    path: "/mentor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Students",
    path: "/mentor/students",
    icon: GraduationCap,
  },
  {
    title: "Pending Outpasses",
    path: "/mentor/pending-outpasses",
    icon: ClipboardCheck,
    badge: "New",
  },
  {
    title: "History",
    path: "/mentor/history",
    icon: History,
  },
  {
    title: "Notifications",
    path: "/mentor/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    path: "/mentor/profile",
    icon: User,
  },
];

const COORDINATOR_MENUS = [
  {
    title: "Dashboard",
    path: "/coordinator/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Students",
    path: "/coordinator/students",
    icon: Users,
  },
  {
    title: "Pending Outpasses",
    path: "/coordinator/pending-outpasses",
    icon: ClipboardCheck,
  },
  {
    title: "History",
    path: "/coordinator/history",
    icon: History,
  },
  {
    title: "Notifications",
    path: "/coordinator/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    path: "/coordinator/profile",
    icon: User,
  },
];

const MentorSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCoordinator =
    location.pathname === "/coordinator" ||
    location.pathname.startsWith("/coordinator/");

  const activeRole = isCoordinator ? "COORDINATOR" : "MENTOR";

  const menus = isCoordinator ? COORDINATOR_MENUS : MENTOR_MENUS;

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setMobileOpen(true)}
        className="fixed left-5 top-5 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xl lg:hidden"
      >
        <Menu size={22} />
      </button>

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col
          border-r border-slate-800
          bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
          shadow-2xl transition-all duration-300
          ${collapsed ? "lg:w-24" : "lg:w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-72
        `}
      >
        <div className="border-b border-slate-700/40 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg">
              <ShieldCheck size={30} className="text-white" />
            </div>

            {!collapsed && (
              <div>
                <h1 className="text-2xl font-bold text-white">AMIOUT</h1>

                <p className="text-sm text-slate-300">
                  {isCoordinator ? "Coordinator Portal" : "Mentor Portal"}
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="absolute right-4 top-4 rounded-xl bg-slate-800 p-2 text-slate-300 lg:hidden"
        >
          <X size={20} />
        </button>

        <div className="hidden justify-end px-4 pt-4 lg:flex">
          <button
            type="button"
            aria-label="Collapse sidebar"
            onClick={() => setCollapsed((value) => !value)}
            className="rounded-xl bg-slate-800 p-2 text-slate-300 transition hover:bg-blue-600 hover:text-white"
          >
            <ChevronLeft
              size={18}
              className={`transition ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-2">
            {menus.map((menu) => {
              const Icon = menu.icon;

              return (
                <li key={menu.path}>
                  <NavLink
                    to={menu.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `
                      group relative flex items-center
                      ${collapsed ? "justify-center" : "justify-between"}
                      rounded-2xl px-4 py-3
                      transition-all duration-300
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-900/30"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              isActive
                                ? "bg-white/20"
                                : "bg-slate-800 group-hover:bg-slate-700"
                            }`}
                          >
                            <Icon size={20} />
                          </div>

                          {!collapsed && (
                            <span className="font-medium tracking-wide">
                              {menu.title}
                            </span>
                          )}
                        </div>

                        {!collapsed && menu.badge && (
                          <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                            {menu.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-800 p-4">
          {!collapsed && (
            <div className="mb-4 rounded-2xl bg-slate-800/60 p-4">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "Faculty"}
              </p>

              <p className="truncate text-xs text-slate-400">
                {user?.email || ""}
              </p>

              <p className="mt-2 text-xs font-semibold text-cyan-300">
                {activeRole}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            className={`flex w-full items-center ${
              collapsed ? "justify-center" : "justify-start gap-3"
            } rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-medium text-white shadow-lg transition hover:from-red-600 hover:to-red-700`}
          >
            <LogOut size={20} />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default MentorSidebar;
