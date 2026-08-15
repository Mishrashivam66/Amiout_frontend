import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaExpand,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

import { toast } from "react-hot-toast";

const Navbar = ({ openSidebar }) => {
  // ============================================================================
  // States
  // ============================================================================

  const [currentTime, setCurrentTime] = useState(new Date());

  const [profileOpen, setProfileOpen] = useState(false);

  const [notificationCount] = useState(4);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ============================================================================
  // Live Time
  // ============================================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================================
  // Close Dropdown Outside Click
  // ============================================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ============================================================================
  // Fullscreen
  // ============================================================================

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();

      toast.success("Entered Fullscreen");
    } else {
      document.exitFullscreen();

      toast.success("Exited Fullscreen");
    }
  };

  // ============================================================================
  // Logout
  // ============================================================================

  const handleLogout = () => {
    toast.success("Logout Successfully");

    // TODO:
    // Clear Token
    // Navigate Login
  };

  return (
    <header
      className="
        sticky
        top-0
        z-30
        border-b
        border-[#1E293B]
        bg-[#081018]/95
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          px-4
          py-4
          lg:px-8
        "
      >
        {/* ====================================================== */}
        {/* Left Section */}
        {/* ====================================================== */}

        <div className="flex items-center gap-4">
          {/* Mobile Menu */}

          <button
            onClick={openSidebar}
            className="
              rounded-xl
              border
              border-[#223447]
              bg-[#122131]
              p-3
              text-white
              transition-all
              hover:border-green-500
              hover:text-green-400
              lg:hidden
            "
          >
            <FaBars className="text-lg" />
          </button>

          {/* Title */}

          <div>
            <h1 className="text-2xl font-bold tracking-wide text-white">
              Admin Dashboard
            </h1>

            <p className="text-sm text-slate-400">
              Smart Outpass Management System
            </p>
          </div>
        </div>

        {/* ====================================================== */}
        {/* Search */}
        {/* ====================================================== */}

        <div className="hidden w-full max-w-xl px-8 lg:block">
          <div className="relative">
            <FaSearch
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

            <input
              type="text"
              placeholder="Search anything..."
              className="
                w-full
                rounded-2xl
                border
                border-[#223447]
                bg-[#122131]
                py-3
                pl-12
                pr-4
                text-white
                outline-none
                transition-all
                placeholder:text-slate-500
                focus:border-green-500
              "
            />
          </div>
        </div>

        {/* ====================================================== */}
        {/* Right Section */}
        {/* ====================================================== */}

        <div className="flex items-center gap-3">
          {/* ====================================================== */}
          {/* Fullscreen */}
          {/* ====================================================== */}

          <button
            onClick={handleFullscreen}
            className="
              hidden
              rounded-xl
              border
              border-[#223447]
              bg-[#122131]
              p-3
              text-slate-300
              transition-all
              duration-300
              hover:border-green-500
              hover:text-green-400
              lg:flex
            "
          >
            <FaExpand />
          </button>

          {/* ====================================================== */}
          {/* Theme */}
          {/* ====================================================== */}

          {/* ====================================================== */}
          {/* Notification */}
          {/* ====================================================== */}

          <button
            onClick={() => navigate("/admin/notifications")}
            className="
    relative
    rounded-xl
    border
    border-[#223447]
    bg-[#122131]
    p-3
    text-slate-300
    transition-all
    duration-300
    hover:border-green-500
    hover:text-green-400
  "
          >
            <FaBell />

            {notificationCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                {notificationCount}
              </span>
            )}
          </button>

          {/* ====================================================== */}
          {/* Date & Time */}
          {/* ====================================================== */}

          <div className="hidden text-right lg:block">
            <p className="text-sm font-medium text-white">
              {currentTime.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>

            <p className="text-xs text-slate-400">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>

          {/* ====================================================== */}
          {/* Profile */}
          {/* ====================================================== */}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-[#223447]
                bg-[#122131]
                px-3
                py-2
                transition-all
                duration-300
                hover:border-green-500
              "
            >
              <FaUserCircle className="text-3xl text-green-400" />

              <div className="hidden text-left lg:block">
                <h4 className="text-sm font-semibold text-white">
                  Admin Officer
                </h4>

                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
            </button>

            {/* ==================================================== */}
            {/* Dropdown */}
            {/* ==================================================== */}

            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-64
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#223447]
                  bg-[#122131]
                  shadow-2xl
                "
              >
                <div className="border-b border-[#223447] p-5">
                  <h3 className="font-semibold text-white">Shivam Kumar</h3>

                  <p className="mt-1 text-sm text-slate-400">Administrator</p>
                </div>

                <button
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-5
                    py-4
                    text-slate-300
                    transition-all
                    duration-300
                    hover:bg-[#1B2A3D]
                    hover:text-green-400
                  "
                >
                  <FaUserCircle />
                  My Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-5
                    py-4
                    text-red-400
                    transition-all
                    duration-300
                    hover:bg-red-600
                    hover:text-white
                  "
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
