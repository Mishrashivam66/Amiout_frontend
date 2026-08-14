import { Bell, LogOut, Menu, Search, ChevronDown } from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";

const MentorNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-20
        backdrop-blur-xl
        bg-white/80
        border-b
        border-slate-200
        shadow-sm
      "
    >
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="
              lg:hidden
              h-11
              w-11
              rounded-xl
              border
              border-slate-200
              bg-white
              flex
              items-center
              justify-center
              hover:bg-slate-100
              transition
            "
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div
            className="
              hidden
              md:flex
              items-center
              gap-3
              h-11
              w-[340px]
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              px-4
              focus-within:border-blue-500
              focus-within:bg-white
              transition
            "
          >
            <Search size={18} className="text-slate-500" />

            <input
              type="text"
              placeholder="Search students, outpass..."
              className="
                flex-1
                bg-transparent
                outline-none
                text-sm
                placeholder:text-slate-400
              "
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Notification */}
          <button
            className="
              relative
              h-11
              w-11
              rounded-2xl
              border
              border-slate-200
              bg-white
              flex
              items-center
              justify-center
              hover:bg-blue-50
              hover:border-blue-300
              transition
            "
          >
            <Bell size={20} />

            <span
              className="
                absolute
                -top-1
                -right-1
                min-w-[20px]
                h-5
                rounded-full
                bg-red-500
                text-white
                text-[11px]
                font-bold
                flex
                items-center
                justify-center
                px-1
              "
            >
              0
            </span>
          </button>

          {/* User Card */}
          <div
            className="
              hidden
              md:flex
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-3
              py-2
            "
          >
            <div
              className="
                h-11
                w-11
                rounded-full
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                flex
                items-center
                justify-center
                text-white
                font-bold
                text-lg
              "
            >
              {user?.name?.charAt(0)?.toUpperCase() || "M"}
            </div>

            <div className="leading-tight">
              <h3 className="font-semibold text-slate-800 text-sm">
                {user?.name || "Mentor"}
              </h3>

              <p className="text-xs text-slate-500">Mentor</p>
            </div>

            <ChevronDown size={18} className="text-slate-400" />
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="
              h-11
              rounded-2xl
              bg-gradient-to-r
              from-red-500
              to-red-600
              px-5
              text-white
              flex
              items-center
              gap-2
              font-medium
              shadow-lg
              shadow-red-200
              hover:scale-105
              transition
            "
          >
            <LogOut size={18} />

            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default MentorNavbar;
