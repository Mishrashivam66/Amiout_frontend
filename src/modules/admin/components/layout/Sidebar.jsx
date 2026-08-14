import { NavLink, useNavigate } from "react-router-dom";

import {
  FaChartPie,
  FaUsers,
  FaUserGraduate,
  FaClipboardList,
  FaFileImport,
  FaChartBar,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: FaChartPie,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: FaUsers,
  },
  {
    name: "Mentors",
    path: "/admin/mentors",
    icon: FaUserGraduate,
  },
  {
    name: "Outpasses",
    path: "/admin/outpasses",
    icon: FaClipboardList,
  },
  {
    name: "Imports",
    path: "/admin/imports",
    icon: FaFileImport,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: FaChartBar,
  },
  {
    name: "Notifications",
    path: "/admin/notifications",
    icon: FaBell,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: FaCog,
  },
];

const Sidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Token aur user data remove karo
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Agar aur data save hai to ye bhi kar sakte ho
    // localStorage.clear();

    // Login page par bhejo
    navigate("/login");
  };
  return (
    <div className="flex h-full flex-col bg-[#081018] text-white">
      {/* ====================================================== */}
      {/* Logo */}
      {/* ====================================================== */}

      <div className="flex items-center gap-3 border-b border-[#1E293B] px-6 py-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow-lg">
          <FaUserShield className="text-2xl text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-wide">AMIOUT</h1>

          <p className="text-xs text-slate-400">Smart Outpass ERP</p>
        </div>
      </div>

      {/* ====================================================== */}
      {/* Navigation */}
      {/* ====================================================== */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-4 rounded-xl px-4 py-3
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-green-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-[#122131] hover:text-green-400"
                    }
                  `
                  }
                >
                  <Icon className="text-lg" />

                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ====================================================== */}
      {/* Admin Profile */}
      {/* ====================================================== */}

      <div className="border-t border-[#1E293B] p-5">
        <div className="rounded-2xl border border-[#1E293B] bg-[#0F1724] p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 font-bold">
              A
            </div>

            <div>
              <h3 className="font-semibold">Admin Officer</h3>

              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="
    mt-5
    flex
    w-full
    items-center
    justify-center
    gap-3
    rounded-xl
    bg-red-600
    py-3
    font-medium
    transition-all
    duration-300
    hover:bg-red-700
  "
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
