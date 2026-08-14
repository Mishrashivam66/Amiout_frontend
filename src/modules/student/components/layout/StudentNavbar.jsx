// ==========================================
// Project : AMIOUT
// Module  : Student
// File    : StudentNavbar.jsx
// ==========================================

import { Menu, Bell, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../../context/AuthContext";

const StudentNavbar = ({ setOpen }) => {
  const navigate = useNavigate();

  const { user } = useAuth();

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-20
        items-center
        justify-between
        border-b
        border-slate-200
        bg-white
        px-4
        sm:px-6
        lg:px-8
      "
    >
      {/* ==========================================
          Left Section
      ========================================== */}

      <div className="flex items-center gap-4">
        {/* Mobile Menu */}

        <button
          onClick={() => setOpen(true)}
          className="
            rounded-xl
            p-2
            text-slate-700
            transition
            hover:bg-slate-100
            lg:hidden
          "
        >
          <Menu size={24} />
        </button>

        {/* Title */}

        <div>
          <h1 className="text-lg font-bold text-slate-800 sm:text-xl">
            Student Dashboard
          </h1>

          <p className="hidden text-sm text-slate-500 sm:block">
            Welcome back, {user?.name || "Student"}
          </p>
        </div>
      </div>

      {/* ==========================================
          Right Section
      ========================================== */}

      <div className="flex items-center gap-3">
        {/* Notification */}

        <button
          onClick={() => navigate("/student/notifications")}
          className="
            relative
            rounded-xl
            p-2
            text-slate-700
            transition
            hover:bg-slate-100
          "
        >
          <Bell size={22} />

          <span
            className="
              absolute
              right-1
              top-1
              h-2.5
              w-2.5
              rounded-full
              bg-red-500
            "
          />
        </button>

        {/* Profile */}

        <button
          onClick={() => navigate("/student/profile")}
          className="
            flex
            items-center
            gap-3
            rounded-xl
            px-2
            py-2
            transition
            hover:bg-slate-100
            sm:px-3
          "
        >
          {/* User Info */}

          <div className="hidden text-right sm:block">
            <h3 className="text-sm font-semibold text-slate-800">
              {user?.name || "Student"}
            </h3>

            <p className="text-xs text-slate-500">Student</p>
          </div>

          {/* Avatar */}

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-green-600
              text-white
            "
          >
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <UserCircle size={30} />
            )}
          </div>
        </button>
      </div>
    </header>
  );
};

export default StudentNavbar;
