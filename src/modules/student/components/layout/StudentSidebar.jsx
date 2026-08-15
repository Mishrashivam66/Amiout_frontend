// ==========================================
// Project : AMIOUT
// Module  : Student
// File    : StudentSidebar.jsx
// ==========================================

import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  UserCircle,
  FilePlus2,
  ClipboardList,
  History,
  Bell,
  Activity,
  UserCog,
  LogOut,
  X,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";

const navigation = [
  {
    title: "Dashboard",
    path: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Profile",
    path: "/student/profile",
    icon: UserCircle,
  },
  {
    title: "Complete Profile",
    path: "/student/complete-profile",
    icon: UserCog,
  },
  {
    title: "Apply Outpass",
    path: "/student/apply-outpass",
    icon: FilePlus2,
  },
  {
    title: "Active Outpass",
    path: "/student/active-outpass",
    icon: ClipboardList,
  },
  {
    title: "Outpass History",
    path: "/student/outpass/history",
    icon: History,
  },
  {
    title: "Notifications",
    path: "/student/notifications",
    icon: Bell,
  },
  {
    title: "Activities",
    path: "/student/activities",
    icon: Activity,
  },
];

const StudentSidebar = ({ open, setOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile Overlay */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-72
          flex-col
          bg-slate-950
          text-white
          shadow-xl
          transition-transform
          duration-300

          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/10
            px-6
            py-5
          "
        >
          <div>
            <h1
              className="
                text-2xl
                font-extrabold
                tracking-wide
                text-green-400
              "
            >
              AMIOUT
            </h1>

            <p className="text-xs text-slate-400">Student Portal</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="
              rounded-lg
              p-2
              hover:bg-white/10
              lg:hidden
            "
          >
            <X size={24} />
          </button>
        </div>

        {/* User Section */}

        <div
          className="
            border-b
            border-white/10
            px-6
            py-6
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-green-500
              text-xl
              font-bold
            "
          >
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <h2
            className="
              mt-4
              font-semibold
            "
          >
            {user?.name || "Student"}
          </h2>

          <p
            className="
              truncate
              text-sm
              text-slate-400
            "
          >
            {user?.email}
          </p>
        </div>

        {/* Navigation */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-4
          "
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `
                  mb-2
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  transition-all

                  ${
                    isActive
                      ? "bg-green-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-green-500/20 hover:text-green-400"
                  }
                  `
                }
              >
                <Icon size={20} />

                <span className="font-medium">{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}

        {/* Logout */}

        <div
          className="
    border-t
    border-white/10
    p-4
  "
        >
          <button
            onClick={handleLogout}
            className="
      flex
      w-full
      items-center
      justify-center
      gap-3
      rounded-xl
      bg-red-600
      px-4
      py-3
      font-semibold
      text-white
      transition
      hover:bg-red-700
    "
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;
