import { Bell, Menu, Search, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

const MentorNavbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect currently selected faculty portal.
  const isCoordinator =
    location.pathname === "/coordinator" ||
    location.pathname.startsWith("/coordinator/");

  const activeRole = isCoordinator ? "Coordinator" : "Mentor";

  const notificationPath = isCoordinator
    ? "/coordinator/notifications"
    : "/mentor/notifications";

  return (
    <header className="sticky top-0 z-40 h-20 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div className="hidden h-11 w-[340px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-500 focus-within:bg-white md:flex">
            <Search size={18} className="text-slate-500" />

            <input
              type="text"
              placeholder="Search students, outpass..."
              aria-label="Search students and outpasses"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Notification */}
          <button
            type="button"
            onClick={() => navigate(notificationPath)}
            aria-label="View notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white transition hover:border-blue-300 hover:bg-blue-50"
          >
            <Bell size={20} />

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
              0
            </span>
          </button>

          {/* User Card */}
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 md:flex">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "M"}
            </div>

            <div className="leading-tight">
              <h3 className="text-sm font-semibold text-slate-800">
                {user?.name || "Faculty"}
              </h3>

              <p className="text-xs text-slate-500">{activeRole}</p>
            </div>

            <ChevronDown size={18} className="text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MentorNavbar;
