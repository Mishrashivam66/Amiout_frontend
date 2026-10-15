import { useEffect } from "react";
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
  X,
  LogOut,
  Users,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";

// ==========================================
// MENTOR MENU
// ==========================================

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

// ==========================================
// COORDINATOR MENU
// ==========================================

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

// ==========================================
// SIDEBAR COMPONENT
// ==========================================

const MentorSidebar = ({
  open = false,
  setOpen,
  collapsed = false,
  setCollapsed,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isCoordinator =
    location.pathname === "/coordinator" ||
    location.pathname.startsWith("/coordinator/");

  const activeRole = isCoordinator ? "COORDINATOR" : "MENTOR";

  const menus = isCoordinator ? COORDINATOR_MENUS : MENTOR_MENUS;

  const closeSidebar = () => {
    setOpen?.(false);
  };

  // ==========================================
  // CLOSE ON ROUTE CHANGE
  // ==========================================

  useEffect(() => {
    setOpen?.(false);
  }, [location.pathname, setOpen]);

  // ==========================================
  // ESC KEY + PREVENT BACKGROUND SCROLL
  // ==========================================

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen?.(false);
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen]);

  // ==========================================
  // JSX
  // ==========================================

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={closeSidebar}
          className="
            fixed inset-0 z-[90]
            bg-slate-950/65
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* SIDEBAR */}
      <aside
        id="faculty-sidebar"
        aria-label={`${activeRole} navigation`}
        className={`
          fixed inset-y-0 left-0 z-[100]
          flex h-screen w-72 flex-col
          border-r border-slate-800
          bg-gradient-to-b
          from-slate-950 via-slate-900 to-slate-950
          shadow-2xl

          transform-gpu
          transition-transform duration-300 ease-in-out

          ${collapsed ? "lg:w-24" : "lg:w-72"}

          ${open ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
        `}
      >
        {/* =====================================
            LOGO / HEADER
        ===================================== */}

        <div className="relative shrink-0 border-b border-slate-700/40 px-5 py-6">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-12 w-12 shrink-0
                items-center justify-center
                rounded-2xl
                bg-gradient-to-br from-blue-500 to-cyan-400
                shadow-lg shadow-blue-500/20
              "
            >
              <ShieldCheck size={27} className="text-white" />
            </div>

            <div className={collapsed ? "lg:hidden" : ""}>
              <h1 className="text-2xl font-extrabold tracking-wide text-white">
                AMIOUT
              </h1>

              <p className="text-xs font-medium text-slate-400">
                {isCoordinator ? "Coordinator Portal" : "Mentor Portal"}
              </p>
            </div>
          </div>

          {/* MOBILE CLOSE */}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={closeSidebar}
            className="
              absolute right-3 top-3
              flex h-9 w-9 items-center justify-center
              rounded-xl border border-slate-700
              bg-slate-800 text-slate-300
              transition hover:bg-slate-700 hover:text-white
              lg:hidden
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* =====================================
            DESKTOP COLLAPSE
        ===================================== */}

        <div className="hidden shrink-0 justify-end px-4 pt-4 lg:flex">
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed?.((previous) => !previous)}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-xl border border-slate-700
              bg-slate-800 text-slate-300
              transition hover:bg-blue-600 hover:text-white
            "
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <nav
          className="
            min-h-0 flex-1
            overflow-y-auto
            px-3 py-5
            scrollbar-thin
            scrollbar-thumb-slate-700
          "
        >
          <p
            className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            Main Navigation
          </p>

          <ul className="space-y-1.5">
            {menus.map((menu) => {
              const Icon = menu.icon;

              return (
                <li key={menu.path}>
                  <NavLink
                    to={menu.path}
                    title={collapsed ? menu.title : undefined}
                    onClick={closeSidebar}
                    className={({ isActive }) => `
                      group relative flex min-h-12
                      items-center gap-3
                      rounded-xl px-3 py-2.5
                      transition-all duration-200

                      ${collapsed ? "lg:justify-center" : ""}

                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-900/30"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-lg transition-colors

                            ${
                              isActive
                                ? "bg-white/20"
                                : "bg-slate-800 group-hover:bg-slate-700"
                            }
                          `}
                        >
                          <Icon size={19} />
                        </div>

                        <span
                          className={`flex-1 text-sm font-semibold tracking-wide ${
                            collapsed ? "lg:hidden" : ""
                          }`}
                        >
                          {menu.title}
                        </span>

                        {menu.badge && (
                          <span
                            className={`rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold uppercase text-white ${
                              collapsed ? "lg:hidden" : ""
                            }`}
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

        {/* =====================================
            FACULTY PROFILE / LOGOUT
        ===================================== */}

        <div className="shrink-0 border-t border-slate-800 p-4">
          <div
            className={`mb-4 rounded-2xl border border-slate-700/50 bg-slate-800/60 p-4 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-gradient-to-br from-blue-500 to-indigo-600
                  text-sm font-bold text-white
                "
              >
                {user?.name?.charAt(0)?.toUpperCase() || "F"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  {user?.name || "Faculty"}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <span className="inline-flex rounded-lg bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-cyan-300">
                {activeRole}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              closeSidebar();
              logout();
            }}
            className={`
              flex w-full items-center
              gap-3 rounded-xl
              bg-gradient-to-r from-red-600 to-rose-600
              px-4 py-3 text-sm font-bold text-white
              shadow-lg shadow-red-950/20
              transition hover:from-red-700 hover:to-rose-700

              ${collapsed ? "lg:justify-center" : ""}
            `}
          >
            <LogOut size={19} className="shrink-0" />

            <span className={collapsed ? "lg:hidden" : ""}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MentorSidebar;
