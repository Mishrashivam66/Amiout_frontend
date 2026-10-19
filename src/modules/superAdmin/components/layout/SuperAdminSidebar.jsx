import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  ClipboardList,
  FileDown,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  ShieldCheck,
  UserRoundPlus,
  UsersRound,
  LogOut,
  Loader2,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "../../../../context/AuthContext";

// ============================================================
// SUPER ADMIN NAVIGATION
// ============================================================

const navigation = [
  {
    label: "Dashboard",
    path: "/super-admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Manage Admins",
    path: "/super-admin/admins",
    icon: UsersRound,
  },
  {
    label: "Create Admin",
    path: "/super-admin/admins/create",
    icon: UserRoundPlus,
  },
  {
    label: "University Students",
    path: "/super-admin/students",
    icon: GraduationCap,
  },
  {
    label: "All Outpasses",
    path: "/super-admin/outpasses",
    icon: ClipboardList,
  },
  {
    label: "Download Reports",
    path: "/super-admin/reports",
    icon: FileDown,
  },
];

// ============================================================
// SUPER ADMIN SIDEBAR
// ============================================================

export default function SuperAdminSidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      // Existing AuthContext logout functionality.
      await logout();

      onClose?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to logout. Please try again.",
        { duration: 1000 },
      );
    } finally {
      setLoggingOut(false);
    }
  };

  // ==========================================================
  // SIDEBAR CONTENT
  // ==========================================================

  const content = (
    <div className="flex h-full flex-col bg-[#091629]">
      {/* ================================================
          BRAND HEADER
      ================================================= */}

      <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-400/10 text-amber-300">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1 className="text-lg font-black tracking-wide text-white">
              AMIOUT
            </h1>

            <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">
              Super Admin
            </p>
          </div>
        </div>

        {/* MOBILE CLOSE */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 lg:hidden"
        >
          <X size={21} />
        </button>
      </div>

      {/* ================================================
          NAVIGATION
      ================================================= */}

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-7">
        <p className="mb-4 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Administration
        </p>

        <nav className="space-y-2">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "border-amber-400/25 bg-amber-400/10 text-amber-300 shadow-sm"
                    : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              <Icon
                size={19}
                className="shrink-0 transition-transform group-hover:scale-110"
              />

              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ================================================
          SIDEBAR BOTTOM
      ================================================= */}

      <div className="shrink-0 space-y-3 border-t border-white/10 p-4">
        {/* SUPER ADMIN PROFILE */}

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <ShieldCheck size={21} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white">
              {user?.name || "Super Admin"}
            </p>

            <p className="mt-1 text-[10px] font-semibold tracking-wide text-amber-300">
              SUPER_ADMIN
            </p>
          </div>
        </div>

        {/* PRIVILEGED ACCESS INFORMATION */}

        <div className="flex items-start gap-3 rounded-xl border border-amber-400/15 bg-[#13243a] p-4">
          <LockKeyhole size={19} className="shrink-0 text-amber-300" />

          <div>
            <p className="text-xs font-bold text-white">Privileged Access</p>

            <p className="mt-1 text-[11px] leading-5 text-slate-400">
              University-wide monitoring and report downloads are restricted to
              authorized Super Admins.
            </p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="group flex w-full items-center justify-center gap-3 rounded-xl border border-red-400/20 bg-gradient-to-r from-[#B91C1C] to-[#DC2626] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/20 transition-all duration-200 hover:from-[#991B1B] hover:to-[#B91C1C] hover:shadow-red-900/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? (
            <Loader2 size={19} className="animate-spin" />
          ) : (
            <LogOut
              size={19}
              className="transition-transform group-hover:translate-x-1"
            />
          )}

          <span>{loggingOut ? "Logging Out..." : "Logout"}</span>
        </button>
      </div>
    </div>
  );

  // ==========================================================
  // RESPONSIVE SIDEBAR
  // ==========================================================

  return (
    <>
      {/* DESKTOP SIDEBAR */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 lg:block">
        {content}
      </aside>

      {/* MOBILE SIDEBAR */}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* BACKDROP */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar overlay"
            className="absolute inset-0 w-full bg-black/70 backdrop-blur-sm"
          />

          {/* DRAWER */}

          <aside className="relative h-full w-72 max-w-[85vw] shadow-2xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
