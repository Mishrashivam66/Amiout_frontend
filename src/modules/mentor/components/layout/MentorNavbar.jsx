import { Bell, Menu, Search, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

const MentorNavbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // ACTIVE FACULTY ROLE
  // ==========================================

  const isCoordinator =
    location.pathname === "/coordinator" ||
    location.pathname.startsWith("/coordinator/");

  const activeRole = isCoordinator ? "Coordinator" : "Mentor";

  const notificationPath = isCoordinator
    ? "/coordinator/notifications"
    : "/mentor/notifications";

  // ==========================================
  // MOBILE MENU HANDLER
  // ==========================================

  const handleMenuClick = () => {
    if (typeof onMenuClick === "function") {
      onMenuClick();
    }
  };

  return (
    <header
      className="
        sticky top-0 z-40
        h-20 w-full
        border-b border-slate-200
        bg-white/90
        shadow-sm backdrop-blur-xl
      "
    >
      <div className="flex h-full items-center justify-between gap-3 px-4 md:px-6">
        {/* =====================================
            LEFT SIDE
        ===================================== */}

        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          {/* MOBILE HAMBURGER */}
          <button
            type="button"
            onClick={handleMenuClick}
            aria-label="Open navigation menu"
            aria-controls="faculty-sidebar"
            className="
              relative z-10
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              border border-slate-200
              bg-white text-slate-700
              shadow-sm
              transition-all duration-200
              hover:border-blue-300 hover:bg-blue-50
              active:scale-95
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-500
              lg:hidden
            "
          >
            <Menu size={23} strokeWidth={2.2} />
          </button>

          {/* SEARCH FIELD */}
          <div
            className="
              hidden h-11
              w-[240px] items-center gap-3
              rounded-2xl
              border border-slate-200
              bg-slate-50 px-4
              transition-all
              focus-within:border-blue-500
              focus-within:bg-white
              focus-within:ring-4
              focus-within:ring-blue-500/10
              md:flex xl:w-[340px]
            "
          >
            <Search size={18} className="shrink-0 text-slate-400" />

            <input
              type="search"
              placeholder="Search students, outpass..."
              aria-label="Search students and outpasses"
              className="
                min-w-0 flex-1
                bg-transparent text-sm
                text-slate-800 outline-none
                placeholder:text-slate-400
              "
            />
          </div>

          {/* MOBILE PAGE LABEL */}
          <div className="min-w-0 md:hidden">
            <p className="truncate text-sm font-bold text-slate-900">
              Faculty Portal
            </p>

            <p className="text-xs text-slate-500">{activeRole}</p>
          </div>
        </div>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          {/* NOTIFICATIONS */}
          <button
            type="button"
            onClick={() => navigate(notificationPath)}
            aria-label="View notifications"
            className="
              relative flex h-11 w-11
              items-center justify-center
              rounded-2xl
              border border-slate-200
              bg-white text-slate-700
              transition-all duration-200
              hover:border-blue-300
              hover:bg-blue-50
              hover:text-blue-600
            "
          >
            <Bell size={20} />

            {/* Replace this with real unread count later */}
            <span
              className="
                absolute -right-1 -top-1
                flex h-5 min-w-5
                items-center justify-center
                rounded-full bg-red-500
                px-1 text-[11px]
                font-bold text-white
              "
            >
              0
            </span>
          </button>

          {/* FACULTY PROFILE */}
          <div
            className="
              hidden items-center gap-3
              rounded-2xl
              border border-slate-200
              bg-white px-3 py-2
              shadow-sm
              md:flex
            "
          >
            <div
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-full
                bg-gradient-to-br
                from-blue-600 to-indigo-600
                text-lg font-bold text-white
              "
            >
              {user?.name?.charAt(0)?.toUpperCase() || "F"}
            </div>

            <div className="min-w-0 leading-tight">
              <h3 className="max-w-[160px] truncate text-sm font-semibold text-slate-800">
                {user?.name || "Faculty"}
              </h3>

              <p className="mt-1 text-xs font-medium text-slate-500">
                {activeRole}
              </p>
            </div>

            <ChevronDown size={18} className="text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MentorNavbar;
