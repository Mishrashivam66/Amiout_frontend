import { useState } from "react";
import { NavLink } from "react-router-dom";

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
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";

/* ============================================================================
Sidebar Menu
============================================================================ */

const menus = [
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

/* ============================================================================
   Component
============================================================================ */

const MentorSidebar = () => {
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = (
    <>
      {/* ====================================================== */}
      {/* Logo */}
      {/* ====================================================== */}

      <div className="border-b border-slate-700/40 p-6">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-linear-to-r
              from-blue-500
              to-cyan-400
              shadow-lg
            "
          >
            <ShieldCheck className="text-white" size={30} />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-2xl font-bold tracking-wide text-white">
                AMIOUT
              </h1>

              <p className="text-sm text-slate-300">Mentor Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================== */}
      {/* Collapse Button */}
      {/* ====================================================== */}

      <div className="hidden lg:flex justify-end px-4 pt-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            rounded-xl
            bg-slate-800
            p-2
            text-slate-300
            transition
            hover:bg-blue-600
            hover:text-white
          "
        >
          <ChevronLeft
            size={18}
            className={`transition ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* ====================================================== */}
      {/* Navigation Starts Here */}
      {/* ====================================================== */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-2">
          {/* Continue in Part 2 */}
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <li key={menu.path}>
                <NavLink
                  to={menu.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
                    group
                    relative
                    flex
                    items-center
                    ${collapsed ? "justify-center" : "justify-between"}
                    rounded-2xl
                    px-4
                    py-3
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-900/30"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }
                  `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}
                      {isActive && (
                        <span
                          className="
                            absolute
                            left-0
                            top-2
                            bottom-2
                            w-1
                            rounded-r-full
                            bg-cyan-300
                          "
                        />
                      )}

                      {/* Left */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            transition
                            ${
                              isActive
                                ? "bg-white/20"
                                : "bg-slate-800 group-hover:bg-slate-700"
                            }
                          `}
                        >
                          <Icon size={20} />
                        </div>

                        {!collapsed && (
                          <span className="font-medium tracking-wide">
                            {menu.title}
                          </span>
                        )}
                      </div>

                      {/* Badge */}
                      {!collapsed && menu.badge && (
                        <span
                          className="
                            rounded-full
                            bg-red-500
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-white
                          "
                        >
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
      {/* ====================================================== */}
      {/* Bottom Section */}
      {/* ====================================================== */}
      {/* ====================================================== */}
      {/* Bottom Section */}
      {/* ====================================================== */}

      <div className="border-t border-slate-800 p-4">
        {/* User Info */}
        {!collapsed && (
          <div className="mb-4 rounded-2xl bg-slate-800/60 p-4">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name || "Mentor"}
            </p>

            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className={`
            flex
            w-full
            items-center
            ${collapsed ? "justify-center" : "justify-start gap-3"}
            rounded-2xl
            bg-gradient-to-r
            from-red-500
            to-red-600
            px-4
            py-3
            text-white
            font-medium
            shadow-lg
            shadow-red-900/20
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:from-red-600
            hover:to-red-700
          `}
        >
          <LogOut size={20} />

          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );
  return (
    <>
      {/* ====================================================== */}
      {/* Mobile Overlay */}
      {/* ====================================================== */}

      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-sm
            lg:hidden
          "
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ====================================================== */}
      {/* Mobile Menu Button */}
      {/* ====================================================== */}

      <button
        onClick={() => setMobileOpen(true)}
        className="
          fixed
          top-5
          left-5
          z-50
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-blue-600
          text-white
          shadow-xl
          lg:hidden
        "
      >
        <Menu size={22} />
      </button>

      {/* ====================================================== */}
      {/* Sidebar */}
      {/* ====================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          flex-col
          bg-gradient-to-b
          from-slate-950
          via-slate-900
          to-slate-950
          border-r
          border-slate-800
          shadow-2xl
          transition-all
          duration-300

          ${collapsed ? "lg:w-24" : "lg:w-72"}

          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}

          w-72
        `}
      >
        {/* Close Button Mobile */}

        <div className="absolute right-4 top-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(false)}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-slate-800
              text-slate-300
              hover:bg-red-500
              hover:text-white
              transition
            "
          >
            <X size={20} />
          </button>
        </div>

        {SidebarContent}
      </aside>
    </>
  );
};

export default MentorSidebar;
